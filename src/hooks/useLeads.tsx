import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type Lead = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  source: string | null;
  status: "new" | "contacted" | "converted";
  created_at: string;
  updated_at: string;
};

export type LeadNote = {
  id: string;
  lead_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export function useLeads() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const leadsQuery = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
    enabled: !!user,
  });

  const addLead = useMutation({
    mutationFn: async (lead: { name: string; email?: string; source?: string; status?: "new" | "contacted" | "converted" }) => {
      const { data, error } = await supabase
        .from("leads")
        .insert({ ...lead, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const updateLead = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Lead> & { id: string }) => {
      const { data, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  return { leads: leadsQuery.data ?? [], isLoading: leadsQuery.isLoading, addLead, updateLead, deleteLead };
}

export function useLeadNotes(leadId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ["lead-notes", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", leadId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as LeadNote[];
    },
    enabled: !!leadId && !!user,
  });

  const addNote = useMutation({
    mutationFn: async ({ leadId, content }: { leadId: string; content: string }) => {
      const { data, error } = await supabase
        .from("lead_notes")
        .insert({ lead_id: leadId, user_id: user!.id, content })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lead-notes", leadId] }),
  });

  return { notes: notesQuery.data ?? [], isLoading: notesQuery.isLoading, addNote };
}
