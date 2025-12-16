import { Profile, StreamType } from '../types';

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  points?: number;
}

export const generateSuggestions = (profile: Profile): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const { stream } = profile;

  // 1. Regionalization (EOI Streams)
  if ([StreamType.FOREIGN_WORKER, StreamType.INTL_STUDENT, StreamType.IN_DEMAND, StreamType.MASTERS, StreamType.PHD].includes(stream)) {
      const isGrad = [StreamType.MASTERS, StreamType.PHD].includes(stream);
      const currentLocation = isGrad ? profile.studyLocation : profile.workLocation;
      
      if (currentLocation === 'toronto' || currentLocation === 'gta') {
          suggestions.push({
              id: 'region',
              title: isGrad ? 'Study in Northern Ontario' : 'Work in Northern Ontario',
              description: isGrad 
                ? 'Studying at an institution in Northern Ontario grants the maximum 10 points for location (vs 0 for Toronto or 3 for GTA).'
                : 'Securing a job offer in Northern Ontario (e.g., Sudbury, Thunder Bay) grants 10 points (vs 3 for GTA).',
              impact: 'High',
              points: currentLocation === 'toronto' ? 10 : 7
          });
      } else if (currentLocation === 'outside_gta' && stream !== StreamType.MASTERS && stream !== StreamType.PHD) {
           // For job streams, Outside GTA is 8, Northern is 10.
           suggestions.push({
              id: 'region-north',
              title: 'Move to Northern Ontario',
              description: 'Northern Ontario offers 10 points compared to 8 points for other areas outside the GTA.',
              impact: 'Low',
              points: 2
          });
      }
  }

  // 2. Wage (Job Offer Streams)
  if ([StreamType.FOREIGN_WORKER, StreamType.INTL_STUDENT, StreamType.IN_DEMAND].includes(stream)) {
      const wage = profile.wageAmount || 0;
      if (wage < 40) {
          suggestions.push({
              id: 'wage',
              title: 'Negotiate Higher Wage',
              description: 'A wage of $40/hr or higher (approx $80k/yr) secures the maximum 10 points for this category.',
              impact: wage < 20 ? 'High' : 'Medium',
              points: 10 - (wage >= 35 ? 8 : wage >= 30 ? 7 : wage >= 25 ? 6 : wage >= 20 ? 5 : 0)
          });
      }
  }

  // 3. Language (Grad & EE)
  if ([StreamType.MASTERS, StreamType.PHD, StreamType.HCP, StreamType.FRENCH_WORKER, StreamType.SKILLED_TRADES].includes(stream)) {
      const clb = profile.clbLevel || 0;
      if (clb < 9) {
          suggestions.push({
              id: 'language',
              title: 'Improve Official Language Score',
              description: 'Achieving CLB 9 or higher in your first official language maximizes language points.',
              impact: 'High',
              points: 10 - (clb >= 8 ? 6 : clb >= 7 ? 4 : 0)
          });
      }
      
      if (!profile.bilingual) {
           suggestions.push({
              id: 'bilingual',
              title: 'Learn a Second Official Language',
              description: 'Demonstrating proficiency in both English and French (CLB 7+) adds significant points.',
              impact: 'High',
              points: 10
          });
      }
  }

  // 4. Tenure & Permit (Job Offer Streams)
  if ([StreamType.FOREIGN_WORKER, StreamType.INTL_STUDENT, StreamType.IN_DEMAND].includes(stream)) {
      if (!profile.currentlyWorkingWithEmployer) {
          suggestions.push({
              id: 'tenure',
              title: 'Complete 6 Months Tenure',
              description: 'Staying with your current employer for at least 6 months before applying adds 3 points.',
              impact: 'Medium',
              points: 3
          });
      }
      if (!profile.hasValidPermit) {
           suggestions.push({
              id: 'permit',
              title: 'Secure Valid Status',
              description: 'Having a valid work or study permit at the time of EOI registration adds 10 points.',
              impact: 'High',
              points: 10
          });
      }
      if (!profile.earningsHistory) {
           suggestions.push({
              id: 'earnings',
              title: 'Build Earnings History',
              description: 'Earning at least $40k in a single tax year in Canada (in the last 5 years) adds 3 points.',
              impact: 'Medium',
              points: 3
          });
      }
  }

  // 5. Strategic Priorities (Job Offer Streams)
  if ([StreamType.FOREIGN_WORKER, StreamType.INTL_STUDENT, StreamType.IN_DEMAND].includes(stream)) {
      if (profile.nocBroadCategory === 'sales_service_arts' || !profile.nocBroadCategory) {
           suggestions.push({
              id: 'category',
              title: 'Target Strategic Occupations',
              description: 'Jobs in Health, Trades, STEM, Transport, or Manufacturing grant the highest points (10 pts).',
              impact: 'High',
              points: 10
          });
      } else if (profile.nocBroadCategory === 'business_admin') {
           suggestions.push({
              id: 'category-shift',
              title: 'Shift to STEM/Trades/Health',
              description: 'Business & Admin roles get 5 points, while STEM/Health/Trades get 10.',
              impact: 'Medium',
              points: 5
          });
      }
  }

  // 6. Education (Masters/PhD)
  if ([StreamType.MASTERS, StreamType.PHD].includes(stream)) {
      if (profile.canadianCredentialCount !== '2+') {
           suggestions.push({
              id: 'credential',
              title: 'Additional Canadian Credential',
              description: 'Completing another Canadian credential (e.g., a 1-year certificate) adds 5 points.',
              impact: 'Medium',
              points: 5
          });
      }
  }

  return suggestions;
};