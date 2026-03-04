"use client";

import { useTradeStore } from "@/store/tradeStore";
import { exportToCSV } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Download, Upload, Moon, Sun } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Trade } from "@/types/trade";
import { v4 as uuidv4 } from "uuid";

export default function SettingsPage() {
  const { trades, resetAll, importTrades } = useTradeStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Basic theme toggle that uses class manipulation on html
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      setTheme("dark");
    }
  };

  const handleExport = () => {
    if (trades.length === 0) {
      toast({
        title: "No Data",
        description: "There are no trades to export.",
        variant: "destructive",
      });
      return;
    }
    exportToCSV(trades);
    toast({
      title: "Export Successful",
      description: "Trades have been exported to CSV.",
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split("\n");
        if (lines.length <= 1) throw new Error("File empty or invalid.");

        const importedTrades: Trade[] = [];
        
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          // Simple CSV parsing (handling quotes)
          const matches = lines[i].match(/(?:"[^"]*"|^[^,]*)(?:,|$)/g);
          if (!matches) continue;
          
          const row = matches.map(m => {
            let val = m.replace(/,$/, '').trim();
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.substring(1, val.length - 1).replace(/""/g, '"');
            }
            return val;
          });

          if (row.length >= 10) {
            importedTrades.push({
              id: uuidv4(),
              date: new Date(row[0]).toISOString(),
              pair: row[1],
              type: row[2] as "BUY" | "SELL",
              entryPrice: parseFloat(row[3]),
              exitPrice: parseFloat(row[4]),
              stopLoss: parseFloat(row[5]) || 0,
              takeProfit: parseFloat(row[6]) || 0,
              size: parseFloat(row[7]),
              pnl: parseFloat(row[8]),
              rrRatio: parseFloat(row[9]),
              strategyTag: row[10] || "",
              notes: row[11] || "",
            });
          }
        }

        importTrades(importedTrades);
        
        toast({
          title: "Import Successful",
          description: `Successfully imported ${importedTrades.length} trades.`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Something went wrong parsing the CSV. Please ensure it matches the export format.",
          variant: "destructive",
        });
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetAll();
    toast({
      title: "Data Reset",
      description: "All trading data has been cleared permanently.",
      variant: "destructive",
    });
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and data.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the app looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium text-sm">Theme</span>
              <p className="text-sm text-muted-foreground">
                Toggle between dark and light themes (UI optimized for dark mode).
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export your data, import history, or wipe your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-medium text-sm">Export Data</span>
                <p className="text-sm text-muted-foreground">
                  Download all your trades as a CSV file.
                </p>
              </div>
              <Button onClick={handleExport} variant="secondary" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <span className="font-medium text-sm">Import Data</span>
                <p className="text-sm text-muted-foreground">
                  Upload a previously exported CSV file.
                </p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleImport}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <Upload className="mr-2 h-4 w-4" /> Import CSV
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <span className="font-medium text-sm text-destructive">Danger Zone</span>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all trades. This action cannot be undone.
                </p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Reset All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all
                      your trades and remove your data from your local storage.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
