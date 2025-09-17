// schemas/sekolah-schema.ts
import * as z from "zod"
import { JenisJenjang } from "../generated/prisma"

export const addSekolahSchema = z.object({
  type: z.enum(['add', 'edit']),
  nama: z.string().min(3, "Nama sekolah minimal 3 karakter"),
  nspn: z.string().min(8, "NPSN minimal 8 digit"),
  jenjang: z.enum(Object.values(JenisJenjang), {
    error: "Pilih jenjang sekolah",
  }),
  email: z.email("Email tidak valid"),
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

export type AddSekolahFormValues = z.infer<typeof addSekolahSchema>

export const profileSchema = z.object({
  nama: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  nspn: z.string().min(8, "NPSN minimal 8 digit"),
  email: z.email('Format email tidak valid'),
  wilayah: z.string().optional(),
  nomorTeleponSekolah: z
    .string()
    .optional(),
  website: z
    .url('Format website tidak valid')
    .or(z.literal(''))
    .optional(),
  alamatLengkap: z.string().optional(),
  akreditasi: z.enum(['A', 'B', 'C'], 'Akreditasi harus diisi'),
  namaKepalaSekolah: z.string().optional(),
  nomorTeleponKepalaSekolah: z
    .string()
    .optional(),
  namaKoordinator: z.string().optional(),
  nomorTeleponKoordinator: z
    .string()
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
