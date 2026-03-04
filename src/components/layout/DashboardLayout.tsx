"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const fetchTrades = useTradeStore((state) => state.fetchTrades);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTrades();
    }
  }, [status, fetchTrades]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
