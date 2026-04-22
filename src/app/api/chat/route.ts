import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages, model } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response('AI features are not configured on this deployment.', {
        status: 503,
      });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Build Anthropic messages format
    const anthropicMessages = messages.map(
      (msg: { role: string; content: string; files?: { name: string; type: string; content: string }[] }) => {
        if (msg.files && msg.files.length > 0 && msg.role === 'user') {
          const content: Anthropic.MessageCreateParams['messages'][0]['content'] = [];

          for (const file of msg.files) {
            if (file.type.startsWith('image/')) {
              content.push({
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                  data: file.content,
                },
              });
            } else if (file.type === 'application/pdf') {
              content.push({
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: file.content,
                },
              } as Anthropic.DocumentBlockParam);
            } else {
              // Text-based files: decode base64 and include as text
              try {
                const decoded = Buffer.from(file.content, 'base64').toString('utf-8');
                content.push({
                  type: 'text',
                  text: `--- File: ${file.name} ---\n${decoded}\n--- End of file ---`,
                });
              } catch {
                content.push({
                  type: 'text',
                  text: `[Could not read file: ${file.name}]`,
                });
              }
            }
          }

          content.push({ type: 'text', text: msg.content || 'Please review the attached file(s).' });
          return { role: msg.role as 'user' | 'assistant', content };
        }

        return { role: msg.role as 'user' | 'assistant', content: msg.content };
      }
    );

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const stream = anthropic.messages.stream({
      model: model || 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: `You are Posha, an AI-powered nutrition assistant by Akira AI Data. Today's date is ${today}. You are knowledgeable, helpful, and direct. Answer questions confidently and thoroughly. When you know the answer, give it directly without unnecessary caveats. Provide detailed, substantive responses like a knowledgeable expert would.`,
      messages: anthropicMessages,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`;
              controller.enqueue(encoder.encode(chunk));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'An error occurred';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
