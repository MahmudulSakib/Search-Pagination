import { PrismaClient, Prisma } from "@generated/prisma";
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
  const query = searchParams.get("query") || "";

  const skip = (page - 1) * limit;

  const whereClause = query
    ? { email: { contains: query, mode: Prisma.QueryMode.insensitive } }
    : {};

  const results = await prisma.emails.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalCount = await prisma.emails.count({ where: whereClause });

  return NextResponse.json({ data: results, total: totalCount, page, limit });
}
