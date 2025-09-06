import {
  RiPieChartLine,
  RiTrophyLine,
  RiTeamLine,
  RiSchoolLine,
  RiHealthBookLine,
  RiHistoryLine,
  RiDoorLine,
  RiAdminLine,
  RiHospitalLine,
  RiBarChart2Line,
  RiLock2Line,
  RiProfileLine,
} from "@remixicon/react";
import { Building } from "lucide-react";

export const navigations = [
  {
    title: "Siswi",
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
    items: [
      {
        title: "Ringkasan",
        url: "#",
        icon: RiPieChartLine,
      },
      {
        title: "Siswi",
        url: "#",
        icon: RiTeamLine,
      },
      {
        title: "Verifikasi Laporan",
        url: "#",
        icon: RiHealthBookLine,
      },
      {
        title: "Papan Skor",
        url: "#",
        icon: RiTrophyLine,
      },
      {
        title: "Keamanan",
        url: "#",
        icon: RiLock2Line,
      },
    ],
  },
  {
    title: "Sekolah",
    items: [
      {
        title: "Ringkasan",
        url: "/sekolah",
        icon: RiPieChartLine,
      },
      {
        title: "Kelas",
        url: "#",
        icon: RiDoorLine,
      },
      {
        title: "Guru Pengurus",
        url: "#",
        icon: RiAdminLine,
      },
      {
        title: "Siswi",
        url: "#",
        icon: RiTeamLine,
      },
      {
        title: "Papan Skor",
        url: "#",
        icon: RiTrophyLine,
      },
      {
        title: "Laporan",
        url: "#",
        icon: RiBarChart2Line,
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
    items: [
      {
        title: "Siswi",
        url: "#",
        icon: RiTeamLine,
      },
      {
        title: "Laporan",
        url: "#",
        icon: RiBarChart2Line,
      },
      {
        title: "Keamanan",
        url: "#",
        icon: RiLock2Line,
      },
    ],
  },
  {
    title: "Super Admin",
    items: [
      {
        title: "Ringkasan",
        url: "#",
        icon: RiPieChartLine,
      },
      {
        title: "Sekolah",
        url: "#",
        icon: RiSchoolLine,
      },
      {
        title: "Puskesmas",
        url: "#",
        icon: RiHospitalLine,
      },
      {
        title: "Keamanan",
        url: "#",
        icon: RiLock2Line,
      },
    ],
  },
]