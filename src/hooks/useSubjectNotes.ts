
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Note {
  id: string;
  Title: string;
  Content: string;
  created_at?: string;
  subject_id?: number;
  user_id?: string;
}

export const useSubjectNotes = (subjectId: number) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('subject_notes')
        .select('*')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        return;
      }

      setNotes(data as Note[] || []);
    } catch (error) {
      console.error('Exception fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, isLoading, refetchNotes: fetchNotes };
};
