import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, TrendingUp, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
            TJ
          </div>
          <span className="text-xl font-bold tracking-tight">TradeJournal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:flex">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32 overflow-hidden">
        {/* Hero Section */}
        <div className="relative isolate">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#10b981] to-[#3b82f6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>

          <Badge className="mb-6 px-3 py-1 bg-muted/50 text-muted-foreground border-border/50 text-xs sm:text-sm shadow-sm backdrop-blur-sm">
            🚀 The Modern Trading Experience
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Master your psychology.<br/> 
            Track your edge.
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A beautiful, uncompromisingly professional trading journal built for serious traders. Log trades, analyze performance, and become consistently profitable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                Start Journaling for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-14 px-8 text-base border-border/50 hover:bg-muted/50">
                Sign back in
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid gap-8 sm:grid-cols-3 max-w-6xl mx-auto text-left">
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Deep Analytics</h3>
            <p className="text-muted-foreground">Beautiful charts and insights to understand your win rate, RR, and profit distribution by pair.</p>
          </div>
          
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Secure Cloud Sync</h3>
            <p className="text-muted-foreground">Your data is safely stored in the cloud. Access your journal from any device, anywhere.</p>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 mb-2">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Performance Tracking</h3>
            <p className="text-muted-foreground">Monitor your equity curve and monthly performance to ensure consistent, upward growth.</p>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-border/40 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TradeJournal. All rights reserved.
      </footer>
    </div>
  );
}

// Temporary inline import until the real Badge is imported properly
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`inline-flex items-center rounded-full font-medium ${className}`}>{children}</span>;
}
