"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { LogOut } from "lucide-react";
import { useTradeStore } from "@/store/tradeStore";

export function Navbar() {
  const { data: session } = useSession();
  const resetAll = useTradeStore((state) => state.resetAll);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    // Clear the global store when logging out so data isn't cached
    resetAll();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-background px-3 md:px-6">
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-sm text-muted-foreground mr-2">
          {session?.user?.name || session?.user?.email}
        </span>
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
          <span className="text-sm font-bold">
            {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
