import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  TrendingUp, 
  Tv, 
  Trophy, 
  Calculator, 
  Zap,
  ChevronRight,
  Filter,
  Share,
  Download,
  Plus,
  Minus,
  X,
  Smartphone,
  CheckCircle,
  Users,
  Search,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Layout,
  Share2,
  ExternalLink,
  Calendar,
  BarChart2,
  PieChart,
  Eye,
  EyeOff,
  User,
  MoreVertical,
  Briefcase,
  Send,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MATCHES, 
  LIVE_MATCHES, 
  PREDICTORS as INITIAL_PREDICTORS, 
  POSTED_SLIPS as INITIAL_SLIPS, 
  COMMUNITY_PREDICTIONS, 
  BANKER_OF_THE_DAY 
} from './data';
import { Page, Match, LiveMatch, Predictor, CommunityPrediction, SlipSelection, PostedSlip, UserAccount, SlipComment } from './types';
import { cn } from './lib/utils';
import html2canvas from 'html2canvas';
import { supabase } from './lib/supabase';

// --- Shared Components ---

const AdBanner = ({ label = "Advertisement" }) => (
  <div className="w-full bg-surface-lighter h-24 flex items-center justify-center border border-white/5 rounded-lg my-6">
    <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">{label}</span>
  </div>
);

const SectionHeading = ({ title, icon: Icon }: { title: string, icon?: any }) => (
  <div className="flex items-center justify-between mb-4 px-4">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/60">{title}</h2>
    </div>
    <div className="h-px flex-1 bg-white/5 ml-4" />
  </div>
);

// --- Pages ---

