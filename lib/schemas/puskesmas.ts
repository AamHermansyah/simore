import { z } from "zod"

export const addPuskesmasSchema = z.object({
  type: z.enum(['add', 'edit']),
  nama: z.string().min(3, "Nama puskesmas minimal 3 karakter"),
  email: z.email("Format email tidak valid"),
  sekolahIds: z.array(z.uuid()).min(1, "Pilih minimal satu sekolah"),
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

export type AddPuskesmasFormValues = z.infer<typeof addPuskesmasSchema>
