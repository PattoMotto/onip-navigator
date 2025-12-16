import React, { useState, useMemo } from 'react';
import { StreamType, Profile, ScoreResult } from './types';
import { EOI_STREAMS } from './constants';
import StreamSelector from './components/StreamSelector';
import CalculatorForm from './components/CalculatorForm';
import StickyResults from './components/StickyResults';
import { calculateOINPScore } from './utils/scoring';

const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    stream: StreamType.FOREIGN_WORKER,
    nocTeer: '',
    wageAmount: 0,
    educationLevel: '',
    clbLevel: 0,
    workLocation: '',
  });

  const handleProfileUpdate = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleStreamChange = (stream: StreamType) => {
    setProfile(prev => ({ ...prev, stream }));
  };

  const result: ScoreResult = useMemo(() => {
    return calculateOINPScore(profile);
  }, [profile]);

  const isEOI = EOI_STREAMS.includes(profile.stream);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center text-white font-bold text-xl">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <h1 className="font-bold text-lg text-slate-800 tracking-tight">OINP Navigator</h1>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            Unofficial Tool
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Am I Eligible?</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Select an immigration stream below to calculate your estimated score and receive tailored optimization tips for the Ontario Immigrant Nominee Program.
          </p>
        </div>

        <StreamSelector selected={profile.stream} onSelect={handleStreamChange} />
        
        <div className="flex flex-col lg:flex-row gap-10 items-start relative mt-8">
           <CalculatorForm profile={profile} onChange={handleProfileUpdate} />
           
           {/* Desktop Sidebar Info */}
           <div className="hidden lg:block w-80 sticky top-28 shrink-0 space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
               <h4 className="font-bold text-xs text-slate-400 mb-4 uppercase tracking-widest">About this Stream</h4>
               <p className="text-sm font-medium text-slate-900 mb-2">{profile.stream}</p>
               <p className="text-sm text-slate-500 leading-relaxed mb-4">
                 {isEOI 
                   ? "This stream uses the Expression of Interest (EOI) scoring system. Candidates are ranked in a pool and invited based on their score."
                   : "This stream operates through the Federal Express Entry system. Ontario searches the pool for candidates meeting specific criteria."
                 }
               </p>
               <div className="text-xs text-slate-400 border-t border-slate-100 pt-3">
                 Scores are estimates based on the latest OINP program guides.
               </div>
             </div>
           </div>
        </div>
      </main>

      <StickyResults result={result} profile={profile} isEOI={isEOI} />
    </div>
  );
};

export default App;