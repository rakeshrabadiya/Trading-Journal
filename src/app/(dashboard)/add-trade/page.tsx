"use client";

import { TradeForm } from "@/components/TradeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddTradePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Trade</h1>
        <p className="text-muted-foreground">
          Log a new trade into your journal.
        </p>
      </div>

      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Trade Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TradeForm />
        </CardContent>
      </Card>
    </div>
  );
}
