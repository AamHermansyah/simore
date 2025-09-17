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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  Mail,
  Phone,
  Plus,
  Building2,
  MapPin,
  LoaderCircle,
} from "lucide-react";
import SearchInput from "@/components/shared/search-input";
import { SekolahAddEditForm } from "../_components/sekolah-add-edit-form";
import { Sekolah } from "@/lib/generated/prisma";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { CancelTokenSource, isAxiosError } from "axios"
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";

export default function AdminSchoolsPage() {
  const [addEditDialog, setAddEditDialog] = useState(false);
  const [data, setData] = useState<Sekolah[]>([]);
  const [selectedSekolah, setSelectedSekolah] = useState<Sekolah | null>(null);
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
  const page = searchParams.get('page') || '1';
  const navigate = useRouter();
  const cancelTokenSource = useRef<CancelTokenSource | null>(null);

  const fetch = useCallback((keyword: string, page: string) => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel('Operation canceled due to new request.');
    }

    const source = axios.CancelToken.source();
    cancelTokenSource.current = source;

    setLoading(true);

    axios
      .get(`/api/sekolah`, {
        params: {
          q: keyword,
          limit: pagination.limit || 10,
          page: typeof page === 'string' && !isNaN(+page) ? +page : 1
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
    fetch(q, page);
  }, [q, page]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Kelola Akun Sekolah</h1>
        <p className="text-sm text-muted-foreground">
          Tambah, ubah, nonaktifkan, dan kelola admin sekolah.
        </p>
      </div>

      <div className="w-full flex items-center justify-between gap-4">
        <SearchInput
          defaultValue={q}
          placeholder="Cari nama sekolah atau NPSN"
          onChange={handleSearch}
        />
        <Button onClick={() => setAddEditDialog(true)}>
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Sekolah</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sekolah</TableHead>
                <TableHead>NPSN</TableHead>
                <TableHead>Wilayah</TableHead>
                <TableHead>Kontak</TableHead>
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
                        {q.length > 0 ? "Data tidak ditemukan" : "Belum ada data sekolah"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((sekolah) => (
                      <TableRow key={sekolah.id}>
                        <TableCell>
                          <div className="font-medium inline-flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> {sekolah.nama}
                          </div>
                        </TableCell>
                        <TableCell>{sekolah.nspn}</TableCell>
                        <TableCell>
                          <div className="text-sm inline-flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" /> {sekolah.wilayah || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" /> {sekolah.email}
                            </span>
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" /> {sekolah.nomorTeleponSekolah || '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sekolah.status ? 'default' : 'outline'}>
                            {sekolah.status ? 'Aktif' : 'Nonaktif'}
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
                                  setSelectedSekolah(sekolah);
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

      <SekolahAddEditForm
        open={addEditDialog}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              setSelectedSekolah(null);
              setTypeAction('add');
            }, 200);
          };
          setAddEditDialog(open);
        }}
        type={typeAction}
        selectedSekolah={selectedSekolah}
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
  );
}
