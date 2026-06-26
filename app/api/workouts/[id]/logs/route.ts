import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const logSchema = z.object({
  weight: z.number().optional(),
  reps: z.number().int().optional(),
  sets: z.number().int().optional(),
  time: z.number().optional(),
  steps: z.number().int().optional(),
  distance: z.number().optional(),
  date: z.string().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const logs = await prisma.workoutLog.findMany({
    where: { workoutId: id, userId: session.user.id },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(logs);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const data = logSchema.parse(body);

    const workout = await prisma.workout.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const log = await prisma.workoutLog.create({
      data: {
        workoutId: id,
        userId: session.user.id,
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });
    return NextResponse.json(log, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
