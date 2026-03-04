"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useTradeStore } from "@/store/tradeStore";
import { formatCurrency } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TradeTable() {
  const { trades, deleteTrade } = useTradeStore();
  const [search, setSearch] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("");

  const strategies = Array.from(
    new Set(trades.map((t) => t.strategyTag).filter(Boolean))
  );

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.pair
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStrategy = strategyFilter
      ? trade.strategyTag === strategyFilter
      : true;
    return matchesSearch && matchesStrategy;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pair..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            className="flex h-9 w-full sm:w-[180px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={strategyFilter}
            onChange={(e) => setStrategyFilter(e.target.value)}
          >
            <option value="" className="bg-background">All Strategies</option>
            {strategies.map((s) => (
              <option key={s} value={s} className="bg-background">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Pair</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Entry</TableHead>
              <TableHead className="text-right">Exit</TableHead>
              <TableHead className="text-right">PnL</TableHead>
              <TableHead className="text-right">RR</TableHead>
              <TableHead>Strategy</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No trades found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTrades.map((trade) => (
                <TableRow key={trade.id} className="transition-colors hover:bg-muted/50">
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(trade.date), "MMM dd, HH:mm")}
                  </TableCell>
                  <TableCell className="font-medium">{trade.pair}</TableCell>
                  <TableCell>
                    <Badge
                      variant={trade.type === "BUY" ? "default" : "destructive"}
                      className="bg-opacity-80"
                    >
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${trade.entryPrice}</TableCell>
                  <TableCell className="text-right">${trade.exitPrice}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      trade.pnl > 0
                        ? "text-emerald-500"
                        : trade.pnl < 0
                        ? "text-rose-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {trade.pnl > 0 ? "+" : ""}
                    {formatCurrency(trade.pnl)}
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.rrRatio > 0 ? trade.rrRatio.toFixed(2) : "-"}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground truncate max-w-[100px] block">
                      {trade.strategyTag || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => deleteTrade(trade.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
