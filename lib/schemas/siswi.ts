import { z } from "zod"

export const addSiswiSchema = z.object({
  type: z.enum(['add', 'edit']),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nisn: z.string().min(6, "NISN minimal 6 karakter"),
  angkatanId: z.string().min(1, "Angkatan harus diisi"),
  nomorTelepon: z.string()
    .regex(/^08\d{8,11}$/, "Nomor telepon tidak valid"),
  password: z.string().optional(),
})
  .superRefine((data, ctx) => {
    if (data.type === "add" && !data.password) {
      ctx.addIssue({
        path: ["password"],
        code: "custom",
        message: "Password wajib diisi",
      })
    }
    if (data.password && data.password.length < 6) {
      ctx.addIssue({
        path: ["password"],
        code: "custom",
        message: "Password minimal 6 karakter",
      })
    }
  })

export type AddSiswiFormValues = z.infer<typeof addSiswiSchema>
