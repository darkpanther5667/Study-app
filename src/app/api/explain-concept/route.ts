import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { concept, level = 'intermediate' } = await request.json();

    if (!concept) {
      return NextResponse.json({ error: 'Missing concept' }, { status: 400 });
    }

    // In production, call Claude API to explain concept
    // For demo, return mock explanation
    const mockExplanation = {
      explanation: `${concept} is a fundamental concept that builds upon several core principles. It represents a key understanding that connects multiple ideas together in the subject area.`,
      example: `For example, when applied to practical problems, ${concept} helps break down complex scenarios into manageable parts that can be analyzed systematically.`,
      analogy: `Think of ${concept} like building with blocks - each piece connects to others, and understanding how they fit together helps you build bigger and more complex structures.`,
    };

    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json(mockExplanation);
  } catch (error) {
    console.error('Error in explain-concept:', error);
    return NextResponse.json({ error: 'Failed to get explanation' }, { status: 500 });
  }
}