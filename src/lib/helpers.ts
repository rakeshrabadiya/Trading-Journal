import { Trade } from "@/types/trade";
import { format } from "date-fns";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const exportToCSV = (trades: Trade[]) => {
  const headers = [
    "Date,Pair,Type,Entry Price,Exit Price,Stop Loss,Take Profit,Size,PnL,RR Ratio,Strategy,Notes",
  ];

  const rows = trades.map((trade) => {
    return [
      `"${format(new Date(trade.date), "yyyy-MM-dd HH:mm")}"`,
      `"${trade.pair}"`,
      `"${trade.type}"`,
      trade.entryPrice,
      trade.exitPrice,
      trade.stopLoss,
      trade.takeProfit,
      trade.size,
      trade.pnl,
      trade.rrRatio,
      `"${trade.strategyTag}"`,
      `"${trade.notes.replace(/"/g, '""')}"`,
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `trading-journal-export-${format(new Date(), "yyyy-MM-dd")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
