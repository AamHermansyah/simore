export type JenisKelamin = 'Laki-laki' | 'Perempuan';

export type StatusKonfirmasi = 'Menunggu' | 'Selesai' | 'Ditolak';

export interface Siswa {
  id: string;
  nama: string;
  nis: string;
  noHp: string;
  jenisKelamin: JenisKelamin;
  tanggalLahir: string; // Format: YYYY-MM-DD
  sekolahId: string;
  kelasId: string;
  email: string;
  password: string;
}

export interface AdminSekolah {
  id: string;
  nama: string;
  instansiId: string;
  email: string;
  noHp: string;
  jenisKelamin: JenisKelamin;
  password: string;
}

export interface AdminPuskesmas {
  id: string;
  nama: string;
  instansiId: string;
  email: string;
  noHp: string;
  jenisKelamin: JenisKelamin;
  password: string;
}

export interface Sekolah {
  id: string;
  nama: string;
  alamat: string;
  puskesmasId: string;
}

export interface Kelas {
  id: string;
  nama: string;
  sekolahId: string;
  kode: string; // Kode undangan untuk siswa
}

export interface Puskesmas {
  id: string;
  nama: string;
  alamat: string;
  kode: string; // Kode puskesmas otomatis
}

export interface KonsumsiTTD {
  id: string;
  siswaId: string;
  namaKonfirmasi: string;
  tanggalKonsumsi: string; // Format: YYYY-MM-DD
  tanggalJadwalKonsumsi: string; // Format: YYYY-MM-DD
  status: StatusKonfirmasi;
  adminValidatorId?: string; // ID admin yang memvalidasi
}

export interface Admin {
  id: string;
  nama: string;
  email: string;
  password: string;
}

// Data dummy untuk aplikasi

// Admin sistem
export const admins: Admin[] = [
  {
    id: 'admin-001',
    nama: 'Super Admin',
    email: 'admin@ttdapp.com',
    password: 'admin123'
  },
  {
    id: 'admin-002',
    nama: 'Admin Pengelola',
    email: 'pengelola@ttdapp.com',
    password: 'pengelola123'
  }
];

// Data puskesmas
export const puskesmas: Puskesmas[] = [
  {
    id: 'puskesmas-001',
    nama: 'Puskesmas Sejahtera',
    alamat: 'Jl. Kesehatan No. 1, Kota Sehat',
    kode: 'PKM-001'
  },
  {
    id: 'puskesmas-002',
    nama: 'Puskesmas Bahagia',
    alamat: 'Jl. Kebahagiaan No. 15, Kota Bahagia',
    kode: 'PKM-002'
  },
  {
    id: 'puskesmas-003',
    nama: 'Puskesmas Sentosa',
    alamat: 'Jl. Sentosa Raya No. 20, Kota Sentosa',
    kode: 'PKM-003'
  }
];

// Data admin puskesmas
export const adminPuskesmas: AdminPuskesmas[] = [
  {
    id: 'admin-puskesmas-001',
    nama: 'Dr. Fitri Setiawan',
    instansiId: 'puskesmas-001',
    email: 'fitri@puskesmassejahtera.com',
    noHp: '081234567890',
    jenisKelamin: 'Perempuan',
    password: 'fitri123'
  },
  {
    id: 'admin-puskesmas-002',
    nama: 'Dr. Ahmad Syafaat',
    instansiId: 'puskesmas-002',
    email: 'ahmad@puskesmasbahagia.com',
    noHp: '081234567891',
    jenisKelamin: 'Laki-laki',
    password: 'ahmad123'
  },
  {
    id: 'admin-puskesmas-003',
    nama: 'Dr. Ratna Puspita',
    instansiId: 'puskesmas-003',
    email: 'ratna@puskesmassentosa.com',
    noHp: '081234567892',
    jenisKelamin: 'Perempuan',
    password: 'ratna123'
  }
];

// Data sekolah
export const sekolah: Sekolah[] = [
  {
    id: 'sekolah-001',
    nama: 'SMA Negeri 1 Kota Sehat',
    alamat: 'Jl. Pendidikan No. 10, Kota Sehat',
    puskesmasId: 'puskesmas-001'
  },
  {
    id: 'sekolah-002',
    nama: 'SMA Negeri 2 Kota Sehat',
    alamat: 'Jl. Cendekia No. 15, Kota Sehat',
    puskesmasId: 'puskesmas-001'
  },
  {
    id: 'sekolah-003',
    nama: 'SMA Negeri 1 Kota Bahagia',
    alamat: 'Jl. Bahagia No. 20, Kota Bahagia',
    puskesmasId: 'puskesmas-002'
  },
  {
    id: 'sekolah-004',
    nama: 'SMA Negeri 1 Kota Sentosa',
    alamat: 'Jl. Sentosa No. 25, Kota Sentosa',
    puskesmasId: 'puskesmas-003'
  }
];

