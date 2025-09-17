import z from "zod";

export const profileSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  nip: z.string().min(1, "NIP wajib diisi"),
  email: z.email("Email tidak valid"),
  nomorTelepon: z.string().optional(),
  alamat: z.string().optional(),
  jabatan: z.string().optional(),
  instansi: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;