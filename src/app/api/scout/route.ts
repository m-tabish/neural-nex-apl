import { NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

// Explicitly initialize the Google provider
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

export async function GET() {
  try {
    const hasKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    return NextResponse.json({ 
      status: "ok", 
      message: "PitchVision AI API is live",
      env_configured: hasKey,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: "GET Handler Failed", message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  console.log("POST /api/scout: Request received");
  
  try {
    // 1. Parse Body
    let body;
    try {
      body = await req.json();
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json({ error: "Invalid JSON body", message: parseError.message }, { status: 400 });
    }

    const { 
      player_name, 
      location, 
      discipline, 
      hand, 
      biometrics, 
      analysis 
    } = body;

    // 2. Validate API Key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey.length < 5) {
      console.error("CRITICAL: GOOGLE_GENERATIVE_AI_API_KEY is missing or too short.");
      return NextResponse.json({ 
        error: "Configuration Error", 
        message: "Gemini API key is missing or invalid in production environment." 
      }, { status: 500 });
    }

    // 3. Prepare AI Prompts
    const systemPrompt = `You are PitchVision AI, an elite Biomechanical Analyst for Grassroots Cricket.
Your task is to analyze mechanical joint angles (elbow extension, knee bracing, head stability) against professional benchmarks.
Identify structural strengths and weaknesses, and flag any illegal bowling actions (flexion > 15 degrees).

Your output must be structured as valid JSON matching the following schema:
{
  "evaluation": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "mechanical_grade": "A|B|C|D",
    "technical_summary": "string"
  }
}`;

    const userPrompt = `
Analyze the following player statistics and biomechanical joint angles:
- Player Name: ${player_name}
- Location: ${location}
- Discipline: ${discipline} (${hand}-handed)
- Telemetry Joint Metrics: ${JSON.stringify(biometrics)}
- Bio-Engine Scoring: ${JSON.stringify(analysis)}

Generate the structured JSON response. Return only raw, valid JSON.`;

    // 4. Execute AI Generation
    try {
      const { text } = await generateText({
        model: google('gemini-1.5-pro'),
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.2,
      });

      if (!text) {
        throw new Error("AI returned empty response");
      }

      // 5. Parse and Return Result
      const parsedData = JSON.parse(text.trim());
      return NextResponse.json(parsedData);

    } catch (aiError: any) {
      console.error("Gemini AI Generation Error:", aiError);
      return NextResponse.json({ 
        error: "AI Generation Failed", 
        message: aiError.message,
        type: aiError.constructor.name,
        stack: process.env.NODE_ENV === 'development' ? aiError.stack : undefined
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Critical API Route Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      message: error.message || "An unexpected error occurred." 
    }, { status: 500 });
  }
}
