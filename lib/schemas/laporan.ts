import z from "zod";

const dynamicImageSchema = ({
  requiredMessage,
  sizeMessage,
  optional
}: {
  requiredMessage: string;
  sizeMessage: string;
  optional?: boolean;
}) => {
  return z
    .custom<FileList[0] | undefined | null | string>()
    .refine((file) => (!file && optional) || file, {
      message: requiredMessage,
    })
    .refine((file) => (!file && optional) || (file && (
      typeof file === 'string' || (!!file && file.size <= 4 * 1024 * 1024)
    )), {
      message: sizeMessage,
    })
    .refine((file) => (!file && optional) || (file && (
      typeof file === 'string' || !!file && file.type?.startsWith("image"))
    ), {
      message: "Hanya gambar yang diizinkan.",
    })
}

export const addLaporanSchema = z.object({
  foto: dynamicImageSchema({
    requiredMessage: 'Gambar wajib diupload',
    sizeMessage: 'Gambar detail maksimal 4MB',
    optional: false
  }),
  keluhan: z.string().optional(),
})

export type AddLaporanSchema = z.infer<typeof addLaporanSchema>