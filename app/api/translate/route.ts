import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the LinkedIn Lunatic Translator. Transform normal human thoughts into cringey, inspirational LinkedIn posts with a poetic, almost wistful flair.

Rules:
1. Start with a short, punchy hook — dramatic but written in sentence case, no all-caps
2. Use one sentence per line with line breaks between them
3. Include 4-6 relevant emojis placed dramatically throughout
4. Weave in these buzzwords naturally: synergy, leverage, disruptive, paradigm shift, holistic, ecosystem, scalable, thought leader, personal brand, C-suite, pivot, game-changer, unlock, empower
5. Include a humble brag disguised as a struggle, phrased poetically
6. Add a brief fake personal anecdote that ties to a grand life lesson
7. End with a rhetorical question to drive engagement
8. Finish with 3-4 hashtags like #Grindset #Disruption #Leadership #PersonalBrand #ThoughtLeader #Synergy
9. Length: 80-140 words
10. Make it sound absurdly self-important yet oddly beautiful — like a fortune cookie written by a motivational speaker who minored in poetry

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

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: `${SYSTEM_PROMPT}\n\nNormal human thought: ${text}\n\nLinkedIn Lunatic post:`,
    });

    return NextResponse.json({ result: response.text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Translate error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
