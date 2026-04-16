'use client';

import { useState, useRef, useCallback } from 'react';
import { Send, Square, Paperclip } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import { FileAttachment, Message } from '@/types';
import { streamChat } from '@/lib/api';
import { FilePreview } from './FilePreview';

export function ChatInput() {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const {
    activeConversationId,
    conversations,
    isStreaming,
    addMessage,
    setIsStreaming,
    setStreamingContent,
    streamingContent,
    createConversation,
  } = useChatStore();

  const selectedModel = useUIStore((s) => s.selectedModel);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds 10MB limit`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setFiles((prev) => [
          ...prev,
          {
            id: uuidv4(),
            name: file.name,
            type: file.type,
            size: file.size,
            content: base64,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, open: openFilePicker } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/*': [],
      'text/*': ['.txt', '.md', '.py', '.js', '.ts', '.json', '.csv'],
      'application/pdf': ['.pdf'],
    },
  });

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed && files.length === 0) return;
    if (isStreaming) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = await createConversation(selectedModel);
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
      files: files.length > 0 ? [...files] : undefined,
    };

    addMessage(convId, userMessage);
    setInput('');
    setFiles([]);
    setIsStreaming(true);
    setStreamingContent('');

    // Create placeholder assistant message
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    addMessage(convId, assistantMessage);

    const conv = useChatStore.getState().conversations.find((c) => c.id === convId);
    const apiMessages = conv
      ? conv.messages.slice(0, -1).map((m) => ({
          role: m.role,
          content: m.content,
          files: m.files,
        }))
      : [{ role: 'user' as const, content: trimmed, files: files.length > 0 ? files : undefined }];

    const controller = new AbortController();
    abortRef.current = controller;

    let accumulated = '';

    await streamChat({
      messages: apiMessages,
      model: selectedModel,
      signal: controller.signal,
      onChunk: (text) => {
        accumulated += text;
        setStreamingContent(accumulated);
      },
      onDone: () => {
        const finalContent = accumulated || streamingContent;
        const store = useChatStore.getState();
        const currentConv = store.conversations.find((c) => c.id === convId);
        if (currentConv) {
          const lastMsg = currentConv.messages[currentConv.messages.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            useChatStore.getState().updateLastAssistantMessage(convId!, finalContent);
          }
        }
        setIsStreaming(false);
        setStreamingContent('');
        abortRef.current = null;
      },
      onError: (error) => {
        useChatStore
          .getState()
          .updateLastAssistantMessage(
            convId!,
            `Something went wrong: ${error}`
          );
        setIsStreaming(false);
        setStreamingContent('');
        abortRef.current = null;
      },
    });
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="p-4 flex-shrink-0" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="max-w-3xl mx-auto">
        <div className="bg-input-bg border border-input-border rounded-2xl overflow-hidden focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all">
          <FilePreview files={files} onRemove={removeFile} />
          <div className="flex items-end gap-2 p-3">
            <button
              onClick={openFilePicker}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors flex-shrink-0 mb-0.5"
              aria-label="Attach file"
              disabled={isStreaming}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <TextareaAutosize
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message NourishSnap..."
              className="flex-1 bg-transparent text-foreground text-[15px] resize-none outline-none placeholder:text-muted-foreground min-h-[24px] max-h-[200px] py-1.5"
              minRows={1}
              maxRows={6}
              disabled={isStreaming}
            />

            {isStreaming ? (
              <button
                onClick={handleStop}
                className="p-2 rounded-lg bg-foreground text-background hover:opacity-80 transition-opacity flex-shrink-0 mb-0.5"
                aria-label="Stop generating"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim() && files.length === 0}
                className="p-2 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-30 disabled:hover:bg-accent transition-colors flex-shrink-0 mb-0.5"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          NourishSnap can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}
