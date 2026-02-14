
import { GoogleGenAI } from "@google/genai";

export const getCorrectiveActionSuggestion = async (equipmentName: string, issueDescription: string) => {
  // 호출 시점에 인스턴스를 생성하여 process.env.API_KEY가 주입된 이후에 실행되도록 보장합니다.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    return "수동 조치 내용을 입력하세요. (API 키 확인 필요)";
  }
};
