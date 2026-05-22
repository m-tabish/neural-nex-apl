Here is the complete, unified documentation containing both your final README and the exact PRD for your AI coding tool. You can copy this entire block into your repository.

```markdown
# PitchVision AI (Team Neural Nexus) 🏏
### APL Qualifiers - PS-23: Grassroots Cricket Talent Scouting

PitchVision AI is a platform designed to help young cricket players in Lucknow's local maidans (like Aliganj and Rajajipuram) get discovered by formal academies and the Uttar Pradesh Cricket Association (UPCA). 

Our system analyzes bowling and batting videos using client-side computer vision, calculates key biomechanical joint angles, and uses an agentic workflow to give players helpful training tips in their local dialect (Hindi/Awadhi) while autonomously drafting professional scouting profiles for selectors.

---

## 🎯 The Core Problem we are Solving
Lucknow has an incredible amount of raw cricket talent, but the path from street cricket to formal selection is broken:
* **No local scouting:** Great players in local neighborhoods go completely unnoticed because scouts can't visit every park.
* **Injury & illegal actions:** Many young fast bowlers develop illegal actions (like "chucking" or excessive elbow flexion) without realizing it, which can get them banned later.
* **Communication gap:** Many local coaches and players speak Hindi or Awadhi and don't know how to create professional sports portfolios or reach out to UPCA selectors.

PitchVision AI acts as a digital scout and biomechanics coach that anyone can access using just a smartphone camera.

---

## ⚙️ How it Works (Under the Hood)
Instead of trying to run a heavy, supervised machine learning model to analyze raw pixels (which fails due to different lighting and camera distances), we use a smarter geometry-based approach running entirely in the browser:

```text
[Upload Video] ──> [MediaPipe extracts joints] ──> [Browser Calculates Angles] ──> [AI Agent writes reports] 

```

1. **Video Ingestion:** The user uploads a short video of a bowler or batsman.
2. **Pose Tracking:** Using Google's MediaPipe, we map 33 key coordinates of the player's body directly on an HTML5 Canvas in real-time.
3. **Trigonometric Math:** The client-side JavaScript pauses at the exact release or impact frame and instantly calculates critical angles (like the bowling arm elbow or the front knee bend) right in the browser, meaning zero server lag.
4. **Agent Analysis:** A Next.js API Route takes this coordinate data and passes it to our specialized AI prompts to generate coaching advice and formal selectors' dossiers.

---

## 🤖 The Multi-Agent Workflow

We orchestrate our AI logic to handle the workflow across distinct conceptual agents:

1. **Evaluation Agent:** Checks the joint angles against textbook professional benchmarks (e.g., Pat Cummins' braced front leg or Virat Kohli's high elbow). It also flags chucking risks.
2. **Vernacular Liaison Agent:** Translates the dry biomechanical data into friendly, practical coaching tips written in conversational **Hindi and Awadhi** for the player.
3. **Scouter Agent:** If the player's biomechanical score meets the threshold, it automatically puts together a professional "talent scout card".

---

## 📐 The Scoring Math (Simple Geometry)

To make sure our scores are accurate regardless of the camera's distance or the player's height, we look at pure angles instead of pixel distances.

To find the angle ($\theta$) at any joint (like the elbow $B$ between shoulder $A$ and wrist $C$):

1. **Create two vectors from the coordinates:**
$\vec{u}=A-B$
$\vec{v}=C-B$
2. **Calculate the angle using the dot product formula:**

$$\theta=\arccos\left(\frac{\vec{u}\cdot\vec{v}}{\|\vec{u}\|\|\vec{v}\|}\right)\times\frac{180}{\pi}$$


3. **Compare to Baselines:**
* **Fast Bowling Arm Flex:** Must be as close to 180° as possible. If the angle bends below 165°, the system flags a "chucking warning".
* **Front-Foot Cover Drive:** Checks if the front knee bends between 120° and 135° for perfect weight transfer.



---

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router) - Handles both the UI and the serverless backend API routes in one single repository.
* **Styling:** Tailwind CSS + `shadcn/ui` + Lucide Icons (clean, premium sports analytics layout).
* **Computer Vision:** Google MediaPipe Pose (`@mediapipe/tasks-vision`) - Runs entirely client-side for zero-latency tracking.
* **AI Orchestration:** Vercel AI SDK + Google Gemini 1.5 Pro.

---

## 🚀 Setup & Run Instructions

This project is a unified Next.js application.

```bash
# Install dependencies
npm install

