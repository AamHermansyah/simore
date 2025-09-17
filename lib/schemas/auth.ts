import { z } from "zod"
import { roles } from "../constants"
import { Roles } from "../types";

// buat tuple type untuk z.enum
const roleEnum = z.enum(roles.map((r) => r.value) as Roles[], {
  error: 'Role tidak valid'
});

export const loginSchema = z
  .object({
    role: roleEnum,
    email: z.string().optional(), // optional dulu, validasi pakai superRefine
    phone: z.string().optional(),
    password: z.string().min(6, "Password minimal 6 karakter"),
  })
  .superRefine((data, ctx) => {
    if (data.role === "SISWI") {
      if (!data.phone || !/^(08)\d{8,14}$/.test(data.phone)) {
        ctx.addIssue({
          path: ["phone"],
          message: "Nomor HP wajib diisi & format tidak valid",
          code: "custom",
        })
      }
    } else {
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          path: ["email"],
          message: "Email wajib diisi & format tidak valid",
          code: "custom",
        })
      }
    }
  });

export type LoginSchemaValues = z.infer<typeof loginSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password saat ini minimal 6 karakter"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
