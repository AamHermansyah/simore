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
  Ellipsis,
  Mail,
  Phone,
  Plus,
  MapPin,
  Users2,
  Hospital,
} from "lucide-react";
import SearchInput from "@/components/shared/search-input";
import { PasswordInput } from "@/components/core/password-input";
import MultipleSelector, { Option } from "@/components/ui/multiselect";

const sekolahOptions: Option[] = [
  {
    value: "sman1",
    label: "SMA Negeri 1 Garut",
  },
  {
    value: "sman2",
    label: "SMA Negeri 2 Garut",
  },
  {
    value: "sman3",
    label: "SMA Negeri 3 Garut",
  },
  {
    value: "sman21",
    label: "SMAN 21 Garut",
  },
  {
    value: "smp5",
    label: "SMP Negeri 5 Garut",
  },
]

export default function AdminPhcPage() {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header minimal */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Kelola Akun Puskesmas</h1>
        <p className="text-sm text-muted-foreground">
          Tambah, ubah, nonaktifkan, dan kelola admin puskesmas untuk akses monitoring SiMoRE.
        </p>
      </div>

      {/* Toolbar */}
      <div className="w-full flex items-center justify-between gap-4">
        <SearchInput placeholder="Cari nama puskesmas / kode / daerah..." />
        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </div>

      {/* Tabel Puskesmas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Puskesmas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Puskesmas</TableHead>
                <TableHead>Wilayah</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Sekolah Dibina</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Row 1 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium inline-flex items-center gap-2"><Hospital className="h-4 w-4" /> Puskesmas Cempaka Putih</div>
                </TableCell>
                <TableCell className="text-sm inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Jakarta Pusat, DKI Jakarta</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> admin@pkm-cempakaputih.go.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 021-xxxxxxx</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm inline-flex items-center gap-2"><Users2 className="h-4 w-4" /> 3</TableCell>
                <TableCell>
                  <Badge>Aktif</Badge>
                </TableCell>
                <TableCell className="text-right"><RowActions /></TableCell>
              </TableRow>

              {/* Row 2 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium inline-flex items-center gap-2"><Hospital className="h-4 w-4" /> Puskesmas Sukasari</div>
                </TableCell>
                <TableCell className="text-sm inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Bandung, Jawa Barat</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> admin@pkm-sukasari.go.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 022-xxxxxxx</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm inline-flex items-center gap-2"><Users2 className="h-4 w-4" /> 2</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-200 text-slate-800">Nonaktif</Badge>
                </TableCell>
                <TableCell className="text-right"><RowActions /></TableCell>
              </TableRow>

              {/* Row 3 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium inline-flex items-center gap-2"><Hospital className="h-4 w-4" /> Puskesmas Ciputat</div>
                </TableCell>
                <TableCell className="text-sm inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Tangerang Selatan, Banten</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> admin@pkm-ciputat.go.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 021-xxxxxxx</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm inline-flex items-center gap-2"><Users2 className="h-4 w-4" /> 4</TableCell>
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
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Tambah Akun Puskesmas</AlertDialogTitle>
            <AlertDialogDescription>Isi data institusi dan kontak utama admin puskesmas.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phcName">Nama Puskesmas</Label>
              <Input id="phcName" placeholder="cth. Puskesmas Cempaka Putih" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Admin</Label>
              <Input id="email" type="email" placeholder="admin@puskesmas.go.id" />
            </div>
            <div className="grid gap-2">
              <Label>Akses Sekolah</Label>
              <MultipleSelector
                commandProps={{
                  label: "Pilih sekolah",
                }}
                value={[]}
                defaultOptions={sekolahOptions}
                placeholder="Pilih sekolah..."
                hideClearAllButton
                emptyIndicator={<p className="text-center text-sm">Tidak ada sekolah ditemukan</p>}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" placeholder="Masukan password" />
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
        <DropdownMenuItem>Kelola admin puskesmas</DropdownMenuItem>
        <DropdownMenuItem>Kelola sekolah binaan</DropdownMenuItem>
        <DropdownMenuItem>Reset password akun</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-600">Nonaktifkan</DropdownMenuItem>
        <DropdownMenuItem className="text-rose-600">Hapus</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
