export interface Trade {
  id: string;
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  size: number;
  pnl: number;
  rrRatio: number;
  strategyTag: string;
  notes: string;
  screenshot?: string;
  date: string;
}
