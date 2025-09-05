"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bell,
  Calendar,
  Camera,
  Check,
  CircleEllipsis,
  History,
  Pill,
  Star,
  Trophy,
} from "lucide-react";

/**
 * ================================================
 * SiMoRE — Halaman "/s" (Dashboard Siswi)
 * ================================================
 * Tek stack: Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, Recharts, Framer Motion
 * Catatan: Desain desktop-first lalu responsif.
 * Warna brand: primary #fae27c, secondary #c5eaf8
 * Komponen dibuat satu file agar mudah di-snapshot untuk UI/UX.
 * Logika hanya dummy (penambahan data lokal via useState, toast sederhana).
 */

// Brand helpers
const BRAND = {
  primary: "#fae27c",
  secondary: "#c5eaf8",
  primaryText: "#231f20",
};

// Dummy: data grafik mingguan (Minggu → Sabtu)
const weeklyData = [
  { day: "Min", value: 1 },
  { day: "Sen", value: 1 },
  { day: "Sel", value: 0 },
  { day: "Rab", value: 1 },
  { day: "Kam", value: 1 }, // TTD default Kamis
  { day: "Jum", value: 0 },
  { day: "Sab", value: 1 },
];

// Dummy: data grafik bulanan
const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  percent: Math.max(55, Math.min(100, 65 + Math.round((Math.sin(i / 3) + 1) * 15))),
}));

// Tipe untuk activity riwayat
interface ActivityItem {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: "Terkirim" | "Diverifikasi" | "Ditolak";
  note?: string;
}

