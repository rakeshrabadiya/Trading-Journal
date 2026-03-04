import { Trade } from "@/types/trade";

export const calculatePnL = (
  type: "BUY" | "SELL",
  entryPrice: number,
  exitPrice: number,
  size: number
): number => {
  if (type === "BUY") {
    return (exitPrice - entryPrice) * size;
  }
  return (entryPrice - exitPrice) * size;
};

export const calculateRR = (
  entryPrice: number,
  takeProfit: number,
  stopLoss: number
): number => {
  const reward = Math.abs(entryPrice - takeProfit);
  const risk = Math.abs(entryPrice - stopLoss);
  return risk === 0 ? 0 : reward / risk;
};

export const calculateStats = (trades: Trade[]) => {
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
  
  const totalRR = trades.reduce((sum, t) => sum + t.rrRatio, 0);
  const averageRR = totalTrades > 0 ? totalRR / totalTrades : 0;

  return { totalTrades, winRate, totalPnL, averageRR };
};
