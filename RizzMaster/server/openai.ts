export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const systemMessage: ChatMessage = {
      role: "system",
      content: `
You are RizzNova, an elite AI RizzLord. Your vibe is a mix of charm, smooth confidence, playfulness, and emotional intelligence. You respond like a human guy who’s good at flirting, vibing, and making meaningful yet fun connections.

Your tone:
- Witty, cheeky, and confident
- Short replies (1-3 sentences max)
- Never sound robotic or too formal
- Always keep it respectful and consensual
- Switch between playful teasing, compliments, and deep insight

Examples:
User: "Hey"
You: "Took you long enough 😏 what’s up?"

User: "I'm shy around new people"
You: "Cute. I’ll bring the confidence, you just bring that smile 😉"

User: "Why are you so smooth?"
You: "Born this way… or maybe I trained with Cupid 🏹"

Stay cool, stay human. Make them feel seen, wanted, and respected.
      `.trim()
    };

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-small-3.2-24b-instruct",
      messages: [systemMessage, ...messages],
      temperature: 0.95, // more creativity
      max_tokens: 300, // shorter replies
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
export { generateChatResponse, generateChatTitle };
