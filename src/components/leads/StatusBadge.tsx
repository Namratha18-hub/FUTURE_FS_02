import { Badge } from "@/components/ui/badge";

const statusConfig = {
  new: { label: "New", className: "bg-primary/10 text-primary border-primary/20" },
  contacted: { label: "Contacted", className: "bg-chart-contacted/10 text-chart-contacted border-chart-contacted/20" },
  converted: { label: "Converted", className: "bg-accent/10 text-accent border-accent/20" },
};

export function StatusBadge({ status }: { status: "new" | "contacted" | "converted" }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={`${config.className} font-medium text-xs`}>
      {config.label}
    </Badge>
  );
}
