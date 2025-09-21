import { z } from "zod"

const currentYear = new Date().getFullYear()

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

export const profileSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nip: z.string().min(5, "NIP minimal 5 karakter"),
  email: z.email("Email tidak valid"),
  nomorTelepon: z.string().optional(),
  alamat: z.string().optional(),
  posisi: z.string().optional(),
  pendidikanTerakhir: z.string().optional(),
  universitas: z.string().optional(),
  tahunLulus: z
    .string()
    .regex(/^\d{4}$/, "Tahun lulus harus berupa 4 digit angka")
    .refine(
      (val) => {
        const year = Number(val)
        return year >= 1990 && year <= currentYear
      },
      { message: `Tahun lulus minimal 1990 dan maksimal ${currentYear}` }
    )
    .optional()
    .or(z.literal("")),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
