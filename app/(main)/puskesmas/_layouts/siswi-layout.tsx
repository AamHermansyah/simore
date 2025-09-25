"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  LoaderCircle,
  Mail,
  Phone,
} from "lucide-react";
import SearchInput from "@/components/shared/search-input";
import { toast } from "sonner";
import axios, { CancelTokenSource, isAxiosError } from "axios";
import { Angkatan, Guru, Siswi } from "@/lib/generated/prisma";
import { useRouter, useSearchParams } from "next/navigation";

type SiswiData = Siswi & {
  angkatan: Angkatan | null;
  _count: { laporan: number };
}

interface IProps {
  sekolahId: string;
  angkatanData: (Pick<Angkatan, 'id' | 'nama' | 'createdAt' | 'status'> & {
    guru: Pick<Guru, 'id' | 'nama'> | null;
    totalSiswi: number;
    totalSiswiAktif: number;
    kepatuhan: number;
  })[]
}

export default function SiswiLayout({ sekolahId, angkatanData }: IProps) {
  const [data, setData] = useState<SiswiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 0,
    limit: 10,
    totalPages: 0,
  });

  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const angkatanId = searchParams.get('angkatanId');
  const status = searchParams.get('status');
  const page = searchParams.get('page') || '1';
  const navigate = useRouter();
  const cancelTokenSource = useRef<CancelTokenSource | null>(null);

  const fetch = useCallback((
    keyword: string,
    page: string,
    angkatanId: string | null,
    status: string | null
  ) => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel('Operation canceled due to new request.');
    }

    const source = axios.CancelToken.source();
    cancelTokenSource.current = source;

    setLoading(true);

    axios
      .get(`/api/siswi/${sekolahId}`, {
        params: {
          q: keyword,
          limit: pagination.limit || 10,
          page: typeof page === 'string' && !isNaN(+page) ? +page : 1,
          angkatanId,
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

  const handleSearch = (value: string) => {
    value = value.trim();
    if (q !== value) {
      navigate.replace(`?q=${value}`);
    }
  }

  useEffect(() => {
    fetch(q, page, angkatanId, status);
  }, [q, page, angkatanId, status]);

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col justify-between gap-3 lg:mb-6 lg:flex-row lg:items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Kelola Siswa</h1>
          <p className="text-sm text-muted-foreground">
            Tambah, ubah, pindahkan kelas, dan kelola status akun siswa.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
          <SearchInput
            defaultValue={q}
            onChange={handleSearch}
            placeholder="Cari nama atau NISN"
            className="w-full sm:w-auto max-w-none"
          />
          <Select
            defaultValue={angkatanId || 'all'}
            onValueChange={(value) => {
              const params = new URLSearchParams(searchParams.toString())
              if (value === "all") {
                params.delete("angkatanId")
              } else {
                params.set("angkatanId", value)
              }

              navigate.replace(`?${params.toString()}`)
            }}
          >
            <SelectTrigger className="w-full sm:w-42">
              <SelectValue placeholder="Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Angkatan</SelectItem>
              {angkatanData.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <SelectItem value="1">Aktif</SelectItem>
              <SelectItem value="0">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabel Siswa */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Siswi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswi</TableHead>
                <TableHead>Angkatan</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Total Laporan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading ? (
                <>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {q.length > 0 ? "Data tidak ditemukan" : "Belum ada data siswi"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((siswi) => (
                      <TableRow key={siswi.id}>
                        <TableCell>
                          <div className="font-medium">{siswi.nama}</div>
                          <div className="text-xs text-muted-foreground">NISN {siswi.nisn}</div>
                        </TableCell>
                        <TableCell>
                          <Badge>{siswi.angkatan?.nama || '-'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" /> {siswi.email || '-'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" /> {siswi.nomorTelepon}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {siswi._count.laporan}
                        </TableCell>
                        <TableCell>
                          <Badge variant={siswi.status ? 'default' : 'outline'}>
                            {siswi.status ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
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