"use client";

import { StatsCards } from "@/components/StatsCards";
import { EquityChart } from "@/components/EquityChart";
import { useTradeStore } from "@/store/tradeStore";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const trades = useTradeStore((state) => state.trades);
  const recentTrades = trades.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your trading performance.
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5 bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <EquityChart />
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-2 bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No trades recorded yet.
                </p>
              ) : (
                recentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between space-x-4 border-b border-border/50 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {trade.pair}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(trade.date), "MMM dd")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge
                        variant={trade.type === "BUY" ? "default" : "destructive"}
                        className="text-[10px] h-4 px-1"
                      >
                        {trade.type}
                      </Badge>
                      <span
                        className={`text-sm font-semibold ${
                          trade.pnl > 0
                            ? "text-emerald-500"
                            : trade.pnl < 0
                            ? "text-rose-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {trade.pnl > 0 ? "+" : ""}
                        {formatCurrency(trade.pnl)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