// Data kelas
export const kelas: Kelas[] = [
  {
    id: 'kelas-001',
    nama: 'X IPA 1',
    sekolahId: 'sekolah-001',
    kode: 'XIPA1-001'
  },
  {
    id: 'kelas-002',
    nama: 'X IPA 2',
    sekolahId: 'sekolah-001',
    kode: 'XIPA2-001'
  },
  {
    id: 'kelas-003',
    nama: 'X IPS 1',
    sekolahId: 'sekolah-001',
    kode: 'XIPS1-001'
  },
  {
    id: 'kelas-004',
    nama: 'XI IPA 1',
    sekolahId: 'sekolah-002',
    kode: 'XIIPA1-002'
  },
  {
    id: 'kelas-005',
    nama: 'XI IPS 1',
    sekolahId: 'sekolah-002',
    kode: 'XIIPS1-002'
  },
  {
    id: 'kelas-006',
    nama: 'X IPA 1',
    sekolahId: 'sekolah-003',
    kode: 'XIPA1-003'
  },
  {
    id: 'kelas-007',
    nama: 'X IPA 1',
    sekolahId: 'sekolah-004',
    kode: 'XIPA1-004'
  }
];

// Data admin sekolah
export const adminSekolah: AdminSekolah[] = [
  {
    id: 'admin-sekolah-001',
    nama: 'Budi Santoso',
    instansiId: 'sekolah-001',
    email: 'budi@sman1kotasehat.com',
    noHp: '081234567893',
    jenisKelamin: 'Laki-laki',
    password: 'budi123'
  },
  {
    id: 'admin-sekolah-002',
    nama: 'Siti Nurhaliza',
    instansiId: 'sekolah-002',
    email: 'siti@sman2kotasehat.com',
    noHp: '081234567894',
    jenisKelamin: 'Perempuan',
    password: 'siti123'
  },
  {
    id: 'admin-sekolah-003',
    nama: 'Andi Wijaya',
    instansiId: 'sekolah-003',
    email: 'andi@sman1kotabahagia.com',
    noHp: '081234567895',
    jenisKelamin: 'Laki-laki',
    password: 'andi123'
  },
  {
    id: 'admin-sekolah-004',
    nama: 'Dewi Lestari',
    instansiId: 'sekolah-004',
    email: 'dewi@sman1kotasentosa.com',
    noHp: '081234567896',
    jenisKelamin: 'Perempuan',
    password: 'dewi123'
  }
];

