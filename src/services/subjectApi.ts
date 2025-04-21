
import { supabase } from "@/lib/supabase";
import { Subject } from "./types";

// Subject-related API

export const getSubjects = async (): Promise<Subject[]> => {
  const { data, error } = await supabase
    .from('subjects')
    .select();
  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
  return data || [];
};

export const getSubjectById = async (id: number): Promise<Subject | null> => {
  const { data, error } = await supabase
    .from('subjects')
    .select()
    .eq('id', id)
    .single();
  if (error) {
    console.error(`Error fetching subject ${id}:`, error);
    return null;
  }
  return data;
};
