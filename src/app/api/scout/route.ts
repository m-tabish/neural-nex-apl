import { NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "PitchVision AI API is live",
    env_configured: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Config Error", message: "API Key missing" }, { status: 500 });
    }

    // Initialize provider inside handler to ensure fresh env access
    const googleProvider = createGoogleGenerativeAI({ apiKey });

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Parse Error", message: "Invalid JSON" }, { status: 400 });
    }

    const { player_name, location, discipline, hand, biometrics, analysis } = body;

    const systemPrompt = `You are PitchVision AI, a cricket biomechanical analyst. Analyze the data and return JSON.`;
    const userPrompt = `Player: ${player_name}, Discipline: ${discipline}, Metrics: ${JSON.stringify(biometrics)}`;

    try {
      const { text } = await generateText({
        model: googleProvider('gemini-1.5-pro'),
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.1,
      });

      if (!text) throw new Error("Empty AI response");

      return NextResponse.json(JSON.parse(text.trim()));

    } catch (aiError: any) {
      console.error("AI SDK ERROR:", aiError);
      return NextResponse.json({ 
        error: "AI_SDK_FAILURE", 
        message: aiError.message,
        details: aiError.toString(),
        stack: aiError.stack?.split('\n').slice(0, 3) // Send a snippet of the stack
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("GLOBAL API ERROR:", error);
    return NextResponse.json({ 
      error: "GLOBAL_FAILURE", 
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3)
    }, { status: 500 });
  }
}
