'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { kelas } from "@/data/dummyData";

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

interface School {
  id: string;
  nama: string;
  alamat: string;
  puskesmasId: string;
}

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, 'Nama harus memiliki minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().optional(),
  role: z.enum(['admin', 'siswi']),
  schoolId: z.string().min(1, 'Sekolah harus dipilih'),
  phoneNumber: z.string().optional(),
  gender: z.enum(['Laki-laki', 'Perempuan']).optional(),
  nis: z.string().optional(),
  birthDate: z.string().optional(),
  classId: z.string().optional(),
});

// Form values type
export type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  user?: User;
  schools: School[];
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
}

export default function UserForm({ user, schools, onSubmit, onCancel }: UserFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: user
      ? {
          name: user.nama,
          email: user.email,
          password: '',
          role: user.role,
          schoolId: user.role === 'admin' ? user.instansiId : user.sekolahId,
          phoneNumber: user.noHp,
          gender: user.jenisKelamin,
          nis: user.nis,
          birthDate: user.tanggalLahir,
          classId: user.kelasId,
        }
      : {
          name: '',
          email: '',
          password: '',
          role: 'siswi',
          schoolId: '',
          phoneNumber: '',
          gender: 'Perempuan',
          nis: '',
          birthDate: '',
          classId: '',
        },
  });

  const isEditMode = !!user;
  const selectedRole = form.watch('role');
  const selectedSchoolId = form.watch('schoolId');
  
  // Get available classes for selected school
  const availableClasses = selectedSchoolId 
    ? kelas.filter(k => k.sekolahId === selectedSchoolId)
    : [];

  // Password validation schema changes based on mode (create/edit)
  useEffect(() => {
    form.register('password', {
      required: !isEditMode,
      minLength: {
        value: 6,
        message: 'Password harus memiliki minimal 6 karakter',
      },
    });
  }, [isEditMode, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin Sekolah</SelectItem>
                  <SelectItem value="siswi">Siswi</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="contoh@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEditMode ? 'Password (kosongkan jika tidak ingin mengubah)' : 'Password'}
              </FormLabel>
              <FormControl>
                <Input placeholder="Masukkan password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor HP (WhatsApp)</FormLabel>
              <FormControl>
                <Input placeholder="08123456789" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sekolah</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sekolah" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Fields specific for Siswi */}
        {selectedRole === 'siswi' && (
          <>
            <FormField
              control={form.control}
              name="nis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIS</FormLabel>
                  <FormControl>
                    <Input placeholder="Nomor Induk Siswa" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedSchoolId || availableClasses.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !selectedSchoolId 
                            ? "Pilih sekolah terlebih dahulu" 
                            : availableClasses.length === 0 
                              ? "Tidak ada kelas tersedia" 
                              : "Pilih kelas"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableClasses.map((k) => (
                        <SelectItem key={k.id} value={k.id}>
                          {k.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">
            {isEditMode ? 'Simpan Perubahan' : 'Tambah Pengguna'}
          </Button>
        </div>
      </form>
    </Form>
  );
}