import { create } from "zustand";
import { Trade } from "@/types/trade";
import { calculateStats } from "@/lib/tradeCalculations";

interface TradeState {
  trades: Trade[];
  isLoading: boolean;
  setTrades: (trades: Trade[]) => void;
  fetchTrades: () => Promise<void>;
  addTrade: (trade: Trade) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  importTrades: (trades: Trade[]) => Promise<void>; // Mock for now if we want batch import
  getStats: () => ReturnType<typeof calculateStats>;
}

export const useTradeStore = create<TradeState>()((set, get) => ({
  trades: [],
  isLoading: false,
  setTrades: (trades) => set({ trades }),
  fetchTrades: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/trades");
      if (response.ok) {
        const data = await response.json();
        set({ trades: data });
      }
    } catch (error) {
      console.error("Failed to fetch trades", error);
    } finally {
      set({ isLoading: false });
    }
  },
  addTrade: async (trade) => {
    // Optimistic update
    set((state) => ({ trades: [trade, ...state.trades] }));
    try {
      const response = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trade),
      });
      if (!response.ok) {
        // Rollback if failed
        set((state) => ({ trades: state.trades.filter((t) => t.id !== trade.id) }));
        throw new Error("Failed to save trade to database");
      }
    } catch (error) {
      console.error("Failed to add trade", error);
    }
  },
  deleteTrade: async (id) => {
    // Optimistic delete
    const previousTrades = get().trades;
    set((state) => ({ trades: state.trades.filter((t) => t.id !== id) }));
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        // Rollback
        set({ trades: previousTrades });
        throw new Error("Failed to delete trade");
      }
    } catch (error) {
      console.error("Failed to delete trade", error);
    }
  },
  importTrades: async (importedTrades) => {
    // Batch import simplified: send one by one or create a batch route later.
    // For now, we will do sequential requests (not ideal for huge files, but works for PoC)
    set({ isLoading: true });
    try {
      const successfulTrades = [];
      for (const trade of importedTrades) {
         const response = await fetch("/api/trades", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(trade),
         });
         if (response.ok) {
           const savedTrade = await response.json();
           successfulTrades.push(savedTrade);
         }
      }
      set((state) => ({ trades: [...successfulTrades, ...state.trades] }));
    } catch (error) {
       console.error("Import failed", error);
    } finally {
      set({ isLoading: false });
    }
  },
  getStats: () => calculateStats(get().trades),
}));
