"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import axios, { CancelTokenSource, isAxiosError } from "axios";
import { Angkatan, Laporan, Siswi, StatusLaporan } from "@/lib/generated/prisma";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ImageZoom } from "@/components/ui/kibo-ui/image-zoom";
import { cn, getStatusLaporanVariant } from "@/lib/utils";

type LaporanData = Laporan & {
  siswi: Pick<Siswi, 'id' | 'nama' | 'nisn'> & {
    angkatan: Angkatan | null;
  }
}

export default function SiswiRiwayatPage() {
  const [data, setData] = useState<LaporanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 0,
    limit: 10,
    totalPages: 0,
  });

  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const page = searchParams.get('page') || '1';
  const navigate = useRouter();
  const cancelTokenSource = useRef<CancelTokenSource | null>(null);

  const fetch = useCallback((
    page: string,
    status: string | null
  ) => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel('Operation canceled due to new request.');
    }

    const source = axios.CancelToken.source();
    cancelTokenSource.current = source;

    setLoading(true);

    axios
      .get('/api/siswi/laporan', {
        params: {
          limit: pagination.limit || 10,
          page: typeof page === 'string' && !isNaN(+page) ? +page : 1,
          status
        },
        cancelToken: source.token,
      })
      .then((res) => {
        const { items, ...pagination } = res.data
        setData(items);
        setPagination(pagination);
        setLoading(false)
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          setData([]);
          setLoading(false)
          if (isAxiosError(error)) {
            toast.error(JSON.stringify(error.response?.data) || error.message);
          } else {
            toast.error(error.message || 'Internal Error');
          }
        }
      });
  }, []);

  useEffect(() => {
    fetch(page, status);
  }, [page, status]);

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col justify-between gap-3 lg:mb-6 lg:flex-row lg:items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Riwayat Laporan</h1>
          <p className="text-sm text-muted-foreground">
            Informasi mengenai laporan yang telah anda unggah
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
          <Select
            defaultValue={status || 'all'}
            onValueChange={(value) => {
              const params = new URLSearchParams(searchParams.toString())
              if (value === "all") {
                params.delete("status")
              } else {
                params.set("status", value)
              }

              navigate.replace(`?${params.toString()}`)
            }}
          >
            <SelectTrigger className="w-full sm:w-38">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {Object.values(StatusLaporan).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabel Siswa */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead className="text-center">Bukti</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Keluhan</TableHead>
                <TableHead>Catatan Guru</TableHead>
                <TableHead>Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading ? (
                <>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Belum ada data riwayat laporan
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((laporan) => (
                      <TableRow key={laporan.id}>
                        <TableCell>
                          <div className="font-medium">{laporan.siswi.nama}</div>
                          <div className="text-xs text-muted-foreground">NISN {laporan.siswi.nisn}</div>
                        </TableCell>
                        <TableCell>
                          <ImageZoom
                            backdropClassName={cn(
                              '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                            )}
                          >
                            <div className="mx-auto w-[70px] aspect-[2/3] bg-muted rounded overflow-hidden">
                              <img
                                src={laporan.buktiGambar}
                                alt="bukti gambar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </ImageZoom>
                        </TableCell>
                        <TableCell>
                          {format(laporan.createdAt, "dd MMMM yyyy", { locale: id })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusLaporanVariant(laporan.status)}>
                            {laporan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px]">
                          {laporan.keluhan || 'Tidak ada'}
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px]">
                          <p className="whitespace-pre-wrap">
                            {laporan.catatanGuru || 'Tidak ada'}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px]">
                          {laporan.rewardPoint} Poin
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <LoaderCircle className="size-5 mx-auto animate-spin" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}