const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const featured = BANKER_OF_THE_DAY;
  const bankerRef = React.useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const shareBanker = async () => {
    if (!bankerRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(bankerRef.current, { backgroundColor: '#052a1a', scale: 2 });
      const link = document.createElement('a');
      link.download = `stakeiq-banker-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  const features = [
    { name: 'Predictions', icon: TrendingUp, id: 'predictions', color: 'text-primary' },
    { name: 'Live Scores', icon: Tv, id: 'live', color: 'text-blue-500' },
    { name: 'SlipBuilder', icon: Layout, id: 'slip', color: 'text-purple-500' },
    { name: 'Rankings', icon: Trophy, id: 'predictors', color: 'text-yellow-500' },
    { name: 'Tools', icon: Calculator, id: 'tools', color: 'text-orange-500' },
    { name: 'NPFL Special', icon: Zap, id: 'predictions', color: 'text-primary' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20"
    >
      <AdBanner />
      
      {/* Hero */}
      <div className="px-4 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-white/5 p-8 text-center shadow-2xl">
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white mb-2 leading-none tracking-tighter uppercase">
              STAKEIQ<span className="text-primary">.</span>
            </h1>
            <p className="text-[10px] text-white/40 mb-6 font-bold uppercase tracking-[0.2em]">Bet Smarter. Not Harder.</p>
            <button 
              onClick={() => setPage('predictions')}
              className="bg-primary hover:bg-primary-dark transition-all text-black font-black py-3.5 px-10 rounded-full shadow-lg shadow-primary/20 uppercase text-xs tracking-widest"
            >
              Get Today's Tips
            </button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[2]">
            <Zap className="w-64 h-64 text-primary" />
          </div>
        </div>
      </div>

      <SectionHeading title="Banker of the Day" icon={Zap} />
      <div className="px-4 mb-8">
        <div className="relative group">
          <div 
            ref={bankerRef}
            className="bg-gradient-to-br from-[#0a2a1a] to-[#05150d] border-2 border-primary/30 p-6 rounded-3xl relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">Banker of the Day</h3>
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">StakeIQ's Highest Confidence Pick</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="text-center w-1/3">
                <span className="block text-3xl mb-1">{featured.homeLogo}</span>
                <span className="text-[10px] font-black uppercase tracking-tight text-white/90">{featured.homeTeam}</span>
                <div className="flex gap-0.5 justify-center mt-2">
                  {featured.homeForm.map((f, i) => (
                    <span key={i} className={cn("w-3 h-3 rounded-sm text-[6px] flex items-center justify-center font-black", f === 'W' ? "bg-primary text-black" : "bg-white/10 text-white/40")}>{f}</span>
                  ))}
                </div>
              </div>
              <div className="text-center w-1/3">
                <div className="text-lg font-black text-white/10">VS</div>
                <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">{featured.time}</div>
              </div>
              <div className="text-center w-1/3">
                <span className="block text-3xl mb-1">{featured.awayLogo}</span>
                <span className="text-[10px] font-black uppercase tracking-tight text-white/90">{featured.awayTeam}</span>
                <div className="flex gap-0.5 justify-center mt-2">
                  {featured.awayForm.map((f, i) => (
                    <span key={i} className={cn("w-3 h-3 rounded-sm text-[6px] flex items-center justify-center font-black", f === 'W' ? "bg-primary text-black" : "bg-white/10 text-white/40")}>{f}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-5 border border-white/5 mb-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">StakeIQ Verdict</div>
                  <div className="text-2xl font-black text-primary tracking-tighter uppercase">{featured.predictedOutcome}</div>
                  <div className="text-[10px] text-white/60 font-bold mt-1">Predicted Score: {featured.predictedScore}</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Confidence</div>
                  <div className="text-2xl font-black text-primary">94%</div>
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 opacity-10">
              <h2 className="text-4xl font-black tracking-tighter">STAKEIQ</h2>
            </div>
          </div>
          
          <button 
            onClick={shareBanker}
            disabled={sharing}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] mt-3 flex items-center justify-center gap-2"
          >
            {sharing ? 'Generating...' : <><Download className="w-4 h-4 text-primary" /> Share Banker Pick</>}
          </button>
        </div>
      </div>

      <SectionHeading title="Features" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 px-4 mb-8">
        {features.map((f, i) => (
          <button
            key={i}
            onClick={() => setPage(f.id as Page)}
            className="flex flex-col items-center justify-center p-6 bg-surface border border-white/5 rounded-xl hover:border-primary/30 transition-all group"
          >
            <f.icon className={cn("w-8 h-8 mb-3 transition-transform group-hover:scale-110", f.color)} />
            <span className="font-display font-medium text-sm">{f.name}</span>
          </button>
        ))}
      </div>

      <SectionHeading title="Predictions Feed" icon={TrendingUp} />
      <div className="px-4 space-y-4">
        {MATCHES.slice(1, 3).map((match) => (
          <div 
            key={match.id}
            onClick={() => setPage('predictions')}
            className="bg-surface border border-white/5 p-5 rounded-2xl relative overflow-hidden group cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{match.league}</span>
              <span className={cn("text-[8px] font-black px-2 py-0.5 rounded border", match.confidence === 'High' ? "bg-primary/20 text-primary border-primary/20" : "bg-white/5 text-white/40 border-white/10")}>{match.confidence} POCKET</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase">{match.homeTeam} vs {match.awayTeam}</span>
              <span className="text-xs font-black text-primary">{match.predictedScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-[9px] text-white/40 font-black uppercase tracking-widest">Verdict: <span className="text-white">{match.predictedOutcome}</span></div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <AdBanner />
    </motion.div>
  );
};

// --- Additional Components for Predictions ---

interface MatchDetailModalProps {
  match: Match;
  onClose: () => void;
}

const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ match, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full max-w-sm bg-surface border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Banner Section */}
        {match.status === 'finished' && (
          <div className={cn(
            "py-3 px-6 text-center flex items-center justify-center gap-2",
            match.predictionCorrect ? "bg-primary text-black" : "bg-red-600/90 text-white"
          )}>
            {match.predictionCorrect ? (
              <>
                <CheckCircle className="w-4 h-4 fill-current" />
                <span className="text-xs font-black uppercase tracking-widest">Prediction Correct!</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Prediction Wrong</span>
              </>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{match.league}</span>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-white/40" />
            </button>
          </div>

          {/* Score Header */}
          <div className="text-center mb-8">
            {match.status === 'live' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">LIVE {match.liveMinute}'</span>
                </div>
                <div className="text-3xl font-black text-white tracking-tighter">
                  {match.liveScore?.home} — {match.liveScore?.away}
                </div>
                <div className="text-[10px] font-bold text-white/40 uppercase">Predicted Score: {match.predictedScore}</div>
                <div className="mt-4 bg-primary/10 border border-primary/20 py-2 rounded-lg">
                   <p className="text-[9px] font-black text-primary uppercase">Match in progress — prediction still possible</p>
                </div>
              </div>
            ) : match.status === 'finished' ? (
              <div className="space-y-1">
                <div className="text-3xl font-black text-white tracking-tighter">
                  {match.finalScore?.home} — {match.finalScore?.away}
                </div>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">FULL TIME</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-1">UPCOMING</div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{match.time}</span>
              </div>
            )}
          </div>

          {/* Comparison Boxes */}
          {match.status === 'finished' && (
            <div className="grid grid-cols-2 gap-3 mb-8">
               <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                  <div className="text-[8px] text-white/40 font-black uppercase mb-1">Predicted</div>
                  <div className="text-xl font-black text-white">{match.predictedScore}</div>
               </div>
               <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                  <div className="text-[8px] text-white/40 font-black uppercase mb-1">Actual</div>
                  <div className="text-xl font-black text-white">
                    {match.finalScore?.home}-{match.finalScore?.away} {match.predictionCorrect ? '✅' : '❌'}
                  </div>
               </div>
            </div>
          )}

          {/* Verdicts */}
          <SectionHeading title="Outcome Breakdown" />
          <div className="space-y-2 mb-8">
             <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-black text-white/60 uppercase">Predicted Outcome</span>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-white uppercase">{match.predictedOutcome}</span>
                   {match.status === 'finished' && (
                     <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded", match.predictionCorrect ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-500")}>
                        {match.predictionCorrect ? 'Correct' : 'Wrong'}
                     </span>
                   )}
                </div>
             </div>
             <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-black text-white/60 uppercase">Over 2.5 Goals</span>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-white uppercase">{match.over25 > 50 ? 'Yes' : 'No'}</span>
                   {match.status === 'finished' && (
                     <span className={cn(
                       "text-[9px] font-black px-1.5 py-0.5 rounded",
                       ((match.finalScore!.home + match.finalScore!.away > 2.5) === (match.over25 > 50)) ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-500"
                     )}>
                        {((match.finalScore!.home + match.finalScore!.away > 2.5) === (match.over25 > 50)) ? 'Correct' : 'Wrong'}
                     </span>
                   )}
                </div>
             </div>
             <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-black text-white/60 uppercase">Both Teams to Score</span>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-white uppercase">{match.btts > 50 ? 'Yes' : 'No'}</span>
                   {match.status === 'finished' && (
                     <span className={cn(
                       "text-[9px] font-black px-1.5 py-0.5 rounded",
                       ((match.finalScore!.home > 0 && match.finalScore!.away > 0) === (match.btts > 50)) ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-500"
                     )}>
                        {((match.finalScore!.home > 0 && match.finalScore!.away > 0) === (match.btts > 50)) ? 'Correct' : 'Wrong'}
                     </span>
                   )}
                </div>
             </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-white text-black font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PredictionsPage = () => {
  const [filter, setFilter] = useState('All');
  const [tab, setTab] = useState<'tips' | 'experts'>('tips');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filters = ['All', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'NPFL'];
  
  const filteredMatches = MATCHES.filter(m => {
    const matchesFilter = filter === 'All' || m.league === filter;
    const matchesSearch = !searchQuery || 
      m.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.league.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24 pt-4"
    >
      <AnimatePresence>
        {selectedMatch && (
          <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
        )}
      </AnimatePresence>

      {/* Inline Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams or leagues..."
            className="w-full bg-surface border border-white/5 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-white outline-none focus:border-primary/40 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-white/5 rounded-full">
              <X className="w-3 h-3 text-white/40" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-surface mx-4 p-1 rounded-xl mb-4 border border-white/5">
        <button 
          onClick={() => setTab('tips')}
          className={cn("flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", tab === 'tips' ? "bg-white text-black" : "text-white/40")}
        >
          StakeIQ Tips
        </button>
        <button 
          onClick={() => setTab('experts')}
          className={cn("flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", tab === 'experts' ? "bg-white text-black" : "text-white/40")}
        >
          Expert Feed
        </button>
      </div>

      {tab === 'tips' ? (
        <>
          <div className="overflow-x-auto whitespace-nowrap px-4 mt-6 mb-6 flex gap-2 pb-2 hide-scrollbar">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold transition-all border",
                  filter === f 
                    ? "bg-primary text-black border-primary" 
                    : "bg-surface text-gray-400 border-white/10"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="px-4 space-y-3">
            {filteredMatches.map((match, i) => (
              <React.Fragment key={match.id}>
                <div 
                  onClick={() => setSelectedMatch(match)}
                  className={cn(
                    "bg-surface border border-white/5 rounded-xl overflow-hidden shadow-lg relative p-3 transition-all active:scale-[0.98] cursor-pointer",
                    match.status === 'live' && "border-primary/40 border-l-4 border-l-primary",
                    match.status === 'finished' && "opacity-60"
                  )}
                >
                  {/* Status Indicator for Live */}
                  {match.status === 'live' && (
                    <div className="absolute top-2 left-1.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}

                  {/* Top Layer: Title and Score */}
                  <div className="flex justify-between items-center mb-1.5 min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <h3 className="text-xs font-black text-white uppercase truncate tracking-tight">
                        {match.homeTeam} 
                        {match.status === 'live' && <span className="font-mono text-white mx-1 text-sm">{match.liveScore?.home}</span>}
                        {match.status === 'finished' && <span className="font-mono text-white mx-1 text-sm">{match.finalScore?.home}</span>}
                        <span className="text-white/20 mx-1">{match.status === 'upcoming' ? 'vs' : '—'}</span>
                        {match.status === 'live' && <span className="font-mono text-white mx-1 text-sm">{match.liveScore?.away}</span>}
                        {match.status === 'finished' && <span className="font-mono text-white mx-1 text-sm">{match.finalScore?.away}</span>}
                        {match.awayTeam}
                      </h3>
                      {match.status === 'upcoming' && (
                        <span className="bg-primary/20 text-primary text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
                          {match.predictedScore}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                       {match.status === 'live' ? (
                         <div className="flex items-center gap-1 bg-red-600/20 px-2 py-0.5 rounded border border-red-600/20">
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">LIVE</span>
                         </div>
                       ) : match.status === 'finished' ? (
                          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded">
                             <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">FT</span>
                          </div>
                       ) : (
                          <>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              match.confidence === 'High' ? "bg-primary" : match.confidence === 'Medium' ? "bg-yellow-500" : "bg-red-500"
                            )} />
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{match.confidence}</span>
                          </>
                       )}
                    </div>
                  </div>

                  {/* Sub Header: League and Time */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.15em] truncate">
                      {match.league} • {match.status === 'live' ? `${match.liveMinute}'` : match.status === 'finished' ? 'Final Score' : match.time}
                    </span>
                    <div className="flex gap-2 shrink-0">
                       {match.status === 'finished' && (
                         <div className={cn(
                           "flex items-center justify-center p-0.5 rounded-full",
                           match.predictionCorrect ? "bg-primary text-black" : "bg-red-500 text-white"
                         )}>
                            {match.predictionCorrect ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Compact Probability Bars - Hide if finished or live (per constraints usually, or simplify) */}
                  {match.status === 'upcoming' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex gap-0.5 h-1 rounded-full overflow-hidden bg-white/5">
                          <div className="h-full bg-primary" style={{ width: `${match.winProb}%` }} />
                          <div className="h-full bg-white/20" style={{ width: `${match.drawProb}%` }} />
                          <div className="h-full bg-white/10" style={{ width: `${match.lossProb}%` }} />
                        </div>
                        <div className="flex gap-2 text-[7px] font-black text-white/40 uppercase tracking-tighter shrink-0">
                          <span className="text-primary">W {match.winProb}%</span>
                          <span>D {match.drawProb}%</span>
                          <span>L {match.lossProb}%</span>
                        </div>
                      </div>

                      {/* Form and H2H Row */}
                      <div className="flex justify-between items-center text-[7px]">
                        <div className="flex gap-0.5">
                          {match.homeForm.map((f, idx) => (
                            <div key={idx} className={cn(
                              "w-2.5 h-2.5 rounded-full flex items-center justify-center font-black text-[5px]",
                              f === 'W' ? "bg-primary text-black" : f === 'D' ? "bg-white/20 text-white/40" : "bg-red-600/20 text-red-500"
                            )}>{f}</div>
                          ))}
                        </div>
                        <span className="text-white/20 font-bold uppercase truncate max-w-[120px] ml-2">"{match.h2h}"</span>
                        <div className="flex gap-0.5">
                          {match.awayForm.map((f, idx) => (
                            <div key={idx} className={cn(
                              "w-2.5 h-2.5 rounded-full flex items-center justify-center font-black text-[5px]",
                              f === 'W' ? "bg-primary text-black" : f === 'D' ? "bg-white/20 text-white/40" : "bg-red-600/20 text-red-500"
                            )}>{f}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {match.status !== 'upcoming' && (
                    <div className="flex justify-between items-center text-[7px] font-black uppercase text-white/40 tracking-widest pt-1">
                       <span>{match.status === 'live' ? 'Match Statistics Updated Real-time' : 'Final Breakdown Available'}</span>
                       <span className="text-primary">View Insights →</span>
                    </div>
                  )}
                </div>
                {i % 4 === 3 && <AdBanner />}
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <div className="px-4 space-y-4">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mb-4 text-center">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Following your favorite experts? 🇳🇬</p>
          </div>
          {INITIAL_PREDICTORS.map((predictor) => (
            <div key={predictor.username} className="bg-surface border border-white/5 rounded-2xl p-5 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-black text-xs text-white/40">
                    {predictor.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black uppercase tracking-tight">{predictor.username}</span>
                      {predictor.isVerified && <CheckCircle className="w-3 h-3 text-primary" />}
                    </div>
                    <div className="text-[8px] text-white/30 uppercase tracking-widest font-bold">Accuracy: {predictor.accuracy}%</div>
                  </div>
                </div>
                <div className="bg-white/5 px-2 py-1 rounded text-[9px] font-black text-white/60 uppercase tracking-wider border border-white/5">
                  @{predictor.username.toLowerCase()}
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-4 text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">
                   <span>Match Prediction</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">{MATCHES[0].homeTeam} vs {MATCHES[0].awayTeam}</div>
                    <div className="text-xl font-black text-white uppercase">{MATCHES[0].predictedOutcome}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Probability</div>
                    <div className="text-xl font-black text-primary">85%</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-white text-black text-[10px] font-black py-2.5 rounded-lg uppercase tracking-wider">Copy Prediction</button>
                <button className="flex items-center justify-center w-12 bg-white/5 border border-white/5 rounded-lg">
                  <Share className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>
          ))}
          <AdBanner label="Ad - Support Nigeria's Best Predictors" />
        </div>
      )}
    </motion.div>
  );
};

const LiveScoresPage = () => {
  const [data, setData] = useState(LIVE_MATCHES);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate score updates or minute updates
      setData(prev => prev.map(m => {
        if (!m.isLive) return m;
        const newMinute = parseInt(m.minute) < 90 ? (parseInt(m.minute) + 1).toString() : '90+';
        return { ...m, minute: newMinute };
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const live = data.filter(m => m.isLive);
  const completed = data.filter(m => !m.isLive);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 pt-4 px-4">
      <SectionHeading title="Live Now" icon={Tv} />
      <div className="space-y-3 mb-8">
        {live.length > 0 ? live.map(m => (
          <div key={m.id} className="bg-surface border border-primary/20 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <div className="pulsing-dot" />
            </div>
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">{m.league}</div>
            <div className="flex justify-between items-center">
              <div className="w-1/3 font-bold text-sm">{m.homeTeam}</div>
              <div className="w-1/3 text-center">
                <div className="text-xl font-display font-black flex items-center justify-center gap-3">
                  <span>{m.homeScore}</span>
                  <span className="text-gray-600">-</span>
                  <span>{m.awayScore}</span>
                </div>
                <div className="text-[10px] font-mono text-primary font-bold mt-1 tracking-tighter animate-pulse">{m.minute}'</div>
              </div>
              <div className="w-1/3 font-bold text-sm text-right">{m.awayTeam}</div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-surface/50 rounded-2xl border border-white/5">
             <Tv className="w-12 h-12 text-gray-700 mx-auto mb-3" />
             <p className="text-gray-500 font-medium tracking-tight">No live matches right now — check back soon</p>
          </div>
        )}
      </div>

      <SectionHeading title="Completed" icon={Filter} />
      <div className="space-y-3">
        {completed.map(m => (
          <div key={m.id} className="bg-surface/50 border border-white/5 p-4 rounded-xl opacity-80">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{m.league}</div>
            <div className="flex justify-between items-center">
              <div className="w-1/3 font-bold text-sm text-gray-300">{m.homeTeam}</div>
              <div className="w-1/3 text-center">
                <div className="text-xl font-display font-black flex items-center justify-center gap-3">
                  <span>{m.homeScore}</span>
                  <span className="text-gray-600">-</span>
                  <span>{m.awayScore}</span>
                </div>
                <div className="text-[10px] font-mono text-gray-500 font-bold mt-1 uppercase tracking-wider">{m.status}</div>
              </div>
              <div className="w-1/3 font-bold text-sm text-gray-300 text-right">{m.awayTeam}</div>
            </div>
          </div>
        ))}
      </div>
      
      <AdBanner label="Ad - Keep StakeIQ Free!" />
    </motion.div>
  );
};

const SlipBuilderPage = () => {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState<SlipSelection[]>([]);
  const [showPicker, setShowPicker] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [sharing, setSharing] = useState(false);
  const [showOdds, setShowOdds] = useState(true);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const toggleSelection = (match: Match, selection: string) => {
    const odds = selection === 'Home Win' ? 2.1 : selection === 'Draw' ? 3.2 : selection === 'Away Win' ? 2.8 : 1.9;
    setSelections(prev => {
      const exists = prev.find(s => s.matchId === match.id);
      if (exists) {
        return prev.filter(s => s.matchId !== match.id);
      }
      return [...prev, { matchId: match.id, homeTeam: match.homeTeam, awayTeam: match.awayTeam, selection, odds }];
    });
    setShowPicker(null);
  };

  const totalOdds = selections.reduce((acc, curr) => acc * curr.odds, 1);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0a0a0a', scale: 2 });
      const link = document.createElement('a');
      link.download = `stakeiq-slip-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 pt-4 px-4">
      {/* Progress Indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 space-y-1.5">
            <div className={cn("h-1 rounded-full", step >= i ? "bg-primary" : "bg-white/10")} />
            <div className={cn("text-[8px] font-black uppercase tracking-widest", step >= i ? "text-primary" : "text-white/20")}>
              Step {i}: {i === 1 ? 'Pick' : i === 2 ? 'Review' : 'Share'}
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <SectionHeading title="Select Matches" icon={Layout} />
          {MATCHES.map(match => {
            const isSelected = selections.find(s => s.matchId === match.id);
            return (
              <div 
                key={match.id}
                onClick={() => setShowPicker(match.id)}
                className={cn(
                  "bg-surface border p-4 rounded-xl transition-all cursor-pointer",
                  isSelected ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/20"
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[8px] text-white/40 font-black uppercase mb-1">{match.league} • {match.time}</div>
                    <div className="text-sm font-black uppercase">{match.homeTeam} vs {match.awayTeam}</div>
                  </div>
                  {isSelected ? (
                    <div className="bg-primary text-black p-1 rounded-full"><CheckCircle className="w-4 h-4" /></div>
                  ) : (
                    <Plus className="w-4 h-4 text-white/20" />
                  )}
                </div>
                {isSelected && (
                  <div className="mt-3 text-[10px] font-black text-primary uppercase">Pick: {isSelected.selection} @{isSelected.odds.toFixed(2)}</div>
                )}
              </div>
            );
          })}

          {selections.length > 0 && (
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={() => setStep(2)}
              className="fixed bottom-24 left-4 right-4 bg-primary text-black font-black py-4 rounded-xl shadow-2xl shadow-primary/20 flex justify-between items-center px-6 z-30"
            >
              <span className="uppercase text-xs tracking-widest">My Slip ({selections.length})</span>
              <span className="text-[10px] bg-black/10 px-2 py-1 rounded">View Full Slip →</span>
            </motion.button>
          )}

          {/* Bottom Sheet for Selections */}
          <AnimatePresence>
            {showPicker && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPicker(null)}
                  className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 p-6 z-50 rounded-t-3xl"
                >
                  <h3 className="text-sm font-black uppercase mb-6 text-center">Make Your Selection</h3>
                  <div className="space-y-3">
                    {['Home Win', 'Draw', 'Away Win', 'Over 2.5 Goals', 'Both Teams To Score'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => toggleSelection(MATCHES.find(m => m.id === showPicker)!, opt)}
                        className="w-full bg-white/5 border border-white/5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <SectionHeading title="Review Your Slip" icon={Layout} />
          <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto hide-scrollbar">
              {selections.map(s => (
                <div key={s.matchId} className="p-4 flex justify-between items-start hover:bg-white/5">
                  <div>
                    <div className="text-[10px] font-black uppercase text-white/40">{s.homeTeam} vs {s.awayTeam}</div>
                    <div className="text-xs font-black text-primary uppercase mt-0.5">{s.selection}</div>
                  </div>
                  <div className="text-xs font-black text-white px-2 py-1 bg-white/5 rounded">@{s.odds.toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="p-5 bg-white/5 flex justify-between items-center border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-white/60 uppercase">Combined Odds</span>
              </div>
              <span className={cn("text-xl font-black text-primary transition-all", showOdds ? "opacity-100 blur-0" : "opacity-0 blur-md")}>
                @{totalOdds.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Show/Hide Toggles */}
            <div className="grid grid-cols-1">
              <button 
                onClick={() => setShowOdds(!showOdds)}
                className={cn(
                  "p-4 rounded-xl border flex flex-col gap-1 transition-all text-left",
                  showOdds ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/5 text-white/40"
                )}
              >
                <div className="text-[9px] font-black uppercase">Odds Display</div>
                <div className="text-[10px] font-bold uppercase">{showOdds ? 'Showing' : 'Hidden'}</div>
              </button>
            </div>

            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
              <div>
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2 block">Card Nickname (Optional)</label>
                <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="e.g. StakeLord" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary font-black text-sm" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
             <button onClick={() => setStep(1)} className="flex-1 bg-white/5 text-white/60 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest border border-white/5">Back</button>
             <button onClick={() => setStep(3)} className="flex-[2] bg-primary text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Generate My Card 🎨</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div 
            ref={cardRef}
            className="bg-[#0A0A0A] border-2 border-[#00E67633] rounded-3xl p-8 relative overflow-hidden w-full max-w-sm mx-auto min-h-[550px] flex flex-col"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E6760d] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 mb-8 flex justify-between items-start">
              <div>
                <div className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.3em] mb-2">STAKEIQ SLIP</div>
                <h2 className="text-xl font-black tracking-tighter uppercase leading-none">My Predictions 🎯</h2>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">STAKEIQ</span>
              </div>
            </div>

            <div className="relative z-10 space-y-3 mb-8 flex-1">
              {selections.map(s => (
                <div key={s.matchId} className="flex justify-between items-center border-l-2 border-[#00E67666] pl-4 py-1">
                  <div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-tight">{s.homeTeam} vs {s.awayTeam}</div>
                    <div className="text-xs font-black text-white uppercase">Predicted: {s.selection}</div>
                  </div>
                  <div className="text-xs font-black text-[#00E676]">@{s.odds.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto relative z-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 items-end">
              <div>
                <div className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Predicted by:</div>
                <div className="text-xs font-black text-white uppercase block truncate max-w-full">
                  {nickname ? (nickname.startsWith('@') ? nickname : `@${nickname}`) : '@STAKEIQ_CHAMP'}
                </div>
              </div>
              <div className={cn("text-right transition-all", showOdds ? "opacity-100" : "opacity-0")}>
                <div className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Combined Odds:</div>
                <div className="text-xl font-black text-[#00E676] tracking-tighter">@{totalOdds.toFixed(2)}</div>
              </div>
            </div>

            <div className="relative z-10 mt-6 text-center">
              <p className="text-[7px] text-white/20 font-medium uppercase tracking-tighter shrink-0">This is a prediction only. Not financial advice. Bet responsibly.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={downloadCard}
              disabled={sharing}
              className="bg-white text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {sharing ? 'Saving...' : <><Download className="w-4 h-4" /> Download PNG</>}
            </button>
            <button 
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Check out my winning slip on StakeIQ! 🔥")}`, '_blank')}
              className="bg-[#25D366] text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" /> WhatsApp
            </button>
          </div>
          <button 
            onClick={() => { setStep(1); setSelections([]); }}
            className="w-full bg-white/5 text-white/40 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest border border-white/5"
          >
            Start New Slip
          </button>
        </div>
      )}
    </motion.div>
  );
};

// --- Additional Components for Profiles ---

interface AuthModalProps {
  onClose: () => void;
  onComplete: (user: UserAccount) => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onComplete, initialMode = 'signup' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({ 
    username: '', 
    displayName: '', 
    bio: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({ username: '', displayName: '', bio: '', email: '', password: '', confirmPassword: '' });
    setError(null);
  };

  const handleAction = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!formData.username || !formData.displayName || !formData.email || !formData.password) {
          throw new Error('Please fill all required fields');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // 1. Check if username is taken
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', formData.username)
          .single();
        
        if (existingProfile) {
          throw new Error('Username already taken');
        }

        // 2. Auth Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Signup failed');

        // 3. Create Profile
        const colors = ['#00E676', '#2196F3', '#FFC107', '#E91E63', '#9C27B0'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: formData.username,
            display_name: formData.displayName,
            bio: formData.bio || '',
            avatar_color: randomColor
          });

        if (profileError) throw profileError;
        
        // Success handled by session listener in App.tsx
      } else {
        // Log in
        let email = formData.email;
        
        // If it looks like a username (starts with @ or doesn't have @), try to find the email
        if (!email.includes('@')) {
          const cleanUsername = email.replace('@', '');
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', cleanUsername)
            .single();
          
          if (profile) {
            // Supabase Auth doesn't let us get email by ID easily without admin, 
            // so we might need to store email in profiles or just tell users to use email.
            // For this implementation, I'll store email in profiles for easier lookup or just stick to email login.
            // Actually, Supabase doesn't expose emails of other users.
            // I'll assume they use email for now, or I'll update profiles to include email.
            throw new Error('Please use your email address to log in');
          }
        }

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (loginError) throw loginError;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      alert('Password reset link sent to your email!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        className="w-full max-w-sm bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-1 flex border-b border-white/5 bg-white/5">
          <button 
            onClick={() => { setMode('login'); resetForm(); }}
            className={cn("flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all", mode === 'login' ? "text-primary border-b-2 border-primary" : "text-white/40")}
          >
            Login
          </button>
          <button 
            onClick={() => { setMode('signup'); resetForm(); }}
            className={cn("flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all", mode === 'signup' ? "text-primary border-b-2 border-primary" : "text-white/40")}
          >
            Sign Up
          </button>
          <button onClick={onClose} className="p-2 absolute top-2 right-2 hover:bg-white/10 rounded-full transition-colors z-10">
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Username</label>
                <input 
                  value={formData.username} 
                  onChange={e => setFormData({ ...formData, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                  placeholder="@stakelord" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary font-bold text-white text-xs" 
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Display Name</label>
                <input 
                  value={formData.displayName} 
                  onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="John Doe" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary font-bold text-white text-xs" 
                />
              </div>
            </>
          )}

          <div>
            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">
              {mode === 'signup' ? 'Email Address' : 'Email or Username'}
            </label>
            <input 
              type="text"
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder={mode === 'signup' ? "name@example.com" : "@username"} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary font-bold text-white text-xs" 
            />
          </div>

          <div>
            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Password</label>
            <div className="relative">
              <input 
                type="password"
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary font-bold text-white text-xs" 
              />
            </div>
            {mode === 'login' && (
              <button 
                onClick={handleForgotPassword}
                className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline mt-1"
              >
                Forgot Password?
              </button>
            )}
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Confirm Password</label>
              <input 
                type="password"
                value={formData.confirmPassword} 
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary font-bold text-white text-xs" 
              />
            </div>
          )}

          <button 
            onClick={handleAction}
            className="w-full bg-primary text-black font-black py-4 rounded-xl shadow-lg shadow-primary/20 uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            {mode === 'signup' ? 'Create Account 🚀' : 'Login Now ⚡'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


interface PostedSlipCardProps {
  slip: PostedSlip;
  isOwner?: boolean;
  onViewProfile?: (u: string) => void;
  currentUser?: UserAccount | null;
  onSignup?: () => void;
}

const CommentSheet = ({ 
  isOpen, 
  onClose, 
  slip, 
  comments, 
  currentUser, 
  onSignup, 
  onAddComment 
}: { 
  isOpen: boolean, 
  onClose: () => void,
  slip: PostedSlip,
  comments: SlipComment[], 
  currentUser: UserAccount | null, 
  onSignup?: () => void,
  onAddComment: (text: string) => void
}) => {
  const [text, setText] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddComment(text);
      setText('');
      // Scroll to bottom? Not strictly required but nice.
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => 
      prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="w-full h-[92vh] max-w-lg bg-surface rounded-t-3xl border-t border-white/10 flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-1 bg-white/20 rounded-full my-3" />
              <div className="w-full px-6 py-2 flex justify-between items-center bg-surface sticky top-0 z-10">
                <div className="w-8" /> {/* Placeholder */}
                <h2 className="text-sm font-black uppercase tracking-[0.1em]">Comments</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>
            </div>
            <div className="h-px w-full bg-white/10" />

            {/* Slip Summary */}
            <div className="px-6 py-4 flex items-center gap-4 bg-white/5 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                {slip.predictorUsername.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase">@{slip.predictorUsername}</span>
                  <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded shrink-0">@{slip.totalOdds.toFixed(2)} ODDS</span>
                </div>
                {slip.caption && <p className="text-[10px] text-white/50 truncate">"{slip.caption}"</p>}
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {comments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <MessageSquare className="w-12 h-12 mb-4" />
                  <h3 className="text-sm font-black uppercase mb-1">No comments yet</h3>
                  <p className="text-[10px] font-medium tracking-tight">Be the first to share your thoughts</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {comments.slice(0, visibleCount).map((c) => (
                      <div key={c.id} className="space-y-4">
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border border-white/10",
                            ["bg-blue-500/20 text-blue-400", "bg-purple-500/20 text-purple-400", "bg-orange-500/20 text-orange-400", "bg-pink-500/20 text-pink-400"][c.username.length % 4]
                          )}>
                            {c.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-[11px] font-black text-white tracking-tight">@{c.username}</span>
                              <span className="text-[10px] text-white/70 leading-relaxed font-medium">{c.text}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] text-white/30 font-medium uppercase">{c.timeAgo}</span>
                              <button className="text-[9px] font-bold text-white/20 hover:text-primary transition-colors">Reply</button>
                            </div>

                            {/* Replies */}
                            {c.replies.length > 0 && (
                              <div className="mt-4 space-y-4">
                                {c.replies.slice(0, expandedReplies.includes(c.id) ? c.replies.length : 2).map((r) => (
                                  <div key={r.id} className="flex gap-3">
                                    <div className={cn(
                                      "w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 border border-white/10",
                                      ["bg-green-500/20 text-green-400", "bg-yellow-500/20 text-yellow-400", "bg-red-500/20 text-red-400"][r.username.length % 3]
                                    )}>
                                      {r.username.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-baseline gap-2 mb-0.5">
                                        <span className="text-[10px] font-black text-white tracking-tight">@{r.username}</span>
                                        <span className="text-[10px] text-white/60 leading-relaxed font-medium">{r.text}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-[7px] text-white/30 font-medium uppercase">{r.timeAgo}</span>
                                        <button className="text-[8px] font-bold text-white/20 hover:text-primary transition-colors">Reply</button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                
                                {c.replies.length > 2 && !expandedReplies.includes(c.id) && (
                                  <button 
                                    onClick={() => toggleReplies(c.id)}
                                    className="text-[9px] font-black text-white/40 flex items-center gap-2 hover:text-primary transition-colors ml-9"
                                  >
                                    <div className="w-6 h-[1px] bg-white/10" />
                                    View more replies ({c.replies.length - 2})
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 pb-12 flex justify-center">
                    {visibleCount < comments.length ? (
                      <button 
                        onClick={() => setVisibleCount(prev => prev + 10)}
                        className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-all"
                      >
                        Load 10 more comments
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">No more comments</span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Comment Input */}
            <div className="px-6 pb-8 pt-5 bg-surface border-t border-white/5 sm:pb-6">
              {currentUser ? (
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                    {currentUser.username.slice(0, 2).toUpperCase()}
                  </div>
                  <input 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a comment..."
                    autoFocus
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                    disabled={!text.trim()}
                    className="p-3 bg-primary rounded-2xl text-black disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-primary/10"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">
                    Sign up to comment{' '}
                    <button onClick={onSignup} className="text-primary hover:underline ml-1">Sign Up</button>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PostedSlipCard: React.FC<PostedSlipCardProps> = ({ slip: initialSlip, onViewProfile, currentUser, onSignup }) => {
  const [agreed, setAgreed] = useState(false);
  const [disagreed, setDisagreed] = useState(false);
  const [agreeCount, setAgreeCount] = useState(initialSlip.agrees || 0);
  const [disagreeCount, setDisagreeCount] = useState(initialSlip.disagrees || 0);
  const [comments, setComments] = useState<SlipComment[]>([]);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInteractions();
  }, [initialSlip.id]);

  const fetchInteractions = async () => {
    try {
      // 1. Fetch Reactions
      const { data: reactions, error: rError } = await supabase
        .from('reactions')
        .select('*')
        .eq('slip_id', initialSlip.id);
      
      if (rError) throw rError;

      const agrees = reactions.filter(r => r.emoji === '👍');
      const disagrees = reactions.filter(r => r.emoji === '👎');
      
      setAgreeCount(agrees.length);
      setDisagreeCount(disagrees.length);

      if (currentUser) {
        setAgreed(agrees.some(r => r.user_id === currentUser.id));
        setDisagreed(disagrees.some(r => r.user_id === currentUser.id));
      }

      // 2. Fetch Comments
      const { data: commentsData, error: cError } = await supabase
        .from('comments')
        .select('*, profiles(*)')
        .eq('slip_id', initialSlip.id)
        .order('created_at', { ascending: true });
      
      if (cError) throw cError;

      setComments(commentsData.map(c => ({
        id: c.id,
        username: c.profiles.username,
        displayName: c.profiles.display_name,
        text: c.content,
        timeAgo: new Date(c.created_at).toLocaleDateString(),
        replies: [] // Future improvement
      })));

    } catch (err) {
      console.error('Error fetching interactions:', err);
    }
  };

  const toggleReaction = async (emoji: '👍' | '👎') => {
    if (!currentUser) {
      onSignup?.();
      return;
    }

    try {
      if ((emoji === '👍' && agreed) || (emoji === '👎' && disagreed)) {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .match({ slip_id: initialSlip.id, user_id: currentUser.id, emoji });
        
        if (error) throw error;
        if (emoji === '👍') { setAgreed(false); setAgreeCount(prev => prev - 1); }
        else { setDisagreed(false); setDisagreeCount(prev => prev - 1); }
      } else {
        // Add reaction (and remove opposite if exists)
        await supabase.from('reactions').delete().match({ slip_id: initialSlip.id, user_id: currentUser.id });
        
        const { error } = await supabase
          .from('reactions')
          .insert({ slip_id: initialSlip.id, user_id: currentUser.id, emoji });
        
        if (error) throw error;
        
        if (emoji === '👍') {
          if (disagreed) setDisagreeCount(prev => prev - 1);
          setAgreed(true);
          setDisagreed(false);
          setAgreeCount(prev => prev + 1);
        } else {
          if (agreed) setAgreeCount(prev => prev - 1);
          setDisagreed(true);
          setAgreed(false);
          setDisagreeCount(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error('Reaction error:', err);
    }
  };

  const addComment = async (text: string) => {
    if (!currentUser) return;
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          slip_id: initialSlip.id,
          user_id: currentUser.id,
          content: text
        })
        .select('*, profiles(*)')
        .single();
      
      if (error) throw error;

      const newComment: SlipComment = {
        id: data.id,
        userId: data.user_id,
        username: data.profiles.username,
        displayName: data.profiles.display_name,
        text: data.content,
        timeAgo: 'Just now',
        replies: []
      };
      setComments(prev => [...prev, newComment]);
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const shareSlip = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0a0a0a', scale: 2 });
      const link = document.createElement('a');
      link.download = `stakeiq-slip-${initialSlip.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error(err); }
  };

  const correctCount = initialSlip.selections.filter(s => s.status === 'Won').length;
  const totalCount = initialSlip.selections.length;

  return (
    <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl mb-6 flex flex-col">
      {initialSlip.accuracy && initialSlip.accuracy >= 70 && (
        <div className="bg-primary/20 py-2.5 px-4 flex items-center justify-center gap-2 border-b border-primary/20">
          <Zap className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">I Called It 🔥</span>
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div 
            onClick={() => onViewProfile?.(initialSlip.predictorUsername)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs group-hover:scale-110 transition-transform">
              {initialSlip.predictorUsername.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <div className="text-xs font-black text-white uppercase group-hover:text-primary transition-colors tracking-tight">@{initialSlip.predictorUsername}</div>
                <CheckCircle className="w-3 h-3 text-primary" />
              </div>
              <div className="text-[8px] text-white/30 font-bold uppercase tracking-widest">{initialSlip.timestamp}</div>
            </div>
          </div>
          <button onClick={shareSlip} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <Share2 className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {initialSlip.caption && (
          <p className="text-xs text-white/80 font-medium mb-4 leading-relaxed">"{initialSlip.caption}"</p>
        )}

        <div className="space-y-2.5 mb-5">
          {initialSlip.selections.map((sel, idx) => (
            <div key={idx} className="bg-black/40 p-3.5 rounded-xl border border-white/5 flex justify-between items-center transition-all hover:border-white/10">
              <div className="min-w-0 flex-1">
                <div className="text-[8px] text-white/30 font-black uppercase tracking-widest mb-1 truncate">{sel.homeTeam} vs {sel.awayTeam}</div>
                <div className="text-xs font-black text-white uppercase">Predicted: {sel.selection}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-[10px] font-black text-primary">@{sel.odds.toFixed(2)}</div>
                <div className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                  sel.status === 'Won' ? "bg-primary/20 text-primary" : 
                  sel.status === 'Lost' ? "bg-red-500/20 text-red-500" : 
                  sel.status === 'Live' ? "bg-blue-500/20 text-blue-500 animate-pulse" : 
                  "bg-white/5 text-white/40"
                )}>
                  {sel.status === 'Won' ? '✅' : sel.status === 'Lost' ? '❌' : sel.status === 'Live' ? '⌛' : '⏳'}
                  {sel.status === 'Won' ? 'Correct' : sel.status === 'Lost' ? 'Wrong' : sel.status === 'Live' ? 'Live' : 'Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-5 border border-white/5">
           <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Progress Tracker</span>
              <span className="text-[9px] font-black text-primary uppercase">{correctCount} of {totalCount} correct so far</span>
           </div>
           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex gap-0.5">
              {initialSlip.selections.map((s, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-full flex-1 transition-all",
                    s.status === 'Won' ? "bg-primary" : 
                    s.status === 'Lost' ? "bg-red-500" : 
                    s.status === 'Live' ? "bg-blue-500 animate-pulse" : 
                    "bg-white/10"
                  )} 
                />
              ))}
           </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <div>
            <div className="text-[8px] text-white/30 font-black uppercase mb-0.5 tracking-widest">Total Combined Odds</div>
            <div className="text-lg font-black text-primary tracking-tighter">@{initialSlip.totalOdds.toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => toggleReaction('👍')}
              className={cn("flex items-center gap-2 px-4 py-3 rounded-xl transition-all border", agreed ? "bg-primary border-primary text-black" : "bg-white/5 border-white/5 text-white/40")}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black">{agreeCount}</span>
            </button>
            <button 
              onClick={() => toggleReaction('👎')}
              className={cn("flex items-center gap-2 px-4 py-3 rounded-xl transition-all border", disagreed ? "bg-red-500 border-red-500 text-white" : "bg-white/5 border-white/5 text-white/40")}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black">{disagreeCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Preview & Trigger */}
      <div className="px-5 pb-5 border-t border-white/5 bg-black/5">
        <div className="py-4 space-y-1.5">
          {comments.slice(0, 2).map((c) => (
            <div key={c.id} className="text-[11px] leading-tight">
               <span className="font-black text-white mr-2">@{c.username}</span>
               <span className="text-white/60 truncate inline-block max-w-[80%] align-top">{c.text}</span>
            </div>
          ))}
          <button 
            onClick={() => setIsCommentSheetOpen(true)}
            className="text-[10px] font-bold text-white/40 hover:text-primary transition-colors mt-1 block"
          >
            {comments.length > 0 ? `View all ${comments.length} comments 💬` : 'Be the first to comment 💬'}
          </button>
        </div>
      </div>

      <CommentSheet 
        isOpen={isCommentSheetOpen}
        onClose={() => setIsCommentSheetOpen(false)}
        slip={initialSlip}
        comments={comments}
        currentUser={currentUser}
        onSignup={onSignup}
        onAddComment={addComment}
      />
      
      {/* Hidden Card for Screenshot */}
      <div className="fixed -left-[2000px] top-0">
        <div ref={cardRef} className="w-[400px] bg-[#0A0A0A] p-8 border-[10px] border-[#083d26] relative">
          <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-30">
            <Zap className="w-3 h-3 text-[#00E676]" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">StakeIQ</span>
          </div>
          <div className="mb-6">
            <div className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.3em] mb-2">STAKEIQ PREDICTION</div>
            <h2 className="text-xl font-black tracking-tighter uppercase text-white leading-none">BY @{initialSlip.predictorUsername}</h2>
          </div>
          <div className="space-y-3 mb-6">
            {initialSlip.selections.map((sel, idx) => (
              <div key={idx} className="bg-[#121212] p-4 border border-white/10 rounded-xl flex justify-between items-center">
                <span className="text-sm font-black text-white uppercase">{sel.homeTeam} vs {sel.awayTeam}</span>
                <span className="text-sm font-black text-[#00E676]">{sel.selection}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-end pt-6 border-t border-white/10">
            <div>
              <div className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Total Combined Odds</div>
              <div className="text-xl font-black text-[#00E676] tracking-tighter">@{initialSlip.totalOdds.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Status</div>
              <div className="text-lg font-black text-white tracking-tighter uppercase">{initialSlip.status}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProfilePageProps {
  username: string;
  isOwn: boolean;
  onBack: () => void;
  currentUser?: UserAccount | null;
  onSignup?: () => void;
  isFollowing: boolean;
  onToggleFollow: (u: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ username, isOwn, onBack, currentUser, onSignup, isFollowing, onToggleFollow }) => {
  const [activeTab, setActiveTab] = useState<'slips' | 'stats' | 'followers'>('slips');
  const [predictor, setPredictor] = useState<any>(null);
  const [slips, setSlips] = useState<PostedSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (pError) throw pError;

      // 2. Fetch Slips
      const { data: slipsData, error: sError } = await supabase
        .from('slips')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (sError) throw sError;

      // 3. Fetch Follower Counts
      const { count: followersCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profile.id);
      
      const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profile.id);

      setPredictor({
        id: profile.id,
        username: profile.username,
        displayName: profile.display_name,
        bio: profile.bio || 'New Predictor on the block!',
        avatar: profile.username.slice(0, 2).toUpperCase(),
        predictions: slipsData.length,
        accuracy: 0, // Calculate or fetch
        streak: 0,
        isVerified: true,
        followers: followersCount || 0,
        following: followingCount || 0,
        joinedAt: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });

      setSlips(slipsData.map(s => ({
        id: s.id,
        userId: s.user_id,
        predictorUsername: profile.username,
        selections: s.selections,
        totalOdds: s.total_odds,
        timestamp: new Date(s.created_at).toLocaleDateString(),
        agrees: 0,
        disagrees: 0,
        status: s.status as any,
        caption: s.caption,
        comments: []
      })));

    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  if (!predictor) return <div className="p-10 text-center">Predictor not found</div>;

  const shareProfile = async () => {
    if (!profileRef.current) return;
    try {
      const canvas = await html2canvas(profileRef.current, { backgroundColor: '#052a1a', scale: 2 });
      const link = document.createElement('a');
      link.download = `stakeiq-profile-${username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error(err); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="bg-surface border-b border-white/5 relative">
        <div className="px-6 py-8">
          <div className="flex justify-between items-start mb-6">
            <button onClick={onBack} className="p-2 bg-white/5 rounded-full text-white/40 mb-4">
               <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex gap-2">
              <button onClick={shareProfile} className="p-2 bg-white/5 rounded-full text-white/40">
                <Share2 className="w-5 h-5" />
              </button>
              {!isOwn && (
                <button 
                  onClick={() => onToggleFollow(username)}
                  className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", isFollowing ? "bg-white/10 text-white/40" : "bg-primary text-black")}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
              {isOwn && (
                <button className="px-4 py-2 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-white/5 flex items-center justify-center text-primary text-3xl font-black mb-4">
              {predictor.avatar}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{predictor.displayName}</h1>
              {predictor.isVerified && <CheckCircle className="w-4 h-4 text-primary" />}
            </div>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-3">@{predictor.username}</p>
            <p className="text-xs text-white/60 max-w-xs mb-4">{predictor.bio}</p>
            <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full">
              <Calendar className="w-3 h-3" />
              Predicting since {predictor.joinedAt}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 border-t border-white/5">
          {[
            { label: 'Slips', value: predictor.predictions },
            { label: 'Accuracy', value: `${predictor.accuracy}%` },
            { label: 'Streak', value: `${predictor.streak} 🔥` },
            { label: 'Followers', value: (predictor.followers + (isFollowing ? 1 : 0)).toLocaleString() },
          ].map((stat, i) => (
            <div key={i} className="py-4 border-r border-white/5 last:border-0 text-center">
              <div className="text-[10px] font-black text-white uppercase mb-0.5">{stat.value}</div>
              <div className="text-[7px] text-white/30 font-black uppercase tracking-tighter">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky top-[72px] z-30 bg-bg-dark/80 backdrop-blur-lg border-b border-white/5 flex">
        {[
          { id: 'slips', label: 'Recent Slips' },
          { id: 'stats', label: 'Detailed Stats' },
          { id: 'followers', label: 'Community' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all relative",
              activeTab === tab.id ? "text-primary" : "text-white/40"
            )}
          >
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'slips' && (
          <div className="space-y-4">
            {slips.length > 0 ? (
              slips.map(slip => (
                <PostedSlipCard key={slip.id} slip={slip} onViewProfile={(u) => { if (u !== username) onBack(); }} currentUser={currentUser} onSignup={onSignup} />
              ))
            ) : (
              <div className="text-center py-12 bg-surface rounded-2xl border border-white/5">
                 <Briefcase className="w-12 h-12 text-white/10 mx-auto mb-4" />
                 <p className="text-xs text-white/40 font-black uppercase tracking-widest">No slips posted yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-surface p-6 rounded-2xl border border-white/5 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <circle 
                      cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      className="text-primary"
                      strokeDasharray={2 * Math.PI * 58}
                      strokeDashoffset={2 * Math.PI * 58 * (1 - predictor.accuracy / 100)}
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white leading-none">{predictor.accuracy}%</span>
                    <span className="text-[7px] text-white/40 uppercase font-black">Overall</span>
                 </div>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-tighter">PREDICTION PERFORMANCE</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-xl border border-white/5">
                <BarChart2 className="w-5 h-5 text-primary mb-2" />
                <div className="text-[7px] text-white/40 font-black uppercase tracking-widest mb-1">Best League</div>
                <div className="text-xs font-black text-white uppercase">Premier League — {predictor.accuracy + 4}%</div>
              </div>
              <div className="bg-surface p-4 rounded-xl border border-white/5">
                <PieChart className="w-5 h-5 text-primary mb-2" />
                <div className="text-[7px] text-white/40 font-black uppercase tracking-widest mb-1">Most Picked</div>
                <div className="text-xs font-black text-white uppercase">Home Win (45%)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Card for Screenshot */}
      <div className="fixed -left-[2000px] top-0">
        <div ref={profileRef} className="w-[400px] bg-[#0A0A0A] p-10 border-[10px] border-[#083d26] relative">
          <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-30">
            <Zap className="w-3 h-3 text-[#00E676]" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">StakeIQ</span>
          </div>
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-24 h-24 rounded-full bg-[#00E6761a] border-4 border-white/5 flex items-center justify-center text-[#00E676] text-4xl font-black mb-4">
              {predictor.avatar}
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase text-white leading-none mb-1">{predictor.displayName}</h2>
            <p className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">StakeIQ Predictor</p>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-10">
             <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl font-black text-[#00E676] mb-1">{predictor.accuracy}%</div>
                <div className="text-[8px] text-white/40 font-black uppercase tracking-widest">Accuracy</div>
             </div>
             <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl font-black text-white mb-1">{predictor.streak} 🔥</div>
                <div className="text-[8px] text-white/40 font-black uppercase tracking-widest">Best Streak</div>
             </div>
          </div>
          <div className="text-center">
             <p className="text-sm font-black text-white/60 uppercase tracking-widest animate-pulse">FOLLOW ME ON STAKEIQ 🔥</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface PredictorsPageProps {
  onViewProfile: (u: string) => void;
  onSignup: () => void;
  currentUser: UserAccount | null;
}

const PredictorsPage: React.FC<PredictorsPageProps> = ({ onViewProfile, onSignup, currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'rankings' | 'post' | 'feed'>('feed');
  const [selectedMatches, setSelectedMatches] = useState<SlipSelection[]>([]);
  const [showPicker, setShowPicker] = useState<string | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [slips, setSlips] = useState<PostedSlip[]>([]);
  const [leaderboard, setLeaderboard] = useState<Predictor[]>([]);
  
  const upcomingMatches = MATCHES.filter(m => m.status === 'upcoming');

  useEffect(() => {
    fetchSlips();
    fetchLeaderboard();
  }, []);

  const fetchSlips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('slips')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedSlips: PostedSlip[] = data.map(s => ({
        id: s.id,
        userId: s.user_id,
        predictorUsername: s.profiles.username,
        selections: s.selections,
        totalOdds: s.total_odds,
        timestamp: new Date(s.created_at).toLocaleDateString(),
        agrees: 0, // Will fetch from reactions
        disagrees: 0, // Will fetch from reactions
        status: s.status as any,
        caption: s.caption,
        comments: [] // Will fetch on demand or later
      }));
      setSlips(mappedSlips);
    } catch (err) {
      console.error('Error fetching slips:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // Simple leaderboard logic: ordered by accuracy
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      const predictors: Predictor[] = data.map((p, idx) => ({
        rank: idx + 1,
        username: p.username,
        displayName: p.display_name,
        name: p.display_name,
        bio: p.bio || '',
        avatar: p.username.slice(0, 2).toUpperCase(),
        predictions: 0,
        correct: 0,
        accuracy: 0,
        streak: 0,
        isVerified: true,
        followers: 0,
        following: 0,
        joinedAt: p.created_at
      }));
      setLeaderboard(predictors);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  const handlePostSlip = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('slips')
        .insert({
          user_id: currentUser.id,
          caption: caption,
          selections: selectedMatches,
          total_odds: totalOdds,
          total_count: selectedMatches.length
        });
      
      if (error) throw error;
      
      setIsReviewOpen(false);
      setSelectedMatches([]);
      setCaption('');
      setActiveSubTab('feed');
      fetchSlips();
    } catch (err: any) {
      alert(err.message || 'Failed to post slip');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (match: Match, selection: string) => {
    const odds = selection === 'Home Win' ? 2.1 : selection === 'Draw' ? 3.2 : selection === 'Away Win' ? 2.8 : 1.9;
    setSelectedMatches(prev => {
      const exists = prev.find(s => s.matchId === match.id);
      if (exists) {
        return prev.filter(s => s.matchId !== match.id);
      }
      return [...prev, { matchId: match.id, homeTeam: match.homeTeam, awayTeam: match.awayTeam, selection, odds }];
    });
    setShowPicker(null);
  };

  const removeSelection = (matchId: string) => {
    setSelectedMatches(prev => prev.filter(s => s.matchId !== matchId));
  };

  const totalOdds = selectedMatches.reduce((acc, curr) => acc * curr.odds, 1);

  return (
    <div className="pb-32 pt-4 px-4">
      {/* Horizontal Section Switcher */}
      <div className="flex bg-surface p-1 rounded-2xl mb-6 sticky top-20 z-40 border border-white/5 shadow-2xl backdrop-blur-md">
        {[
          { id: 'rankings', label: 'Rankings', icon: Trophy },
          { id: 'post', label: 'Post Slip', icon: Plus },
          { id: 'feed', label: 'Feed', icon: MessageSquare },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={cn(
              "flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all tracking-wider flex items-center justify-center gap-2", 
              activeSubTab === tab.id ? "bg-primary text-black" : "text-white/40"
            )}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab !== 'post' && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeSubTab === 'rankings' ? 'predictors' : 'slips'}...`}
              className="w-full bg-surface border border-white/5 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-white outline-none focus:border-primary/40 transition-all"
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeSubTab === 'rankings' && (
          <motion.section
            key="rankings"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            <SectionHeading title="Top Predictors This Month 🏆" icon={Trophy} />
            <div className="space-y-3">
              {leaderboard.map((predictor, idx) => (
                <div 
                  key={predictor.username}
                  className="bg-surface border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer shadow-lg"
                  onClick={() => onViewProfile(predictor.username)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-white/20 w-4">{idx + 1}</span>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">
                        {predictor.avatar}
                      </div>
                      {idx < 3 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121212] shadow-lg">
                           <Trophy className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">{predictor.name}</span>
                        {predictor.isVerified && <CheckCircle className="w-3 h-3 text-primary" />}
                      </div>
                      <div className="text-[8px] text-white/30 uppercase font-black tracking-widest">@{predictor.username}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div>
                      <div className="text-sm font-black text-white leading-none">{predictor.accuracy}%</div>
                      <div className="w-20 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-500", 
                            predictor.accuracy > 60 ? "bg-[#00E676]" : 
                            predictor.accuracy >= 40 ? "bg-yellow-500" : "bg-red-500"
                          )} 
                          style={{ width: `${predictor.accuracy}%` }} 
                        />
                      </div>
                    </div>
                    <div className="text-[7px] text-white/30 font-black uppercase tracking-tighter">🔥 {predictor.streak} streak</div>
                  </div>
                </div>
              ))}
            </div>
            
            {!currentUser && (
              <div className="pt-8">
                <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 text-center relative overflow-hidden group" onClick={onSignup}>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black tracking-tighter uppercase text-white mb-2 leading-none">THINK YOU CAN <br/> PREDICT FOOTBALL? 🎯</h3>
                    <button className="bg-primary text-black font-black py-4 px-10 rounded-xl shadow-lg shadow-primary/20 uppercase text-xs tracking-widest mt-4">
                      Join The Elite
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {activeSubTab === 'post' && (
          <motion.section
            key="post"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            <SectionHeading title="Post Your Prediction Slip 🎯" icon={Plus} />
            {!currentUser ? (
              <div className="bg-surface border border-white/5 rounded-3xl p-10 text-center relative overflow-hidden group">
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-primary/20 mb-6">
                  <Layout className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-2">Predictor Account Required</h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed mb-6">
                  Create a free Predictor account to post slips and join the leaderboard
                </p>
                <button 
                  onClick={onSignup}
                  className="bg-primary text-black font-black py-4 px-10 rounded-xl uppercase text-xs tracking-widest shadow-xl"
                >
                  Become a Predictor 🚀
                </button>
              </div>
            ) : (
              <div className="bg-surface border border-white/5 rounded-2xl p-6">
                <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-4">Today's Matches</div>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
                   {upcomingMatches.map(match => {
                     const isSelected = selectedMatches.find(s => s.matchId === match.id);
                     return (
                       <div key={match.id} className="space-y-2">
                        <button 
                          onClick={() => setShowPicker(match.id)}
                          className={cn(
                            "w-full flex justify-between items-center p-4 rounded-xl border transition-all text-left",
                            isSelected ? "bg-primary border-primary text-black" : "bg-black/40 border-white/5 text-white"
                          )}
                        >
                          <div>
                              <div className={cn("text-[8px] font-black uppercase mb-1", isSelected ? "text-black/60" : "text-white/30")}>{match.league} • {match.time}</div>
                              <div className="text-xs font-black uppercase tracking-tight">{match.homeTeam} vs {match.awayTeam}</div>
                          </div>
                          {isSelected ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4 text-white/20" />}
                        </button>
                        {isSelected && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex justify-between items-center"
                          >
                            <div className="text-[10px] font-black text-primary uppercase tracking-tight">Pick: {isSelected.selection} @{isSelected.odds.toFixed(2)}</div>
                            <button onClick={() => removeSelection(match.id)} className="p-1 text-primary/40 hover:text-red-500 whitespace-nowrap">
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        )}
                       </div>
                     );
                   })}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {activeSubTab === 'feed' && (
          <motion.section
            key="feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <SectionHeading title="Latest Prediction Slips" icon={MessageSquare} />
            <div className="space-y-4">
              {loading && slips.length === 0 ? (
                <div className="py-20 text-center opacity-40 uppercase font-black text-[10px] tracking-widest animate-pulse">Loading slips...</div>
              ) : slips.length > 0 ? slips.map(slip => (
                <PostedSlipCard key={slip.id} slip={slip} onViewProfile={onViewProfile} currentUser={currentUser} onSignup={onSignup} />
              )) : (
                <div className="py-20 text-center opacity-40 uppercase font-black text-[10px] tracking-widest border border-white/5 rounded-3xl">No slips posted yet</div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Review Action */}
      {activeSubTab === 'post' && selectedMatches.length > 0 && (
        <motion.button 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setIsReviewOpen(true)}
          className="fixed bottom-24 left-4 right-4 bg-primary text-black font-black py-5 rounded-2xl shadow-2xl flex justify-between items-center px-8 z-[60]"
        >
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase font-black opacity-60">Building Slip</span>
            <span className="text-sm font-black tracking-tighter uppercase">My Slip ({selectedMatches.length})</span>
          </div>
          <div className="bg-black/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
            Review →
          </div>
        </motion.button>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsReviewOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/10 rounded-t-[40px] z-[110] p-8 max-w-lg mx-auto"
            >
               <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />
               <h3 className="text-2xl font-black tracking-tighter uppercase text-white mb-6">Review My Slip 📝</h3>
               
               <div className="space-y-3 mb-8 max-h-[30vh] overflow-y-auto hide-scrollbar">
                  {selectedMatches.map(m => (
                    <div key={m.matchId} className="bg-white/5 border border-white/5 p-4 rounded-xl flex justify-between items-center text-white">
                       <div>
                          <div className="text-[8px] text-white/30 font-black uppercase mb-1">{m.homeTeam} vs {m.awayTeam}</div>
                          <div className="text-xs font-black uppercase">Pick: {m.selection}</div>
                       </div>
                       <button onClick={() => removeSelection(m.matchId)} className="p-2 text-white/20 hover:text-red-500">
                          <Minus className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
               </div>

               <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mb-8">
                  <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Total Odds</div>
                  <div className="text-xl font-black text-primary tracking-tighter">@{totalOdds.toFixed(2)}</div>
               </div>

               <div className="mb-8">
                  <label className="text-[9px] font-black text-white/40 uppercase mb-2 block">Caption (Max 60 chars)</label>
                  <input 
                    maxLength={60} 
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="e.g. 5 Fold Banker" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none font-black text-xs text-white focus:border-primary transition-colors"
                  />
               </div>

               <button 
                onClick={handlePostSlip}
                disabled={loading}
                className="w-full bg-primary text-black font-black py-5 rounded-2xl uppercase text-xs tracking-widest shadow-2xl disabled:opacity-50"
               >
                 {loading ? 'Posting...' : 'Post My Slip 📤'}
               </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Selection Picker Bottom Sheet */}
      <AnimatePresence>
        {showPicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPicker(null)}
              className="fixed inset-0 bg-black/80 z-[120] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 p-6 z-[130] rounded-t-3xl max-w-lg mx-auto"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />
              <h3 className="text-sm font-black uppercase mb-6 text-center">Make Your Prediction</h3>
              <div className="space-y-3">
                {['Home Win', 'Draw', 'Away Win', 'Over 2.5 Goals', 'Both Teams To Score'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => toggleSelection(MATCHES.find(m => m.id === showPicker)!, opt)}
                    className="w-full bg-white/5 border border-white/5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
const ToolsPage = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [singleStake, setSingleStake] = useState('1000');
  const [singleOdds, setSingleOdds] = useState('2.50');
  const [singleResult, setSingleResult] = useState<{ winnings: number, total: number } | null>(null);

  const [accaSelections, setAccaSelections] = useState([{ id: 1, odds: '1.50' }, { id: 2, odds: '2.00' }]);
  const [accaStake, setAccaStake] = useState('1000');

  const calculateSingle = () => {
    const s = parseFloat(singleStake);
    const o = parseFloat(singleOdds);
    if (!isNaN(s) && !isNaN(o)) {
      setSingleResult({ winnings: s * o - s, total: s * o });
    }
  };

  const addAccaSelection = () => {
    if (accaSelections.length < 10) {
      setAccaSelections([...accaSelections, { id: Date.now(), odds: '1.00' }]);
    }
  };

  const removeAccaSelection = (id: number) => {
    if (accaSelections.length > 2) {
      setAccaSelections(accaSelections.filter(s => s.id !== id));
    }
  };

  const totalAccaOdds = accaSelections.reduce((acc, curr) => acc * (parseFloat(curr.odds) || 1), 1).toFixed(2);
  const accaWinnings = (parseFloat(totalAccaOdds) * parseFloat(accaStake || '0')).toFixed(2);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 pt-4 px-4">
      {/* Form Analyzer */}
      <div className="bg-surface p-6 rounded-3xl border-2 border-primary/20 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary fill-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Form Analyzer — Who Wins?</h3>
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-6">Compare any two teams head to head</p>
          
            <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3">
              <input placeholder="Home Team" className="w-full bg-transparent outline-none text-xs font-black uppercase text-white" />
            </div>
            <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black text-white/20 border border-white/5">VS</div>
            <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3">
              <input placeholder="Away Team" className="w-full bg-transparent outline-none text-xs font-black uppercase text-white" />
            </div>
          </div>

          <button 
            onClick={() => {
              setAnalyzing(true);
              setTimeout(() => {
                setAnalyzing(false);
                setShowResult(true);
              }, 1500);
            }}
            className="w-full bg-primary text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {analyzing ? 'Analyzing Stats...' : 'Analyze Battle ⚔️'}
          </button>

          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6 pt-6 border-t border-white/5">
                <div className="grid grid-cols-2 gap-8 mb-4">
                  <div className="text-center">
                    <div className="flex gap-1 justify-center mb-3">
                      {['W', 'D', 'W', 'W', 'L'].map((f, i) => (
                        <span key={i} className={cn("w-4 h-4 rounded-sm text-[8px] flex items-center justify-center font-black", f === 'W' ? "bg-primary text-black" : f === 'D' ? "bg-white/20 text-white/40" : "bg-red-500 text-white")}>{f}</span>
                      ))}
                    </div>
                    <div className="text-[8px] text-white/40 font-black uppercase mb-1">Form Rating</div>
                    <div className="text-xl font-black text-white">82%</div>
                  </div>
                  <div className="text-center">
                    <div className="flex gap-1 justify-center mb-3">
                      {['L', 'W', 'D', 'L', 'L'].map((f, i) => (
                        <span key={i} className={cn("w-4 h-4 rounded-sm text-[8px] flex items-center justify-center font-black", f === 'W' ? "bg-primary text-black" : f === 'D' ? "bg-white/20 text-white/40" : "bg-red-500 text-white")}>{f}</span>
                      ))}
                    </div>
                    <div className="text-[8px] text-white/40 font-black uppercase mb-1">Form Rating</div>
                    <div className="text-xl font-black text-white">34%</div>
                  </div>
                </div>

                <div className="bg-black/60 p-5 rounded-2xl border border-white/5">
                   <div className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-4 text-center">StakeIQ Winning Probability</div>
                   <div className="flex justify-between items-center mb-2 text-[10px] font-black uppercase">
                      <span className="text-primary">Home 65%</span>
                      <span className="text-white/20">Draw 20%</span>
                      <span className="text-white">Away 15%</span>
                   </div>
                   <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary" style={{ width: '65%' }} />
                      <div className="h-full bg-white/10" style={{ width: '20%' }} />
                      <div className="h-full bg-white/30" style={{ width: '15%' }} />
                   </div>
                </div>

                <button className="w-full bg-white/5 border border-white/10 text-white/60 font-black py-3 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                   <Download className="w-4 h-4" /> Share Battle Card
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Single Calculator */}
      <div className="bg-surface p-6 rounded-2xl border border-white/5 mb-8">
        <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" /> Single Calculator
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">STAKE (₦)</label>
               <input type="number" value={singleStake} onChange={e => setSingleStake(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none font-mono text-sm focus:border-primary/50" />
             </div>
             <div>
               <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">ODDS</label>
               <input type="number" step="0.01" value={singleOdds} onChange={e => setSingleOdds(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none font-mono text-sm focus:border-primary/50" />
             </div>
          </div>
          <button onClick={calculateSingle} className="w-full bg-primary text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest hover:bg-primary-dark transition-colors">
             CALCULATE
          </button>
          
          <AnimatePresence>
            {singleResult && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4 border-t border-white/5 space-y-3">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Potential Winnings</span>
                    <span className="font-display font-black text-primary">₦{singleResult.winnings.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                    <span className="text-sm text-white font-bold uppercase tracking-tight">Total Return</span>
                    <span className="text-lg font-display font-black text-white">₦{singleResult.total.toLocaleString()}</span>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Acca Builder */}
      <div className="bg-surface p-5 rounded-2xl border border-white/5">
        <SectionHeading title="Accumulator Builder" icon={Zap} />
        <div className="space-y-4">
          {accaSelections.map((sel, idx) => (
            <div key={sel.id} className="flex gap-2 items-end">
              <div className="flex-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Selection {idx + 1} Odds</label>
                 <input 
                  type="number" 
                  step="0.01" 
                  value={sel.odds} 
                  onChange={e => {
                    const newSels = [...accaSelections];
                    newSels[idx].odds = e.target.value;
                    setAccaSelections(newSels);
                  }}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none" />
              </div>
              <button 
                onClick={() => removeAccaSelection(sel.id)}
                className="bg-red-500/10 text-red-500 p-3.5 rounded-xl hover:bg-red-500/20 transition-colors"
                disabled={accaSelections.length <= 2}
              >
                 <Minus className="w-5 h-5" />
              </button>
            </div>
          ))}

          <button onClick={addAccaSelection} className="w-full bg-surface-lighter hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/5 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Selection
          </button>

          <div className="pt-6 border-t border-white/5 space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Total Stake (₦)</label>
              <input type="number" value={accaStake} onChange={e => setAccaStake(e.target.value)} className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-4 outline-none text-lg font-display font-black" />
            </div>

            <div className="bg-bg-dark border border-primary/20 p-6 rounded-2xl">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 font-medium">Combined Odds</span>
                  <span className="font-display font-black text-white text-xl">{totalAccaOdds}</span>
               </div>
               <div className="flex justify-between items-center bg-primary/10 p-4 rounded-xl border border-primary/10">
                  <span className="text-sm text-primary font-bold uppercase tracking-tight">Potential Winnings</span>
                  <span className="text-xl font-display font-black text-primary">₦{accaWinnings}</span>
               </div>
            </div>

            <button className="w-full bg-primary text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
               <Zap className="w-5 h-5" /> Build My Acca Card 🎨
            </button>
          </div>
        </div>
      </div>
      
      <AdBanner />
    </motion.div>
  );
};

// --- Search Components ---

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: (username: string) => void;
  setPage: (page: Page) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onViewProfile, setPage }) => {
  const [query, setQuery] = useState('');
  const [predictors, setPredictors] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setPredictors([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      searchPredictors();
    } else {
      setPredictors([]);
    }
  }, [query]);

  const searchPredictors = async () => {
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(10);
      
      if (error) throw error;
      setPredictors(data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const filteredMatches = MATCHES.filter(m => 
    m.homeTeam.toLowerCase().includes(query.toLowerCase()) || 
    m.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
    m.league.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-6 overflow-hidden"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search predictors or teams..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-white focus:border-primary/50 outline-none transition-colors"
            />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-white/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 hide-scrollbar">
          {query.length > 0 ? (
            <>
              {/* Predictors Results */}
              <div>
                <SectionHeading title="Predictors" icon={Users} />
                <div className="space-y-3 px-4">
                  {searching ? (
                    <div className="py-4 text-center animate-pulse text-[10px] uppercase font-black text-white/20">Searching...</div>
                  ) : predictors.length > 0 ? predictors.map(p => (
                    <div 
                      key={p.username}
                      onClick={() => {
                        onViewProfile(p.username);
                        onClose();
                      }}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/30 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                          {p.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-tight">{p.display_name}</p>
                          <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">@{p.username}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  )) : (
                    <p className="text-[10px] text-white/20 font-black uppercase text-center py-4">No predictors found</p>
                  )}
                </div>
              </div>

              {/* Matches Results */}
              <div>
                <SectionHeading title="Matches" icon={Tv} />
                <div className="space-y-3 px-4">
                  {filteredMatches.length > 0 ? filteredMatches.map(m => (
                    <div 
                      key={m.id}
                      onClick={() => {
                        setPage('predictions');
                        onClose();
                      }}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/30 cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight">{m.homeTeam} vs {m.awayTeam}</p>
                        <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">{m.league}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-primary uppercase">{m.time}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[10px] text-white/20 font-black uppercase text-center py-4">No matches found</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <Search className="w-16 h-16 mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">Search StakeIQ</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Main Application ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [session, setSession] = useState<any>(null);
  const [authModal, setAuthModal] = useState<{ open: boolean, mode: 'login' | 'signup' }>({ open: false, mode: 'signup' });
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [followedPredictors, setFollowedPredictors] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;

      // Fetch following list
      const { data: followingData } = await supabase
        .from('followers')
        .select('profiles!followers_following_id_fkey(username)')
        .eq('follower_id', userId);
      
      const followingUsernames = followingData?.map((f: any) => f.profiles.username) || [];
      setFollowedPredictors(followingUsernames);
      setCurrentUser({
        id: data.id,
        username: data.username,
        displayName: data.display_name,
        bio: data.bio,
        email: session?.user.email || '',
        joinedAt: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        avatarColor: data.avatar_color,
        stats: {
          totalSlips: 0, // Will be fetched later
          accuracy: 0,
          bestStreak: 0,
          followers: 0,
          following: 0
        }
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
    setViewingProfile(null);
  };

  const toggleFollow = async (predictorUsername: string) => {
    if (!currentUser) {
      setAuthModal({ open: true, mode: 'signup' });
      return;
    }

    try {
      // 1. Get the target profile's ID
      const { data: targetProfile, error: pError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', predictorUsername)
        .single();
      
      if (pError) throw pError;

      const isFollowing = followedPredictors.includes(predictorUsername);

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('followers')
          .delete()
          .match({ follower_id: currentUser.id, following_id: targetProfile.id });
        
        if (error) throw error;
        setFollowedPredictors(prev => prev.filter(u => u !== predictorUsername));
      } else {
        // Follow
        const { error } = await supabase
          .from('followers')
          .insert({ follower_id: currentUser.id, following_id: targetProfile.id });
        
        if (error) throw error;
        setFollowedPredictors(prev => [...prev, predictorUsername]);
      }
    } catch (err) {
      console.error('Toggle follow error:', err);
    }
  };

  const renderPage = () => {
    if (viewingProfile) {
      return (
        <ProfilePage 
          username={viewingProfile} 
          isOwn={currentUser?.username === viewingProfile} 
          onBack={() => setViewingProfile(null)} 
          currentUser={currentUser}
          onSignup={() => setAuthModal({ open: true, mode: 'signup' })}
          isFollowing={followedPredictors.includes(viewingProfile)}
          onToggleFollow={toggleFollow}
        />
      );
    }

    switch (currentPage) {
      case 'home': return <HomePage setPage={setCurrentPage} />;
      case 'predictions': return <PredictionsPage />;
      case 'live': return <LiveScoresPage />;
      case 'slip': return <SlipBuilderPage />;
      case 'predictors': return (
        <PredictorsPage 
          onViewProfile={setViewingProfile} 
          onSignup={() => setAuthModal({ open: true, mode: 'signup' })}
          currentUser={currentUser}
        />
      );
      case 'tools': return <ToolsPage />;
      default: return <HomePage setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-bg-dark border-x border-white/5 relative">
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-bg-dark flex flex-col items-center justify-center gap-4"
          >
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Initializing StakeIQ...</p>
          </motion.div>
        )}
          {authModal.open && (
            <AuthModal 
              onClose={() => setAuthModal({ ...authModal, open: false })} 
              onComplete={() => {}} 
              initialMode={authModal.mode}
            />
          )}
          {searchOpen && (
            <SearchOverlay 
              isOpen={searchOpen} 
              onClose={() => setSearchOpen(false)} 
              onViewProfile={setViewingProfile}
              setPage={setCurrentPage}
            />
          )}
      </AnimatePresence>

      {/* Sticky Header */}
      <header className={cn(
        "sticky top-0 z-40 px-6 py-4 flex items-center justify-between transition-all duration-300",
        scrolled ? "bg-surface/90 backdrop-blur-lg border-b border-white/5 shadow-2xl" : "bg-[#121212] border-b border-white/5"
      )}>
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setCurrentPage('home'); setViewingProfile(null); }}>
          <div className="bg-primary p-1 rounded-sm transition-transform group-hover:rotate-12">
            <Zap className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">
            STAKEIQ<span className="text-primary">.</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAuthModal({ open: true, mode: 'login' })}
                className="text-white/60 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mr-1"
              >
                Login
              </button>
              <button 
                onClick={() => setAuthModal({ open: true, mode: 'signup' })}
                className="bg-white text-black text-[10px] font-black py-2 px-4 rounded-lg transition-all hover:bg-white/90 uppercase tracking-widest shadow-lg"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[8px] font-black text-white/40 uppercase">
               Logged in as <span className="text-primary">@{currentUser.username}</span>
            </div>
          )}
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewingProfile || currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Disclaimer */}
      <footer className="px-6 py-16 pb-32 text-center bg-[#0a0a0a] mt-10 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 mb-6">
           <Zap className="w-6 h-6 text-primary" />
           <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] leading-none">STAKEIQ SYSTEM</span>
        </div>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-10 px-4">Bet Smarter. Not Harder.</p>
        <div className="space-y-6 px-4">
          <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/30">
            <a href="#" className="hover:text-primary transition-colors">Safety</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">TOS</a>
          </div>
          <div className="p-6 border border-white/5 rounded-xl opacity-30 mx-auto max-w-sm">
            <p className="text-[9px] text-white leading-loose font-bold uppercase tracking-widest">
              Informational purposes only. Bet responsibly. 18+ only.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-0 pb-0 max-w-lg mx-auto pointer-events-none">
        <div className="bg-[#121212] border-t border-white/10 flex justify-around items-center h-16 pointer-events-auto">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'predictions', icon: TrendingUp, label: 'Predict' },
            { id: 'predictors', icon: Trophy, label: 'Predictors' },
            { id: 'slip', icon: Layout, label: 'Builder' },
            { id: 'profile', label: currentUser ? 'Profile' : 'Me' },
          ].map((item) => {
            const isActive = !viewingProfile && currentPage === item.id;
            const isProfileActive = (viewingProfile && currentUser?.username === viewingProfile) || (item.id === 'profile' && !viewingProfile && currentPage === 'profile');
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    if (currentUser) {
                      setViewingProfile(currentUser.username);
                    } else {
                      setAuthModal({ open: true, mode: 'login' });
                    }
                  } else {
                    setViewingProfile(null);
                    setCurrentPage(item.id as Page);
                  }
                }}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all flex-1 h-full justify-center",
                  (isActive || (item.id === 'profile' && isProfileActive)) ? "text-primary" : "text-white/40"
                )}
              >
                {item.id === 'profile' ? (
                  currentUser ? (
                    <div className={cn(
                      "w-6 h-6 rounded-full border flex items-center justify-center text-[8px] font-black uppercase transition-all relative",
                      isProfileActive ? "bg-primary border-primary text-black scale-110" : "bg-white/5 border-white/20 text-white/40"
                    )}>
                      {currentUser.avatar}
                      {showNotification && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-black" />
                      )}
                    </div>
                  ) : (
                    <User className={cn("w-5 h-5", isProfileActive ? "scale-110" : "scale-100")} />
                  )
                ) : (
                  item.icon && <item.icon className={cn("w-5 h-5", isActive ? "scale-110" : "scale-100")} />
                )}
                <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
