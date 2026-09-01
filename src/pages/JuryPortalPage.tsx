import React, { useState, useEffect, useRef } from 'react';
import { PageRoute, JuryMember, PresetAvatarId } from '../types';
import {
  getJurySession,
  setJurySession,
  updateJuryMember,
  deleteJuryMember,
} from '../utils/storage';
import { PRESET_AVATARS } from '../data/juryAvatars';
import { compressImageFile, CompressionResult } from '../utils/imageCompressor';
import { JuryAvatar } from '../components/JuryAvatar';
import {
  Shield,
  Award,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Quote,
  Lock,
  Mail,
  User,
  LogOut,
  Trash2,
  Eye,
  FileCheck,
  Save,
  ArrowLeft,
  Crown,
  Star,
  Info,
} from 'lucide-react';

interface JuryPortalPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const JuryPortalPage: React.FC<JuryPortalPageProps> = ({ onNavigate }) => {
  const [jury, setJury] = useState<JuryMember | null>(null);

  // Editable fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [bioQuote, setBioQuote] = useState('');
  const [scoutingAffiliation, setScoutingAffiliation] = useState('');
  const [avatarType, setAvatarType] = useState<'preset' | 'custom'>('preset');
  const [avatarPresetId, setAvatarPresetId] = useState<PresetAvatarId>('duck-referee');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Status states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentSession = getJurySession();
    if (!currentSession) {
      onNavigate('login');
      return;
    }

