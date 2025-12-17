import React, { useState, useMemo } from 'react';
import { StreamType, Profile, ScoreResult } from './types';
import { EOI_STREAMS } from './constants';
import StreamSelector from './components/StreamSelector';
import CalculatorForm from './components/CalculatorForm';
import StickyResults from './components/StickyResults';
import DonateModal from './components/DonateModal';
import DisclaimerModal from './components/DisclaimerModal';
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

  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);

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

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors group"
              title="Support the Project"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="text-xs font-semibold hidden sm:inline">Donate</span>
            </button>
            <a
              href="https://github.com/PattoMotto/onip-navigator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors group"
              title="View Source on GitHub"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold hidden sm:inline">GitHub</span>
            </a>
            <button
              onClick={() => setIsDisclaimerModalOpen(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 sm:px-3 py-1.5 rounded-full hover:bg-slate-200 hover:text-slate-600 transition-all cursor-pointer"
              title="Click for official Disclaimer"
            >
              Unofficial <span className="hidden sm:inline">Tool</span>
            </button>
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

      <DonateModal isOpen={isDonateModalOpen} onClose={() => setIsDonateModalOpen(false)} />
      <DisclaimerModal isOpen={isDisclaimerModalOpen} onClose={() => setIsDisclaimerModalOpen(false)} />
    </div>
  );
};

export default App;