import React, { useState } from 'react';
import { Profile, StreamType } from '../types';
import { TEER_LEVELS, WAGE_TIERS, EDUCATION_LEVELS, FIELDS_OF_STUDY, REGIONS, CLB_LEVELS, EOI_STREAMS, CANADIAN_CREDENTIAL_OPTIONS, TECH_OCCUPATIONS, NOC_BROAD_CATEGORIES } from '../constants';
import InputSection from './InputSection';
import CRSCalculator from './CRSCalculator';

interface Props {
  profile: Profile;
  onChange: (updates: Partial<Profile>) => void;
}

const CalculatorForm: React.FC<Props> = ({ profile, onChange }) => {
  const isEOI = EOI_STREAMS.includes(profile.stream);
  const isJobStream = [StreamType.FOREIGN_WORKER, StreamType.INTL_STUDENT, StreamType.IN_DEMAND].includes(profile.stream);
  const isGradStream = [StreamType.MASTERS, StreamType.PHD].includes(profile.stream);
  const isEE = !isEOI;
  
  const [showCrsCalc, setShowCrsCalc] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto pb-48">
      
      {/* SECTION: EMPLOYMENT / LABOUR MARKET */}
      {(isJobStream || isGradStream) && (
        <InputSection title="Employment & Labour Market" active={true}>
            {/* Job Offer Streams Specifics */}
            {isJobStream && (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Job Skill Level (TEER)</label>
                        <select 
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow hover:border-slate-300"
                            value={profile.nocTeer || ''}
                            onChange={(e) => onChange({ nocTeer: e.target.value })}
                        >
                            <option value="">Select TEER Category...</option>
                            {TEER_LEVELS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        {profile.stream === StreamType.INTL_STUDENT && (
                          <div className="flex items-start gap-2 mt-3 p-3 bg-indigo-50 text-indigo-800 text-xs rounded-lg border border-indigo-100">
                             <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <p><strong>Note for International Students:</strong> You do NOT receive points for the Job Skill Level (TEER) in the EOI grid. This category is excluded for this stream.</p>
                          </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Occupational Category (Strategic Priorities)</label>
                        <select 
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow hover:border-slate-300"
                            value={profile.nocBroadCategory || ''}
                            onChange={(e) => onChange({ nocBroadCategory: e.target.value })}
                        >
                            <option value="">Select Job Industry...</option>
                            {NOC_BROAD_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Hourly Wage (approximate)</label>
                        <select 
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow hover:border-slate-300"
                            value={profile.wageAmount === 40 ? '40k+' : profile.wageAmount === 35 ? '35-39' : profile.wageAmount === 20 ? '20-24' : ''}
                            onChange={(e) => {
                            const val = e.target.value;
                            let wage = 0;
                            if (val === '40k+') wage = 40;
                            else if (val === '35-39') wage = 35;
                            else if (val === '30-34') wage = 30;
                            else if (val === '25-29') wage = 25;
                            else if (val === '20-24') wage = 20;
                            onChange({ wageAmount: wage });
                            }}
                        >
                            <option value="">Select Wage Range...</option>
                            {WAGE_TIERS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* Shared Job/Grad Factors */}
            <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-4 p-4 bg-white rounded-xl cursor-pointer hover:bg-slate-50 border border-slate-200 transition-colors">
                    <input 
                    type="checkbox" 
                    checked={!!profile.hasValidPermit}
                    onChange={(e) => onChange({ hasValidPermit: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
                    />
                    <div>
                        <span className="block text-sm font-bold text-slate-900">Valid Work or Study Permit</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Do you currently have legal status in Canada with a valid permit?</span>
                    </div>
                </label>

                {isJobStream && (
                     <label className="flex items-center space-x-4 p-4 bg-white rounded-xl cursor-pointer hover:bg-slate-50 border border-slate-200 transition-colors">
                        <input 
                        type="checkbox" 
                        checked={!!profile.currentlyWorkingWithEmployer}
                        onChange={(e) => onChange({ currentlyWorkingWithEmployer: e.target.checked })}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
                        />
                        <div>
                            <span className="block text-sm font-bold text-slate-900">6 Months Tenure</span>
                            <span className="block text-xs text-slate-500 mt-0.5">Have you worked with the job-offering employer for at least 6 months?</span>
                        </div>
                    </label>
                )}

                <label className="flex items-center space-x-4 p-4 bg-white rounded-xl cursor-pointer hover:bg-slate-50 border border-slate-200 transition-colors">
                    <input 
                    type="checkbox" 
                    checked={!!profile.earningsHistory}
                    onChange={(e) => onChange({ earningsHistory: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
                    />
                    <div>
                        <span className="block text-sm font-bold text-slate-900">Earnings History</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Have you earned at least $40k in a single tax year in Canada (last 5 years)?</span>
                    </div>
                </label>
            </div>
        </InputSection>
      )}

      {/* SECTION 2: EDUCATION - Hidden for Job Streams as they don't score points for it */}
      {(isGradStream || isEE) && (
        <InputSection title="Education History" active={true}>
            <div className="space-y-6">
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Highest Level of Education</label>
                <select 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow hover:border-slate-300"
                    value={profile.educationLevel || ''}
                    onChange={(e) => onChange({ educationLevel: e.target.value })}
                >
                    <option value="">Select Level...</option>
                    {EDUCATION_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
                </div>

                {isGradStream && (
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Field of Study</label>
                    <select 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow hover:border-slate-300"
                    value={profile.fieldOfStudy || ''}
                    onChange={(e) => onChange({ fieldOfStudy: e.target.value })}
                    >
                    <option value="">Select Field...</option>
                    {FIELDS_OF_STUDY.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                </div>
                )}

                {isGradStream && (
                    <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Canadian Education Experience</label>
                    <select 
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow hover:border-slate-300"
                        value={profile.canadianCredentialCount || '0'}
                        onChange={(e) => onChange({ canadianCredentialCount: e.target.value })}
                    >
                        {CANADIAN_CREDENTIAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    </div>
                )}
            </div>
        </InputSection>
      )}

      {/* SECTION 3: LANGUAGE */}
      {(isGradStream || isEE) && (
        <InputSection title="Language Ability" active={true}>
            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">First Official Language (CLB)</label>
            <select 
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow hover:border-slate-300"
                value={profile.clbLevel || ''}
                onChange={(e) => onChange({ clbLevel: parseInt(e.target.value) })}
            >
                <option value="">Select CLB Level...</option>
                {CLB_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            </div>
            
            <div className="mt-4">
            <label className="flex items-center space-x-4 p-4 bg-white rounded-xl cursor-pointer hover:bg-slate-50 border border-slate-200 transition-colors">
                <input 
                type="checkbox" 
                checked={!!profile.bilingual}
                onChange={(e) => onChange({ bilingual: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
                />
                <div>
                    <span className="block text-sm font-bold text-slate-900">Bilingual (2 Official Languages)</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Do you have CLB 7+ in your first official language AND CLB 6+ in your second?</span>
                </div>
            </label>
            </div>
        </InputSection>
      )}

      {/* SECTION 4: REGIONALIZATION */}
      <InputSection title="Regionalization" active={isEOI}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {isGradStream ? 'Location of Study (Campus)' : 'Location of Job Offer'}
          </label>
          <select 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow hover:border-slate-300"
            value={(isGradStream ? profile.studyLocation : profile.workLocation) || ''}
            onChange={(e) => {
               if(isGradStream) onChange({ studyLocation: e.target.value });
               else onChange({ workLocation: e.target.value });
            }}
          >
            <option value="">Select Location...</option>
            {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </InputSection>

      {/* SECTION 5: EXPRESS ENTRY SPECIFIC */}
      <InputSection title="Express Entry Profile" active={isEE}>
        
        {profile.stream === StreamType.HCP && (
           <div className="mb-6 bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <label className="flex items-start space-x-4 cursor-pointer">
                  <input 
                  type="checkbox" 
                  checked={!!profile.isTechOccupation}
                  onChange={(e) => onChange({ isTechOccupation: e.target.checked })}
                  className="w-5 h-5 mt-0.5 text-indigo-600 rounded focus:ring-indigo-500" 
                  />
                  <div>
                      <span className="block text-sm font-bold text-indigo-900">Tech Draw Eligible?</span>
                      <span className="block text-xs text-indigo-700 mt-1 leading-relaxed">Check if you have work experience in one of the OINP Tech Draw NOC codes (e.g., Software Engineers, Data Scientists).</span>
                  </div>
              </label>
              {profile.isTechOccupation && (
                 <div className="mt-4 text-xs text-indigo-700 bg-white/60 p-3 rounded-lg border border-indigo-100 h-32 overflow-y-auto">
                    <strong>Eligible NOCs:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      {TECH_OCCUPATIONS.map(noc => <li key={noc}>{noc}</li>)}
                    </ul>
                 </div>
              )}
           </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Current Federal CRS Score</label>
          <div className="flex gap-2">
              <input 
                type="number"
                placeholder="e.g. 450"
                className="flex-1 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-700"
                value={profile.crsScore || ''}
                onChange={(e) => onChange({ crsScore: parseInt(e.target.value) })}
              />
              <button 
                 onClick={() => setShowCrsCalc(!showCrsCalc)}
                 className="px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors shadow-sm"
              >
                {showCrsCalc ? 'Hide Estimator' : 'Estimate Score'}
              </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Enter your score manually or use the estimator button.</p>
        </div>

        {showCrsCalc && (
            <div className="animate-fadeIn">
                <CRSCalculator profile={profile} onChange={onChange} />
            </div>
        )}

        {profile.stream === StreamType.FRENCH_WORKER && (
           <div className="mt-4">
             <label className="flex items-center space-x-4 p-4 bg-white rounded-xl cursor-pointer hover:bg-slate-50 border border-slate-200 transition-colors">
              <input 
                type="checkbox" 
                checked={!!profile.isFrenchSpeaker}
                onChange={(e) => onChange({ isFrenchSpeaker: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
              />
              <span className="text-sm font-bold text-slate-700">Primary language is French (CLB 7+)?</span>
            </label>
          </div>
        )}
        
         {profile.stream === StreamType.SKILLED_TRADES && (
           <div className="mt-4">
             <label className="flex items-center space-x-4 p-4 bg-white rounded-xl cursor-pointer hover:bg-slate-50 border border-slate-200 transition-colors">
              <input 
                type="checkbox" 
                checked={!!profile.hasTradeExperience}
                onChange={(e) => onChange({ hasTradeExperience: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
              />
              <span className="text-sm font-bold text-slate-700">1 year work experience in eligible trade?</span>
            </label>
          </div>
        )}
      </InputSection>

    </div>
  );
};

export default CalculatorForm;