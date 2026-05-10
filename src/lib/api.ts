import type { DoubtExplanation, QuizQuestion, ConceptExplanation } from '@/types/grasp';

export async function explainDoubt(
  imageBase64: string,
  mimeType: string
): Promise<DoubtExplanation> {
  const response = await fetch('/api/explain-doubt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  });

  if (!response.ok) {
    throw new Error('Failed to get explanation');
  }

  return response.json();
}

export async function generateQuiz(
  subject: string,
  topic: string,
  count: number = 5
): Promise<{ questions: QuizQuestion[] }> {
  const response = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, topic, count }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate quiz');
  }

  return response.json();
}

export async function explainConcept(
  concept: string,
  level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): Promise<ConceptExplanation> {
  const response = await fetch('/api/explain-concept', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concept, level }),
  });

  if (!response.ok) {
    throw new Error('Failed to get concept explanation');
  }

  return response.json();
}