import { GoogleGenAI } from "@google/genai";

// Initialize the API client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    console.warn("API Key missing for Gemini");
    return "Descrição automática indisponível (chave API ausente).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escreva uma descrição curta, apetitosa e vendedora para um cardápio de bar/restaurante para o item: "${productName}" da categoria "${category}". Máximo de 20 palavras. Em Português do Brasil.`,
    });

    return response.text || "Sem descrição gerada.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Erro ao gerar descrição.";
  }
};

export const generateProductImage = async (productName: string): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) {
    console.warn("API Key missing for Gemini");
    return null;
  }

  try {
    // Using gemini-2.5-flash-image which is the recommended model for generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Professional food photography of ${productName}, delicious, appetizing, restaurant style, high resolution, soft lighting, 4k.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Extract image from parts (gemini-2.5-flash-image returns inlineData)
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};