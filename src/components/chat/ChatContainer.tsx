'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import { WelcomeScreen } from './WelcomeScreen';
import { ChatInput } from './ChatInput';

export function ChatContainer() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const conversations = useChatStore((s) => s.conversations);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const createConversation = useChatStore((s) => s.createConversation);
  const addMessage = useChatStore((s) => s.addMessage);
  const setIsStreaming = useChatStore((s) => s.setIsStreaming);
  const setStreamingContent = useChatStore((s) => s.setStreamingContent);
  const selectedModel = useUIStore((s) => s.selectedModel);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const messages = activeConversation?.messages || [];

  // Auto-scroll on new content
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent, autoScroll]);

  // Detect if user scrolled up
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isAtBottom);
  };

  const handleSuggestionClick = async (text: string) => {
    let convId = activeConversationId;
    if (!convId) {
      convId = await createConversation(selectedModel);
    }

    const { v4: uuidv4 } = await import('uuid');
    const { streamChat } = await import('@/lib/api');

    const userMessage = {
      id: uuidv4(),
      role: 'user' as const,
      content: text,
      timestamp: Date.now(),
    };
    addMessage(convId, userMessage);

    const assistantMessage = {
      id: uuidv4(),
      role: 'assistant' as const,
      content: '',
      timestamp: Date.now(),
    };
    addMessage(convId, assistantMessage);

    setIsStreaming(true);
    setStreamingContent('');

    let accumulated = '';

    await streamChat({
      messages: [{ role: 'user', content: text }],
      model: selectedModel,
      onChunk: (chunk) => {
        accumulated += chunk;
        setStreamingContent(accumulated);
      },
      onDone: () => {
        useChatStore.getState().updateLastAssistantMessage(convId!, accumulated);
        setIsStreaming(false);
        setStreamingContent('');
      },
      onError: (error) => {
        useChatStore
          .getState()
          .updateLastAssistantMessage(convId!, `Something went wrong: ${error}`);
        setIsStreaming(false);
        setStreamingContent('');
      },
    });
  };

  const handleRetry = async () => {
    if (!activeConversation || messages.length < 2) return;

    // Find last user message
    const lastUserMsgIndex = messages.length - 2;
    const lastUserMsg = messages[lastUserMsgIndex];
    if (lastUserMsg.role !== 'user') return;

    // Replace last assistant message
    useChatStore
      .getState()
      .updateLastAssistantMessage(activeConversation.id, '');

    setIsStreaming(true);
    setStreamingContent('');

    const apiMessages = messages.slice(0, lastUserMsgIndex + 1).map((m) => ({
      role: m.role,
      content: m.content,
      files: m.files,
    }));

    let accumulated = '';

    const { streamChat } = await import('@/lib/api');

    await streamChat({
      messages: apiMessages,
      model: selectedModel,
      onChunk: (chunk) => {
        accumulated += chunk;
        setStreamingContent(accumulated);
      },
      onDone: () => {
        useChatStore
          .getState()
          .updateLastAssistantMessage(activeConversation.id, accumulated);
        setIsStreaming(false);
        setStreamingContent('');
      },
      onError: (error) => {
        useChatStore
          .getState()
          .updateLastAssistantMessage(
            activeConversation.id,
            `Something went wrong: ${error}`
          );
        setIsStreaming(false);
        setStreamingContent('');
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              if (message.role === 'user') {
                return <UserMessage key={message.id} message={message} />;
              }
              return (
                <AssistantMessage
                  key={message.id}
                  message={message}
                  isStreaming={isStreaming}
                  streamingContent={streamingContent}
                  isLast={isLast}
                  onRetry={isLast ? handleRetry : undefined}
                />
              );
            })}
          </div>
        )}
      </div>

      <ChatInput />
    </div>
  );
}
