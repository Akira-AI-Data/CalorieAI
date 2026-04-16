'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { ChatContainer } from '@/components/chat/ChatContainer';

export default function ChatPage() {
  return (
    <div className="h-full overflow-hidden">
      <MainLayout>
        <ChatContainer />
      </MainLayout>
    </div>
  );
}
