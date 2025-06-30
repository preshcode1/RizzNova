import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // use OpenRouter key
  baseURL: "https://openrouter.ai/api/v1", // important for OpenRouter
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are RizzNova, an elite AI RizzLord...`.trim()
    };

    // REMOVE any extra props like timestamp
    const cleanMessages = [systemMessage, ...messages].map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-small-3.2-24b-instruct",
      messages: cleanMessages,
      temperature: 0.95,
      max_tokens: 300,
      top_p: 0.9,
      presence_penalty: 0.6,
    });

    return response.choices[0].message.content ?? "Couldn't rizz that one. Try again.";
  } catch (error: any) {
    console.error("OpenRouter API error:", error);

    if (error.status === 429 || error.code === "insufficient_quota") {
      throw new Error("Rate limited or quota exceeded. Try again later.");
    }

    if (error.status === 401) {
      throw new Error("Invalid OpenRouter API key. Check your key.");
    }

    throw new Error("Failed to get chat response.");
  }
}

export async function generateChatTitle(firstMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-small-3.2-24b-instruct",
      messages: [
        {
          role: "system",
          content: "Generate a short, smooth, 2–6 word title based on the user’s first message. Keep it cool and catchy.",
        },
        {
          role: "user",
          content: firstMessage,
        },
      ],
      max_tokens: 15,
      temperature: 0.9,
    });

    return response.choices[0].message.content?.trim() || "New Chat";
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "New Chat";
  }
}
