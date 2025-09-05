"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarRange,
  ChevronRight,
  Send,
  Users2,
} from "lucide-react";

/**
 * ================================================
 * SiMoRE — "/school" (Dashboard Sekolah)
 * ================================================
 * Desktop-first, responsif seperlunya. Desain-only + logika ringan UI.
 * Brand: primary #fae27c, secondary #c5eaf8
 */

const BRAND = { primary: "#fae27c", secondary: "#c5eaf8", ink: "#111827" };

// Dummy datasets
const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, i).toLocaleString("id-ID", { month: "short" }),
  compliance: Math.round(68 + 20 * Math.random()),
  reports: Math.round(250 + 200 * Math.random()),
}));

const waStatusData = [
  { name: "Terkirim", value: 420 },
  { name: "Gagal", value: 35 },
  { name: "Antri", value: 18 },
];

interface RiskItem {
  id: string;
  name: string;
  class: string;
  lastReport: string; // YYYY-MM-DD
  days: number; // days since last
}

const initialRisks: RiskItem[] = [
  { id: "s-001", name: "Aulia Nur", class: "XI IPA 1", lastReport: "2025-08-18", days: 17 },
  { id: "s-002", name: "Della Pratiwi", class: "XI IPA 2", lastReport: "2025-08-22", days: 13 },
  { id: "s-003", name: "Rani Saputri", class: "XI IPS 1", lastReport: "2025-08-14", days: 21 },
  { id: "s-004", name: "Salsa Azzahra", class: "XI IPA 3", lastReport: "2025-08-25", days: 10 },
];

interface DistItem {
  id: string;
  date: string;
  batch: string;
  amount: number;
}

const initialDistributions: DistItem[] = [
  { id: "d-012", date: "2025-08-28", batch: "B-0825-12", amount: 600 },
  { id: "d-011", date: "2025-08-05", batch: "B-0825-07", amount: 580 },
];