// Data siswa
export const siswa: Siswa[] = [
  {
    id: 'siswa-001',
    nama: 'Putri Ramadhani',
    nis: '10001',
    noHp: '081234567897',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-05-15',
    sekolahId: 'sekolah-001',
    kelasId: 'kelas-001',
    email: 'putri.r@gmail.com',
    password: 'putri123'
  },
  {
    id: 'siswa-002',
    nama: 'Anita Sari',
    nis: '10002',
    noHp: '081234567898',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-08-20',
    sekolahId: 'sekolah-001',
    kelasId: 'kelas-001',
    email: 'anita.s@gmail.com',
    password: 'anita123'
  },
  {
    id: 'siswa-003',
    nama: 'Dinda Permata',
    nis: '10003',
    noHp: '081234567899',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-11-10',
    sekolahId: 'sekolah-001',
    kelasId: 'kelas-002',
    email: 'dinda.p@gmail.com',
    password: 'dinda123'
  },
  {
    id: 'siswa-004',
    nama: 'Maya Indah',
    nis: '10004',
    noHp: '081234567810',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-02-28',
    sekolahId: 'sekolah-001',
    kelasId: 'kelas-002',
    email: 'maya.i@gmail.com',
    password: 'maya123'
  },
  {
    id: 'siswa-005',
    nama: 'Sinta Dewi',
    nis: '10005',
    noHp: '081234567811',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-04-12',
    sekolahId: 'sekolah-001',
    kelasId: 'kelas-003',
    email: 'sinta.d@gmail.com',
    password: 'sinta123'
  },
  {
    id: 'siswa-006',
    nama: 'Rina Cahaya',
    nis: '10006',
    noHp: '081234567812',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-06-05',
    sekolahId: 'sekolah-002',
    kelasId: 'kelas-004',
    email: 'rina.c@gmail.com',
    password: 'rina123'
  },
  {
    id: 'siswa-007',
    nama: 'Laras Wati',
    nis: '10007',
    noHp: '081234567813',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-09-22',
    sekolahId: 'sekolah-002',
    kelasId: 'kelas-004',
    email: 'laras.w@gmail.com',
    password: 'laras123'
  },
  {
    id: 'siswa-008',
    nama: 'Dina Maulida',
    nis: '10008',
    noHp: '081234567814',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-10-30',
    sekolahId: 'sekolah-002',
    kelasId: 'kelas-005',
    email: 'dina.m@gmail.com',
    password: 'dina123'
  },
  {
    id: 'siswa-009',
    nama: 'Rara Setiawati',
    nis: '10009',
    noHp: '081234567815',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-01-18',
    sekolahId: 'sekolah-003',
    kelasId: 'kelas-006',
    email: 'rara.s@gmail.com',
    password: 'rara123'
  },
  {
    id: 'siswa-010',
    nama: 'Lia Puspita',
    nis: '10010',
    noHp: '081234567816',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-03-25',
    sekolahId: 'sekolah-003',
    kelasId: 'kelas-006',
    email: 'lia.p@gmail.com',
    password: 'lia123'
  },
  {
    id: 'siswa-011',
    nama: 'Tia Amelia',
    nis: '10011',
    noHp: '081234567817',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-07-14',
    sekolahId: 'sekolah-004',
    kelasId: 'kelas-007',
    email: 'tia.a@gmail.com',
    password: 'tia123'
  },
  {
    id: 'siswa-012',
    nama: 'Nina Safitri',
    nis: '10012',
    noHp: '081234567818',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2007-12-05',
    sekolahId: 'sekolah-004',
    kelasId: 'kelas-007',
    email: 'nina.s@gmail.com',
    password: 'nina123'
  }
];

// Data konsumsi Tablet Tambah Darah (TTD)
export const konsumsiTTD: KonsumsiTTD[] = [
  {
    id: 'konsumsi-001',
    siswaId: 'siswa-001',
    namaKonfirmasi: 'Putri Ramadhani',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-001'
  },
  {
    id: 'konsumsi-002',
    siswaId: 'siswa-002',
    namaKonfirmasi: 'Anita Sari',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-001'
  },
  {
    id: 'konsumsi-003',
    siswaId: 'siswa-003',
    namaKonfirmasi: 'Dinda Permata',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-001'
  },
  {
    id: 'konsumsi-004',
    siswaId: 'siswa-004',
    namaKonfirmasi: 'Maya Indah',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Ditolak',
    adminValidatorId: 'admin-sekolah-001'
  },
  {
    id: 'konsumsi-005',
    siswaId: 'siswa-005',
    namaKonfirmasi: 'Sinta Dewi',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Menunggu'
  },
  {
    id: 'konsumsi-006',
    siswaId: 'siswa-006',
    namaKonfirmasi: 'Rina Cahaya',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-002'
  },
  {
    id: 'konsumsi-007',
    siswaId: 'siswa-007',
    namaKonfirmasi: 'Laras Wati',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-002'
  },
  {
    id: 'konsumsi-008',
    siswaId: 'siswa-008',
    namaKonfirmasi: 'Dina Maulida',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Menunggu'
  },
  {
    id: 'konsumsi-009',
    siswaId: 'siswa-009',
    namaKonfirmasi: 'Rara Setiawati',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-003'
  },
  {
    id: 'konsumsi-010',
    siswaId: 'siswa-010',
    namaKonfirmasi: 'Lia Puspita',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Menunggu'
  },
  {
    id: 'konsumsi-011',
    siswaId: 'siswa-011',
    namaKonfirmasi: 'Tia Amelia',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-004'
  },
  {
    id: 'konsumsi-012',
    siswaId: 'siswa-012',
    namaKonfirmasi: 'Nina Safitri',
    tanggalKonsumsi: '2025-08-01',
    tanggalJadwalKonsumsi: '2025-08-01',
    status: 'Ditolak',
    adminValidatorId: 'admin-sekolah-004'
  },
  // Data konsumsi TTD minggu berikutnya
  {
    id: 'konsumsi-013',
    siswaId: 'siswa-001',
    namaKonfirmasi: 'Putri Ramadhani',
    tanggalKonsumsi: '2025-08-08',
    tanggalJadwalKonsumsi: '2025-08-08',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-001'
  },
  {
    id: 'konsumsi-014',
    siswaId: 'siswa-002',
    namaKonfirmasi: 'Anita Sari',
    tanggalKonsumsi: '2025-08-08',
    tanggalJadwalKonsumsi: '2025-08-08',
    status: 'Menunggu'
  },
  {
    id: 'konsumsi-015',
    siswaId: 'siswa-006',
    namaKonfirmasi: 'Rina Cahaya',
    tanggalKonsumsi: '2025-08-08',
    tanggalJadwalKonsumsi: '2025-08-08',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-002'
  },
  {
    id: 'konsumsi-016',
    siswaId: 'siswa-009',
    namaKonfirmasi: 'Rara Setiawati',
    tanggalKonsumsi: '2025-08-08',
    tanggalJadwalKonsumsi: '2025-08-08',
    status: 'Selesai',
    adminValidatorId: 'admin-sekolah-003'
  }
];

