import { PrismaClient } from "@generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const emails: string[] = await req.json();
  const results = await Promise.all(
    emails.map((email) =>
      prisma.emails.create({
        data: { email },
      })
    )
  );
  return NextResponse.json({ success: true, data: results });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "1");

  const skip = (page - 1) * limit;

  const results = await prisma.emails.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalCount = await prisma.emails.count();

  return NextResponse.json({ data: results, total: totalCount, page, limit });
}
