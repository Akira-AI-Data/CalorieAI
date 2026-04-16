import { isToday, isYesterday, subDays, isAfter } from 'date-fns';
import { Conversation } from '@/types';

export type DateGroup = 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days' | 'Older';

export function groupConversationsByDate(
  conversations: Conversation[]
): Map<DateGroup, Conversation[]> {
  const groups = new Map<DateGroup, Conversation[]>();
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const thirtyDaysAgo = subDays(now, 30);

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  for (const conv of sorted) {
    const date = new Date(conv.updatedAt);
    let group: DateGroup;

    if (isToday(date)) {
      group = 'Today';
    } else if (isYesterday(date)) {
      group = 'Yesterday';
    } else if (isAfter(date, sevenDaysAgo)) {
      group = 'Last 7 Days';
    } else if (isAfter(date, thirtyDaysAgo)) {
      group = 'Last 30 Days';
    } else {
      group = 'Older';
    }

    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(conv);
  }

  return groups;
}
