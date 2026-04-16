import { Message, Model, FileAttachment } from '@/types';

interface StreamChatOptions {
  messages: { role: string; content: string; files?: FileAttachment[] }[];
  model: Model;
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
  signal?: AbortSignal;
}

export async function streamChat({
  messages,
  model,
  onChunk,
  onDone,
  onError,
  signal,
}: StreamChatOptions) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model }),
      signal,
    });

    if (!response.ok) {
      if (response.status === 429) {
        onError('Rate limited. Please wait a moment and try again.');
        return;
      }
      const errorText = await response.text();
      onError(errorText || `Error: ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('Failed to read response stream.');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            onChunk(parsed.text);
          }
          if (parsed.error) {
            onError(parsed.error);
            return;
          }
        } catch {
          // Ignore parse errors for partial chunks
        }
      }
    }

    onDone();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      onDone();
      return;
    }
    onError('Connection lost. Check your internet and try again.');
  }
}
