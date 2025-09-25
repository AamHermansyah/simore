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

export const profileSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  nomorTelepon: z
    .string()
    .regex(/^[0-9+\-()\s]*$/, "Nomor telepon tidak valid")
    .optional()
    .or(z.literal("")),
  website: z
    .url("Website tidak valid")
    .optional()
    .or(z.literal("")),
  alamat: z.string().optional().or(z.literal("")),
  wilayahKerja: z.string().optional().or(z.literal("")),
  namaKepalaPuskesmas: z.string().optional().or(z.literal("")),
  nip: z
    .string()
    .regex(/^\d+$/, "NIP hanya boleh angka")
    .optional()
    .or(z.literal("")),
  nomorTeleponKepalaPuskesmas: z
    .string()
    .regex(/^[0-9+\-()\s]*$/, "Nomor telepon tidak valid")
    .optional()
    .or(z.literal("")),
  tahunLulus: z
    .string()
    .regex(/^(19[9][0-9]|20[0-9]{2}|2100)$/, "Tahun lulus harus mulai dari 1990 ke atas")
    .optional()
    .or(z.literal("")),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

