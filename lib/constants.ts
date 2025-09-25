import {
  RiPieChartLine,
  RiTrophyLine,
  RiTeamLine,
  RiSchoolLine,
  RiHealthBookLine,
  RiHistoryLine,
  RiAdminLine,
  RiHospitalLine,
  RiBarChart2Line,
  RiProfileLine,
  RiGraduationCapLine,
  RiTaskLine,
} from "@remixicon/react";
import {
  BarChart3,
  Building,
  Building2,
  CheckCircle,
  GraduationCap,
  School,
  Shield,
  TrendingUp,
  User,
  Users
} from "lucide-react";
import { NavigationGroup } from "./types";
import { Day } from "date-fns";

export const navigations: NavigationGroup[] = [
  {
    title: "Siswi",
    role: 'SISWI',
    items: [
      {
        title: "Ringkasan",
        url: "/siswi",
        icon: RiPieChartLine,
      },
      {
        title: "Laporan Baru",
        url: "/siswi/laporan",
        icon: RiHealthBookLine,
      },
      {
        title: "Riwayat Laporan",
        url: "/siswi/riwayat",
        icon: RiHistoryLine,
      },
      {
        title: "Papan Skor",
        url: "/siswi/peringkat",
        icon: RiTrophyLine,
      },
      {
        title: "Profil",
        url: "/siswi/profil",
        icon: RiProfileLine,
      },
    ],
  },
  {
    title: "Guru",
    role: 'GURU',
    items: [
      {
        title: "Ringkasan",
        url: "/guru",
        icon: RiPieChartLine,
      },
      {
        title: "Siswi",
        url: "/guru/angkatan",
        icon: RiTeamLine,
      },
      {
        title: "Laporan Siswi",
        url: "/guru/laporan",
        icon: RiTaskLine,
      },
      {
        title: "Papan Skor",
        url: "/guru/peringkat-siswi",
        icon: RiTrophyLine,
      },
      {
        title: "Profil",
        url: "/guru/profil",
        icon: RiProfileLine,
      },
    ],
  },
  {
    title: "Sekolah",
    role: 'SEKOLAH',
    items: [
      {
        title: "Ringkasan",
        url: "/sekolah",
        icon: RiPieChartLine,
      },
      {
        title: "Angkatan",
        url: "/sekolah/angkatan",
        icon: RiGraduationCapLine,
      },
      {
        title: "Guru Pengelola",
        url: "/sekolah/guru",
        icon: RiAdminLine,
      },
      {
        title: "Siswi",
        url: "/sekolah/siswi",
        icon: RiTeamLine,
      },
      {
        title: "Laporan Siswi",
        url: "/sekolah/laporan",
        icon: RiTaskLine,
      },
      {
        title: "Papan Skor",
        url: "/sekolah/peringkat-siswi",
        icon: RiTrophyLine,
      },
      {
        title: "Profil",
        url: "/sekolah/profil",
        icon: Building,
      },
    ],
  },
  {
    title: "Puskesmas",
    role: 'PUSKESMAS',
    items: [
      {
        title: "Ringkasan",
        url: "/puskesmas",
        icon: RiPieChartLine,
      },
      {
        title: "Siswi",
        url: "#",
        icon: RiTeamLine,
      },
      {
        title: "Papan Skor",
        url: "/guru/siswi/peringkat",
        icon: RiTrophyLine,
      },
      {
        title: "Profil",
        url: "/puskesmas/profil",
        icon: Building,
      },
    ],
  },
  {
    title: "Super Admin",
    role: 'SUPERADMIN',
    items: [
      {
        title: "Ringkasan",
        url: "/admin",
        icon: RiPieChartLine,
      },
      {
        title: "Sekolah",
        url: "/admin/sekolah",
        icon: RiSchoolLine,
      },
      {
        title: "Puskesmas",
        url: "/admin/puskesmas",
        icon: RiHospitalLine,
      },
      {
        title: "Profil",
        url: "/admin/profil",
        icon: RiProfileLine,
      },
    ],
  },
]

export const features = [
  {
    icon: CheckCircle,
    title: 'Laporan Mudah',
    description: 'Sistem pelaporan yang sederhana dan user-friendly untuk siswi'
  },
  {
    icon: BarChart3,
    title: 'Monitoring Real-time',
    description: 'Pantau konsumsi tablet tambah darah secara real-time'
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description: 'Akses berbeda untuk siswa, guru, sekolah, dan puskesmas'
  },
  {
    icon: TrendingUp,
    title: 'Analytics Lengkap',
    description: 'Dashboard analytics untuk monitoring kesehatan siswi'
  }
];

export const roles = [
  {
    value: 'SISWI',
    label: 'Siswi',
    icon: User,
    color: 'emerald',
    description: 'Laporan konsumsi tablet tambah darah'
  },
  {
    value: 'GURU',
    label: 'Guru',
    icon: GraduationCap,
    color: 'blue',
    description: 'Monitoring siswi dalam satu angkatan'
  },
  {
    value: 'SEKOLAH',
    label: 'Sekolah',
    icon: School,
    color: 'orange',
    description: 'Kelola data guru dan siswa'
  },
  {
    value: 'PUSKESMAS',
    label: 'Puskesmas',
    icon: Building2,
    color: 'purple',
    description: 'Monitoring seluruh sekolah'
  },
  {
    value: 'SUPERADMIN',
    label: 'Super Admin',
    icon: Shield,
    color: 'red',
    description: 'Kelola akun sekolah & puskesmas'
  }
];

export const getColorClasses = (color: string) => {
  const colors = {
    emerald: {
      bg: 'from-emerald-50 to-green-100',
      text: 'text-emerald-700',
      icon: 'text-emerald-600',
      border: 'border-emerald-200 hover:border-emerald-300',
      ring: 'ring-emerald-500'
    },
    blue: {
      bg: 'from-blue-50 to-indigo-100',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      border: 'border-blue-200 hover:border-blue-300',
      ring: 'ring-blue-500'
    },
    orange: {
      bg: 'from-orange-50 to-red-100',
      text: 'text-orange-700',
      icon: 'text-orange-600',
      border: 'border-orange-200 hover:border-orange-300',
      ring: 'ring-orange-500'
    },
    purple: {
      bg: 'from-purple-50 to-pink-100',
      text: 'text-purple-700',
      icon: 'text-purple-600',
      border: 'border-purple-200 hover:border-purple-300',
      ring: 'ring-purple-500'
    },
    red: {
      bg: 'from-red-50 to-rose-100',
      text: 'text-red-700',
      icon: 'text-red-600',
      border: 'border-red-200 hover:border-red-300',
      ring: 'ring-red-500'
    }
  };
  return colors[color as keyof typeof colors] || colors.emerald;
};

// 0 - 6 (Minggu - Sabtu)
export const submitTimes = {
  day: 4 as Day,
  start: 6,
  end: 21,
  maxPoint: 200,
  step: 10,
};