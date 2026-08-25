import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  Download,
  Plus,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Zap
} from 'lucide-react';
import { PageRoute, SportId, Team } from '../types';
import { SPORTS_DATA } from '../data/mockData';
import { RubberDuckGraphic } from '../components/RubberDuckGraphic';
import { playDuckQuack, playVictoryChime } from '../utils/audio';

interface SignUpPageProps {
  onAddTeam: (newTeam: Team) => void;
  onNavigate: (route: PageRoute) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onAddTeam, onNavigate }) => {
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [country, setCountry] = useState('Netherlands');
  const [category, setCategory] = useState<'Pro Float' | 'Open Classic' | 'Heavyweight Buoy' | 'Junior Quackers'>('Open Classic');
  const [mascotName, setMascotName] = useState('');
  const [duckColor, setDuckColor] = useState('#F59E0B');
  const [duckAccessory, setDuckAccessory] = useState<'goggles' | 'medal' | 'headband' | 'snorkel' | 'cape' | 'crown'>('crown');
  const [selectedSports, setSelectedSports] = useState<SportId[]>(['rapids-sprint']);
  const [members, setMembers] = useState<{ id: string; name: string; role: string; duckNumber: number }[]>([
    { id: '1', name: 'Lead Ducklete', role: 'Captain & Sprint Ace', duckNumber: 1 }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Tactician');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [submittedTeam, setSubmittedTeam] = useState<Team | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const colorOptions = [
    { label: 'Classic Duck Yellow', hex: '#F59E0B' },
    { label: 'Golden Nugget', hex: '#FCD34D' },
    { label: 'Dutch Neon Orange', hex: '#FB923C' },
    { label: 'Alpine Coral Red', hex: '#EF4444' },
    { label: 'Aqua Splash Blue', hex: '#38BDF8' },
    { label: 'Emerald Stream Green', hex: '#10B981' },
    { label: 'Midnight Stealth Black', hex: '#334155' }
  ];

  const accessoryOptions: { id: 'goggles' | 'medal' | 'headband' | 'snorkel' | 'cape' | 'crown'; label: string; icon: string }[] = [
    { id: 'crown', label: 'Gold Crown', icon: '👑' },
    { id: 'goggles', label: 'Aero Goggles', icon: '🥽' },
    { id: 'medal', label: 'Olympic Medal', icon: '🥇' },
    { id: 'headband', label: 'Racer Headband', icon: '🎗️' },
    { id: 'snorkel', label: 'Deep Snorkel', icon: '🤿' },
    { id: 'cape', label: 'Super Cape', icon: '🦸' }
  ];

  const handleSportToggle = (sportId: SportId) => {
    if (selectedSports.includes(sportId)) {
      if (selectedSports.length > 1) {
        setSelectedSports(selectedSports.filter((id) => id !== sportId));
      }
    } else {
      setSelectedSports([...selectedSports, sportId]);
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newId = String(Date.now());
    setMembers([
      ...members,
      {
        id: newId,
        name: newMemberName.trim(),
        role: newMemberRole,
        duckNumber: members.length + 1
      }
    ]);
    setNewMemberName('');
    playDuckQuack(1.2);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) return;
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!teamName.trim()) errors.push('Team Name is required.');
    if (!captainName.trim()) errors.push('Captain Name is required.');
    if (!contactEmail.trim() || !contactEmail.includes('@')) errors.push('A valid contact email is required.');
    if (!mascotName.trim()) errors.push('Mascot Duck Name is required.');
    if (selectedSports.length === 0) errors.push('Please select at least 1 sport discipline.');
    if (!agreedTerms) errors.push('You must accept the KBF Anti-Lithium-Motor Fair Play Oath.');

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);

    const newTeamData: Team = {
      id: `team-user-${Date.now()}`,
      name: teamName.trim(),
      country: country,
      countryCode: country.slice(0, 2).toUpperCase(),
      captain: captainName.trim(),
      mascotName: mascotName.trim(),
      duckColor: duckColor,
      accessory: duckAccessory,
      category: category,
      registeredSports: selectedSports,
      gold: 0,
      silver: 0,
      bronze: 0,
      totalPoints: 10, // Initial sign up qualification points
      members: members,
      bio: `Official ${category} registered flotilla captained by ${captainName.trim()}. Ready to compete in ${selectedSports.length} disciplines!`,
      stats: {
        speed: 85 + Math.floor(Math.random() * 12),
        buoyancy: 88 + Math.floor(Math.random() * 10),
        hydroDynamics: 86 + Math.floor(Math.random() * 12),
        quackVolume: 90 + Math.floor(Math.random() * 8)
      },
      isUserRegistered: true
    };

    onAddTeam(newTeamData);
    setSubmittedTeam(newTeamData);

    // Play Victory Sound & Trigger Confetti
    playVictoryChime();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FCD34D', '#38BDF8', '#10B981']
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Official Championship Entry
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-950">
              Sign Up Your Flotilla
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl font-medium">
              Register your club, university, or neighborhood flotilla for BADEENDLYMPICS 2026. Design your custom duck mascot and generate your official Team Pass!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs">
            <RubberDuckGraphic size={48} color={duckColor} accessory={duckAccessory} animated />
            <div className="text-left">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-700">Live Customizer</span>
              <div className="text-xs font-black uppercase italic tracking-tight text-slate-900">{mascotName || 'Your Duck Mascot'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION SUCCESS MODAL / CARD */}
      {submittedTeam && (
        <section className="rounded-3xl border border-emerald-300 bg-white p-6 sm:p-10 space-y-6 animate-in zoom-in-95 duration-200 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-8 w-8 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
                  Registration Confirmed!
                </span>
                <h2 className="text-3xl font-black uppercase italic tracking-tight text-slate-950">
                  Welcome to the Games, {submittedTeam.name}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Your team has been entered into the official roster. Pass ID: <span className="font-mono font-bold text-slate-900">KBF-2026-{submittedTeam.id.slice(-6)}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('leaderboard')}
                className="bg-black text-white hover:bg-slate-800 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-black/10 active:scale-95 transition-all"
              >
                View Standings →
              </button>
              <button
                onClick={() => onNavigate('profiles')}
                className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold uppercase tracking-wider text-xs transition-colors"
              >
                View Profiles
              </button>
            </div>
          </div>

          {/* OFFICIAL DUCKLETE ID CARD PREVIEW */}
          <div className="max-w-md mx-auto rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <RubberDuckGraphic size={28} color="#F59E0B" accessory="crown" />
                <span className="text-xs font-black uppercase italic tracking-tight text-slate-950">BADEENDLYMPICS PASS</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-amber-400 text-black px-2.5 py-0.5 rounded-full tracking-wider">
                VALIDATED
              </span>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <RubberDuckGraphic size={70} color={submittedTeam.duckColor} accessory={submittedTeam.accessory} />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-black uppercase italic tracking-tight text-slate-950">{submittedTeam.name}</div>
                <div className="text-xs text-slate-600 font-bold">Mascot: {submittedTeam.mascotName}</div>
                <div className="text-xs text-slate-400">Captain: {submittedTeam.captain}</div>
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-700">{submittedTeam.category} • {submittedTeam.country}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                <span className="text-[10px] block uppercase font-black tracking-widest text-slate-400">Sports Entered</span>
                <span className="font-black text-slate-900">{submittedTeam.registeredSports.length} Disciplines</span>
              </div>
              <QrCode className="h-8 w-8 text-slate-900" />
            </div>
          </div>
        </section>
      )}

      {/* FORM & LIVE ID CARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Registration Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-950">Team & Captain Details</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Fill in your team information and race category.</p>
            </div>

            {/* Error alerts */}
            {formErrors.length > 0 && (
              <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-xs text-rose-800 space-y-1">
                <div className="flex items-center gap-1.5 font-black uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span>Please fix the following issues:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 font-medium">
                  {formErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-1.5">
                  Team Name *
                </label>
                <input
                  id="signup-input-team-name"
                  type="text"
                  placeholder="e.g. Amsterdam River Rockets"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-1.5">
                  Captain Name *
                </label>
                <input
                  id="signup-input-captain"
                  type="text"
                  placeholder="e.g. Joost van Dijk"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-1.5">
                  Captain Contact Email *
                </label>
                <input
                  id="signup-input-email"
                  type="email"
                  placeholder="captain@quackmail.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-1.5">
                  Country / Region
                </label>
                <select
                  id="signup-select-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Netherlands">Netherlands (NED)</option>
                  <option value="Belgium">Belgium (BEL)</option>
                  <option value="Germany">Germany (GER)</option>
                  <option value="United Kingdom">United Kingdom (GBR)</option>
                  <option value="Norway">Norway (NOR)</option>
                  <option value="Austria">Austria (AUT)</option>
                  <option value="France">France (FRA)</option>
                  <option value="Sweden">Sweden (SWE)</option>
                  <option value="United States">United States (USA)</option>
                </select>
              </div>
            </div>

            {/* Division Category */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-2">
                Championship Division
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Open Classic', 'Pro Float', 'Heavyweight Buoy', 'Junior Quackers'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      playDuckQuack(1.15);
                    }}
                    className={`p-3 rounded-2xl border text-xs font-black uppercase tracking-wider text-center transition-all ${
                      category === cat
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* MASCOT CUSTOMIZER */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-950">Mascot Rubber Duck Customizer</h3>
                <p className="text-xs text-slate-500 font-medium">Pick your mascot’s color, signature accessory, and name.</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-1.5">
                  Mascot Duck Name *
                </label>
                <input
                  id="signup-input-mascot-name"
                  type="text"
                  placeholder="e.g. Captain Quacktastic"
                  value={mascotName}
                  onChange={(e) => setMascotName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none font-medium"
                  required
                />
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-2">
                  Duck Vinyl Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        setDuckColor(c.hex);
                        playDuckQuack(1.1);
                      }}
                      className={`h-9 w-9 rounded-full border-2 transition-transform ${
                        duckColor === c.hex
                          ? 'border-black scale-110 shadow-md ring-2 ring-amber-400'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Accessory Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-2">
                  Signature Headwear / Accessory
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {accessoryOptions.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setDuckAccessory(acc.id);
                        playDuckQuack(1.2);
                      }}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                        duckAccessory === acc.id
                          ? 'border-black bg-black text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xl">{acc.icon}</div>
                      <div className="text-[10px] uppercase font-black tracking-wider mt-1 truncate">{acc.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SPORT DISCIPLINES SELECTION */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-950">Select Sports Disciplines *</h3>
                <p className="text-xs text-slate-500 font-medium">Select which events your team will enter.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SPORTS_DATA.map((sport) => {
                  const isChecked = selectedSports.includes(sport.id);
                  return (
                    <div
                      key={sport.id}
                      onClick={() => handleSportToggle(sport.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'border-black bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-5 w-5 rounded-lg flex items-center justify-center border ${isChecked ? 'bg-amber-400 border-amber-400 text-black' : 'border-slate-300'}`}>
                          {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase italic tracking-tight">{sport.name}</div>
                          <div className={`text-[10px] ${isChecked ? 'text-slate-400' : 'text-slate-500'}`}>{sport.trackDetails.arena}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TEAM ROSTER MEMBERS */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-950">Ducklete Crew Members</h3>
                  <p className="text-xs text-slate-500 font-medium">Add up to 5 team members or support crew.</p>
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">{members.length}/5 Registered</span>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg">
                        #{m.duckNumber}
                      </span>
                      <span className="font-bold text-slate-900">{m.name}</span>
                      <span className="text-slate-400">({m.role})</span>
                    </div>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Member Row */}
              {members.length < 5 && (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Crew Member Name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none font-medium"
                  >
                    <option value="Tactician">Tactician</option>
                    <option value="Ballast Specialist">Ballast Specialist</option>
                    <option value="Wing Navigator">Wing Navigator</option>
                    <option value="Quack Resonator">Quack Resonator</option>
                    <option value="Chief Mechanic">Chief Mechanic</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-4 py-2.5 rounded-xl bg-black text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1 hover:bg-slate-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* OATH OF FAIR PLAY */}
            <div className="border-t border-slate-100 pt-5">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  id="signup-checkbox-terms"
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                  required
                />
                <span className="text-xs text-slate-600 leading-relaxed font-normal">
                  I solemnly pledge that our rubber ducks contain <strong>zero concealed lithium propulsion</strong>, chemical effervescent boosters, or remote rudders, and abide by the <strong>Koninklijke Rubber Duck Code of Honor</strong>.
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              id="signup-submit-btn"
              type="submit"
              className="w-full py-4 rounded-2xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Complete Registration & Generate Pass</span>
            </button>
          </form>
        </div>

        {/* Right Col: Live Official Pass Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Live Official Pass Preview
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-black bg-amber-400 px-2.5 py-0.5 rounded-full">
                KBF ID: DUCK-2026-X
              </span>
            </div>

            {/* Visual Physical Pass Badge */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Lanyard Hole Clip */}
              <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto mb-5 flex items-center justify-center">
                <div className="w-8 h-1 bg-amber-400 rounded-full" />
              </div>

              {/* Watermark Logo */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-base font-black uppercase italic tracking-tight text-slate-950 block">
                    BADEENDLYMPICS 2026
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    Official Competitor Credential
                  </span>
                </div>
                <div className="p-1 rounded-xl bg-black text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1">
                  {category.toUpperCase()}
                </div>
              </div>

              {/* Duck Graphic & Mascot */}
              <div className="flex items-center gap-4 my-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <RubberDuckGraphic size={64} color={duckColor} accessory={duckAccessory} animated />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black uppercase italic tracking-tight text-slate-950 leading-tight">
                    {teamName || 'Your Team Name'}
                  </h4>
                  <p className="text-xs font-bold text-slate-700">
                    Mascot: {mascotName || 'Unregistered Mascot'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Captain: {captainName || 'Team Captain'}
                  </p>
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full">
                    {country}
                  </span>
                </div>
              </div>

              {/* Sports Badges */}
              <div className="my-4 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  Authorized Clearances ({selectedSports.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSports.map((s) => {
                    const sport = SPORTS_DATA.find((item) => item.id === s);
                    return (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                        ✓ {sport?.name.split(' ')[0]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Barcode & Security Hologram */}
              <div className="mt-5 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="font-mono text-[9px] font-bold tracking-widest text-slate-400">
                    ||| | |||| | ||||| || ||| ||||
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    KBF LASER VERIFIED • UTRECHT ARENA
                  </div>
                </div>

                <div className="h-9 w-9 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 font-medium flex items-center gap-3 shadow-xs">
              <ShieldCheck className="h-5 w-5 text-black shrink-0" />
              <span>
                Need to make adjustments later? You can update your lineup at the scrutineering kiosk on Day 1.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