// Fungsi untuk mendapatkan data berdasarkan relasi
export const getDataRelasi = {
  // Mendapatkan data sekolah berdasarkan ID puskesmas
  getSekolahByPuskesmasId: (puskesmasId: string) => {
    return sekolah.filter(s => s.puskesmasId === puskesmasId);
  },
  
  // Mendapatkan data kelas berdasarkan ID sekolah
  getKelasBySekolahId: (sekolahId: string) => {
    return kelas.filter(k => k.sekolahId === sekolahId);
  },
  
  // Mendapatkan data siswa berdasarkan ID kelas
  getSiswaByKelasId: (kelasId: string) => {
    return siswa.filter(s => s.kelasId === kelasId);
  },
  
  // Mendapatkan data konsumsi TTD berdasarkan ID siswa
  getKonsumsiTTDBySiswaId: (siswaId: string) => {
    return konsumsiTTD.filter(k => k.siswaId === siswaId);
  },
  
  // Mendapatkan data admin sekolah berdasarkan ID sekolah
  getAdminBySekolahId: (sekolahId: string) => {
    return adminSekolah.filter(a => a.instansiId === sekolahId);
  },
  
  // Mendapatkan data admin puskesmas berdasarkan ID puskesmas
  getAdminByPuskesmasId: (puskesmasId: string) => {
    return adminPuskesmas.filter(a => a.instansiId === puskesmasId);
  },
  
  // Mendapatkan statistik konsumsi TTD per sekolah
  getStatistikKonsumsiTTDPerSekolah: () => {
    const result: Record<string, {
      total: number,
      selesai: number,
      menunggu: number,
      ditolak: number,
      namaSekolah: string
    }> = {};
    
    // Inisialisasi data per sekolah
    sekolah.forEach(s => {
      result[s.id] = {
        total: 0,
        selesai: 0,
        menunggu: 0,
        ditolak: 0,
        namaSekolah: s.nama
      };
    });
    
    // Hitung statistik
    konsumsiTTD.forEach(k => {
      const siswaData = siswa.find(s => s.id === k.siswaId);
      if (siswaData) {
        const sekolahId = siswaData.sekolahId;
        result[sekolahId].total += 1;
        
        if (k.status === 'Selesai') {
          result[sekolahId].selesai += 1;
        } else if (k.status === 'Menunggu') {
          result[sekolahId].menunggu += 1;
        } else if (k.status === 'Ditolak') {
          result[sekolahId].ditolak += 1;
        }
      }
    });
    
    return result;
  }
};

// Fungsi utilitas untuk autentikasi
export const auth = {
  // Login untuk admin
  loginAdmin: (email: string, password: string) => {
    return admins.find(a => a.email === email && a.password === password);
  },
  
  // Login untuk admin sekolah
  loginAdminSekolah: (email: string, password: string) => {
    return adminSekolah.find(a => a.email === email && a.password === password);
  },
  
  // Login untuk admin puskesmas
  loginAdminPuskesmas: (email: string, password: string) => {
    return adminPuskesmas.find(a => a.email === email && a.password === password);
  },
  
  // Login untuk siswa
  loginSiswa: (email: string, password: string) => {
    return siswa.find(s => s.email === email && s.password === password);
  }
};

// Data untuk diexport
export default {
  admins,
  puskesmas,
  adminPuskesmas,
  sekolah,
  kelas,
  adminSekolah,
  siswa,
  konsumsiTTD,
  getDataRelasi,
  auth
};