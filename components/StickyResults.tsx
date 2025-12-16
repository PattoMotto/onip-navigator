import React, { useState, useMemo } from 'react';
import { ScoreResult, Profile } from '../types';
import { getEEStatus } from '../utils/scoring';
import { generateSuggestions } from '../utils/suggestions';

interface Props {
  result: ScoreResult;
  profile: Profile;
  isEOI: boolean;
}

const StickyResults: React.FC<Props> = ({ result, profile, isEOI }) => {
  const [showDetails, setShowDetails] = useState(false);

  const suggestions = useMemo(() => generateSuggestions(profile), [profile]);

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.15)] transition-all duration-500 ease-in-out z-50 ${showDetails ? 'h-[85vh]' : 'h-24'}`}>
      <div className="max-w-5xl mx-auto px-4 h-full flex flex-col">
        
        {/* Header Bar */}
        <div className="h-24 flex items-center justify-between shrink-0 group cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
               {isEOI ? 'Total Estimated Score' : 'Eligibility Status'}
            </p>
            <div className="flex items-baseline gap-2">
                {isEOI ? (
                    <>
                    <span className="text-4xl font-black text-indigo-700 tracking-tight">{result.total}</span>
                    <span className="text-xl text-slate-400 font-medium">/ {result.maxPossible}</span>
                    </>
                ) : (
                    <span className="text-2xl font-bold text-indigo-700">{getEEStatus(profile)}</span>
                )}
            </div>
          </div>

          <div className="flex items-center gap-4">
             {showDetails ? (
                <button 
                onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-full hover:bg-slate-200 transition-colors"
                >
                    Close
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
             ) : (
                <button 
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all"
                >
                    View Analysis
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                </button>
             )}
          </div>
        </div>

        {/* Expanded Content */}
        {showDetails && (
           <div className="flex-1 overflow-y-auto pb-12 pt-4 grid grid-cols-1 md:grid-cols-12 gap-10 border-t border-slate-100 animate-fadeIn">
              
              {/* Left Col: Breakdown (5 cols) */}
              <div className="md:col-span-5 space-y-6">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </span>
                    Detailed Breakdown
                </h4>
                {isEOI ? (
                   <div className="space-y-3">
                     {Object.entries(result.breakdown).map(([key, score]) => (
                       <div key={key} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                         <span className="text-slate-700 font-medium text-sm">{key}</span>
                         <span className={`font-bold text-lg ${(score as number) > 0 ? 'text-indigo-700' : 'text-slate-300'}`}>{score as number}</span>
                       </div>
                     ))}
                     {Object.keys(result.breakdown).length === 0 && <p className="text-slate-500 italic text-sm">Fill out the form to see your score.</p>}
                     
                     {!result.eligible && (
                        <div className="mt-6 p-4 bg-rose-50 text-rose-800 rounded-xl text-sm border border-rose-100 flex items-start gap-3">
                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <div>
                                <strong className="block mb-1 font-bold">Eligibility Warning</strong>
                                You may not meet the mandatory stream requirements (e.g., minimum education or language level).
                            </div>
                        </div>
                     )}
                   </div>
                ) : (
                  <div className="p-6 bg-amber-50 text-amber-900 rounded-xl border border-amber-100 text-sm leading-relaxed">
                    For Express Entry streams, points are determined by the Federal Comprehensive Ranking System (CRS). Ontario selects candidates from the pool based on criteria like CRS score, French ability, or Tech/Trade experience.
                  </div>
                )}
              </div>

              {/* Right Col: Suggestions (7 cols) */}
              <div className="md:col-span-7 flex flex-col pl-0 md:pl-4 border-l border-transparent md:border-slate-100">
                <h4 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                  <span className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </span>
                  Optimization Tips
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestions.length > 0 ? (
                        suggestions.map(s => (
                            <div key={s.id} className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full 
                                        ${s.impact === 'High' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {s.impact} Impact
                                    </span>
                                    {s.points && (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                            +{s.points} pts
                                        </span>
                                    )}
                                </div>
                                <h5 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-indigo-700 transition-colors">{s.title}</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h5 className="font-bold text-slate-900">Score Optimized</h5>
                            <p className="text-slate-500 text-sm mt-1">You've maximized the potential points based on standard factors.</p>
                        </div>
                    )}
                </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default StickyResults;