import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType } = await request.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    // In production, call Claude API here
    // For demo, return mock response
    const mockResponse = {
      question: 'Calculate the derivative of f(x) = x² + 2x + 1',
      steps: [
        'Apply the power rule: d/dx(x^n) = nx^(n-1)',
        'For x²: derivative is 2x',
        'For 2x: derivative is 2',
        'For constant 1: derivative is 0',
        'Combine: f\'(x) = 2x + 2',
      ],
      keyConcept: 'Power Rule of Differentiation',
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error in explain-doubt:', error);
    return NextResponse.json({ error: 'Failed to get explanation' }, { status: 500 });
  }
}