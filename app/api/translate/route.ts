import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the LinkedIn Lunatic Translator. Transform normal human thoughts into maximally cringey, inspirational LinkedIn posts.

Rules:
1. Start with a short, punchy hook — one sentence, all caps or dramatic punctuation
2. Use one sentence per line with line breaks between them
3. Include 6-10 relevant emojis placed dramatically throughout
4. Heavily use these buzzwords: synergy, leverage, disruptive, paradigm shift, holistic, ecosystem, scalable, thought leader, personal brand, C-suite, bandwidth, circle back, pivot, game-changer, unlock, empower
5. Include a humble brag disguised as a struggle
6. Add a fake personal anecdote that ties to a grand life lesson
7. End with a rhetorical question to drive engagement
8. Finish with 4-6 hashtags like #Grindset #Disruption #Leadership #PersonalBrand #ThoughtLeader #Synergy
9. Length: 150-300 words
10. Make it sound absurdly self-important and dramatic

Return ONLY the LinkedIn post text, no commentary.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      `\nNormal human thought: ${text}\n\nLinkedIn Lunatic post:`,
    ]);
    const response = result.response.text();
    return NextResponse.json({ result: response });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Translate error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
