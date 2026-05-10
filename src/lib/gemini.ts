const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

async function callGemini(parts: GeminiPart[], systemPrompt?: string): Promise<string> {
  if (!GEMINI_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const body: Record<string, unknown> = {
    contents: [{ parts }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
    },
  };

  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const res = await fetch(`${BASE_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export interface DoubtExplanation {
  question: string;
  steps: string[];
  keyConcept: string;
  tip: string;
}

export async function explainDoubt(imageBase64: string, mimeType: string): Promise<DoubtExplanation> {
  const system = `You are an expert tutor for Indian students (JEE, NEET, Board exams).
When given a question image:
1. State the question clearly
2. Give a step-by-step solution (numbered)
3. Highlight the key concept used
4. Give one tip to remember this concept
Respond ONLY as valid JSON — no markdown backticks.`;

  const raw = await callGemini(
    [
      { inlineData: { mimeType, data: imageBase64 } },
      { text: 'Explain this question step by step.' },
    ],
    system
  );

  try {
    return JSON.parse(raw) as DoubtExplanation;
  } catch {
    return { question: 'Could not parse question', steps: [raw], keyConcept: '', tip: '' };
  }
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export async function generateQuiz(subject: string, topic: string, count = 5): Promise<QuizQuestion[]> {
  const system = `You are a quiz generator for Indian students.
Generate ${count} multiple choice questions on "${topic}" in "${subject}".
Respond ONLY as valid JSON array — no markdown, no backticks.
Format: [{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]`;

  const raw = await callGemini([{ text: `Generate quiz: ${subject} - ${topic}` }], system);
  const clean = raw.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(clean) as QuizQuestion[];
  } catch {
    return [];
  }
}

export interface Flashcard {
  question: string;
  answer: string;
  hint: string;
}

export async function generateFlashcard(topic: string, subject: string): Promise<Flashcard> {
  const system = `You are a flashcard creator for students.
Given a topic, create ONE high-quality flashcard.
Respond ONLY as valid JSON — no markdown, no backticks.
Format: {"question":"...","answer":"...","hint":"..."}`;

  const raw = await callGemini(
    [{ text: `Create a flashcard for: ${topic} (subject: ${subject})` }],
    system
  );
  const clean = raw.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(clean) as Flashcard;
  } catch {
    return { question: topic, answer: '', hint: '' };
  }
}

export async function askTutor(question: string, subject: string, history: Array<{role: string; content: string}> = []) {
  const system = `You are Grasp AI, a friendly and expert tutor for Indian students.
Subject context: ${subject}.
Be concise, use examples, and speak like a helpful senior student — not a textbook.`;

  const parts = [
    ...history.map(h => ({ text: `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.content}` })),
    { text: `Student: ${question}` },
  ];

  return callGemini(parts, system);
}