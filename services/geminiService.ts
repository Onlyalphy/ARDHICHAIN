
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface VerificationResult {
  isAuthentic: boolean;
  hasDispute: boolean;
  courtCaseRef?: string;
  confidenceScore: number;
  reasoning: string;
}

export const analyzeLandDispute = async (lrNumber: string, description: string): Promise<VerificationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a simulated land court case check for Kenya. 
      LR Number: ${lrNumber}
      Description: ${description}
      
      Determine if there are any historical or current indicators of fraud, overlapping titles, or court cases. 
      (Note: This is a simulated environment, but reason based on typical Kenyan land dispute patterns like 'Green Card' issues, grabber alerts, or Gazette notices).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAuthentic: { type: Type.BOOLEAN },
            hasDispute: { type: Type.BOOLEAN },
            courtCaseRef: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["isAuthentic", "hasDispute", "confidenceScore", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      isAuthentic: true,
      hasDispute: false,
      confidenceScore: 0.5,
      reasoning: "AI analysis was unable to complete. Please consult manual registry."
    };
  }
};

export const verifyTitleDeedDocument = async (base64Image: string): Promise<VerificationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: "Analyze this Kenyan Title Deed. Check for seal authenticity, LR number validity, and Ministry of Lands signatures. Return verification status." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAuthentic: { type: Type.BOOLEAN },
            hasDispute: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          },
          required: ["isAuthentic", "hasDispute", "reasoning", "confidenceScore"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Image Verification failed:", error);
    throw error;
  }
};
