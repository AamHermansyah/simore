"use client"

import { useCallback, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Angkatan, Laporan, Siswi } from "@/lib/generated/prisma"
import { updateStatusLaporan } from "@/actions/laporan"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"

type LaporanData = Laporan & {
  siswi: Pick<Siswi, 'id' | 'nama' | 'nisn'> & {
    angkatan: Angkatan | null;
  }
}

interface IProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  type: "approve" | "decline" | "edit-note";
  selectedLaporan: LaporanData | null;
  onSuccess: (data: LaporanData) => void;
}

// Schema dinamis sesuai type
const schema = (type: IProps["type"]) =>
  z.object({
    note:
      type === "edit-note"
        ? z.string().min(10, "Catatan minimal 10 karakter")
        : z.string().optional(),
  })

function LaporanUpdateDialog({ onOpenChange, open, type, onSuccess, selectedLaporan }: IProps) {
  const [loading, startServer] = useTransition();

  const title = useCallback(() => {
    switch (type) {
      case "approve":
        return "Verifikasi Laporan"
      case "decline":
        return "Tolak Laporan"
      case "edit-note":
        return "Beri Catatan"
    }
  }, [type])

  const form = useForm<z.infer<ReturnType<typeof schema>>>({
    resolver: zodResolver(schema(type)),
    defaultValues: {
      note: "",
    },
  })

  const onSubmit = (data: z.infer<ReturnType<typeof schema>>) => {
    if (selectedLaporan) {
      startServer(async () => {
        const res = await updateStatusLaporan({
          id: selectedLaporan.id,
          type,
          note: data.note
        });

        if (!res.success) toast.error(res.message);
        else {
          toast.success(res.message);
          onSuccess({
            ...selectedLaporan,
            status: type === 'approve' ? 'DIVERIFIKASI' : type === 'decline' ? 'DITOLAK' : selectedLaporan.status,
            catatanGuru: data.note || ''
          });
          onOpenChange(false);
        }
      })
    }
  }

  useEffect(() => {
    if ((type === 'edit-note') && selectedLaporan) {
      form.setValue('note', selectedLaporan.catatanGuru || '');
    }
  }, [type]);

  return (
    <AlertDialog open={open} onOpenChange={(open) => {
      if (!open) {
        setTimeout(() => {
          form.reset();
        }, 200);
      };
      onOpenChange(open);
    }}>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>{title()}</AlertDialogTitle>
              <AlertDialogDescription>
                {type !== "edit-note"
                  ? "Aksi ini tidak bisa dikembalikan dan bersifat permanen."
                  : "Berikan catatan kepada siswi dalam memonitoring laporan"}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-4">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan {type !== 'edit-note' && '(Opsional)'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tulis catatan di sini..."
                        className="resize-none h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel type="button" disabled={loading}>
                Cancel
              </AlertDialogCancel>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
                Konfirmasi
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LaporanUpdateDialog