export default function SchoolDashboardPage() {
  const [month, setMonth] = useState("2025-09");
  const [kelas, setKelas] = useState<string>("all");
  const [risks, setRisks] = useState<RiskItem[]>(initialRisks);
  const [dist, setDist] = useState<DistItem[]>(initialDistributions);
  const [openDist, setOpenDist] = useState(false);
  const [openReminder, setOpenReminder] = useState(false);

  const monthLabel = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    return new Date(y, (m || 1) - 1).toLocaleString("id-ID", { month: "long", year: "numeric" });
  }, [month]);

  // KPI dummy values derived from state
  const kpiCompliance = 82;
  const kpiActive = 734;
  const kpiReportsWeek = 489;
  const kpiOverdue14 = risks.filter((r) => r.days >= 14).length;

  function addDistribution(formData: FormData) {
    const date = String(formData.get("date") || "");
    const batch = String(formData.get("batch") || "");
    const amount = Number(formData.get("amount") || 0);
    if (!date || !batch || !amount) return;
    const id = `d-${(dist.length + 1).toString().padStart(3, "0")}`;
    setDist([{ id, date, batch, amount }, ...dist]);
    setOpenDist(false);
  }

  function sendReminder() {
    // Dummy: remove 1 from each risk days and mark <14 filtered next render
    setRisks((prev) => prev.map((r) => ({ ...r, days: Math.max(0, r.days - 1) })));
    setOpenReminder(false);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50">
      {/* Header brand */}
      <div
        className="border-b"
        style={{ background: `linear-gradient(90deg, ${BRAND.primary} 0%, ${BRAND.secondary} 60%, white 100%)` }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard Sekolah</h1>
            <p className="mt-1 text-slate-700">Ringkasan kepatuhan, tindak lanjut, dan operasional program TTD.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={kelas} onValueChange={setKelas}>
              <SelectTrigger className="w-[160px] bg-white/70">
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                <SelectItem value="xi-ipa">XI IPA</SelectItem>
                <SelectItem value="xi-ips">XI IPS</SelectItem>
              </SelectContent>
            </Select>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-[160px] bg-white/70" />
            <Dialog open={openDist} onOpenChange={setOpenDist}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-black text-white hover:bg-black/90">Tambah Distribusi</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Tambah Distribusi Tablet</DialogTitle>
                  <DialogDescription>Catat penyaluran tablet untuk kebutuhan audit.</DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addDistribution(new FormData(e.currentTarget as HTMLFormElement));
                  }}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="batch">No. Batch</Label>
                    <Input id="batch" name="batch" placeholder="Contoh: B-0925-01" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Jumlah Tablet</Label>
                    <Input id="amount" name="amount" type="number" min={0} placeholder="600" />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="rounded-xl bg-black text-white hover:bg-black/90">Simpan</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={openReminder} onOpenChange={setOpenReminder}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl border-slate-300">
                  <Send className="mr-2 h-4 w-4" /> Kirim Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Kirim Reminder WA</DialogTitle>
                  <DialogDescription>Preview template pesan pengingat.</DialogDescription>
                </DialogHeader>
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed">
                  Halo, ini pengingat untuk konsumsi TTD hari Kamis pukul 07:00–09:00. Mohon laporkan di aplikasi SiMoRE ya! Terima kasih.
                </div>
                <DialogFooter>
                  <Button onClick={sendReminder} className="rounded-xl bg-black text-white hover:bg-black/90">
                    <Send className="mr-2 h-4 w-4" /> Kirim Sekarang
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 p-6">
        {/* KPI Cards */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          <Card className="col-span-12 lg:col-span-3 shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Kepatuhan Bulan Ini</CardTitle>
              <CardDescription>{monthLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold" style={{ color: BRAND.ink }}>{kpiCompliance}%</div>
                <div className="flex-1">
                  <Progress value={kpiCompliance} className="h-2 bg-slate-200" />
                  <div className="mt-2 text-xs text-slate-600">Target ≥ 80%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-12 lg:col-span-3 shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Siswi Aktif</CardTitle>
              <CardDescription>Semester Ganjil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#c5eaf8] px-3 py-1.5 text-xl font-semibold text-slate-900">{kpiActive}</div>
                <div className="text-sm text-slate-600">Total terdaftar dan aktif melapor</div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-12 lg:col-span-3 shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Laporan Minggu Ini</CardTitle>
              <CardDescription>Rekap internal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#fae27c] px-3 py-1.5 text-xl font-semibold text-black">{kpiReportsWeek}</div>
                <div className="text-sm text-slate-600">Form masuk 7 hari terakhir</div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-12 lg:col-span-3 shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Belum Melapor ≥14 Hari</CardTitle>
              <CardDescription>Butuh tindak lanjut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertTriangle className="h-5 w-5" />
                  <div className="text-xl font-semibold">{kpiOverdue14}</div>
                </div>
                <div className="text-sm text-slate-600">Prioritaskan kontak orang tua</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <Card className="col-span-12 lg:col-span-8 shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tren Kepatuhan & Volume Laporan</CardTitle>
            <CardDescription>12 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 8, left: 0, right: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" domain={[40, 100]} tickFormatter={(v) => `${v}%`} width={36} />
                <YAxis yAxisId="right" orientation="right" width={36} />
                <Tooltip cursor={{ stroke: "#e2e8f0" }} formatter={(v: number, k) => (k === "compliance" ? `${v}%` : v)} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="compliance" stroke="#111827" strokeWidth={2} dot={false} name="Kepatuhan" />
                <Line yAxisId="right" type="monotone" dataKey="reports" stroke={BRAND.secondary} strokeWidth={2} dot={false} name="Laporan" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-4 shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status Reminder WA</CardTitle>
            <CardDescription>Bulan berjalan</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie dataKey="value" data={waStatusData} nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} stroke="#e5e7eb">
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-3 text-center text-xs text-slate-600">
              {waStatusData.map((d) => (
                <div key={d.name}>
                  <div className="font-medium text-slate-900">{d.value}</div>
                  {d.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tindak Lanjut & Distribusi */}
        <Card className="col-span-12 lg:col-span-8 shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Perlu Tindak Lanjut</CardTitle>
            <CardDescription>Siswi belum melapor {kelas === "all" ? "(semua kelas)" : kelas.toUpperCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Terakhir Lapor</TableHead>
                  <TableHead>Hari</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((r) => (
                  <TableRow key={r.id} className={r.days >= 14 ? "bg-rose-50" : ""}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.class}</TableCell>
                    <TableCell>{r.lastReport}</TableCell>
                    <TableCell>
                      <Badge className={r.days >= 14 ? "bg-rose-600 hover:bg-rose-600" : ""}>{r.days} hari</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="rounded-lg border-slate-300">
                        Hubungi
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 text-xs text-slate-600">Tip: gunakan filter kelas di header untuk memperkecil daftar.</div>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-4 shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Distribusi Terakhir</CardTitle>
            <CardDescription>Log penyaluran batch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dist.map((d) => (
                <div key={d.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{d.batch}</div>
                    <span className="text-xs text-slate-600">{d.date}</span>
                  </div>
                  <div className="mt-1 text-slate-700">Jumlah: <span className="font-medium">{d.amount}</span></div>
                </div>
              ))}
            </div>
            <Link href="#" className="mt-4 inline-flex items-center text-sm text-slate-700 hover:opacity-80">
              Lihat semua <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Footer ribbon */}
        <div className="col-span-12 rounded-xl border border-slate-200 bg-white/80 p-4 text-center text-xs text-slate-500">
          SiMoRE • Dashboard Sekolah • warna utama <span className="font-medium">#fae27c</span> & secondary <span className="font-medium">#c5eaf8</span>
        </div>
      </div>
    </div>
  );
}
