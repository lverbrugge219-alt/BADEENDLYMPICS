import express, { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '1mb' }));

// --- SECURITY & SERVER CONFIGURATION ---
const DEFAULT_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'l.verbrugge219@gmail.com').trim().toLowerCase();
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Badeendgames2027';
const SESSION_SECRET = process.env.SESSION_SECRET || 'badeendlympics_secret_key_2027_secure_salt';

// Persistent storage for custom changed admin password (stored securely on the server)
const AUTH_STATE_FILE = path.join(process.cwd(), '.server_auth_state.json');

interface StoredAuthState {
  passwordHash?: string;
  salt?: string;
  updatedAt?: string;
  revokedTokensBefore?: number;
}

function loadAuthState(): StoredAuthState {
  try {
    if (fs.existsSync(AUTH_STATE_FILE)) {
      const data = fs.readFileSync(AUTH_STATE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading auth state file:', err);
  }
  return {};
}

function saveAuthState(state: StoredAuthState): void {
  try {
    fs.writeFileSync(AUTH_STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing auth state file:', err);
  }
}

// In-memory token revocation & rate limiting
const revokedTokens = new Set<string>();

interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes lockout
const WINDOW_DURATION_MS = 15 * 60 * 1000; // 15 minutes window

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function checkRateLimit(key: string): { locked: boolean; remainingSeconds?: number; attemptsLeft?: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    return { locked: false, attemptsLeft: MAX_FAILED_ATTEMPTS };
  }

  // Check if locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { locked: true, remainingSeconds };
  }

  // Reset if window has expired
  if (now - record.firstAttemptAt > WINDOW_DURATION_MS) {
    loginAttempts.delete(key);
    return { locked: false, attemptsLeft: MAX_FAILED_ATTEMPTS };
  }

  const attemptsLeft = Math.max(0, MAX_FAILED_ATTEMPTS - record.attempts);
  return { locked: false, attemptsLeft };
}

function recordFailedAttempt(key: string): { locked: boolean; remainingSeconds?: number; attemptsLeft: number } {
  const now = Date.now();
  const record = loginAttempts.get(key) || { attempts: 0, firstAttemptAt: now };

  // Reset if old window
  if (now - record.firstAttemptAt > WINDOW_DURATION_MS) {
    record.attempts = 0;
    record.firstAttemptAt = now;
    delete record.lockedUntil;
  }

  record.attempts += 1;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(key, record);
    return { locked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000), attemptsLeft: 0 };
  }

  loginAttempts.set(key, record);
  return { locked: false, attemptsLeft: MAX_FAILED_ATTEMPTS - record.attempts };
}

function recordSuccessfulAttempt(key: string): void {
  loginAttempts.delete(key);
}

// Password hashing and verification
function hashPasswordPbkdf2(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function verifyPasswordAgainstStore(inputPassword: string): boolean {
  const authState = loadAuthState();

  if (authState.passwordHash && authState.salt) {
    const computed = hashPasswordPbkdf2(inputPassword, authState.salt);
    const bufA = Buffer.from(computed);
    const bufB = Buffer.from(authState.passwordHash);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }

  // Default server password from environment
  const bufInput = Buffer.from(inputPassword);
  const bufExpected = Buffer.from(DEFAULT_ADMIN_PASSWORD);
  if (bufInput.length !== bufExpected.length) return false;
  return crypto.timingSafeEqual(bufInput, bufExpected);
}

// Signed session tokens (HMAC-SHA256)
interface TokenPayload {
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
  jti: string;
}

function createToken(email: string): { token: string; expiresAt: number } {
  const iat = Date.now();
  const expiresAt = iat + 8 * 60 * 60 * 1000; // 8 hours validity
  const payload: TokenPayload = {
    email,
    role: 'admin',
    iat,
    exp: expiresAt,
    jti: crypto.randomBytes(16).toString('hex'),
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64url');
  const token = `${payloadStr}.${signature}`;
  return { token, expiresAt };
}

function verifyToken(token: string): { valid: boolean; payload?: TokenPayload; message?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, message: 'Geen sessietoken meegegeven.' };
  }

  if (revokedTokens.has(token)) {
    return { valid: false, message: 'Deze sessie is uitgelogd of ongeldig.' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, message: 'Ongeldig tokenformaat.' };
  }

  const [payloadStr, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64url');

  const bufA = Buffer.from(signature);
  const bufB = Buffer.from(expectedSig);
  if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
    return { valid: false, message: 'Ongeldige handtekening van de sessie.' };
  }

  try {
    const payload: TokenPayload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) {
      return { valid: false, message: 'Sessie is verlopen. Log opnieuw in.' };
    }

    const authState = loadAuthState();
    if (authState.revokedTokensBefore && payload.iat < authState.revokedTokensBefore) {
      return { valid: false, message: 'Wachtwoord is gewijzigd. Log opnieuw in met het nieuwe wachtwoord.' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, message: 'Ongeldige tokendata.' };
  }
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Badeendlympics 2027 Server',
  });
});

