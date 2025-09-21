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
      message: z.treeifyError(parsed.error).errors.join(", "),
    };
  }

  try {
    // Cek apakah NIP atau Email sudah dipakai SuperAdmin lain
    const existing = await prisma.superAdmin.findFirst({
      where: {
        OR: [{ nip: data.nip }, { email: data.email }],
        NOT: { id: decoded.id }, // exclude SuperAdmin yang sedang login
      },
    });

    if (existing) {
      let message = '';
      if (existing.nip === data.nip) message += 'NIP sudah digunakan. ';
      if (existing.email === data.email) message += 'Email sudah digunakan.';
      return {
        success: false,
        message: message.trim(),
      };
    }

    // Update data SuperAdmin
    const updated = await prisma.superAdmin.update({
      where: { id: decoded.id },
      data,
    });

    return {
      success: true,
      data: updated,
    };
  } catch (err) {
    return {
      success: false,
      message: "Terjadi kesalahan server",
    };
  }
}
