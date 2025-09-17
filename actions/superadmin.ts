"use server";

import { JWT_SECRET, JwtPayload } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfileFormValues, profileSchema } from "@/lib/schemas/superadmin";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import z from "zod";

export async function editSuperAdmin(data: ProfileFormValues) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
  if (!decoded?.id) {
    throw new Error("Token tidak valid");
  }

  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: z.treeifyError(parsed.error).errors.join(', ')
    }
  }

  try {
    const updated = await prisma.superAdmin.update({
      where: { id: decoded.id },
      data,
    });

    return {
      success: true,
      data: updated
    };
  } catch (err) {
    return {
      success: false,
      message: "Terjadi kesalahan server"
    };
  }
}