import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Lead } from "@/hooks/useLeads";

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email?: string; source?: string; status?: "new" | "contacted" | "converted" }) => void;
  initialData?: Lead | null;
  loading?: boolean;
}

export function LeadFormDialog({ open, onClose, onSubmit, initialData, loading }: LeadFormDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState<"new" | "contacted" | "converted">("new");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email ?? "");
      setSource(initialData.source ?? "");
      setStatus(initialData.status);
    } else {
      setName(""); setEmail(""); setSource(""); setStatus("new");
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email: email || undefined, source: source || undefined, status });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{initialData ? "Edit Lead" : "Add New Lead"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Lead name" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lead@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Source</label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. LinkedIn, Website" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update" : "Add Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
