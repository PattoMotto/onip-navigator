import { GoogleGenAI } from "@google/genai";
import { Profile, ScoreResult } from '../types';

const getGeminiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey });
};

export const analyzeProfile = async (profile: Profile, scoreResult: ScoreResult): Promise<string> => {
    try {
        const client = getGeminiClient();
        
        const prompt = `
        You are an expert Ontario Immigrant Nominee Program (OINP) consultant.
        Analyze the following user profile and score breakdown for the "${profile.stream}" stream.
        
        Profile Data:
        ${JSON.stringify(profile, null, 2)}
        
        Score Results:
        ${JSON.stringify(scoreResult, null, 2)}
        
        Task:
        1. Summarize their current standing.
        2. Identify the top 3 easiest ways they can improve their score. Focus on actionable advice (e.g., retaking language test, moving to a different region).
        3. If they are in an Express Entry stream, explain how their CRS score compares to recent trends (general knowledge).
        4. Keep the tone professional, encouraging, and concise. Format with Markdown.
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });

        return response.text || "Unable to generate analysis at this time.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I couldn't analyze your profile at the moment. Please try again later.";
    }
};
