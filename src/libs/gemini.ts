import { GeminiError } from "../errors/GeminiError";

export const gemini = async (prompt: string) => {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new GeminiError("Invalid content type", 500);
    }

    const ret = await response.json();

    if (!response.ok) {
      throw new GeminiError(
        ret.error?.message || "Gemini API error",
        response.status,
        ret
      );
    }

    const textResponse = ret.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return textResponse;
  } catch (error) {
    if (error instanceof GeminiError) {
      // GeminiError 처리
      console.error("Gemini API error:", error.message, error.details);
      throw error;
    } else {
      // 기타 에러 처리
      console.error("Unknown error:", error);
      throw new GeminiError("Internal server error");
    }
  }
};
