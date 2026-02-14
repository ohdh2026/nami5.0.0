
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCorrectiveActionSuggestion = async (equipmentName: string, issueDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `운항 전 점검 중 ${equipmentName}에서 다음과 같은 이상이 발견되었습니다: "${issueDescription}". 
      이에 대한 표준 조치 사항(Corrective Action)을 전문가 입장에서 간결하게 한 문장으로 추천해줘.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    return response.text?.trim() || "전문가 조치를 권고합니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "수동 조치 내용을 입력하세요.";
  }
};
