
import { supabase } from "@/lib/supabase";
import { QuizSettings } from "./types";

// Quiz Settings API

export const getQuizSettings = async (): Promise<QuizSettings | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('quiz_settings')
    .select()
    .eq('user_id', user.id)
    .single();
  if (error) {
    console.error('Error fetching quiz settings:', error);
    return null;
  }
  return data;
};

export const updateQuizSettings = async (
  settings: Partial<Omit<QuizSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase
    .from('quiz_settings')
    .upsert({
      user_id: user.id,
      ...settings
    });
  if (error) {
    console.error('Error updating quiz settings:', error);
    return false;
  }
  return true;
};