    setJury(currentSession);
    setName(currentSession.name);
    setEmail(currentSession.email);
    setBioQuote(currentSession.bioQuote || '');
    setScoutingAffiliation(currentSession.scoutingAffiliation || '');
    setAvatarType(currentSession.avatarType);
    setAvatarPresetId(currentSession.avatarPresetId || 'duck-referee');
    setPhotoUrl(currentSession.photoUrl);
  }, [onNavigate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Selecteer a.u.b. een geldig afbeeldingsbestand (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMessage(null);
      const result = await compressImageFile(file, 360, 0.82);
      setCompressionInfo(result);
      setPhotoUrl(result.dataUrl);
      setAvatarType('custom');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Fout bij het comprimeren van de foto.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jury) return;
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Vul a.u.b. je naam in.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Vul een geldig e-mailadres in.');
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateJuryMember(jury.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        bioQuote: bioQuote.trim(),
        scoutingAffiliation: scoutingAffiliation.trim(),
        avatarType,
        avatarPresetId: avatarType === 'preset' ? avatarPresetId : undefined,
        photoUrl: avatarType === 'custom' ? photoUrl : undefined,
        password: newPassword.trim() ? newPassword.trim() : undefined,
      });

      if (updated) {
        setJury(updated);
        setNewPassword('');
        showToast('Juryprofiel succesvol bijgewerkt!');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Er is een fout opgetreden bij het opslaan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setJurySession(null);
    onNavigate('jury');
  };

  const handleDeleteProfile = () => {
    if (!jury) return;
    deleteJuryMember(jury.id);
    onNavigate('jury');
  };

  if (!jury) return null;

  return (
    <div className="bg-slate-50 text-black min-h-screen">
      {/* Header */}
      <section className="bg-black text-white border-b-2 border-black py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => onNavigate('jury')}
                className="text-xs font-display font-black text-slate-400 hover:text-amber-400 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>NAAR JURY OVERZICHT</span>
              </button>
              <span className="text-slate-600">|</span>
              <span className="bg-amber-400 text-black px-2 py-0.5 font-display font-black text-[10px] uppercase">
                JURYPORTAAL
              </span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-amber-400 tracking-tight uppercase leading-none mb-2">
              MIJN JURYPROFIEL
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold max-w-xl">
              Beheer hier je naam, scoutinggroep, avatar/foto en quote voor de Badeendlympics 2027.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('jury')}
              className="bg-zinc-900 text-white hover:bg-zinc-800 font-display font-black text-xs uppercase px-4 py-3 border-2 border-white transition-colors cursor-pointer flex items-center gap-2"
            >
              <Eye size={14} />
              <span>BEKIJK LIVE PAGINA</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-500 text-white hover:bg-rose-600 font-display font-black text-xs uppercase px-4 py-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition-colors cursor-pointer flex items-center gap-2"
            >
              <LogOut size={14} />
              <span>UITLOGGEN</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Edit Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Status / Role Info Box */}
            <div className="bg-amber-50 border-2 border-amber-400 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-display font-black text-xs uppercase text-slate-900">
                      JOUW TOEGEKENDE STATUS:
                    </span>
                    {jury.isHeadJury && (
                      <span className="inline-flex items-center gap-1 bg-amber-400 text-black font-display font-black text-[10px] px-2 py-0.5 uppercase border border-black">
                        <Crown size={11} />
                        HOOFD VAN DE JURY
                      </span>
                    )}
                    {jury.isOrganizer && (
                      <span className="inline-flex items-center gap-1 bg-black text-amber-300 font-display font-black text-[10px] px-2 py-0.5 uppercase border border-black">
                        <Star size={10} className="fill-amber-300" />
                        ORGANISATOR
                      </span>
                    )}
                    {!jury.isHeadJury && !jury.isOrganizer && (
                      <span className="inline-block bg-slate-200 text-slate-800 font-display font-black text-[10px] px-2 py-0.5 uppercase border border-slate-400">
                        OFFICIEEL JURYLID
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-snug">
                    Rollen zoals <strong>Hoofd van de jury</strong> en <strong>Organisator</strong> worden uitsluitend door de organisatie toegekend en beheerd via het beheerderspaneel.
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-start gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div>{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSave} className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                <h2 className="font-display font-black text-lg uppercase tracking-tight text-black flex items-center gap-2">
                  <Award size={18} className="text-amber-500" />
                  <span>PROFIELGEGEVENS WIJZIGEN</span>
                </h2>
                <span className="text-xs text-slate-500 font-bold">
                  Status:{' '}
                  <strong className="text-emerald-600 uppercase font-black">
                    {jury.status === 'active' ? 'Actief Jurylid' : 'In Behandeling'}
                  </strong>
                </span>
              </div>

              {/* 1. Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-1.5 flex items-center justify-between">
                    <span>NAAM *</span>
                    <User size={13} className="text-slate-400" />
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs sm:text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50"
                  />
                </div>

                <div>
                  <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-1.5 flex items-center justify-between">
                    <span>E-MAILADRES * (INLOGGEN)</span>
                    <Mail size={13} className="text-slate-400" />
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs sm:text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50"
                  />
                </div>
              </div>

              {/* Scoutinggroep */}
              <div>
                <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-1.5">
                  SCOUTINGGROEP
                </label>
                <input
                  type="text"
                  value={scoutingAffiliation}
                  onChange={(e) => setScoutingAffiliation(e.target.value)}
                  placeholder="bijv. Scouting Van Brederode"
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs sm:text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50"
                />
              </div>

              {/* 2. Avatar Selection & Compression */}
              <div className="pt-2">
                <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2 flex items-center justify-between">
                  <span>AVATAR / FOTO KIEZEN</span>
                  <Sparkles size={13} className="text-amber-500" />
                </label>

                <div className="grid grid-cols-2 border-2 border-black bg-slate-100 mb-4">
                  <button
                    type="button"
                    onClick={() => setAvatarType('preset')}
                    className={`py-2.5 px-3 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      avatarType === 'preset'
                        ? 'bg-amber-400 text-black'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Award size={14} />
                    BADEEND AVATARS
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarType('custom')}
                    className={`py-2.5 px-3 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors border-l-2 border-black ${
                      avatarType === 'custom'
                        ? 'bg-amber-400 text-black'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Upload size={14} />
                    EIGEN FOTO
                  </button>
                </div>

                {avatarType === 'preset' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 bg-slate-50 border-2 border-black">
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = avatarPresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setAvatarPresetId(preset.id)}
                          className={`p-2 border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? 'border-black bg-amber-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                              : 'border-slate-300 bg-white hover:border-black'
                          }`}
                        >
                          <JuryAvatar
                            avatarType="preset"
                            avatarPresetId={preset.id}
                            size="md"
                          />
                          <span className="font-display font-black text-[10px] uppercase text-black leading-tight">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border-2 border-black flex flex-col sm:flex-row items-center gap-4">
                    <div className="shrink-0">
                      {photoUrl ? (
                        <JuryAvatar
                          avatarType="custom"
                          photoUrl={photoUrl}
                          size="lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-slate-200 border-2 border-dashed border-slate-400 flex items-center justify-center text-slate-500">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isCompressing}
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-black text-amber-400 px-4 py-2.5 text-xs font-display font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-2"
                      >
                        <Upload size={14} />
                        <span>{photoUrl ? 'NIEUWE FOTO UPLOADEN' : 'FOTO KIEZEN'}</span>
                      </button>

                      {compressionInfo && (
                        <div className="bg-emerald-50 border border-emerald-400 p-2 text-[11px] font-bold text-emerald-800 flex items-center gap-2">
                          <FileCheck size={16} className="text-emerald-600 shrink-0" />
                          <span>
                            Gecomprimeerd: {compressionInfo.compressedSizeKb} KB (Geoptimaliseerd)
                          </span>
                        </div>
                      )}

                      <p className="text-[10px] text-slate-500 font-semibold">
                        Wordt automatisch gecomprimeerd voor razendsnelle laadtijden.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quote */}
              <div>
                <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-1.5 flex items-center justify-between">
                  <span>JURY QUOTE / MOTTO</span>
                  <Quote size={13} className="text-slate-400" />
                </label>
                <textarea
                  rows={2}
                  value={bioQuote}
                  onChange={(e) => setBioQuote(e.target.value)}
                  placeholder="Jouw motto op de website..."
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs sm:text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50"
                />
              </div>

              {/* 3. Password Change */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-1.5 flex items-center justify-between">
                  <span>NIEUW WACHTWOORD INSTELLEN (OPTIONEEL)</span>
                  <Lock size={13} className="text-slate-400" />
                </label>
                <input
                  type="password"
                  placeholder="Laat leeg om huidig wachtwoord te behouden"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs sm:text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Aanmelding intrekken / profiel verwijderen</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isCompressing}
                  className="w-full sm:w-auto bg-amber-400 text-black px-8 py-3.5 font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  <span>{isSaving ? 'OPSLAAN...' : 'WIJZIGINGEN OPSLAAN'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preview of Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-black text-white p-4 border-2 border-black">
              <span className="text-amber-400 font-display font-black text-xs uppercase tracking-wider block mb-1">
                LIVE VOORBEELD
              </span>
              <p className="text-[11px] text-slate-300 font-medium">
                Zo ziet jouw jurylid-kaart eruit voor bezoekers op de website:
              </p>
            </div>

            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-start gap-4">
                <JuryAvatar
                  avatarType={avatarType}
                  avatarPresetId={avatarPresetId}
                  photoUrl={photoUrl}
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    {jury.isHeadJury && (
                      <span className="inline-flex items-center gap-1 bg-amber-400 text-black font-display font-black text-[10px] px-2 py-0.5 uppercase border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Crown size={11} />
                        HOOFD VAN DE JURY
                      </span>
                    )}
                    {jury.isOrganizer && (
                      <span className="inline-flex items-center gap-1 bg-black text-amber-300 font-display font-black text-[10px] px-2 py-0.5 uppercase border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Star size={10} className="fill-amber-300" />
                        ORGANISATOR
                      </span>
                    )}
                    {!jury.isHeadJury && !jury.isOrganizer && (
                      <span className="inline-block bg-slate-100 text-slate-800 font-display font-black text-[10px] px-2 py-0.5 uppercase border border-slate-300">
                        OFFICIEEL JURYLID
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-black text-lg uppercase tracking-tight text-black truncate">
                    {name || 'Jouw Naam'}
                  </h3>
                  {scoutingAffiliation && (
                    <p className="text-[11px] font-bold text-slate-600 mt-1 flex items-center gap-1">
                      <Shield size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{scoutingAffiliation}</span>
                    </p>
                  )}
                </div>
              </div>

              {bioQuote && (
                <div className="relative pl-6 pr-2 py-2 bg-amber-50/60 border-l-4 border-amber-400 text-xs italic font-semibold text-slate-700">
                  <Quote
                    size={14}
                    className="absolute left-1.5 top-2 text-amber-400 not-italic opacity-80"
                  />
                  "{bioQuote}"
                </div>
              )}

              <div className="pt-3 border-t-2 border-slate-100 text-[11px] text-slate-400 font-bold text-center">
                Badeendlympics 2027 · Scouting Van Brederode
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display font-black text-xl uppercase mb-2 text-rose-600">
              AANMELDING INTREKKEN?
            </h3>
            <p className="text-xs font-semibold text-slate-600 mb-6 leading-relaxed">
              Weet je zeker dat je je aanmelding als jurylid wilt intrekken? Je profiel wordt direct verwijderd van de website.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-display font-black uppercase text-slate-600 hover:text-black cursor-pointer"
              >
                ANNULEREN
              </button>
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="bg-rose-600 text-white px-5 py-2.5 text-xs font-display font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-rose-700 cursor-pointer"
              >
                JA, VERWIJDER MIJN PROFIEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-2 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2.5 text-xs font-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={18} className="text-black fill-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
