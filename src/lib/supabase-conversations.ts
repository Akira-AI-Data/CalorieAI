import { createServerSupabaseClient } from './supabase';
import { Conversation, Message, Model } from '@/types';

interface DBConversation {
  id: string;
  user_id: string;
  title: string;
  model: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

function toConversation(row: DBConversation): Conversation {
  return {
    id: row.id,
    title: row.title,
    model: row.model as Model,
    messages: row.messages || [],
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(toConversation);
}

export async function createConversation(
  userId: string,
  model: Model
): Promise<Conversation> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      model,
      title: 'New Chat',
      messages: [],
    })
    .select()
    .single();

  if (error) throw error;
  return toConversation(data);
}

export async function updateConversation(
  id: string,
  userId: string,
  updates: { title?: string; messages?: Message[]; model?: Model }
): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('conversations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteConversation(
  id: string,
  userId: string
): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}
