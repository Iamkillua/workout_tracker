import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const workout = await prisma.workout.findFirst({
    where: { id, userId: session.user.id },
    include: { logs: { orderBy: { date: "asc" } } },
  });
  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const headers = buildHeaders(workout.type);
  const rows = workout.logs.map((log) => buildRow(log, workout.type));
  const csv = [headers, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${workout.name.replace(/[^a-z0-9]/gi, "_")}_history.csv"`,
    },
  });
}

function buildHeaders(type: string): string {
  switch (type) {
    case "WEIGHTS":
      return "Date,Weight (kg),Reps,Sets";
    case "BODYWEIGHT":
      return "Date,Reps,Sets";
    case "TREADMILL":
      return "Date,Time (min),Steps,Distance (km)";
    case "CYCLING":
      return "Date,Time (min),Distance (km)";
    default:
      return "Date";
  }
}

function buildRow(
  log: { date: Date; weight?: number | null; reps?: number | null; sets?: number | null; time?: number | null; steps?: number | null; distance?: number | null },
  type: string
): string {
  const date = format(new Date(log.date), "yyyy-MM-dd");
  switch (type) {
    case "WEIGHTS":
      return `${date},${log.weight ?? ""},${log.reps ?? ""},${log.sets ?? ""}`;
    case "BODYWEIGHT":
      return `${date},${log.reps ?? ""},${log.sets ?? ""}`;
    case "TREADMILL":
      return `${date},${log.time ?? ""},${log.steps ?? ""},${log.distance ?? ""}`;
    case "CYCLING":
      return `${date},${log.time ?? ""},${log.distance ?? ""}`;
    default:
      return date;
  }
}
