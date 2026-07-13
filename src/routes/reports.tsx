import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { zoneBreakdown, weeklyCompleted } from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Poliss" },
      { name: "description", content: "Generate and download operational reports." },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  { name: "Weekly cleanup summary — Zone-wise", period: "07 Jul – 13 Jul 2026", size: "142 KB" },
  { name: "Collector performance ledger", period: "June 2026", size: "218 KB" },
  { name: "Rejected submissions audit", period: "Q2 2026", size: "88 KB" },
  { name: "Zonal SLA compliance", period: "June 2026", size: "156 KB" },
];

function ReportsPage() {
  const totalDone = zoneBreakdown.reduce((s, z) => s + z.done, 0);
  const totalOpen = zoneBreakdown.reduce((s, z) => s + z.open, 0);
  const weekTotal = weeklyCompleted.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <PageHeader
        title="Reports"
        description="Operational summaries and exports"
        actions={
          <Button size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Export all
          </Button>
        }
      />

      <div className="space-y-6 p-6">
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Tasks completed (7d)" value={weekTotal} />
          <Stat label="Open tasks" value={totalOpen} />
          <Stat label="All-time completed" value={totalDone} />
        </section>

        <section className="overflow-hidden rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Available reports</h2>
            <p className="text-xs text-muted-foreground">Pre-built templates you can download as CSV or PDF.</p>
          </div>
          <ul className="divide-y divide-border">
            {reports.map((r) => (
              <li key={r.name} className="flex items-center gap-3 px-4 py-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.period} · {r.size}</div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  );
}
