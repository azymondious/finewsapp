import { supabase } from "@/lib/supabaseClient";

// Create a user profile in the public.users table
export const createUserProfile = async (userId: string, email: string) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ id: userId, email }])
    .select()
    .single();

  if (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }

  return data;
};

// Get the current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting current user:", error);
    throw error;
  }

  return data.user;
};

// Sign in anonymously to create a temporary user
export const signInAnonymously = async () => {
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error("Error signing in anonymously:", error);
    throw error;
  }

  // Create a user profile for the anonymous user
  if (data.user) {
    await createUserProfile(
      data.user.id,
      `anonymous-${data.user.id}@example.com`,
    );
  }

  return data.user;
};
