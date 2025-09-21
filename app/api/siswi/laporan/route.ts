import { paginationSchema } from "@/lib/schemas/pagination"
import { JwtPayload, verifyJwt } from "@/lib/auth"
import { NextResponse } from "next/server"
import z from "zod"
import { cookies } from "next/headers"
import { getAllLaporan } from "@/data/laporan"
import { StatusLaporan } from "@/lib/generated/prisma"

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  try {
    const c = await cookies();
    const token = c.get('token')?.value || null;

    const decoded = verifyJwt(token || '') as JwtPayload | null;
    if (!decoded || decoded.role !== "SISWI") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const parsed = z.object({
      ...paginationSchema,
      status: z.enum(Object.values(StatusLaporan)).optional()
    }).safeParse(searchParams);

    if (!parsed.success) {
      const tree = z.treeifyError(parsed.error);
      return NextResponse.json(
        { error: "Invalid query", details: tree.errors.join(", ") },
        { status: 400 }
      )
    }

    const { page, limit, status } = parsed.data;

    const res = await getAllLaporan({ page, limit, siswiId: decoded.id, status });
    if (!res.success) {
      return new NextResponse(res.message, { status: 500 });
    }

    return NextResponse.json(res.data!, { status: 200 });
  } catch (error) {
    console.error("ERROR GET ALL LAPORAN API: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
