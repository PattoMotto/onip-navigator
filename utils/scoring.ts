import { Profile, StreamType, ScoreResult } from '../types';
import { TEER_LEVELS, EDUCATION_LEVELS, CANADIAN_CREDENTIAL_OPTIONS, NOC_BROAD_CATEGORIES } from '../constants';

const getOptionScore = (options: any[], value: string | undefined): number => {
  return options.find(o => o.value === value)?.score || 0;
};

// Helper for Region Scoring
const getRegionScore = (region: string | undefined, stream: StreamType): number => {
    if (!region) return 0;
    
    // Northern Ontario: 10 points
    if (region === 'northern') return 10;
    
    // Other areas outside GTA: 8 points
    if (region === 'outside_gta') return 8;
    
    // Inside GTA (excluding Toronto): 3 points
    if (region === 'gta') return 3;
    
    // Toronto: 0 points
    if (region === 'toronto') return 0;
    
    return 0;
};

const getFieldOfStudyScore = (field: string | undefined, stream: StreamType): number => {
    if (!field) return 0;
    if (field === 'stem_health' || field === 'trades') return 12;
    if (field === 'business_social') return 6;
    if (field === 'arts_humanities') return 0;
    // Fallback/Legacy
    if (field === 'business') return 6; 
    return 0;
};

