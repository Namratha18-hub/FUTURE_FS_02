import { useLeads } from "@/hooks/useLeads";
import { LeadsByStatusChart, LeadDistributionPie, LeadTrendLine, ConversionIndicator } from "@/components/dashboard/LeadCharts";

export default function ChartsPage() {
  const { leads, isLoading } = useLeads();

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
        <h2 className="text-2xl font-display font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground text-sm mt-1">Visual breakdown of your lead pipeline</p>
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
