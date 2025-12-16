import { Profile } from '../types';

// Simplified CRS Calculation (Assumes standard healthy individual for estimation)
export const calculateCRS = (profile: Profile): number => {
    let score = 0;
    
    // If spouse is Canadian/PR, applicant is scored as Single
    const isSingle = profile.maritalStatus !== 'married' || !!profile.spouseIsCanadian;
    
    const age = profile.age || 25;
    const edu = profile.educationLevel || 'none';
    const clb = profile.clbLevel || 0;
    const cdnExp = profile.canadianWorkExperienceYears || 0;
    const foreignExp = profile.foreignWorkExperienceYears || 0;
    
    // --- A. Core / Human Capital ---

    // 1. Age
    let agePoints = 0;
    if (isSingle) {
        if (age >= 20 && age <= 29) agePoints = 110;
        else if (age === 18) agePoints = 99;
        else if (age === 19) agePoints = 105;
        else if (age >= 45) agePoints = 0;
        else {
             // 30=105, 31=99... (-5.5 per year approx)
             const drop = age - 29;
             agePoints = Math.max(0, 110 - (drop * 5.5)); 
        }
    } else {
        if (age >= 20 && age <= 29) agePoints = 100;
        else if (age >= 45) agePoints = 0;
        else {
            const drop = age - 29;
            agePoints = Math.max(0, 100 - (drop * 5)); 
        }
    }
    score += Math.floor(agePoints);

    // 2. Education
    let eduPoints = 0;
    const eduMapSingle: Record<string, number> = { 'phd': 150, 'masters': 135, 'degree': 120, 'diploma2': 98, 'postgrad': 90, 'diploma1': 90, 'cert': 85, 'none': 0 };
    const eduMapMarried: Record<string, number> = { 'phd': 140, 'masters': 126, 'degree': 112, 'diploma2': 91, 'postgrad': 84, 'diploma1': 84, 'cert': 80, 'none': 0 };
    
    if (edu === 'diploma2') eduPoints = isSingle ? 98 : 91; 
    else eduPoints = isSingle ? (eduMapSingle[edu] || 0) : (eduMapMarried[edu] || 0);
    score += eduPoints;

    // 3. Language (First Official)
    let langPoints = 0;
    const getBandScore = (clb: number, single: boolean) => {
        if (single) {
            if (clb >= 10) return 34;
            if (clb === 9) return 31;
            if (clb === 8) return 23;
            if (clb === 7) return 17;
            if (clb === 6) return 9;
            return 0;
        } else {
            if (clb >= 10) return 32;
            if (clb === 9) return 29;
            if (clb === 8) return 22;
            if (clb === 7) return 16;
            if (clb === 6) return 8;
            return 0;
        }
    };
    langPoints = getBandScore(clb, isSingle) * 4;
    score += langPoints;

    // 4. Canadian Work Experience
    let cdnExpPoints = 0;
    if (isSingle) {
        if (cdnExp >= 5) cdnExpPoints = 80;
        else if (cdnExp === 4) cdnExpPoints = 72;
        else if (cdnExp === 3) cdnExpPoints = 64;
        else if (cdnExp === 2) cdnExpPoints = 53;
        else if (cdnExp === 1) cdnExpPoints = 40;
    } else {
        if (cdnExp >= 5) cdnExpPoints = 70;
        else if (cdnExp === 4) cdnExpPoints = 63;
        else if (cdnExp === 3) cdnExpPoints = 56;
        else if (cdnExp === 2) cdnExpPoints = 46;
        else if (cdnExp === 1) cdnExpPoints = 35;
    }
    score += cdnExpPoints;

    // --- B. Spouse Factors (Max 40) ---
    // Only applies if married and spouse is NOT Canadian/PR (otherwise treated as single)
    if (!isSingle) {
        // 1. Spouse Education (Max 10)
        const sEdu = profile.spouseEducationLevel || 'none';
        let sEduPoints = 0;
        const sEduMap: Record<string, number> = { 
            'phd': 10, 'masters': 10, 'degree': 8, 'diploma2': 7, 'postgrad': 6, 'diploma1': 6, 'cert': 2, 'none': 0 
        };
        sEduPoints = sEduMap[sEdu] || 0;
        score += sEduPoints;

        // 2. Spouse Language (Max 20)
        // 5 pts per band (CLB 9+), 3 pts (CLB 7/8), 1 pt (CLB 5/6)
        const sClb = profile.spouseClbLevel || 0;
        let sLangPerBand = 0;
        if (sClb >= 9) sLangPerBand = 5;
        else if (sClb >= 7) sLangPerBand = 3;
        else if (sClb >= 5) sLangPerBand = 1;
        score += (sLangPerBand * 4);

        // 3. Spouse Canadian Work Exp (Max 10)
        const sExp = profile.spouseCanadianWorkExperienceYears || 0;
        let sExpPoints = 0;
        if (sExp >= 5) sExpPoints = 10;
        else if (sExp === 4) sExpPoints = 9;
        else if (sExp === 3) sExpPoints = 8;
        else if (sExp === 2) sExpPoints = 7;
        else if (sExp === 1) sExpPoints = 5;
        score += sExpPoints;
    }

    // --- C. Skill Transferability (Max 100) ---
    let transferPoints = 0;

    // 1. Education + Language (CLB 9 is key)
    const isHighEdu = ['phd', 'masters', 'degree', 'diploma2'].includes(edu); 
    const isMediumEdu = ['diploma1', 'postgrad'].includes(edu); // 1 year post sec
    
    let eduLangPoints = 0;
    if (clb >= 9) {
        if (isHighEdu) eduLangPoints = 50;
        else if (isMediumEdu) eduLangPoints = 25;
    } else if (clb >= 7) {
        if (isHighEdu) eduLangPoints = 25;
        else if (isMediumEdu) eduLangPoints = 13;
    }
    transferPoints += eduLangPoints;

    // 2. Education + Canadian Work Experience
    let eduCdnPoints = 0;
    if (cdnExp >= 2) {
        if (isHighEdu) eduCdnPoints = 50;
        else if (isMediumEdu) eduCdnPoints = 25;
    } else if (cdnExp === 1) {
        if (isHighEdu) eduCdnPoints = 25;
        else if (isMediumEdu) eduCdnPoints = 13;
    }
    transferPoints += eduCdnPoints;

    // 3. Foreign Exp + Language (CLB 9)
    let forLangPoints = 0;
    if (foreignExp >= 3) {
        if (clb >= 9) forLangPoints = 50;
        else if (clb >= 7) forLangPoints = 25;
    } else if (foreignExp >= 1) {
        if (clb >= 9) forLangPoints = 25;
        else if (clb >= 7) forLangPoints = 13;
    }
    
    // Correcting max caps (Education Transferability Max 50)
    const eduTransferFinal = Math.min(50, eduLangPoints + eduCdnPoints);
    
    let forCdnPoints = 0;
    if (foreignExp >= 3) {
        if (cdnExp >= 2) forCdnPoints = 50;
        else if (cdnExp === 1) forCdnPoints = 25;
    } else if (foreignExp >= 1) {
        if (cdnExp >= 2) forCdnPoints = 25;
        else if (cdnExp === 1) forCdnPoints = 13;
    }

    // Foreign Work Transferability Max 50
    const expTransferFinal = Math.min(50, forLangPoints + forCdnPoints);

    // 5. Certificate of Qualification (Trades) + Language
    let tradePoints = 0;
    if (profile.certificateOfQualification) {
        if (clb >= 7) tradePoints = 50;
        else if (clb >= 5) tradePoints = 25;
    }

    // Total Transferability capped at 100
    score += Math.min(100, eduTransferFinal + expTransferFinal + tradePoints);

    // --- D. Additional Points ---
    if (profile.siblingInCanada) score += 15;
    if (profile.bilingual) score += 30; // Basic check, ideally strictly CLB 7 in French
    if (profile.canadianCredentialCount && profile.canadianCredentialCount !== '0') {
         if (['degree', 'masters', 'phd'].includes(edu)) score += 30;
         else score += 15;
    }

    return score;
};