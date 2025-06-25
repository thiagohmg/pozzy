
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

// Tipagem do perfil usando o supabase gerado
export type Profile = Tables<"profiles">;

export function useProfileData(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setLoading(true);

    supabase
      .from("profiles")
      .select("id, full_name, avatar_url, updated_at")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setProfile(null);
        } else {
          setProfile(data ?? null);
        }
        setLoading(false);
      });
  }, [userId]);

  const updateProfile = async (full_name: string, avatar_url: string) => {
    setLoading(true);
    setError(null);

    // Tipar o objeto de update para a tabela correta
    const updateObj: TablesUpdate<"profiles"> = {
      full_name,
      avatar_url,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("profiles")
      .update(updateObj)
      .eq("id", userId);

    setLoading(false);
    if (error) setError(error.message);
    return !error;
  };

  return {
    profile,
    loading,
    error,
    setProfile,
    updateProfile,
  };
}
