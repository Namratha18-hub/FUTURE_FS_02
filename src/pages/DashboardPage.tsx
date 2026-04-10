import { Users, UserPlus, PhoneCall, CheckCircle2, TrendingUp } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeadsByStatusChart, LeadDistributionPie, LeadTrendLine, ConversionIndicator } from "@/components/dashboard/LeadCharts";

export default function DashboardPage() {
  const { leads, isLoading } = useLeads();

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
    rate: leads.length ? Math.round((leads.filter((l) => l.status === "converted").length / leads.length) * 100) : 0,
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
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Overview of your lead pipeline</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Leads" value={stats.total} icon={<Users className="w-5 h-5" />} />
        <StatCard title="New" value={stats.new} icon={<UserPlus className="w-5 h-5" />} />
        <StatCard title="Contacted" value={stats.contacted} icon={<PhoneCall className="w-5 h-5" />} />
        <StatCard title="Converted" value={stats.converted} icon={<CheckCircle2 className="w-5 h-5" />} />
        <StatCard title="Conversion" value={`${stats.rate}%`} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LeadsByStatusChart leads={leads} />
        <LeadDistributionPie leads={leads} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LeadTrendLine leads={leads} />
        </div>
        <ConversionIndicator leads={leads} />
      </div>
    </div>
  );
}
