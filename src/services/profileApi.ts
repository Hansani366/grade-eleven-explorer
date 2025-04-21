
import { supabase } from "@/lib/supabase";
import { Profile } from "./types";

// Profile API

export const getProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};

export const updateProfile = async (profile: Partial<Profile>): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.id)
    .select()
    .single();
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  return data;
};

export const deleteProfile = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id);
  if (error) {
    console.error('Error deleting profile:', error);
    return false;
  }
  const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
  if (authError) {
    console.error('Error deleting user auth account:', authError);
    return false;
  }
  return true;
};

export const uploadProfilePicture = async (file: File): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase
    .storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading profile picture:', uploadError);
    return null;
  }

  const { data: { publicUrl } } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating profile with avatar URL:', updateError);
    return null;
  }

  return publicUrl;
};
