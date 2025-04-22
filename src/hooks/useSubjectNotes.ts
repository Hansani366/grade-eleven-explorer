
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export const useSubjectNotes = (subjectId: number) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('subject_notes')
      .select('*')
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      setIsLoading(false);
      return;
    }

    setNotes(data || []);
    setIsLoading(false);
  }, [subjectId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, isLoading, refetchNotes: fetchNotes };
};
