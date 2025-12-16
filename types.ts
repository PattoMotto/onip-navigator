export enum StreamType {
  FOREIGN_WORKER = 'Foreign Worker',
  INTL_STUDENT = 'International Student',
  IN_DEMAND = 'In-Demand Skills',
  MASTERS = 'Masters Graduate',
  PHD = 'PhD Graduate',
  HCP = 'Human Capital Priorities',
  SKILLED_TRADES = 'Skilled Trades',
  FRENCH_WORKER = 'French-Speaking Skilled Worker'
}

export enum Category {
  JOB_OFFER = 'Job Offer',
  EDUCATION = 'Education',
  LANGUAGE = 'Language',
  REGIONALIZATION = 'Regionalization',
  STRATEGIC = 'Strategic Priorities'
}

export interface Profile {
  stream: StreamType;
  // Job Offer Factors
  nocTeer?: string; // 0, 1, 2, 3, 4, 5
  nocBroadCategory?: string; // Strategic Priorities (e.g. Health, Trades)
  wageAmount?: number; // Annual salary or hourly converted
  jobDuration?: 'less_than_6m' | '6m_plus'; // For scoring
  currentlyWorkingWithEmployer?: boolean; // 6 months+ tenure
  
  // Education Factors
  educationLevel?: string; // PhD, Masters, Bachelors, etc.
  fieldOfStudy?: string; // STEM, Trades, Health, etc.
  canadianCredentialCount?: string; // '0', '1', '2+'
  
  // Masters/PhD & Job Offer Specifics
  hasValidPermit?: boolean;
  earningsHistory?: boolean; // >40k earnings in a year

  // Language Factors
  clbLevel?: number; // 0-10+
  bilingual?: boolean;

  // Regionalization
  workLocation?: string; // GTA, Outside GTA, Northern
  studyLocation?: string; // GTA, Outside GTA, Northern, Toronto

  // Eligibility / EE Specifics
  crsScore?: number;
  hasTradeExperience?: boolean;
  isFrenchSpeaker?: boolean;
  
  // CRS Calculator & Tech Draw Specifics
  isTechOccupation?: boolean;
  age?: number;
  maritalStatus?: 'single' | 'married';
  spouseIsCanadian?: boolean; // If spouse is citizen/PR, treated as single for points
  spouseEducationLevel?: string;
  spouseClbLevel?: number;
  spouseCanadianWorkExperienceYears?: number;
  
  canadianWorkExperienceYears?: number;
  foreignWorkExperienceYears?: number;
  certificateOfQualification?: boolean;
  siblingInCanada?: boolean;
}

export interface ScoreResult {
  total: number;
  breakdown: Record<string, number>;
  eligible: boolean;
  maxPossible: number;
}