import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, Area, AreaChart,
} from "recharts";
import type { Lead } from "@/hooks/useLeads";

const STATUS_COLORS = {
  new: "hsl(217, 91%, 60%)",
  contacted: "hsl(38, 92%, 50%)",
  converted: "hsl(162, 63%, 41%)",
};

export function LeadsByStatusChart({ leads }: { leads: Lead[] }) {
  const data = useMemo(() => {
    const counts = { new: 0, contacted: 0, converted: 0 };
    leads.forEach((l) => counts[l.status]++);
    return [
      { name: "New", value: counts.new, fill: STATUS_COLORS.new },
      { name: "Contacted", value: counts.contacted, fill: STATUS_COLORS.contacted },
      { name: "Converted", value: counts.converted, fill: STATUS_COLORS.converted },
    ];
  }, [leads]);

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-foreground mb-4">Leads by Status</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(214,20%,90%)", fontSize: 13 }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LeadDistributionPie({ leads }: { leads: Lead[] }) {
  const data = useMemo(() => {
    const counts = { new: 0, contacted: 0, converted: 0 };
    leads.forEach((l) => counts[l.status]++);
    return [
      { name: "New", value: counts.new },
      { name: "Contacted", value: counts.contacted },
      { name: "Converted", value: counts.converted },
    ].filter((d) => d.value > 0);
  }, [leads]);

  const COLORS = [STATUS_COLORS.new, STATUS_COLORS.contacted, STATUS_COLORS.converted];

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-foreground mb-4">Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: "0.75rem", fontSize: 13 }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LeadTrendLine({ leads }: { leads: Lead[] }) {
  const data = useMemo(() => {
    const byDate: Record<string, number> = {};
    leads.forEach((l) => {
      const d = new Date(l.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      byDate[d] = (byDate[d] || 0) + 1;
    });
    return Object.entries(byDate)
      .map(([date, count]) => ({ date, count }))
      .reverse();
  }, [leads]);

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-foreground mb-4">Leads Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ borderRadius: "0.75rem", fontSize: 13 }} />
          <Area type="monotone" dataKey="count" stroke="hsl(217, 91%, 60%)" fill="url(#colorCount)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConversionIndicator({ leads }: { leads: Lead[] }) {
  const rate = useMemo(() => {
    if (leads.length === 0) return 0;
    return Math.round((leads.filter((l) => l.status === "converted").length / leads.length) * 100);
  }, [leads]);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in flex flex-col items-center justify-center">
      <h3 className="font-display font-semibold text-foreground mb-4">Conversion Rate</h3>
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(214, 20%, 90%)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke="hsl(162, 63%, 41%)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-display font-bold text-foreground">{rate}%</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-3">{leads.filter((l) => l.status === "converted").length} of {leads.length} leads</p>
    </div>
  );
}
