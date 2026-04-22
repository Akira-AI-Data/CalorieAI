import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Conversation, Model } from '@/types';
import { groupConversationsByDate } from './dateGroups';

const model: Model = 'claude-sonnet-4-20250514';

function createConversation(id: string, isoDate: string): Conversation {
  const timestamp = new Date(isoDate).getTime();

  return {
    id,
    title: id,
    messages: [],
    model,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

describe('groupConversationsByDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-21T12:00:00+10:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('groups conversations by recency and sorts them newest first', () => {
    const groups = groupConversationsByDate([
      createConversation('older', '2026-03-01T09:00:00+10:00'),
      createConversation('yesterday', '2026-04-20T08:00:00+10:00'),
      createConversation('last-30', '2026-04-10T07:00:00+10:00'),
      createConversation('today-newer', '2026-04-21T11:30:00+10:00'),
      createConversation('last-7', '2026-04-16T10:00:00+10:00'),
      createConversation('today-older', '2026-04-21T07:00:00+10:00'),
    ]);

    expect(
      [...groups.entries()].map(([group, conversations]) => [
        group,
        conversations.map((conversation) => conversation.id),
      ])
    ).toEqual([
      ['Today', ['today-newer', 'today-older']],
      ['Yesterday', ['yesterday']],
      ['Last 7 Days', ['last-7']],
      ['Last 30 Days', ['last-30']],
      ['Older', ['older']],
    ]);
  });

  it('keeps items exactly 7 and 30 days old inside their named buckets', () => {
    const groups = groupConversationsByDate([
      createConversation('seven-days', '2026-04-14T00:30:00+10:00'),
      createConversation('thirty-days', '2026-03-22T23:30:00+10:00'),
    ]);

    expect(groups.get('Last 7 Days')?.map((conversation) => conversation.id)).toEqual([
      'seven-days',
    ]);
    expect(groups.get('Last 30 Days')?.map((conversation) => conversation.id)).toEqual([
      'thirty-days',
    ]);
  });
});
