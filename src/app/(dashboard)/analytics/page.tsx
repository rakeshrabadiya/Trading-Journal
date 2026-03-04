"use client";

import { useTradeStore } from "@/store/tradeStore";
import { EquityChart } from "@/components/EquityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useMemo } from "react";
import { format } from "date-fns";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function AnalyticsPage() {
  const trades = useTradeStore((state) => state.trades);

  const winLossData = useMemo(() => {
    const wins = trades.filter((t) => t.pnl > 0).length;
    const losses = trades.filter((t) => t.pnl <= 0).length;

    return {
      labels: ["Wins", "Losses"],
      datasets: [
        {
          data: [wins, losses],
          backgroundColor: ["rgba(16, 185, 129, 0.8)", "rgba(244, 63, 94, 0.8)"],
          borderColor: ["rgba(16, 185, 129, 1)", "rgba(244, 63, 94, 1)"],
          borderWidth: 1,
        },
      ],
    };
  }, [trades]);

  const pairProfitData = useMemo(() => {
    const pairs: Record<string, number> = {};
    trades.forEach((t) => {
      pairs[t.pair] = (pairs[t.pair] || 0) + t.pnl;
    });

    const sortedPairs = Object.entries(pairs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10

    return {
      labels: sortedPairs.map((p) => p[0]),
      datasets: [
        {
          label: "PnL ($)",
          data: sortedPairs.map((p) => p[1]),
          backgroundColor: sortedPairs.map((p) =>
            p[1] >= 0 ? "rgba(16, 185, 129, 0.8)" : "rgba(244, 63, 94, 0.8)"
          ),
        },
      ],
    };
  }, [trades]);

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    trades.forEach((t) => {
      const monthYear = format(new Date(t.date), "MMM yyyy");
      months[monthYear] = (months[monthYear] || 0) + t.pnl;
    });

    // Sort chronologically
    const sorted = Object.entries(months).sort((a, b) => {
      return new Date(a[0]).getTime() - new Date(b[0]).getTime();
    });

    return {
      labels: sorted.map((m) => m[0]),
      datasets: [
        {
          label: "Monthly PnL ($)",
          data: sorted.map((m) => m[1]),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderRadius: 4,
        },
      ],
    };
  }, [trades]);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: "rgba(255, 255, 255, 0.7)" },
      },
    },
    scales: {
      y: { ticks: { color: "rgba(255, 255, 255, 0.5)" } },
      x: { ticks: { color: "rgba(255, 255, 255, 0.5)" } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: "rgba(255, 255, 255, 0.7)" },
      },
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Deep dive into your trading data and performance.
        </p>
      </div>

      {trades.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Not enough data. Add some trades to view analytics.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card/50 backdrop-blur border-border/50 col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <EquityChart />
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Win / Loss Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <Pie data={winLossData} options={pieOptions} />
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Profit by Pair (Top 10)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar data={pairProfitData} options={commonOptions} />
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50 col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar data={monthlyData} options={commonOptions} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
