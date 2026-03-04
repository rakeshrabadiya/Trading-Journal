"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Trade } from "@/types/trade";
import { calculatePnL, calculateRR } from "@/lib/tradeCalculations";
import { useTradeStore } from "@/store/tradeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadScreenshot } from "./UploadScreenshot";
import { useToast } from "@/hooks/use-toast";

export function TradeForm() {
  const addTrade = useTradeStore((state) => state.addTrade);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    pair: "",
    type: "BUY" as "BUY" | "SELL",
    entryPrice: "",
    exitPrice: "",
    stopLoss: "",
    takeProfit: "",
    size: "",
    strategyTag: "",
    notes: "",
    date: new Date().toISOString().slice(0, 16),
  });

  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const sl = parseFloat(formData.stopLoss);
    const tp = parseFloat(formData.takeProfit);
    const size = parseFloat(formData.size);

    if (isNaN(entry) || isNaN(exit) || isNaN(size)) {
      toast({
        title: "Error",
        description: "Please fill out all required numeric fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const pnl = calculatePnL(formData.type, entry, exit, size);
    let rrRatio = 0;
    if (!isNaN(sl) && !isNaN(tp)) {
      rrRatio = calculateRR(entry, tp, sl);
    }

    const newTrade: Trade = {
      id: uuidv4(),
      pair: formData.pair.toUpperCase(),
      type: formData.type,
      entryPrice: entry,
      exitPrice: exit,
      stopLoss: sl || 0,
      takeProfit: tp || 0,
      size,
      pnl,
      rrRatio,
      strategyTag: formData.strategyTag,
      notes: formData.notes,
      screenshot: screenshot || undefined,
      date: new Date(formData.date).toISOString(),
    };

    addTrade(newTrade);

    toast({
      title: "Trade Added",
      description: `Successfully added ${newTrade.pair} trade with ${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)} PnL.`,
    });

    // Reset form
    setFormData({
      pair: "",
      type: "BUY",
      entryPrice: "",
      exitPrice: "",
      stopLoss: "",
      takeProfit: "",
      size: "",
      strategyTag: "",
      notes: "",
      date: new Date().toISOString().slice(0, 16),
    });
    setScreenshot(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="pair">Pair (e.g., BTC/USD)</Label>
          <Input
            id="pair"
            required
            value={formData.pair}
            onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
            placeholder="BTC/USD"
            className="uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(val) => setFormData({ ...formData, type: val as "BUY" | "SELL" })}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BUY">BUY (Long)</SelectItem>
              <SelectItem value="SELL">SELL (Short)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="entryPrice">Entry Price</Label>
          <Input
            id="entryPrice"
            type="number"
            step="any"
            required
            value={formData.entryPrice}
            onChange={(e) =>
              setFormData({ ...formData, entryPrice: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exitPrice">Exit Price</Label>
          <Input
            id="exitPrice"
            type="number"
            step="any"
            required
            value={formData.exitPrice}
            onChange={(e) =>
              setFormData({ ...formData, exitPrice: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stopLoss">Stop Loss (Optional)</Label>
          <Input
            id="stopLoss"
            type="number"
            step="any"
            value={formData.stopLoss}
            onChange={(e) =>
              setFormData({ ...formData, stopLoss: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="takeProfit">Take Profit (Optional)</Label>
          <Input
            id="takeProfit"
            type="number"
            step="any"
            value={formData.takeProfit}
            onChange={(e) =>
              setFormData({ ...formData, takeProfit: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Position Size</Label>
          <Input
            id="size"
            type="number"
            step="any"
            required
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="strategyTag">Strategy Tag</Label>
          <Input
            id="strategyTag"
            value={formData.strategyTag}
            onChange={(e) =>
              setFormData({ ...formData, strategyTag: e.target.value })
            }
            placeholder="e.g., Breakout"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Trade Date & Time</Label>
        <Input
          id="date"
          type="datetime-local"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Why did you take this trade?"
        />
      </div>

      <div className="space-y-2">
        <Label>Screenshot</Label>
        <UploadScreenshot
          previewUrl={screenshot}
          onUpload={setScreenshot}
          onRemove={() => setScreenshot(null)}
        />
      </div>

      <Button type="submit" className="w-full h-12 text-lg font-semibold">
        Save Trade
      </Button>
    </form>
  );
}
