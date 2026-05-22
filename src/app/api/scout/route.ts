import { NextResponse } from 'next/server';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export const maxDuration = 30; // Extend serverless timeout for long generations if needed

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

    // Check if API key is present, fallback to simulated response to guarantee hackathon availability
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return a rich, high-fidelity mock response to prevent breaking when key is absent
      return NextResponse.json(generateMockResponse(player_name, location, discipline, hand, biometrics, analysis));
    }

    const systemPrompt = `You are PitchVision AI, an elite Grassroots Cricket Talent Scout. You orchestrate three virtual agents:
1. **Evaluation Agent**: Analyzes mechanical joint angles (elbow extension, knee bracing, head stability) against textbook professional benchmarks. Identifies structural strengths and chucking actions (flexion > 15 degrees).
2. **Vernacular Liaison Agent**: Translates technical sports science metrics into direct, friendly, and practical training feedback in a warm conversational blend of Hindi and local Awadhi dialect for grassroots cricketers.
3. **Scouter Agent**: Compiles an official UPCA Scouting Dossier outlining the player's potential, speed/control projection, and target academy recommendations.

Your output must be structured as valid JSON matching the following schema:
{
  "evaluation": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "mechanical_grade": "A|B|C|D"
  },
  "vernacular_feedback": {
    "coaching_tips_awadhi": "string (practical tips written in Awadhi/Hindi dialect)",
    "encouragement_message": "string"
  },
  "scouting_card": {
    "overall_potential": "string (e.g. 4.5/5)",
    "scouting_summary": "string (elite scout's pitch for selectors)",
    "suggested_academies": ["string"]
  }
}`;

    const userPrompt = `
Analyze the following player statistics and biomechanical joint angles:
- Player Name: ${player_name}
- Location: ${location}
- Discipline: ${discipline} (${hand}-handed)
- Telemetry Joint Metrics: ${JSON.stringify(biometrics)}
- Bio-Engine Scoring: ${JSON.stringify(analysis)}

Generate the structured JSON response based on the system instructions. Do not output any markdown formatting, preambles, or postscripts—only return raw, valid JSON.`;

    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.2,
    });

    const parsedData = JSON.parse(text.trim());
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Error in AI Scouting Agent route:", error);
    return NextResponse.json({ error: "Failed to generate report", message: error.message }, { status: 500 });
  }
}

function generateMockResponse(name: string, loc: string, discipline: string, hand: string, biometrics: any, analysis: any) {
  const matchPct = analysis.match_percentage;

  if (discipline === "Fast Bowling") {
    const isIllegal = biometrics.bowling_arm_elbow_angle < 165.0;
    const kneeSoft = biometrics.front_knee_bracing_angle < 150.0;

    return {
      "evaluation": {
        "strengths": [
          "Excellent bowling shoulder rotation and momentum alignment.",
          "Solid torso lateral tilt ($" + biometrics.torso_lateral_flexion_angle + "^\\circ$), creating dynamic release leverage."
        ],
        "weaknesses": isIllegal 
          ? ["Illegal bowling arm flexion ($" + (180.0 - biometrics.bowling_arm_elbow_angle).toFixed(1) + "^\\circ$). Exceeds the ICC 15-degree threshold."]
          : [
              "Needs to lock front braced leg to maximize ground reaction forces.",
              kneeSoft ? "Soft front knee bend is absorbing speed instead of transferring it." : "Minor stride adjustments needed."
            ],
        "mechanical_grade": isIllegal ? "D" : (matchPct > 85 ? "A" : "B")
      },
      "vernacular_feedback": {
        "coaching_tips_awadhi": isIllegal
          ? "भैया, कोहनी बहुत ज्यादा मुड़ रही है ($" + (180.0 - biometrics.bowling_arm_elbow_angle).toFixed(1) + "^\\circ$). गेंद फेंकते वक्त हाथ एकदम सीधा रखो। रोज 15 मिनट दीवार के सहारे 'सीधे-हाथ' से गेंदबाजी की प्रैक्टिस करो ताकि एक्शन सुधर सके।"
          : "बच्चा, हाथ का रिलीज बहुत बढ़िया है, लेकिन जब पैर जमीन पर पड़े तो आगे वाला घुटना थोड़ा और सीधा (braced) रखो। घुटना मुड़ेगा तो गेंदबाजी की रफ्तार कम हो जाएगी। ग्राउंड पर सीढ़ियों वाली ड्रिल करो ताकि पैर मजबूत होय।",
        "encouragement_message": "हिम्मत ना हारो, थोड़ी सी सुधार के बाद तुम मैदान में तहलका मचा दोगे!"
      },
      "scouting_card": {
        "overall_potential": isIllegal ? "2.5/5" : (matchPct > 85 ? "4.8/5" : "4.0/5"),
        "scouting_summary": isIllegal
          ? "Showcases strong shoulder strength but action is currently illegal (elbow bend exceeds limits). Requires immediate mechanical remodel before academy recommendation."
          : `Highly promising ${hand}-arm fast bowler from ${loc}. Stride force generation is efficient, pacing potential is high. High priority watch for UPCA junior trials.`,
        "suggested_academies": ["UPCA Aliganj Training Hub", "Ekana Sports City Junior Academy"]
      }
    };
  } else {
    const lowElbow = biometrics.leading_elbow_angle > 110.0;
    const stiffKnee = biometrics.front_knee_flex_angle > 145.0;

    return {
      "evaluation": {
        "strengths": [
          "Perfect head alignment and eyes locked on the line of impact.",
          "High control stance rating with stable base."
        ],
        "weaknesses": [
          lowElbow ? "Leading elbow dropped too early, reducing shot elevation control." : "Keep the leading elbow high towards the target.",
          stiffKnee ? "Stiff front leg at impact limits forward weight transfer." : "Extend front knee slightly further."
        ],
        "mechanical_grade": matchPct > 85 ? "A" : "B"
      },
      "vernacular_feedback": {
        "coaching_tips_awadhi": "बेटा, जब ड्राइव मारो तो आगे वाला कोहनी (elbow) एकदम आसमान की तरफ ऊँचा रखो, जैसे विराट कोहली रखते हैं। घुटना थोड़ा और झुकाओ ताकि पूरा वजन बल्ले पर आए और गेंद जमीन से चिपक के सीधे बाउंड्री पार जाए। रोज शीशे के सामने शैडो प्रैक्टिस करो।",
        "encouragement_message": "बल्ले का मिडल बहुत शानदार है। कोहनी ऊँची रखोगे तो ड्राइव देखने लायक होगी!"
      },
      "scouting_card": {
        "overall_potential": matchPct > 85 ? "4.7/5" : "4.1/5",
        "scouting_summary": `Technically robust batsman showing top-tier balance during the cover drive. Excellent timing at impact. Strong contender for junior district selections in Lucknow.`,
        "suggested_academies": ["Hazratganj Cricket Academy", "Lohia Park Elite Coaching Center"]
      }
    };
  }
}
