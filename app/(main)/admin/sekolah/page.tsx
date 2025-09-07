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
  AlertDialogTrigger,
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
  Building2,
  MapPin,
} from "lucide-react";
import SearchInput from "@/components/shared/search-input";

/**
 * ================================================
 * SiMoRE — "/admin/schools" (CRUD Akun Sekolah — Super Admin)
 * ================================================
 * Desain-only; desktop-first; **disesuaikan dengan contoh** (header minimal, toolbar SearchInput + tombol Tambah,
 * table di dalam Card, status badge: Aktif (default), Nonaktif (secondary/abu-abu)).
 * Komponen: shadcn/ui + Tailwind + TS. Tambah Sekolah via AlertDialog.
 */

export default function AdminSchoolsPage() {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header minimal (sesuai contoh) */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Kelola Akun Sekolah</h1>
        <p className="text-sm text-muted-foreground">
          Tambah, ubah, nonaktifkan, dan kelola admin sekolah.
        </p>
      </div>

      {/* Toolbar: SearchInput + Tambah (tanpa filter kompleks) */}
      <div className="w-full flex items-center justify-between gap-4">
        <SearchInput placeholder="Cari nama sekolah / NPSN / daerah..." />
        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="h-4 w-4" /> Tambah Sekolah
        </Button>
      </div>

      {/* Tabel Sekolah (di dalam Card, sesuai pola contoh) */}
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
              {/* Row 1 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium inline-flex items-center gap-2"><Building2 className="h-4 w-4" /> SMA Negeri 3 Tasikmalaya</div>
                </TableCell>
                <TableCell>20231234</TableCell>
                <TableCell className="text-sm inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Tasikmalaya, Jawa Barat</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> admin@sman3.sch.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 0265-xxxxxxx</span>
                  </div>
                </TableCell>
                <TableCell>
                  {/* Status badge: Aktif (default), Nonaktif (secondary gray) */}
                  <Badge>Aktif</Badge>
                </TableCell>
                <TableCell className="text-right"><RowActions /></TableCell>
              </TableRow>

              {/* Row 2 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium inline-flex items-center gap-2"><Building2 className="h-4 w-4" /> SMK Negeri 63 Jakarta</div>
                </TableCell>
                <TableCell>20194567</TableCell>
                <TableCell className="text-sm inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Jakarta Selatan, DKI Jakarta</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> admin@smkn63.sch.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 021-xxxxxxx</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-200 text-slate-800">Nonaktif</Badge>
                </TableCell>
                <TableCell className="text-right"><RowActions /></TableCell>
              </TableRow>

              {/* Row 3 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium inline-flex items-center gap-2"><Building2 className="h-4 w-4" /> SMA Negeri 1 Bandung</div>
                </TableCell>
                <TableCell>20181234</TableCell>
                <TableCell className="text-sm inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Bandung, Jawa Barat</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> admin@sman1.sch.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 022-xxxxxxx</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>Aktif</Badge>
                </TableCell>
                <TableCell className="text-right"><RowActions /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={openAdd} onOpenChange={setOpenAdd}>
        <AlertDialogTrigger asChild>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Tambah Akun Sekolah</AlertDialogTitle>
            <AlertDialogDescription>Isi data institusi dan kontak utama.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="schoolName">Nama Sekolah</Label>
              <Input id="schoolName" placeholder="cth. SMA Negeri 3 Tasikmalaya" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="npsn">NPSN</Label>
              <Input id="npsn" placeholder="cth. 2023xxxx" />
            </div>
            <div className="grid gap-2">
              <Label>Jenjang</Label>
              <Select defaultValue="sma">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sma">SMA</SelectItem>
                  <SelectItem value="smk">SMK</SelectItem>
                  <SelectItem value="ma">MA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Admin</Label>
              <Input id="email" type="email" placeholder="admin@sekolah.sch.id" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">No. WA Admin</Label>
              <Input id="phone" type="tel" placeholder="08xxxxxxxxxx" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            {/* Desain-only */}
            <AlertDialogAction>Tambah</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
        <DropdownMenuItem>Kelola admin sekolah</DropdownMenuItem>
        <DropdownMenuItem>Kelola integrasi WA</DropdownMenuItem>
        <DropdownMenuItem>Reset password akun</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-600">Nonaktifkan</DropdownMenuItem>
        <DropdownMenuItem className="text-rose-600">Hapus</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