export default function Page() {
  const [openReport, setOpenReport] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: "rpt-004", date: "2025-09-01", time: "07:10", status: "Diverifikasi", note: "Foto jelas" },
    { id: "rpt-003", date: "2025-08-29", time: "06:58", status: "Terkirim", note: "Menunggu verifikasi" },
    { id: "rpt-002", date: "2025-08-22", time: "07:05", status: "Diverifikasi" },
    { id: "rpt-001", date: "2025-08-15", time: "07:02", status: "Diverifikasi" },
  ]);
  const [toast, setToast] = useState<{ show: boolean; title: string; desc?: string } | null>(null);

  const monthProgress = useMemo(() => {
    // Kalkulasi sederhana: persentase dari activity Diverifikasi dalam 30 hari dummy
    const verified = activities.filter((a) => a.status === "Diverifikasi").length;
    return Math.min(100, Math.round((verified / 12) * 100));
  }, [activities]);

  function addReport(formData: FormData) {
    // Dummy submit handler
    const date = new Date();
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    const hh = `${date.getHours()}`.padStart(2, "0");
    const mm = `${date.getMinutes()}`.padStart(2, "0");

    const consumed = formData.get("consumed") === "on";
    const note = String(formData.get("note") || "").trim();
    const nextId = `rpt-${(activities.length + 1).toString().padStart(3, "0")}`;

    if (!consumed) {
      setToast({ show: true, title: "Centang konfirmasi konsumsi TTD terlebih dahulu." });
      return;
    }

    setActivities((prev) => [
      { id: nextId, date: `${y}-${m}-${d}`, time: `${hh}:${mm}`, status: "Terkirim", note },
      ...prev,
    ]);
    setOpenReport(false);
    setFileName("");
    setToast({ show: true, title: "Laporan terkirim", desc: "Menunggu verifikasi sekolah." });
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50">
      {/* Banner brand */}
      <div
        className="w-full"
        style={{
          background: `linear-gradient(90deg, ${BRAND.primary} 0%, ${BRAND.secondary} 60%, white 100%)`,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Halo 👋, selamat datang di <span className="font-bold">SiMoRE</span>
              </h1>
              <p className="mt-2 max-w-2xl text-slate-700">
                Pantau konsumsi Tablet Tambah Darah (TTD), raih medali, dan jaga kesehatanmu — satu
                dashboard untuk semuanya.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="h-10 rounded-xl border border-black/10 bg-black/80 px-5 text-white hover:bg-black"
                onClick={() => setOpenReport(true)}
              >
                <Pill className="mr-2 h-5 w-5" /> Laporkan Sekarang
              </Button>
              <Button variant="outline" className="h-10 rounded-xl border-black/10 bg-white/60 backdrop-blur">
                <History className="mr-2 h-5 w-5" /> Riwayat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Konten utama */}
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 p-6">
        {/* Kartu ringkas */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          <Card className="col-span-12 lg:col-span-4 shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Progres Bulan Ini</span>
                <Badge className="bg-black/80 text-white">Sept 2025</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold" style={{ color: BRAND.primaryText }}>
                  {monthProgress}%
                </div>
                <div className="flex-1">
                  <Progress value={monthProgress} className="h-2 bg-slate-200" />
                  <div className="mt-2 text-xs text-slate-600">
                    Target kepatuhan ≥ 80% per bulan
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-4 shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Streak</span>
                <Trophy className="h-5 w-5 text-amber-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#fae27c] px-4 py-2 font-semibold text-black shadow-sm">
                  3 hari 🔥
                </div>
                <div className="text-sm text-slate-600">Pertahankan untuk bonus medali</div>
              </div>
              <div className="mt-3 flex gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-full rounded ${i < 3 ? "bg-[#fae27c]" : "bg-slate-200"}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-4 shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Jadwal TTD</span>
                <Calendar className="h-5 w-5 text-sky-700" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">Kamis (default)</div>
                  <div className="text-slate-600">Pukul 07.00—09.00 WIB</div>
                </div>
                <Badge variant="secondary" className="bg-[#c5eaf8] text-slate-900">
                  Pengingat aktif
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grafik */}
        <Card className="col-span-12 lg:col-span-7 shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kepatuhan Mingguan</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 1]} ticks={[0, 1]} width={24} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill={BRAND.primary} />
                <Line type="monotone" dataKey="value" stroke={BRAND.secondary} strokeWidth={2} dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-5 shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kepatuhan Bulanan</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ left: 4, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tickFormatter={(v) => `${v}%`} width={36} />
                <Tooltip formatter={(v: number) => `${v}%`} cursor={{ stroke: "#e2e8f0" }} />
                <Line type="monotone" dataKey="percent" stroke="#111827" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabs aktivitas & medali */}
        <Card className="col-span-12 shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Aktivitas & Pencapaian</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity">Aktivitas Terbaru</TabsTrigger>
                <TabsTrigger value="badges">Medali</TabsTrigger>
                <TabsTrigger value="reminders">Pengingat</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-4">
                <Table>
                  <TableCaption>Riwayat laporan konsumsi TTD.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px]">Tanggal</TableHead>
                      <TableHead className="w-[100px]">Waktu</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Catatan</TableHead>
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
                        <TableCell className="text-slate-600">{item.note || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                            <CircleEllipsis className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="badges" className="mt-4">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <BadgeCard
                    title="Starter"
                    desc="Laporan pertama"
                    icon={<Star className="h-5 w-5" />}
                    color="#f3f4f6"
                  />
                  <BadgeCard
                    title="Konsisten"
                    desc="7 hari beruntun"
                    icon={<Trophy className="h-5 w-5" />}
                    color="#fae27c"
                  />
                  <BadgeCard
                    title="Rutin"
                    desc="4x dalam sebulan"
                    icon={<Check className="h-5 w-5" />}
                    color="#c5eaf8"
                  />
                  <BadgeCard
                    title="Rajin Foto"
                    desc="10x upload"
                    icon={<Camera className="h-5 w-5" />}
                    color="#fde68a"
                  />
                </div>
              </TabsContent>
              <TabsContent value="reminders" className="mt-4">
                <div className="space-y-3">
                  <ReminderItem
                    time="Setiap Kamis 07:00"
                    message="Saatnya minum TTD! Jangan lupa laporkan ya."
                  />
                  <ReminderItem
                    time="Setiap Sabtu 08:00"
                    message="Cek progres mingguanmu di SiMoRE."
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Laporan Baru */}
      <Dialog open={openReport} onOpenChange={setOpenReport}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Laporkan Konsumsi TTD</DialogTitle>
            <DialogDescription>Unggah bukti foto dan konfirmasi.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              addReport(formData);
            }}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photo">Foto bukti</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                />
                {fileName && (
                  <span className="text-xs text-slate-600">{fileName}</span>
                )}
              </div>
              <p className="text-xs text-slate-500">Format: JPG/PNG • Maks 5MB (dummy)</p>
            </div>
            <div className="flex items-center gap-2">
              <Input id="consumed" name="consumed" type="checkbox" className="h-4 w-4" />
              <Label htmlFor="consumed" className="text-sm">Saya sudah minum TTD hari ini</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Catatan</Label>
              <Textarea id="note" name="note" placeholder="Opsional" rows={3} />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpenReport(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-black/90">
                <Pill className="mr-2 h-4 w-4" /> Kirim Laporan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Simple Toast (mandiri, tanpa shadcn toast hook) */}
      {toast?.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <Bell className="mt-0.5 h-5 w-5 text-slate-600" />
            <div>
              <div className="font-medium">{toast.title}</div>
              {toast.desc && <div className="text-sm text-slate-600">{toast.desc}</div>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => setToast(null)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ======== Sub Komponen ========
function BadgeCard({
  title,
  desc,
  icon,
  color,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: color || BRAND.secondary }}
      >
        {icon}
      </div>
      <div>
        <div className="font-medium leading-tight">{title}</div>
        <div className="text-xs text-slate-600">{desc}</div>
      </div>
    </div>
  );
}

function ReminderItem({ time, message }: { time: string; message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c5eaf8] text-slate-900">
        <Bell className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{time}</div>
        <div className="text-sm text-slate-600">{message}</div>
      </div>
      <Button size="sm" variant="outline" className="rounded-lg border-slate-300">
        Edit
      </Button>
    </div>
  );
}