# Add your Gemini API key to .env
# GOOGLE_GENERATIVE_AI_API_KEY=your_key

# Run the development server
npm run dev
```

---

## 🏆 Current Progress

* [x] Initial setup and Next.js project directory scaffolding.
* [x] Created system architecture, state management, and math pipeline logic.
* [x] Implement client-side MediaPipe pose rendering on the HTML5 canvas.
* [x] Connect the browser-calculated math state to the Next.js API routes (`/api/scout`).
* [x] Integrated Google Gemini for biomechanical technical evaluation.
* [x] Build the dashboard logs interface and test the end-to-end flow.

---

---

# Product Requirements Document (PRD) for AI Generation

## 1. Product Overview

**Name:** PitchVision AI
**Objective:** Build a web-based, multi-agent scouting dashboard that analyzes gully cricket video footage, extracts biomechanical joint angles using client-side pose estimation, and autonomously generates professional scouting reports and vernacular outreach messages.

## 2. Tech Stack Requirements

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript / JavaScript
* **Styling:** Tailwind CSS + `shadcn/ui` (Dark Mode theme)
* **Vision Engine:** `@mediapipe/tasks-vision` (Client-side HTML5 `<canvas>` and `<video>`)
* **AI Orchestration:** Vercel AI SDK + LLM via API
* **Icons:** Lucide React

## 3. Core Features

### Feature 1: The Vision Dashboard (UI)

* A 2-column dashboard layout.
* **Left Column (Input):** Video upload dropzone accepting `.mp4` files.
* **Right Column (Output):** Terminal-style "Agent Execution Ledger" and result cards.
* **Controls:** A master "Freeze & Analyze Frame" button located below the video player.

### Feature 2: Client-Side Pose Estimation (MediaPipe)

* When a video is uploaded and plays, an HTML5 `<canvas>` must sit perfectly overlaid on the `<video>` element using absolute positioning.
* A `requestAnimationFrame` loop passes the current video frame to MediaPipe `PoseLandmarker`.
* Draw the 33 pose landmarks (skeleton) on the canvas in real-time (neon green stroke).

### Feature 3: Biomechanical Scoring Engine (The Math)

* When the user clicks "Freeze & Analyze Frame", pause the video.
* Extract the X/Y coordinates for: Right Shoulder (12), Right Elbow (14), and Right Wrist (16).
* Calculate the exact angle of the elbow joint using trigonometry (`Math.atan2`).
* Store this calculated angle in a JSON state object.

### Feature 4: Multi-Agent Orchestration (API Route)

* Send the JSON state (e.g., `{ "elbow_angle": 158, "action": "fast_bowling" }`) to a Next.js API route (`/api/scout`).
* The Vercel AI SDK prompts the LLM to act as an orchestration engine of 5 sub-agents.
* The LLM returns a structured JSON response containing:
1. A professional English scouting report detailing mechanical flaws/strengths.
2. A localized WhatsApp message in Hindi/Awadhi aimed at the local coach.


* Stream the simulated agent "thought process" steps sequentially into the Terminal UI on the frontend to create the illusion of multiple agents executing one by one.

## 4. Hardcoded Data State (Mock Pro Baselines)

To bypass the need for a database, use a static reference file for comparisons:

```json
{
  "pro_baselines": {
    "fast_bowling_release": {
      "ideal_elbow_angle_min": 175,
      "ideal_elbow_angle_max": 180,
      "penalty_threshold": 160
    }
  }
}

```

## 5. Execution Phases for AI Generation

* **Phase 1:** Scaffold the Next.js UI, Tailwind, and dummy UI components (Cards, Terminal log).
* **Phase 2:** Implement the MediaPipe Pose Landmarker over the video player and calculate the elbow angle on button click.
* **Phase 3:** Create the `/api/scout` route and wire up the Vercel AI SDK to generate the final text based on the calculated angle.

```

```