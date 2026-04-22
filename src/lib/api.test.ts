import { afterEach, describe, expect, it, vi } from 'vitest';
import { streamChat } from './api';

function createStream(chunks: string[]) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

describe('streamChat', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('emits streamed text chunks and finishes when the server sends DONE', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          createStream([
            'data: {"text":"Hel',
            'lo"}\n\n',
            'data: {"text":" world"}\n\n',
            'data: [DONE]\n\n',
          ]),
          { status: 200 }
        )
      )
    );

    const onChunk = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    await streamChat({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'claude-sonnet-4-20250514',
      onChunk,
      onDone,
      onError,
    });

    expect(onChunk.mock.calls).toEqual([['Hello'], [' world']]);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });

  it('surfaces a friendly rate-limit message for 429 responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Too many requests', { status: 429 })));

    const onDone = vi.fn();
    const onError = vi.fn();

    await streamChat({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'claude-sonnet-4-20250514',
      onChunk: vi.fn(),
      onDone,
      onError,
    });

    expect(onError).toHaveBeenCalledWith('Rate limited. Please wait a moment and try again.');
    expect(onDone).not.toHaveBeenCalled();
  });

  it('returns the server error text for non-OK responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Server exploded', { status: 500 })));

    const onError = vi.fn();

    await streamChat({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'claude-sonnet-4-20250514',
      onChunk: vi.fn(),
      onDone: vi.fn(),
      onError,
    });

    expect(onError).toHaveBeenCalledWith('Server exploded');
  });

  it('treats aborts as a clean completion', async () => {
    const abortError = Object.assign(new Error('Request aborted'), { name: 'AbortError' });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

    const onDone = vi.fn();
    const onError = vi.fn();

    await streamChat({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'claude-sonnet-4-20250514',
      onChunk: vi.fn(),
      onDone,
      onError,
    });

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });
});
