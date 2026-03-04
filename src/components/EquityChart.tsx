"use client";

import { useTradeStore } from "@/store/tradeStore";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export function EquityChart() {
  const trades = useTradeStore((state) => state.trades);

  const chartData = useMemo(() => {
    // Sort trades chronologically for the equity curve
    const sortedTrades = [...trades].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulativePnL = 0;
    const labels: string[] = ["Start"];
    const data: number[] = [0];

    sortedTrades.forEach((trade) => {
      cumulativePnL += trade.pnl;
      labels.push(format(new Date(trade.date), "MMM dd"));
      data.push(cumulativePnL);
    });

    return {
      labels,
      datasets: [
        {
          fill: true,
          label: "Equity Curve ($)",
          data,
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    };
  }, [trades]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          maxTicksLimit: 10,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Line options={options} data={chartData} />
    </div>
  );
}
