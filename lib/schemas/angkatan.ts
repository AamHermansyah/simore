import { z } from "zod"

export const addAngkatanSchema = z.object({
  type: z.enum(['add', 'edit']),
  nama: z.string().min(4, "Nama minimal 3 karakter"),
  guruId: z.string().min(1, "Guru pengurus wajib diisi"),
})

export type AddAngkatanFormValues = z.infer<typeof addAngkatanSchema>
