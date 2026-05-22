import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "PitchVision AI API is live",
    env_configured: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      player_name, 
      location, 
      discipline, 
      hand, 
      biometrics, 
      analysis 
    } = body;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      console.error("CRITICAL: GOOGLE_GENERATIVE_AI_API_KEY is missing.");
      return NextResponse.json({ 
        error: "Configuration Error", 
        message: "Gemini API key is missing. Please set GOOGLE_GENERATIVE_AI_API_KEY." 
      }, { status: 500 });
    }

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

    try {
      const { text } = await generateText({
        model: google('gemini-1.5-pro'),
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.2,
      });

      const parsedData = JSON.parse(text.trim());
      return NextResponse.json(parsedData);
    } catch (aiError: any) {
      console.error("Gemini AI Generation Error:", aiError);
      return NextResponse.json({ 
        error: "AI Generation Failed", 
        message: aiError.message,
        details: aiError.stack
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Request Processing Error:", error);
    return NextResponse.json({ 
      error: "Analysis Failed", 
      message: error.message || "An unexpected error occurred during request processing." 
    }, { status: 500 });
  }
}
