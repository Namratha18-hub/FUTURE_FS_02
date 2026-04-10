import { useState, useMemo } from "react";
import { useLeads, type Lead } from "@/hooks/useLeads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { LeadNotesPanel } from "@/components/leads/LeadNotesPanel";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { Plus, Search, Pencil, Trash2, MessageSquare, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

type SortKey = "name" | "created_at";
type SortDir = "asc" | "desc";

export default function LeadsPage() {
  const { leads, isLoading, addLead, updateLead, deleteLead } = useLeads();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [formOpen, setFormOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notesLead, setNotesLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    let result = leads;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.name.toLowerCase().includes(q) || (l.email?.toLowerCase().includes(q)));
    }
    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }
    result = [...result].sort((a, b) => {
      const valA = sortKey === "name" ? a.name.toLowerCase() : a.created_at;
      const valB = sortKey === "name" ? b.name.toLowerCase() : b.created_at;
      return sortDir === "asc" ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
    });
    return result;
  }, [leads, search, statusFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleAdd = async (data: any) => {
    try {
      await addLead.mutateAsync(data);
      setFormOpen(false);
      toast.success("Lead added");
    } catch { toast.error("Failed to add lead"); }
  };

  const handleUpdate = async (data: any) => {
    if (!editLead) return;
    try {
      await updateLead.mutateAsync({ id: editLead.id, ...data });
      setEditLead(null);
      toast.success("Lead updated");
    } catch { toast.error("Failed to update lead"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLead.mutateAsync(deleteId);
      setDeleteId(null);
      toast.success("Lead deleted");
    } catch { toast.error("Failed to delete lead"); }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Leads</h2>
          <p className="text-muted-foreground text-sm mt-1">{leads.length} total leads</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Lead
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Name <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button onClick={() => toggleSort("created_at")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Date <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  {search || statusFilter !== "all" ? "No leads match your filters" : "No leads yet. Add your first lead!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="group">
                  <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{lead.email || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{lead.source || "—"}</TableCell>
                  <TableCell><StatusBadge status={lead.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => setNotesLead(lead)} title="Notes">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditLead(lead)} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(lead.id)} title="Delete" className="hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <LeadFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAdd} loading={addLead.isPending} />
      <LeadFormDialog open={!!editLead} onClose={() => setEditLead(null)} onSubmit={handleUpdate} initialData={editLead} loading={updateLead.isPending} />
      <LeadNotesPanel lead={notesLead} open={!!notesLead} onClose={() => setNotesLead(null)} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete this lead and all associated notes.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
