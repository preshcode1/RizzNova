import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are RizzNova, an AI-powered dating and relationship assistant. You provide helpful, respectful, and practical advice about dating, relationships, social interactions, and communication skills. 

Your responses should be:
- Supportive and encouraging
- Practical and actionable
- Respectful and appropriate
- Focused on building genuine connections
- Emphasizing consent, respect, and healthy relationships

Avoid:
- Manipulative tactics or "pickup artist" techniques
- Disrespectful or objectifying language
- Encouraging dishonesty or deception
- Inappropriate or explicit content

Keep responses conversational and helpful, like a knowledgeable friend giving advice.`
    };

    const fullMessages = [systemMessage, ...messages];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: fullMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    // Handle quota exceeded error specifically
    if (error.status === 429 && error.code === 'insufficient_quota') {
      throw new Error("OpenAI quota exceeded. Please check your OpenAI billing and add credits to your account. Visit https://platform.openai.com/account/billing to add funds.");
    }
    
    // Handle other API errors
    if (error.status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your API key configuration.");
    }
    
    throw new Error("Failed to generate chat response. Please try again later.");
  }
}

export async function generateChatTitle(firstMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a short, descriptive title (max 6 words) for a chat conversation based on the first user message. Focus on the main topic or question."
        },
        {
          role: "user",
          content: firstMessage
        }
      ],
      max_tokens: 20,
      temperature: 0.5,
    });

    return response.choices[0].message.content?.trim() || "New Chat";
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "New Chat";
  }
}
