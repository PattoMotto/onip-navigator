import { StreamType } from './types';

export const BITCOIN_ADDRESS = 'bc1qm7ktthfyeghpmdqjcnumfxse4d8h0g3pgujxr6';

export const OFFICIAL_LINKS = [
  { label: 'OINP Home Page', url: 'https://www.ontario.ca/page/ontario-immigrant-nominee-program-oinp' },
  { label: 'Program Updates', url: 'https://www.ontario.ca/page/2025-ontario-immigrant-nominee-program-updates' },
  { label: 'Application Guide', url: 'https://www.ontario.ca/page/applying-ontario-immigrant-nominee-program-oinp' },
];

export const STREAMS = [
  { id: StreamType.FOREIGN_WORKER, label: 'Foreign Worker', type: 'EOI' },
  { id: StreamType.INTL_STUDENT, label: 'International Student', type: 'EOI' },
  { id: StreamType.IN_DEMAND, label: 'In-Demand Skills', type: 'EOI' },
  { id: StreamType.MASTERS, label: 'Masters Graduate', type: 'EOI' },
  { id: StreamType.PHD, label: 'PhD Graduate', type: 'EOI' },
  { id: StreamType.HCP, label: 'Human Capital Priorities', type: 'EE' },
  { id: StreamType.SKILLED_TRADES, label: 'Skilled Trades', type: 'EE' },
  { id: StreamType.FRENCH_WORKER, label: 'French-Speaking Skilled Worker', type: 'EE' },
];

export const TEER_LEVELS = [
  { value: '0', label: 'TEER 0 (Management)', score: 10 },
  { value: '1', label: 'TEER 1 (Professional)', score: 10 },
  { value: '2', label: 'TEER 2 (Technical)', score: 8 },
  { value: '3', label: 'TEER 3 (Skilled Trades)', score: 8 },
  { value: '4', label: 'TEER 4 (Intermediate)', score: 0 },
  { value: '5', label: 'TEER 5 (Labour)', score: 0 },
];

export const NOC_BROAD_CATEGORIES = [
  { value: 'health_trades_stem', label: 'Health, Trades, STEM, Transport, Manufacturing (NOC 0, 2, 3, 7, 8, 9)', score: 10 },
  { value: 'business_admin', label: 'Business, Finance, Administration (NOC 1, 4)', score: 5 },
  { value: 'sales_service_arts', label: 'Sales, Service, Arts, Culture (NOC 5, 6)', score: 0 },
];

export const WAGE_TIERS = [
  { value: '40k+', label: '$40.00/hr or more (approx $80k/yr)', score: 10 },
  { value: '35-39', label: '$35.00 to $39.99/hr', score: 8 },
  { value: '30-34', label: '$30.00 to $34.99/hr', score: 7 },
  { value: '25-29', label: '$25.00 to $29.99/hr', score: 6 },
  { value: '20-24', label: '$20.00 to $24.99/hr', score: 5 },
  { value: 'less20', label: 'Less than $20.00/hr', score: 0 },
];

export const EDUCATION_LEVELS = [
  { value: 'phd', label: 'PhD', score: 10 },
  { value: 'masters', label: 'Masters', score: 8 },
  { value: 'degree', label: 'Bachelors Degree (3+ years)', score: 6 },
  { value: 'diploma2', label: 'Diploma (2+ years)', score: 5 },
  { value: 'postgrad', label: 'Post-graduate Certificate (1+ year)', score: 5 },
  { value: 'diploma1', label: 'Diploma (1 year)', score: 3 },
  { value: 'cert', label: 'Certificate (Apprenticeship)', score: 3 },
  { value: 'none', label: 'Secondary / None', score: 0 },
];

export const FIELDS_OF_STUDY = [
  { value: 'stem_health', label: 'STEM / Health (Engineering, Health, Math, CS)', score: 12 },
  { value: 'trades', label: 'Trades (Agriculture, Mechanics, Construction)', score: 12 },
  { value: 'business_social', label: 'Business, Social Science, Education, Law', score: 6 },
  { value: 'arts_humanities', label: 'Arts, Humanities', score: 0 },
  { value: 'other', label: 'Other', score: 0 },
];

export const REGIONS = [
  { value: 'northern', label: 'Northern Ontario (e.g., Sudbury, Thunder Bay)', score: 10 },
  { value: 'outside_gta', label: 'Outside GTA (e.g., Hamilton, Waterloo, Ottawa)', score: 8 },
  { value: 'gta', label: 'Inside GTA (Durham, Halton, Peel, York)', score: 3 },
  { value: 'toronto', label: 'City of Toronto', score: 0 },
];

export const CANADIAN_CREDENTIAL_OPTIONS = [
  { value: '2+', label: 'More than one Canadian credential', score: 10 },
  { value: '1', label: 'One Canadian credential', score: 5 },
  { value: '0', label: 'None', score: 0 },
];

export const CLB_LEVELS = [
  { value: 9, label: 'CLB 9 or higher', score: 10 },
  { value: 8, label: 'CLB 8', score: 6 },
  { value: 7, label: 'CLB 7', score: 4 },
  { value: 6, label: 'CLB 6', score: 0 },
  { value: 0, label: 'CLB 5 or lower', score: 0 },
];

export const EOI_STREAMS = [
  StreamType.FOREIGN_WORKER,
  StreamType.INTL_STUDENT,
  StreamType.IN_DEMAND,
  StreamType.MASTERS,
  StreamType.PHD
];

export const EE_STREAMS = [
  StreamType.HCP,
  StreamType.SKILLED_TRADES,
  StreamType.FRENCH_WORKER
];

export const TECH_OCCUPATIONS = [
  "20012 - Computer and information systems managers",
  "21211 - Data Scientists",
  "21220 - Cybersecurity specialists",
  "21221 - Business systems specialists",
  "21222 - Information systems specialists",
  "21223 - Database analysts and data administrators",
  "21230 - Computer systems developers and programmers",
  "21231 - Software engineers and designers",
  "21232 - Software developers and programmers",
  "21233 - Web designers",
  "21234 - Web developers and programmers",
  "21311 - Computer engineers (except software engineers and designers)",
  "22220 - Computer network technicians",
  "22221 - User support technicians",
  "22222 - Information systems testing technicians"
];