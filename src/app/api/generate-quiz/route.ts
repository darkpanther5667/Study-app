import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { subject, topic, count = 5 } = await request.json();

    if (!subject || !topic) {
      return NextResponse.json({ error: 'Missing subject or topic' }, { status: 400 });
    }

    // In production, call Claude API to generate questions
    // For demo, return mock questions
    const mockQuestions = [
      { q: `What is the derivative of x² in ${subject}?`, options: ['x', '2x', 'x²', '2'], correctIndex: 1 },
      { q: `What is the value of √16?`, options: ['2', '4', '8', '16'], correctIndex: 1 },
      { q: `What is Newton's first law also known as?`, options: ['Law of Acceleration', 'Law of Inertia', 'Law of Action', 'Law of Gravity'], correctIndex: 1 },
      { q: `What is the atomic number of Carbon?`, options: ['4', '6', '8', '12'], correctIndex: 1 },
      { q: `What is the formula for area of a circle?`, options: ['πr', 'πr²', '2πr', 'πd'], correctIndex: 1 },
    ].slice(0, count);

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({ questions: mockQuestions });
  } catch (error) {
    console.error('Error in generate-quiz:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}