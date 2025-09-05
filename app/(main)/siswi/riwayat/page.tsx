import React from 'react'
import { RiMoreLine } from "@remixicon/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const activities = [
  { id: "rpt-004", date: "2025-09-01", time: "07:10", status: "Ditolak", note: "Foto tidak jelas" },
  { id: "rpt-003", date: "2025-08-29", time: "06:58", status: "Terkirim" },
  { id: "rpt-002", date: "2025-08-22", time: "07:05", status: "Diverifikasi" },
  { id: "rpt-001", date: "2025-08-15", time: "07:02", status: "Diverifikasi" },
];

function HistoryReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Laporan</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Tanggal</TableHead>
              <TableHead className="w-[100px]">Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Catatan Guru</TableHead>
              <TableHead>Keluhan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${item.status === "Diverifikasi"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.status === "Ditolak"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                      }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.note || "—"}</TableCell>
                <TableCell className="text-muted-foreground">-</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shadow-none text-muted-foreground"
                    aria-label="Edit item"
                  >
                    <RiMoreLine className="size-5" size={20} aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default HistoryReportsPage;