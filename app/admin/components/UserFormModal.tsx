'use client';

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { kelas } from "@/data/dummyData";

// Interface for User
interface User {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  role: 'admin' | 'siswi';
  instansiId?: string;
  sekolahId?: string;
  kelasId?: string;
  nis?: string;
  tanggalLahir?: string;
}

// Interface for School
interface School {
  id: string;
  nama: string;
  alamat: string;
  puskesmasId: string;
}

// Interface for form values
export interface UserFormValues {
  name: string;
  email: string;
  role: 'admin' | 'siswi';
  schoolId: string;
  phoneNumber?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  nis?: string;
  birthDate?: string;
  classId?: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormValues) => void;
  user?: User;
  schools: School[];
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  schools,
}: UserFormModalProps) {
  const [formValues, setFormValues] = useState<UserFormValues>({
    name: '',
    email: '',
    role: 'siswi',
    schoolId: '',
    phoneNumber: '',
    gender: 'Perempuan',
    nis: '',
    birthDate: '',
    classId: ''
  });

  const [availableClasses, setAvailableClasses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user.nama,
        email: user.email,
        role: user.role,
        schoolId: user.role === 'admin' ? user.instansiId || '' : user.sekolahId || '',
        phoneNumber: user.noHp,
        gender: user.jenisKelamin,
        nis: user.nis || '',
        birthDate: user.tanggalLahir || '',
        classId: user.kelasId || ''
      });

      // If school is selected, load classes for that school
      if (user.role === 'siswi' && user.sekolahId) {
        const schoolClasses = kelas.filter(k => k.sekolahId === user.sekolahId);
        setAvailableClasses(schoolClasses);
      }
    } else {
      // Reset form for new user
      setFormValues({
        name: '',
        email: '',
        role: 'siswi',
        schoolId: '',
        phoneNumber: '',
        gender: 'Perempuan',
        nis: '',
        birthDate: '',
        classId: ''
      });
      setAvailableClasses([]);
    }
  }, [user, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));

    // If school changes, update available classes
    if (name === 'schoolId' && formValues.role === 'siswi') {
      const schoolClasses = kelas.filter(k => k.sekolahId === value);
      setAvailableClasses(schoolClasses);
      // Reset classId if school changes
      setFormValues(prev => ({ ...prev, [name]: value, classId: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
          <DialogDescription>
            {user 
              ? 'Ubah informasi pengguna di bawah ini.' 
              : 'Isi form di bawah untuk menambahkan pengguna baru.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Role Selection */}
            <div className="grid gap-2">
              <Label htmlFor="role">Tipe Pengguna</Label>
              <Select
                value={formValues.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih tipe pengguna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin Sekolah</SelectItem>
                  <SelectItem value="siswi">Siswi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleInputChange}
                placeholder="contoh@email.com"
                required
              />
            </div>
            
            {/* Phone Number */}
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Nomor HP (WhatsApp)</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleInputChange}
                placeholder="08123456789"
              />
            </div>
            
            {/* Gender */}
            <div className="grid gap-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select
                value={formValues.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* School */}
            <div className="grid gap-2">
              <Label htmlFor="schoolId">Sekolah</Label>
              <Select
                value={formValues.schoolId}
                onValueChange={(value) => handleSelectChange('schoolId', value)}
              >
                <SelectTrigger id="schoolId">
                  <SelectValue placeholder="Pilih sekolah" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>{school.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Fields specific for Siswi */}
            {formValues.role === 'siswi' && (
              <>
                {/* NIS */}
                <div className="grid gap-2">
                  <Label htmlFor="nis">NIS</Label>
                  <Input
                    id="nis"
                    name="nis"
                    value={formValues.nis}
                    onChange={handleInputChange}
                    placeholder="Nomor Induk Siswa"
                  />
                </div>
                
                {/* Birth Date */}
                <div className="grid gap-2">
                  <Label htmlFor="birthDate">Tanggal Lahir</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formValues.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Class */}
                <div className="grid gap-2">
                  <Label htmlFor="classId">Kelas</Label>
                  <Select
                    value={formValues.classId}
                    onValueChange={(value) => handleSelectChange('classId', value)}
                    disabled={!formValues.schoolId || availableClasses.length === 0}
                  >
                    <SelectTrigger id="classId">
                      <SelectValue placeholder={
                        !formValues.schoolId 
                          ? "Pilih sekolah terlebih dahulu" 
                          : availableClasses.length === 0 
                            ? "Tidak ada kelas tersedia" 
                            : "Pilih kelas"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map((kelas) => (
                        <SelectItem key={kelas.id} value={kelas.id}>{kelas.nama}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}