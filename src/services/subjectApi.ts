
import { supabase } from "@/lib/supabase";
import { Subject } from "./types";

export const getSubjects = async (): Promise<Subject[]> => {
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      id,
      name,
      title,
      category,
      description
    `);

  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }

  return (data || []).map(subject => ({
    id: subject.id,
    title: subject.title || subject.name,
    name: subject.name,
    icon: subject.category || 'book-open',
    color: subject.description || 'bg-edu-purple',
    description: subject.description || '',
    progress: 0  // Progress will be calculated by useSubjectProgress hook
  }));
};

export const getSubjectById = async (id: number): Promise<Subject | null> => {
  const { data, error } = await supabase
    .from('subjects')
    .select()
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(`Error fetching subject ${id}:`, error);
    return null;
  }

  return {
    id: data.id,
    title: data.title || data.name,
    name: data.name,
    icon: data.category || 'book-open',
    color: data.description || 'bg-edu-purple',
    description: data.description || '',
    progress: 0 // Progress will be calculated by useSubjectProgress hook
  };
};
