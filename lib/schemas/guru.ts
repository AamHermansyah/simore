import { z } from "zod"

export const addGuruSchema = z.object({
  type: z.enum(['add', 'edit']),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nip: z.string().min(6, "NIP minimal 6 karakter"),
  email: z.email("Format email tidak valid"),
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

export type AddGuruFormValues = z.infer<typeof addGuruSchema>
