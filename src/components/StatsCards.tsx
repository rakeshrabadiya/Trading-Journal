"use client";

import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency } from "@/lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Percent,
  DollarSign,
  Activity,
} from "lucide-react";

export function StatsCards() {
  const getStats = useTradeStore((state) => state.getStats);
  const { totalTrades, winRate, totalPnL, averageRR } = getStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total PnL
          </CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalPnL)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Overall profit and loss
          </p>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Win Rate
          </CardTitle>
          <Percent className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{winRate.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {totalTrades} trades
          </p>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Trades
          </CardTitle>
          <Activity className="h-4 w-4 text-violet-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTrades}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Completed market operations
          </p>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average RR
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRR.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Reward to risk ratio
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
