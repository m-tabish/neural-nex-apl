# GullyScout AI - Grassroots Cricket Scouting for Lucknow

GullyScout AI is a platform designed to help young cricket players in Lucknow's local maidans (like Aliganj and Rajajipuram) get discovered by formal academies and the Uttar Pradesh Cricket Association (UPCA). 

Our system analyzes bowling and batting videos using computer vision, calculates key joint angles, and uses a multi-agent system to give players helpful training tips in their local dialect (Hindi/Awadhi) while drafting professional scouting profiles for selectors.

---

## 🎯 The Core Problem we are Solving
Lucknow has an incredible amount of raw cricket talent, but the path from street cricket to formal selection is broken:
* **No local scouting:** Great players in local neighborhoods go completely unnoticed because scouts can't visit every park.
* **Injury & illegal actions:** Many young fast bowlers develop illegal actions (like "chucking" or bending their elbow too much) without realizing it, which can get them banned later.
* **Communication gap:** Many local coaches and players speak Hindi or Awadhi and don't know how to create professional sports portfolios or reach out to UPCA selectors.

GullyScout AI acts as a digital scout and biomechanics coach that anyone can access using just a smartphone.

---

## ⚙️ How it Works (Under the Hood)
Instead of trying to run a heavy machine learning model to analyze raw pixels (which fails due to different lighting and camera distances), we use a smarter geometry-based approach:

```
[Upload Video] ──> [MediaPipe extracts joints] ──> [Calculate Joint Angles] ──> [AI Agents write reports] ──> [Send Alert]
```

1. **Video Ingestion:** The user uploads a 5-second video of a bowler or batsman.
2. **Pose Tracking:** Using Google's MediaPipe, we map 33 key coordinates of the player's body in the browser.
3. **Trigonometric Math:** The system pauses at the exact release or impact frame and calculates critical angles (like the bowling arm elbow or the front knee bend).
4. **Agent Analysis:** A team of specialized AI prompts reads this coordinate data to generate coaching advice and formal selectors' dossiers.

---

## 🤖 The Multi-Agent Workflow
We split our backend logic into five simple, specialized agents to handle the workflow:

1. **Telemetry Agent:** Extracts the raw $X, Y, Z$ positions of the player's joints from the video.
2. **Evaluation Agent:** Checks the joint angles against textbook professional benchmarks (e.g., Pat Cummins' braced front leg or Virat Kohli's high elbow). It also flags chucking risks.
3. **Vernacular Liaison Agent:** Translates the dry biomechanical data into friendly, practical coaching tips written in conversational **Hindi and Awadhi** for the player.
4. **Scouter Agent:** If the player's score is exceptionally high (e.g., over 85%), it automatically puts together a professional "talent scout card".
5. **Dispatch Agent:** Handles sending the final outputs through automated email drafts and WhatsApp pings.

---

## 📐 The Scoring Math (Simple Geometry)
To make sure our scores are accurate regardless of the camera's distance or the player's height, we look at pure angles instead of pixel distances. 

To find the angle ($\theta$) at any joint (like the elbow $B$ between shoulder $A$ and wrist $C$):

1. **Create two vectors from the coordinates:**
   $$\vec{u} = A - B$$
   $$\vec{v} = C - B$$

2. **Calculate the angle using the dot product formula:**
   $$\theta = \arccos\left( \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|} \right) \times \frac{180}{\pi}$$

3. **Compare to Baselines:**
   * **Fast Bowling Arm Flex:** Must be as close to $180^\circ$ as possible. If the angle bends below $165^\circ$ (more than $15^\circ$ flex), the system flags a "chucking warning".
   * **Front-Foot Cover Drive:** Checks if the front knee bends between $120^\circ$ and $135^\circ$ for perfect weight transfer.

---

## 📊 System Data Example (JSON Format)
This is the structured JSON output passed from our math engine to the AI agents:

```json
{
  "player_metadata": {
    "name": "Aditya Verma",
    "location": "Aliganj Maidan, Lucknow",
    "discipline": "Right-Arm Fast"
  },
  "biometric_telemetry": {
    "release_point": {
      "bowling_arm_elbow_angle": 174.2,
      "front_knee_bracing_angle": 161.5
    }
  },
  "comparative_analysis": {
    "chucking_risk": "Low (5.8 degree bend)",
    "stance_match_percentage": 87.5
  },
  "scouting_threshold_met": true
}
```

---

## 🛠️ Tech Stack
* **Frontend:** Next.js (App Router), Tailwind CSS, Lucide Icons (clean and responsive layout).
* **Backend:** FastAPI (Python 3.11), Uvicorn.
* **Computer Vision:** Google MediaPipe Pose (lightweight and runs fast).
* **AI Orchestration:** Standard Anthropic / OpenAI API calls with simple system prompts.

---

## 🚀 Setup & Run Instructions

### 1. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🏆 Current Progress
- [x] Initial setup and project directory scaffolding.
- [x] Created system architecture and math pipeline logic.
- [ ] Implement client-side MediaPipe pose rendering on canvas.
- [ ] Connect FastAPI math calculations to the AI agent prompts.
- [ ] Build the dashboard logs interface and test the end-to-end flow.
