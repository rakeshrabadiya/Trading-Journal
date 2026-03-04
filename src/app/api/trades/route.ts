import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const trades = await prisma.trade.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(trades);
  } catch (error) {
    console.log("[TRADES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      pair,
      type,
      entryPrice,
      exitPrice,
      stopLoss,
      takeProfit,
      size,
      pnl,
      rrRatio,
      strategyTag,
      notes,
      screenshot,
      date,
    } = body;

    const trade = await prisma.trade.create({
      data: {
        userId: session.user.id,
        pair,
        type,
        entryPrice,
        exitPrice,
        stopLoss,
        takeProfit,
        size,
        pnl,
        rrRatio,
        strategyTag,
        notes,
        screenshot,
        date: new Date(date),
      },
    });

    return NextResponse.json(trade);
  } catch (error) {
    console.log("[TRADES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
