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
import { Ellipsis, Mail, Phone, UserPlus } from "lucide-react";
import SearchInput from "@/components/shared/search-input";

export default function TeachersPage() {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Kelola Akun Guru</h1>
        <p className="text-sm text-muted-foreground">
          Tambah, atur kelas, dan kelola akses akun guru pengurus.
        </p>
      </div>

      <div className="w-full flex items-center justify-between gap-4">
        <SearchInput placeholder="Cari nama atau email..." />
        <Button onClick={() => setOpenAdd(true)}>
          <UserPlus className="h-4 w-4" /> Tambah Guru
        </Button>
      </div>

      {/* Tabel Guru */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Guru Pengurus</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guru</TableHead>
                <TableHead>Kelas Diampu</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Terakhir Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Row 1 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium">Dwi Hartati, S.Pd</div>
                  <div className="text-xs text-slate-600">NIP 1987.07.12.2020.1.001</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 text-xs">
                    <Badge className="bg-[#fae27c] text-black">XI IPA 1</Badge>
                    <Badge className="bg-[#c5eaf8] text-slate-900">XI IPA 2</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> dwi.hartati@sch.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 0812-0000-1111</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">2025-09-05 07:42</TableCell>
                <TableCell>
                  <Badge>Aktif</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RowActions />
                </TableCell>
              </TableRow>

              {/* Row 2 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium">Suryana, M.Pd</div>
                  <div className="text-xs text-slate-600">NIP 1986.02.10.2019.1.014</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 text-xs">
                    <Badge>XI IPS 1</Badge>
                    <Badge>XI IPS 2</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-700"><Mail className="h-3.5 w-3.5" /> suryana@sch.id</span>
                    <span className="inline-flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" /> 0813-3333-2222</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">2025-09-06 06:55</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-200 text-slate-800">Nonaktif</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RowActions />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={openAdd} onOpenChange={setOpenAdd}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Tambah Akun Guru</AlertDialogTitle>
            <AlertDialogDescription>Isi data dasar guru untuk mengelola dan monitoring siswi per kelas.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" placeholder="cth. Dwi Hartati, S.Pd" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="guru@sekolah.sch.id" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">No. WA</Label>
              <Input id="phone" type="tel" placeholder="08xxxxxxxxxx" />
            </div>
            <div className="col-span-2 grid gap-2">
              <Label>Kelas Diampu</Label>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <label className="inline-flex items-center gap-2"><Input type="checkbox" className="h-4 w-4" /> XI IPA 1</label>
                <label className="inline-flex items-center gap-2"><Input type="checkbox" className="h-4 w-4" /> XI IPA 2</label>
                <label className="inline-flex items-center gap-2"><Input type="checkbox" className="h-4 w-4" /> XI IPA 3</label>
                <label className="inline-flex items-center gap-2"><Input type="checkbox" className="h-4 w-4" /> XI IPS 1</label>
                <label className="inline-flex items-center gap-2"><Input type="checkbox" className="h-4 w-4" /> XI IPS 2</label>
                <label className="inline-flex items-center gap-2"><Input type="checkbox" className="h-4 w-4" /> XII IPA 1</label>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
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
        <DropdownMenuItem>Edit profil</DropdownMenuItem>
        <DropdownMenuItem>Atur kelas diampu</DropdownMenuItem>
        <DropdownMenuItem>Reset password</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-600">Nonaktifkan</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
