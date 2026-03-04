import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  { params }: { params: { tradeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure the trade belongs to the current user before deleting
    const trade = await prisma.trade.findUnique({
      where: {
        id: params.tradeId,
      },
    });

    if (!trade) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (trade.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.trade.delete({
      where: {
        id: params.tradeId,
      },
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.log("[TRADE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
