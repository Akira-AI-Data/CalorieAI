import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  fetchConversations,
  createConversation,
} from '@/lib/supabase-conversations';
import { Model } from '@/types';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conversations = await fetchConversations(session.user.id);
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { model } = await req.json();
    const conversation = await createConversation(
      session.user.id,
      (model as Model) || 'claude-sonnet-4-20250514'
    );
    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Failed to create conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
