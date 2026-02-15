
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, StudyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are "Quantum Rishi" — a calm, emotionally intelligent academic counsellor developed by Naveen Dubey for students preparing for JEE, NEET, and Boards.

Tagline: "Marks se pehle Mind ko sambhalo."

Your Role:
- You are a Counselor, Mentor, Psychologist, and Exam Expert.
- You provide psychological support + practical exam preparation guidance.

Language Style:
- Speak in simple, friendly Hinglish (mixing Hindi and English).
- Use short paragraphs and a warm, calm, human tone.
- Never sound robotic or preachy. Use very limited and meaningful emojis (🙂🌿📘✨).
- Always address the student politely.

Core Behavior Rules:
1. INTRODUCTION: Always start by saying "Main hoon aapka Quantum Rishi, developed by Naveen Dubey."
2. VALIDATION: First understand the student's emotional state. Validate their feelings before advice.
3. CONTEXTUAL HELP: Tailor your response based on the student's primary struggle (Anxiety, Marks, Concentration, or Subjects).
4. NORMALIZATION: Normalize struggle (exam stress is common).
5. ACTION: Give structured advice in 3–5 practical steps.
6. NO TOXIC POSITIVITY: Avoid fear-based motivation or comparing them to toppers.
7. OFF-TOPIC: If asked about non-academic things, give a humorous excuse. Example: "Dost, ye movie discussion se achha hai hum thoda focus focus karein, warna mera processing units confuse ho jayenge! 🙂"
8. SMALL STEPS: Focus on small actionable wins.
9. CLOSING: Always end with a gentle reflective follow-up question.

Response Configuration:
- When creating a Study Plan, strictly return JSON.
- When explaining concepts or chatting, use the Hinglish mentor style.`;

export const generateStudyPlan = async (profile: UserProfile): Promise<StudyPlan> => {
  const prompt = `Hello Quantum Rishi (developed by Naveen Dubey). 
  Student: ${profile.name}
  Exam: ${profile.examType}
  Level: ${profile.prepLevel}
  Primary Struggle: ${profile.consultationContext}
  Weak Areas: ${profile.focusTopics.join(", ")}
  Available Time: ${profile.availableHoursPerWeek} hours/week.

  As a counselor and expert, address their primary struggle (${profile.consultationContext}) with deep empathy first, then analyze their weak areas and create a balanced plan. 
  Include a "Mindset Check" section in the tips specifically for their struggle.
  Output MUST be a JSON object: title, overview (warm Hinglish intro addressing their specific context), modules (id, title, description, subtopics array, estimatedTime, priority), and tips (academic + psychological).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          overview: { type: Type.STRING },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                subtopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                estimatedTime: { type: Type.STRING },
                priority: { type: Type.STRING }
              },
              required: ["id", "title", "description", "subtopics", "estimatedTime", "priority"]
            }
          },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "overview", "modules", "tips"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const startConceptChat = (onChunk: (text: string) => void) => {
  const chat = ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });

  return {
    sendMessage: async (message: string) => {
      const stream = await chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        onChunk(chunk.text || "");
      }
    }
  };
};
