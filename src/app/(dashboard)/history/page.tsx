"use client";

import { TradeTable } from "@/components/TradeTable";

export default function HistoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trade History</h1>
        <p className="text-muted-foreground">
          Review and manage all your past trades.
        </p>
      </div>

      <div className="bg-card/50 backdrop-blur rounded-xl border border-border/50 p-4 shadow-sm">
        <TradeTable />
      </div>
    </div>
  );
}
