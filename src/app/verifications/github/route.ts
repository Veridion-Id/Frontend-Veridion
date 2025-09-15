import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('GitHub endpoint called');
    
    const { code } = await request.json();
    console.log('Received code:', code ? 'Present' : 'Missing');

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // For now, just return success to test the flow
    return NextResponse.json({
      success: true,
      user: { id: 'test', login: 'testuser' },
    });
  } catch (error) {
    console.error('GitHub authentication error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with GitHub' },
      { status: 500 }
    );
  }
}
