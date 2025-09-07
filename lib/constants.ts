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
        url: "/siswi/peringkat",
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
    items: [
      {
        title: "Ringkasan",
        url: "/sekolah",
        icon: RiPieChartLine,
      },
      {
        title: "Kelas",
        url: "/sekolah/kelas",
        icon: RiDoorLine,
      },
      {
        title: "Guru Pengurus",
        url: "/sekolah/guru",
        icon: RiAdminLine,
      },
      {
        title: "Siswi",
        url: "/sekolah/siswi",
        icon: RiTeamLine,
      },
      {
        title: "Papan Skor",
        url: "/siswi/peringkat",
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
        url: "/admin/sekolah",
        icon: RiSchoolLine,
      },
      {
        title: "Puskesmas",
        url: "/admin/puskesmas",
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