import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const workout = await prisma.workout.findFirst({
    where: { id, userId: session.user.id },
    include: {
      logs: { orderBy: { date: "asc" } },
    },
  });

  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(workout);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const workout = await prisma.workout.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.workout.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