export const calculateOINPScore = (profile: Profile): ScoreResult => {
  const { stream } = profile;
  const breakdown: Record<string, number> = {};
  let total = 0;
  let maxPossible = 0; 
  let eligible = true;

  // --- MASTERS & PHD STREAM LOGIC ---
  if (stream === StreamType.MASTERS || stream === StreamType.PHD) {
      // 1. Employment / Labour Market
      // Factor: Canadian Work Permit/Status
      if (profile.hasValidPermit) {
          breakdown['Valid Work/Study Permit'] = 10;
          total += 10;
      }
      maxPossible += 10;

      // Factor: Earnings History
      if (profile.earningsHistory) {
          breakdown['Earnings History ($40k+)'] = 3;
          total += 3;
      }
      maxPossible += 3;

      // 2. Education
      // Factor: Education Level
      const eduScore = getOptionScore(EDUCATION_LEVELS, profile.educationLevel);
      breakdown['Highest Level of Education'] = eduScore;
      total += eduScore;
      maxPossible += 10;

      // Factor: Field of Study
      const fieldScore = getFieldOfStudyScore(profile.fieldOfStudy, stream);
      breakdown['Field of Study'] = fieldScore;
      total += fieldScore;
      maxPossible += 12;

      // Factor: Canadian Education Experience
      const cadScore = getOptionScore(CANADIAN_CREDENTIAL_OPTIONS, profile.canadianCredentialCount);
      breakdown['Canadian Education Experience'] = cadScore;
      total += cadScore;
      maxPossible += 10;

      // 3. Language
      // Factor: Official Language Ability
      let langScore = 0;
      if (profile.clbLevel) {
          if (profile.clbLevel >= 9) langScore = 10;
          else if (profile.clbLevel === 8) langScore = 6;
          else if (profile.clbLevel === 7) langScore = 4;
      }
      breakdown['Official Language Ability'] = langScore;
      total += langScore;
      maxPossible += 10;

      // Factor: Knowledge of Official Languages (Bilingualism)
      let knowScore = 0;
      if (profile.bilingual) {
          knowScore = 10;
      }
      breakdown['Knowledge of Official Languages'] = knowScore;
      total += knowScore;
      maxPossible += 10;

      // 4. Regionalization
      // Factor: Location of Study
      const regScore = getRegionScore(profile.studyLocation, stream);
      breakdown['Location of Study'] = regScore;
      total += regScore;
      maxPossible += 10;

      // Eligibility Checks (Basic hard rules for display purposes)
      if (stream === StreamType.MASTERS && profile.educationLevel !== 'masters') eligible = false;
      if (stream === StreamType.PHD && profile.educationLevel !== 'phd') eligible = false;
      if (stream === StreamType.MASTERS && (!profile.clbLevel || profile.clbLevel < 7)) eligible = false;
      
      return { total, breakdown, eligible, maxPossible };
  }

  // --- JOB OFFER STREAMS ---
  if ([StreamType.FOREIGN_WORKER, StreamType.INTL_STUDENT, StreamType.IN_DEMAND].includes(stream)) {
    
    // 1. Skill Level (TEER)
    // CRITICAL: International Students do NOT get points for TEER level in the OINP EOI grid.
    if (stream !== StreamType.INTL_STUDENT) {
        const teerScore = getOptionScore(TEER_LEVELS, profile.nocTeer);
        breakdown['Job Level (TEER)'] = teerScore;
        total += teerScore;
        maxPossible += 10;
    } else {
        // Explicitly show 0 for transparency
        breakdown['Job Level (TEER) (Excluded for Students)'] = 0;
    }

    // 2. Strategic Priorities (Broad Occupational Category)
    const categoryScore = getOptionScore(NOC_BROAD_CATEGORIES, profile.nocBroadCategory);
    breakdown['Occupational Category'] = categoryScore;
    total += categoryScore;
    maxPossible += 10;

    // 3. Wage
    let wageScore = 0;
    if (profile.wageAmount && profile.wageAmount >= 40) wageScore = 10;
    else if (profile.wageAmount && profile.wageAmount >= 35) wageScore = 8;
    else if (profile.wageAmount && profile.wageAmount >= 30) wageScore = 7;
    else if (profile.wageAmount && profile.wageAmount >= 25) wageScore = 6;
    else if (profile.wageAmount && profile.wageAmount >= 20) wageScore = 5;
    
    breakdown['Wage Level'] = wageScore;
    total += wageScore;
    maxPossible += 10;

    // 4. Permit
    if (profile.hasValidPermit) {
        breakdown['Valid Work Permit'] = 10;
        total += 10;
    }
    maxPossible += 10;

    // 5. Tenure
    if (profile.currentlyWorkingWithEmployer) {
        breakdown['6 Months Tenure'] = 3;
        total += 3;
    }
    maxPossible += 3;

    // 6. Earnings
    if (profile.earningsHistory) {
        breakdown['Earnings History ($40k+)'] = 3;
        total += 3;
    }
    maxPossible += 3;
    
    // 7. Location
    const regionScore = getRegionScore(profile.workLocation, stream);
    breakdown['Regional Location'] = regionScore;
    total += regionScore;
    maxPossible += 10;
    
    if (stream === StreamType.FOREIGN_WORKER && !profile.nocTeer) eligible = false;

    return { total, breakdown, eligible, maxPossible }; 
  }

  // --- EXPRESS ENTRY STREAMS ---
  return {
      total: 0,
      breakdown: {},
      eligible: true, 
      maxPossible: 0
  };
};

export const getEEStatus = (profile: Profile): string => {
   if (!profile.crsScore) return "Calculate CRS Score first";
   
   const score = profile.crsScore;

   if (profile.stream === StreamType.HCP) {
       // Tech Draw Logic
       if (profile.isTechOccupation) {
            if (score > 465) return "High Probability (Tech Draws typically > 460)";
            if (score > 450) return "Moderate Probability (Tech Draws fluctuate)";
            return "Low Probability for Tech (Try improving to 460+)";
       }
       // General HCP
       if (score > 470) return "High Probability (Recent General Draws > 470)";
       if (score > 460) return "Moderate Probability";
       return "Low Probability (General draws are competitive)";
   }
   if (profile.stream === StreamType.FRENCH_WORKER) {
       if (profile.isFrenchSpeaker && score > 350) return "High Probability (French draws typical > 300-350)";
       return "Low Probability (Requires French CLB 7+)";
   }
   if (profile.stream === StreamType.SKILLED_TRADES) {
       if (profile.hasTradeExperience && score > 350) return "High Probability";
       return "Check Trade Requirements";
   }
   return "Check specific program guides";
};