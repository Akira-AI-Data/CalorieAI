import { create } from 'zustand';
import { Conversation, Message, Model } from '@/types';

// Debounced save to API
const pendingSaves = new Map<string, ReturnType<typeof setTimeout>>();

function debouncedSave(conversationId: string, getState: () => ChatStore) {
  const existing = pendingSaves.get(conversationId);
  if (existing) clearTimeout(existing);

  pendingSaves.set(
    conversationId,
    setTimeout(async () => {
      const conv = getState().conversations.find((c) => c.id === conversationId);
      if (!conv) return;
      try {
        await fetch(`/api/conversations/${conversationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: conv.title,
            messages: conv.messages,
          }),
        });
      } catch {
        // Silent fail - optimistic UI
      }
      pendingSaves.delete(conversationId);
    }, 2000)
  );
}

function flushSave(conversationId: string, getState: () => ChatStore) {
  const existing = pendingSaves.get(conversationId);
  if (existing) clearTimeout(existing);
  pendingSaves.delete(conversationId);

  const conv = getState().conversations.find((c) => c.id === conversationId);
  if (!conv) return;
  fetch(`/api/conversations/${conversationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: conv.title,
      messages: conv.messages,
    }),
  }).catch(() => {});
}

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  streamingContent: string;

  createConversation: (model: Model) => Promise<string>;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateLastAssistantMessage: (conversationId: string, content: string) => void;
  setIsStreaming: (value: boolean) => void;
  setStreamingContent: (content: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  loadFromAPI: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isStreaming: false,
  streamingContent: '',

  createConversation: async (model: Model) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
      });
      const conversation: Conversation = await res.json();
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: conversation.id,
      }));
      return conversation.id;
    } catch {
      // Fallback: create locally
      const id = crypto.randomUUID();
      const now = Date.now();
      const conversation: Conversation = {
        id,
        title: 'New Chat',
        messages: [],
        model,
        createdAt: now,
        updatedAt: now,
      };
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: id,
      }));
      return id;
    }
  },

  deleteConversation: (id: string) => {
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId:
        state.activeConversationId === id ? null : state.activeConversationId,
    }));
    fetch(`/api/conversations/${id}`, { method: 'DELETE' }).catch(() => {});
  },

  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id });
  },

  addMessage: (conversationId: string, message: Message) => {
    set((state) => {
      const conversations = state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const messages = [...c.messages, message];
        let title = c.title;
        if (messages.length === 1 && message.role === 'user') {
          title =
            message.content.slice(0, 60) +
            (message.content.length > 60 ? '...' : '');
        }
        return { ...c, messages, title, updatedAt: Date.now() };
      });
      return { conversations };
    });
    debouncedSave(conversationId, get);
  },

  updateLastAssistantMessage: (conversationId: string, content: string) => {
    set((state) => {
      const conversations = state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const messages = [...c.messages];
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          messages[messages.length - 1] = { ...lastMsg, content };
        }
        return { ...c, messages, updatedAt: Date.now() };
      });
      return { conversations };
    });
    // During streaming, debounce. When streaming ends (content is final), flush immediately.
    if (!get().isStreaming) {
      flushSave(conversationId, get);
    } else {
      debouncedSave(conversationId, get);
    }
  },

  setIsStreaming: (value: boolean) => {
    set({ isStreaming: value });
    // When streaming ends, flush any pending saves
    if (!value) {
      const convId = get().activeConversationId;
      if (convId) {
        flushSave(convId, get);
      }
    }
  },

  setStreamingContent: (content: string) => {
    set({ streamingContent: content });
  },

  updateConversationTitle: (id: string, title: string) => {
    set((state) => {
      const conversations = state.conversations.map((c) =>
        c.id === id ? { ...c, title } : c
      );
      return { conversations };
    });
    debouncedSave(id, get);
  },

  loadFromAPI: async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const conversations: Conversation[] = await res.json();
        set({ conversations });
      }
    } catch {
      // Silent fail - will show empty state
    }
  },
}));
