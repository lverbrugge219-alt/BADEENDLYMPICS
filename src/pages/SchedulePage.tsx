import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  Play,
  Search,
  Sparkles,
  Trophy,
  Users,
  Volume2,
  Zap
} from 'lucide-react';
import { PageRoute, ScheduleEvent, SportId } from '../types';
import { SPORTS_DATA } from '../data/mockData';
import { RubberDuckGraphic } from '../components/RubberDuckGraphic';
import { playDuckQuack, playWhistle } from '../utils/audio';

interface SchedulePageProps {
  schedule: ScheduleEvent[];
  onNavigate: (route: PageRoute) => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ schedule, onNavigate }) => {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [selectedSport, setSelectedSport] = useState<SportId | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>([]);
  const [activeModalEvent, setActiveModalEvent] = useState<ScheduleEvent | null>(null);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedEvents.includes(id)) {
      setBookmarkedEvents(bookmarkedEvents.filter((b) => b !== id));
    } else {
      setBookmarkedEvents([...bookmarkedEvents, id]);
      playDuckQuack(1.2);
    }
  };

  const filteredEvents = schedule.filter((evt) => {
    if (selectedDay !== 'all' && evt.day !== selectedDay) return false;
    if (selectedSport !== 'all' && evt.sportId !== selectedSport) return false;
    if (selectedStatus !== 'all' && evt.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchArena = evt.arena.toLowerCase().includes(q);
      const matchTeam = evt.participatingTeams.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchArena && !matchTeam) return false;
    }
    return true;
  });

  const getSportBadge = (sportId: SportId) => {
    const sport = SPORTS_DATA.find((s) => s.id === sportId);
    return sport?.name || sportId;
  };

  const daysInfo = [
    { day: 1, title: 'Day 1: Opening & Heats', date: 'Fri, Aug 28' },
    { day: 2, title: 'Day 2: Semifinals & Slalom', date: 'Sat, Aug 29' },
    { day: 3, title: 'Day 3: Grand Finals & Awards', date: 'Sun, Aug 30' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-100 text-xs font-black uppercase tracking-widest">
              <Calendar className="h-3.5 w-3.5 text-sky-600" />
              Official 3-Day Timetable
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-950">
              Championship Event Schedule
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl font-medium">
              Track preliminary heats, semifinals, and the marquee Olympic Grand Finals across all 4 aquatic arenas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onNavigate('signup');
                playDuckQuack(1.1);
              }}
              className="bg-black text-white hover:bg-slate-800 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-black/10 active:scale-95 transition-all"
            >
              Enter Open Heats
            </button>
          </div>
        </div>
      </section>

      {/* FILTER CONTROLS BAR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
        {/* Day Selector Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                selectedDay === 'all'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All 3 Days ({schedule.length})
            </button>

            {daysInfo.map((d) => (
              <button
                key={d.day}
                onClick={() => {
                  setSelectedDay(d.day);
                  playDuckQuack(1.1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  selectedDay === d.day
                    ? 'bg-amber-400 text-black shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>

          {/* Bookmarks Counter */}
          {bookmarkedEvents.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200">
              <Bookmark className="h-3.5 w-3.5 fill-amber-700 text-amber-700" />
              <span>{bookmarkedEvents.length} Saved in My Schedule</span>
            </div>
          )}
        </div>

        {/* Secondary filters (Sport, Status, Search) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Sport Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Filter by Sport
            </label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value as SportId | 'all')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Disciplines</option>
              {SPORTS_DATA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Search Heat or Team
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search event title, venue, or team name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SCHEDULE TIMELINE LIST */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <RubberDuckGraphic size={60} color="#F59E0B" accessory="goggles" />
            <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-950">No events matched your filter</h3>
            <p className="text-xs text-slate-500">Try selecting "All 3 Days" or clearing your search term.</p>
            <button
              onClick={() => {
                setSelectedDay('all');
                setSelectedSport('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-black text-white font-bold uppercase tracking-wider text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isBookmarked = bookmarkedEvents.includes(evt.id);
            const isFinal = evt.stage === 'Grand Final' || evt.stage === 'Ceremony';

            return (
              <div
                key={evt.id}
                id={`event-card-${evt.id}`}
                onClick={() => setActiveModalEvent(evt)}
                className={`group cursor-pointer rounded-3xl border transition-all p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isFinal
                    ? 'border-amber-400 bg-white hover:border-amber-500 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs'
                }`}
              >
                {/* Left: Time & Stage */}
                <div className="flex items-start sm:items-center gap-4">
                  {/* Time Badge */}
                  <div className="flex flex-col items-center justify-center h-16 w-20 rounded-2xl bg-slate-950 text-white p-2 shrink-0 text-center font-mono">
                    <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest">DAY {evt.day}</span>
                    <span className="text-xs font-black mt-0.5">{evt.time.split(' - ')[0]}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        isFinal ? 'bg-amber-400 text-black' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {evt.stage}
                      </span>
                      <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                        {getSportBadge(evt.sportId)}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-slate-950 group-hover:text-amber-600 transition-colors">
                      {evt.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {evt.arena}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {evt.participatingTeams.length} Registered Flotillas
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={(e) => toggleBookmark(evt.id, e)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isBookmarked
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={isBookmarked ? 'Remove from My Schedule' : 'Add to My Schedule'}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => setActiveModalEvent(evt)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 group-hover:bg-amber-400 text-slate-900 font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Heat Details</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EVENT DETAIL POPUP MODAL */}
      {activeModalEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setActiveModalEvent(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-black bg-amber-400 px-2.5 py-0.5 rounded-full">
                  Day {activeModalEvent.day} • {activeModalEvent.stage}
                </span>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-950 mt-2">
                  {activeModalEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {activeModalEvent.description}
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl text-xs border border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Scheduled Time</span>
                <span className="font-bold text-slate-900">{activeModalEvent.date} • {activeModalEvent.time}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Arena Location</span>
                <span className="font-bold text-slate-900">{activeModalEvent.arena}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-900 block">
                Participating Flotillas & Ducks
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeModalEvent.participatingTeams.map((teamName, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                    🦆 {teamName}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  playDuckQuack(1.0);
                  setActiveModalEvent(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-black text-white font-bold uppercase tracking-wider text-xs"
              >
                Close Details
              </button>
              <button
                onClick={() => {
                  setActiveModalEvent(null);
                  onNavigate('leaderboard');
                }}
                className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-amber-600"
              >
                View Standings →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
