import { paginationSchema } from "@/lib/schemas/pagination"
import { JwtPayload, verifyJwt } from "@/lib/auth"
import { NextResponse } from "next/server"
import z from "zod"
import { cookies } from "next/headers"
import { getAllSiswi } from "@/data/siswi"
import prisma from "@/lib/prisma"

interface IParams {
  params: Promise<{ angkatanId: string }>
}

export async function GET(req: Request, { params }: IParams) {
  const url = new URL(req.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  const angkatanId = (await params).angkatanId;

  try {
    const c = await cookies();
    const token = c.get('token')?.value || null;

    const decoded = verifyJwt(token || '') as JwtPayload | null;
    if (!decoded || decoded.role !== "GURU") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const parsed = z.object({
      ...paginationSchema,
      status: z.enum(['1', '0']).optional()
    }).safeParse(searchParams);

    if (!parsed.success) {
      const tree = z.treeifyError(parsed.error);
      return NextResponse.json(
        { error: "Invalid query", details: tree.errors.join(", ") },
        { status: 400 }
      )
    }

    const guru = await prisma.guru.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        sekolahId: true
      }
    });

    if (!guru) {
      return NextResponse.json(
        { error: "Data guru tidak ditemukan" },
        { status: 404 }
      )
    }

    const { q = "", page, limit, status } = parsed.data;

    const res = await getAllSiswi({ q, page, limit, sekolahId: guru.sekolahId!, angkatanId, status });
    if (!res.success) {
      return new NextResponse(res.message, { status: 500 });
    }

    return NextResponse.json(res.data!, { status: 200 });
  } catch (error) {
    console.error("ERROR GET ALL SISWI API: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
