import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLeadNotes, type Lead } from "@/hooks/useLeads";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface LeadNotesPanelProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

export function LeadNotesPanel({ lead, open, onClose }: LeadNotesPanelProps) {
  const [content, setContent] = useState("");
  const { notes, addNote, isLoading } = useLeadNotes(lead?.id ?? null);

  const handleAdd = async () => {
    if (!content.trim() || !lead) return;
    try {
      await addNote.mutateAsync({ leadId: lead.id, content: content.trim() });
      setContent("");
      toast.success("Note added");
    } catch {
      toast.error("Failed to add note");
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display">Notes — {lead?.name}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4 space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No notes yet</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="glass-card rounded-lg p-3 animate-fade-in">
                <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border pt-3 flex gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a note..."
            className="min-h-[60px] resize-none"
          />
          <Button onClick={handleAdd} size="icon" disabled={!content.trim() || addNote.isPending} className="shrink-0 self-end">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
