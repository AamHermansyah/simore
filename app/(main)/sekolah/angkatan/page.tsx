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
import { Ellipsis, Plus, Users } from "lucide-react";
import SearchInput from "@/components/shared/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * ================================================
 * SiMoRE — "/school/classes" (CRUD Kelas)
 * ================================================
 * Desain-only; mengikuti struktur TeachersPage (header, toolbar, table, alert-dialog add)
 * Brand: primary #fae27c, secondary #c5eaf8
 */

export default function ClassesPage() {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Kelola Kelas</h1>
        <p className="text-sm text-muted-foreground">
          Tambah, ubah, dan kelola informasi kelas serta wali kelas.
        </p>
      </div>

      {/* Toolbar */}
      <div className="w-full flex items-center justify-between gap-4">
        <SearchInput placeholder="Cari nama kelas atau wali kelas..." />
        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="h-4 w-4" /> Tambah Angkatan
        </Button>
      </div>

      {/* Tabel Kelas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Angkatan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Angkatan</TableHead>
                <TableHead>Guru Pengelola</TableHead>
                <TableHead>Jumlah Siswi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Row 1 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium">2022/2023</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-3.5 w-3.5" /> Dwi Hartati, S.Pd
                  </div>
                </TableCell>
                <TableCell>36</TableCell>
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
                  <div className="font-medium">2022/2023</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-3.5 w-3.5" /> Suryana, M.Pd
                  </div>
                </TableCell>
                <TableCell>33</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-200 text-slate-800">Nonaktif</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RowActions />
                </TableCell>
              </TableRow>

              {/* Row 3 */}
              <TableRow>
                <TableCell>
                  <div className="font-medium">2022/2023</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-3.5 w-3.5" /> Tuti Rahayu, S.Pd
                  </div>
                </TableCell>
                <TableCell>34</TableCell>
                <TableCell>
                  <Badge>Aktif</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RowActions />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Dialog: Tambah Angkatan */}
      <AlertDialog open={openAdd} onOpenChange={setOpenAdd}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Tambah Angkatan</AlertDialogTitle>
            <AlertDialogDescription>Isi data angkatan untuk keperluan administrasi dan monitoring.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="className">Nama Angkatan</Label>
              <Input id="className" placeholder="cth. 2022/2023" />
            </div>
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="homeroom">Guru Pengelola</Label>
              <Select>
                <SelectTrigger id="homeroom" className="w-full">
                  <SelectValue placeholder="Pilih pengelola" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dwi-hartati">Dwi Hartati, S.Pd</SelectItem>
                  <SelectItem value="agus-santoso">Agus Santoso, M.Pd</SelectItem>
                  <SelectItem value="siti-rahma">Siti Rahma, S.Pd</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 grid gap-2">
              <Label>Status</Label>
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2"><Input type="radio" name="status" defaultChecked className="h-4 w-4" /> Aktif</label>
                <label className="inline-flex items-center gap-2"><Input type="radio" name="status" className="h-4 w-4" /> Nonaktif</label>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            {/* Desain-only: tidak ada logika submit */}
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
        <DropdownMenuItem>Detail kelas</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Kelola anggota</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-600">Hapus</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