// Admin Login
app.post('/api/auth/admin/login', async (req: Request, res: Response) => {
  // Add small artificial delay (200ms) to mitigate brute force timing attacks
  await new Promise((resolve) => setTimeout(resolve, 200));

  const { email, password } = req.body || {};
  const clientIp = getClientIp(req);
  const rateLimitKey = `${clientIp}_${(email || '').trim().toLowerCase()}`;

  // 1. Check rate limit
  const rateCheck = checkRateLimit(rateLimitKey);
  if (rateCheck.locked) {
    res.status(429).json({
      success: false,
      message: `Te veel mislukte inlogpogingen. Dit account is tijdelijk geblokkeerd voor ${Math.ceil((rateCheck.remainingSeconds || 60) / 60)} minuten om misbruik te voorkomen.`,
      lockedUntil: Date.now() + (rateCheck.remainingSeconds || 60) * 1000,
      remainingSeconds: rateCheck.remainingSeconds,
    });
    return;
  }

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({
      success: false,
      message: 'Vul zowel e-mailadres als wachtwoord in.',
    });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const configuredEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();

  // 2. Validate email and password safely
  const isEmailMatch = cleanEmail === configuredEmail;
  const isPasswordMatch = verifyPasswordAgainstStore(password);

  if (!isEmailMatch || !isPasswordMatch) {
    const failedResult = recordFailedAttempt(rateLimitKey);
    if (failedResult.locked) {
      res.status(429).json({
        success: false,
        message: 'Te veel mislukte inlogpogingen. Dit account is nu 10 minuten geblokkeerd.',
        lockedUntil: Date.now() + LOCKOUT_DURATION_MS,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: `Onjuist e-mailadres of wachtwoord. Nog ${failedResult.attemptsLeft} ${failedResult.attemptsLeft === 1 ? 'poging' : 'pogingen'} over voor tijdelijke blokkade.`,
      remainingAttempts: failedResult.attemptsLeft,
    });
    return;
  }

  // Success: Clear attempts, create signed token
  recordSuccessfulAttempt(rateLimitKey);
  const { token, expiresAt } = createToken(cleanEmail);

  res.json({
    success: true,
    message: 'Succesvol ingelogd als organisatie.',
    token,
    user: {
      email: cleanEmail,
      role: 'admin',
    },
    expiresAt,
  });
});

// Verify Admin Session Token
app.all(['/api/auth/admin/verify'], (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.body && req.body.token) {
    token = req.body.token;
  } else if (typeof req.query.token === 'string') {
    token = req.query.token;
  }

  const result = verifyToken(token);
  if (!result.valid) {
    res.status(401).json({
      valid: false,
      message: result.message || 'Ongeldige of verlopen sessie.',
    });
    return;
  }

  res.json({
    valid: true,
    user: {
      email: result.payload?.email,
      role: 'admin',
    },
    expiresAt: result.payload?.exp,
  });
});

// Admin Logout
app.post('/api/auth/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.body && req.body.token) {
    token = req.body.token;
  }

  if (token) {
    revokedTokens.add(token);
  }

  res.json({
    success: true,
    message: 'Succesvol uitgelogd.',
  });
});

// Admin Password Change
app.post('/api/auth/admin/change-password', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  const verification = verifyToken(token);
  if (!verification.valid) {
    res.status(401).json({
      success: false,
      message: 'Niet geautoriseerd. Log eerst in als beheerder.',
    });
    return;
  }

  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    res.status(400).json({
      success: false,
      message: 'Vul zowel het huidige als het nieuwe wachtwoord in.',
    });
    return;
  }

  // 1. Verify current password
  if (!verifyPasswordAgainstStore(currentPassword)) {
    res.status(401).json({
      success: false,
      message: 'Het huidige wachtwoord is niet correct.',
    });
    return;
  }

  // 2. Validate new password strength
  if (newPassword.length < 8) {
    res.status(400).json({
      success: false,
      message: 'Het nieuwe wachtwoord moet minimaal 8 tekens lang zijn.',
    });
    return;
  }

  // 3. Hash new password with PBKDF2 & salt
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPasswordPbkdf2(newPassword, salt);

  const authState = loadAuthState();
  authState.passwordHash = passwordHash;
  authState.salt = salt;
  authState.updatedAt = new Date().toISOString();
  authState.revokedTokensBefore = Date.now(); // Invalidate all prior tokens
  saveAuthState(authState);

  // Generate fresh token for the current session
  const adminEmail = verification.payload?.email || DEFAULT_ADMIN_EMAIL;
  const { token: newToken, expiresAt } = createToken(adminEmail);

  res.json({
    success: true,
    message: 'Wachtwoord is veilig bijgewerkt. Vorige sessies zijn ongeldig verklaard.',
    token: newToken,
    expiresAt,
  });
});

// --- SERVER START & VITE INTEGRATION ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
