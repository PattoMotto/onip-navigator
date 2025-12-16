import React, { useEffect } from 'react';
import { Profile } from '../types';
import { calculateCRS } from '../utils/crsScoring';
import { EDUCATION_LEVELS, CLB_LEVELS } from '../constants';

interface Props {
  profile: Profile;
  onChange: (updates: Partial<Profile>) => void;
}

const CRSCalculator: React.FC<Props> = ({ profile, onChange }) => {
  
  // Auto-calculate when dependencies change
  useEffect(() => {
    const score = calculateCRS(profile);
    if (score !== profile.crsScore) {
       onChange({ crsScore: score });
    }
  }, [
    profile.age, 
    profile.educationLevel, 
    profile.maritalStatus, 
    profile.spouseIsCanadian,
    profile.clbLevel, 
    profile.canadianWorkExperienceYears, 
    profile.foreignWorkExperienceYears, 
    profile.bilingual, 
    profile.certificateOfQualification,
    profile.siblingInCanada,
    profile.canadianCredentialCount,
    profile.spouseEducationLevel,
    profile.spouseClbLevel,
    profile.spouseCanadianWorkExperienceYears
  ]);

  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5 mt-4">
        <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">CRS Calculator Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Marital Status</label>
                <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button 
                       className={`flex-1 py-2 text-sm ${profile.maritalStatus !== 'married' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600'}`}
                       onClick={() => onChange({ maritalStatus: 'single' })}
                    >Single</button>
                    <button 
                       className={`flex-1 py-2 text-sm ${profile.maritalStatus === 'married' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600'}`}
                       onClick={() => onChange({ maritalStatus: 'married' })}
                    >Married</button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Age</label>
                <input 
                  type="number" 
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={profile.age || ''}
                  onChange={(e) => onChange({ age: parseInt(e.target.value) })}
                  placeholder="e.g. 29"
                />
            </div>

             <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Canadian Work Experience (Years)</label>
                <select 
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={profile.canadianWorkExperienceYears || 0}
                  onChange={(e) => onChange({ canadianWorkExperienceYears: parseInt(e.target.value) })}
                >
                   <option value="0">None</option>
                   <option value="1">1 Year</option>
                   <option value="2">2 Years</option>
                   <option value="3">3 Years</option>
                   <option value="4">4 Years</option>
                   <option value="5">5+ Years</option>
                </select>
            </div>

             <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Foreign Work Experience (Years)</label>
                <select 
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={profile.foreignWorkExperienceYears || 0}
                  onChange={(e) => onChange({ foreignWorkExperienceYears: parseInt(e.target.value) })}
                >
                   <option value="0">None</option>
                   <option value="1">1 Year</option>
                   <option value="2">2 Years</option>
                   <option value="3">3+ Years</option>
                </select>
            </div>
            
            {/* Additional Factors */}
            <div className="md:col-span-2 space-y-2">
                 <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                    type="checkbox" 
                    checked={!!profile.certificateOfQualification}
                    onChange={(e) => onChange({ certificateOfQualification: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded" 
                    />
                    <span className="text-sm text-slate-700">Valid Certificate of Qualification in a Trade?</span>
                </label>
            
                 <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                    type="checkbox" 
                    checked={!!profile.siblingInCanada}
                    onChange={(e) => onChange({ siblingInCanada: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded" 
                    />
                    <span className="text-sm text-slate-700">Sibling who is Canadian citizen/PR?</span>
                </label>
            </div>

            {/* SPOUSE SECTION */}
            {profile.maritalStatus === 'married' && (
                <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200 mt-2">
                    <h5 className="font-bold text-slate-800 text-sm mb-3">Spouse Details</h5>
                    
                    <label className="flex items-center space-x-3 cursor-pointer mb-4">
                        <input 
                        type="checkbox" 
                        checked={!!profile.spouseIsCanadian}
                        onChange={(e) => onChange({ spouseIsCanadian: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded" 
                        />
                        <span className="text-sm text-slate-700">Spouse is Canadian Citizen or PR? (Scored as Single)</span>
                    </label>

                    {!profile.spouseIsCanadian && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Spouse Education</label>
                                <select 
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={profile.spouseEducationLevel || ''}
                                    onChange={(e) => onChange({ spouseEducationLevel: e.target.value })}
                                >
                                    <option value="">Select Level...</option>
                                    {EDUCATION_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Spouse Language (CLB)</label>
                                <select 
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={profile.spouseClbLevel || ''}
                                    onChange={(e) => onChange({ spouseClbLevel: parseInt(e.target.value) })}
                                >
                                    <option value="">Select CLB Level...</option>
                                    {CLB_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Spouse Cdn Work Exp (Years)</label>
                                <select 
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={profile.spouseCanadianWorkExperienceYears || 0}
                                    onChange={(e) => onChange({ spouseCanadianWorkExperienceYears: parseInt(e.target.value) })}
                                >
                                    <option value="0">None</option>
                                    <option value="1">1 Year</option>
                                    <option value="2">2 Years</option>
                                    <option value="3">3 Years</option>
                                    <option value="4">4 Years</option>
                                    <option value="5">5+ Years</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>

        <div className="bg-indigo-50 p-3 rounded-lg text-center">
            <span className="text-xs text-indigo-600 uppercase font-bold tracking-wider">Calculated Score</span>
            <div className="text-2xl font-bold text-indigo-700">{profile.crsScore || 0}</div>
        </div>
    </div>
  );
};

export default CRSCalculator;