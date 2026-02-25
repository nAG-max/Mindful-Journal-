export type Mood = 'happy' | 'sad' | 'neutral' | 'excited' | 'tired' | 'calm' | 'anxious';

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: Mood | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEntryData {
  title: string;
  content: string;
  mood: Mood | null;
  entry_date: string;
}
