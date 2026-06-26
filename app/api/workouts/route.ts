import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const workoutSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["WEIGHTS", "BODYWEIGHT", "TREADMILL", "CYCLING"]),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workouts = await prisma.workout.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      logs: {
        orderBy: { date: "desc" },
        take: 1,
      },
    },
  });
  return NextResponse.json(workouts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, type } = workoutSchema.parse(body);

    const workout = await prisma.workout.create({
      data: { userId: session.user.id, name, type },
    });
    return NextResponse.json(workout, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
