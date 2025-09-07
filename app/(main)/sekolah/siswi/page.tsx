"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ellipsis,
  Mail,
  Phone,
  Plus,
} from "lucide-react";
import SearchInput from "@/components/shared/search-input";

export default function StudentsPage() {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col justify-between gap-3 lg:mb-6 lg:flex-row lg:items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Kelola Siswa</h1>
          <p className="text-sm text-muted-foreground">
            Tambah, ubah, pindahkan kelas, dan kelola status akun siswa.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AlertDialog open={openAdd} onOpenChange={setOpenAdd}>
            <AlertDialogContent className="sm:max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Tambah Akun Siswa</AlertDialogTitle>
                <AlertDialogDescription>Isi data dasar siswa. Undangan bisa dikirim via Email/WA.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" placeholder="cth. Aulia Nur Rahma" />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="nisn">NISN</Label>
                  <Input id="nisn" placeholder="cth. 006xxxxxxx" />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label>Kelas</Label>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <label className="inline-flex items-center gap-2"><Input type="radio" name="kelas" className="h-4 w-4" defaultChecked /> XI IPA 1</label>
                    <label className="inline-flex items-center gap-2"><Input type="radio" name="kelas" className="h-4 w-4" /> XI IPA 2</label>
                    <label className="inline-flex items-center gap-2"><Input type="radio" name="kelas" className="h-4 w-4" /> XI IPS 1</label>
                  </div>
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="phone">No. WA</Label>
                  <Input id="phone" type="tel" placeholder="08xxxxxxxxxx" />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="email">Email (opsional)</Label>
                  <Input id="email" type="email" placeholder="siswa@sch.id" />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction>Tambah</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Filter bar */}
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <SearchInput placeholder="Cari nama atau NISN" />
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              <SelectItem value="xi-ipa-1">XI IPA 1</SelectItem>
              <SelectItem value="xi-ipa-2">XI IPA 2</SelectItem>
              <SelectItem value="xi-ips-1">XI IPS 1</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="status-all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status-all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="h-4 w-4" /> Tambah Siswa
        </Button>
      </div>

      {/* Tabel Siswa */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Terakhir Lapor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Row 1 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium">Aulia Nur Rahma</div>
                  <div className="text-xs text-slate-600">NISN 0061234567 • NIS 22.10.001</div>
                </TableCell>
                <TableCell>
                  <Badge>XI IPA 1</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> aulia@sch.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 0812-0000-1234</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">2025-09-06 07:05</TableCell>
                <TableCell>
                  <Badge variant="secondary">Aktif</Badge>
                </TableCell>
                <TableCell className="text-right"><RowActions /></TableCell>
              </TableRow>

              {/* Row 2 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium">Della Pratiwi</div>
                  <div className="text-xs text-slate-600">NISN 0067654321 • NIS 22.10.045</div>
                </TableCell>
                <TableCell>
                  <Badge>XI IPA 2</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> della@sch.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 0813-3333-2222</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">2025-08-29 06:58</TableCell>
                <TableCell>
                  <Badge variant="outline">Nonaktif</Badge>
                </TableCell>
                <TableCell className="text-right"><RowActions /></TableCell>
              </TableRow>

              {/* Row 3 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium">Rani Saputri</div>
                  <div className="text-xs text-slate-600">NISN 0061122334 • NIS 22.10.087</div>
                </TableCell>
                <TableCell>
                  <Badge>XI IPS 1</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 0812-7777-4444</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">2025-08-14 07:02</TableCell>
                <TableCell>
                  <Badge variant="secondary">Aktif</Badge>
                </TableCell>
                <TableCell className="text-right"><RowActions /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function RowActions() {
  return (
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
        <DropdownMenuItem>Riwayat laporan</DropdownMenuItem>
        <DropdownMenuItem>Pindahkan kelas</DropdownMenuItem>
        <DropdownMenuItem>Reset password</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-600">Nonaktifkan</DropdownMenuItem>
        <DropdownMenuItem className="text-rose-600">Hapus</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
