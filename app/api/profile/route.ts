import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  age: z.number().int().min(1).max(150),
  height: z.number().min(50).max(300),
  weight: z.number().min(1).max(500),
});

function calcBMI(weight: number, height: number) {
  const h = height / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { age, height, weight } = profileSchema.parse(body);
    const bmi = calcBMI(weight, height);

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, age, height, weight },
      update: { age, height, weight },
    });

    await prisma.weightLog.create({
      data: { userId: session.user.id, weight, bmi },
    });

    return NextResponse.json({ ...profile, bmi });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
