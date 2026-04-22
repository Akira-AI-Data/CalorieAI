import { differenceInCalendarDays, isToday, isYesterday } from 'date-fns';
import { Conversation } from '@/types';

export type DateGroup = 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days' | 'Older';

export function groupConversationsByDate(
  conversations: Conversation[]
): Map<DateGroup, Conversation[]> {
  const groups = new Map<DateGroup, Conversation[]>();
  const now = new Date();

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  for (const conv of sorted) {
    const date = new Date(conv.updatedAt);
    let group: DateGroup;
    const daysAgo = differenceInCalendarDays(now, date);

    if (isToday(date)) {
      group = 'Today';
    } else if (isYesterday(date)) {
      group = 'Yesterday';
    } else if (daysAgo <= 7) {
      group = 'Last 7 Days';
    } else if (daysAgo <= 30) {
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
