'use client'

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ellipsis,
  LoaderCircle,
  Mail,
  Phone,
  Plus,
} from "lucide-react";
import SearchInput from "@/components/shared/search-input";
import { toast } from "sonner";
import axios, { CancelTokenSource, isAxiosError } from "axios";
import { Angkatan, Siswi } from "@/lib/generated/prisma";
import { useRouter, useSearchParams } from "next/navigation";
import { SiswiAddEditForm } from "../_components/siswa-add-edit-form";
import { Pagination } from "@/components/ui/pagination";

type SiswiData = Siswi & {
  angkatan: Angkatan | null;
  _count: { laporan: number };
}

interface IProps {
  angkatanId: string;
  sekolahId: string;
}

function SiswiLayout({ angkatanId, sekolahId }: IProps) {
  const [addEditDialog, setAddEditDialog] = useState(false);
  const [data, setData] = useState<SiswiData[]>([]);
  const [selectedSiswi, setSelectedSiswi] = useState<SiswiData | null>(null);
  const [typeAction, setTypeAction] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 0,
    limit: 10,
    totalPages: 0,
  });

  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status');
  const page = searchParams.get('page') || '1';
  const navigate = useRouter();
  const cancelTokenSource = useRef<CancelTokenSource | null>(null);

  const fetch = useCallback((
    keyword: string,
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
      .get(`/api/angkatan/siswi/${angkatanId}`, {
        params: {
          q: keyword,
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

  const handleSearch = (value: string) => {
    value = value.trim();
    if (q !== value) {
      navigate.replace(`?q=${value}`);
    }
  }

  useEffect(() => {
    fetch(q, page, status);
  }, [q, page, status]);

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
        <Button onClick={() => setAddEditDialog(true)} className="self-end">
          <Plus className="h-4 w-4" /> Tambah
        </Button>
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
                <TableHead className="text-right">Aksi</TableHead>
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
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Ellipsis className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Lihat profil</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setTypeAction('edit');
                                  setSelectedSiswi(siswi);
                                  setAddEditDialog(true);
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Nonaktifkan
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

          {pagination.totalPages > 1 && (
            <div className="w-full flex justify-end pt-4">
              <Pagination
                className="w-max mx-0"
                page={pagination.page}
                pages={pagination.totalPages}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <SiswiAddEditForm
        sekolahId={sekolahId}
        angkatanId={angkatanId}
        open={addEditDialog}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              setSelectedSiswi(null);
              setTypeAction('add');
            }, 200);
          };
          setAddEditDialog(open);
        }}
        type={typeAction}
        selectedSiswi={selectedSiswi}
        onAddSuccess={(item) => {
          if (!page || (page === '1')) setData((prev) => [item, ...prev]);
          else navigate.push('?page=1');
        }}
        onEditSuccess={(data) => {
          setData((prev) => {
            return prev.map((item) => item.id === data.id ? data : item)
          });
        }}
      />
    </div>
  )
}

export default SiswiLayout