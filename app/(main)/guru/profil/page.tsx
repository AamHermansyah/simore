'use client'

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  School,
  Edit3,
  Save,
  X,
  Lock,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/components/core/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const TeacherProfilePage = () => {
  // State untuk edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sample data - dalam implementasi sebenarnya dari API
  const [teacherData, setTeacherData] = useState({
    id: 1,
    name: 'Sari Dewi Lestari, S.Pd',
    nip: '198503152010012001',
    position: 'Guru BK',
    email: 'sari.dewi@school.edu',
    phone: '081234567890',
    address: 'Jl. Pendidikan No. 45, Tasikmalaya',
    birthDate: '1985-03-15',
    education: 'S1 Psikologi Pendidikan',
    university: 'Universitas Pendidikan Indonesia',
    graduationYear: '2008',
    joinDate: '2010-01-15',
    // Data spesifik untuk monitoring tablet tambah darah
    totalStudentsManaged: 125, // Total siswi yang diawasi
    class: '2022/2023', // Laporan mingguan selesai tahun ini
    currentWeekReports: 98, // Persentase laporan minggu ini
    totalReminders: 256, // Total reminder yang dikirim
    responseRate: 94, // Tingkat respon siswi
    teachingExperience: 14 // Tahun mengajar
  });

  const [formData, setFormData] = useState({ ...teacherData });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...teacherData });
  };

  const handleSave = () => {
    // Simulate API call
    setTeacherData({ ...formData });
    setIsEditing(false);
    // Show success message (bisa implement toast)
    alert('Profil berhasil diperbarui!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...teacherData });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent>
          {/* Basic Info */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{teacherData.name}</h1>
            <div className="flex items-center justify-center space-x-4 text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <School className="h-4 w-4" />
                <span>{teacherData.position}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>NIP: {teacherData.nip}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards - Khusus untuk monitoring tablet tambah darah */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{teacherData.totalStudentsManaged}</div>
              <div className="text-sm text-blue-600">Siswi Diawasi</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 text-center">
              <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{teacherData.currentWeekReports}%</div>
              <div className="text-sm text-emerald-600">Laporan Minggu Ini</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-4 text-center">
              <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{teacherData.class}</div>
              <div className="text-sm text-purple-600">Angkatan Diawasi</div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-center">
            {!isEditing ? (
              <Button
                variant="secondary"
                onClick={handleEdit}
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profil</span>
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  <span>Simpan</span>
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                >
                  <X className="h-4 w-4" />
                  <span>Batal</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
        {/* Personal Information */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Pribadi</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              {/* Email */}
              <div>
                <Label className="mb-2 block">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{teacherData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label className="mb-2 block">No. Telepon</Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{teacherData.phone}</span>
                  </div>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <Label className="mb-2 block">Tanggal Lahir</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(teacherData.birthDate)}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <Label className="mb-2 block">Alamat</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={3}
                  />
                ) : (
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{teacherData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information & Security */}
        <div className="space-y-6">
          {/* Professional Information */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">Informasi Profesional</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                {/* Education */}
                <div>
                  <Label className="mb-2 block">
                    Pendidikan Terakhir
                  </Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.education}
                      onChange={(e) =>
                        setFormData({ ...formData, education: e.target.value })
                      }
                    />
                  ) : (
                    <div className="text-sm flex items-center space-x-2 text-gray-900">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{teacherData.education}</span>
                    </div>
                  )}
                </div>

                {/* University */}
                <div>
                  <Label className="mb-2 block">
                    Universitas
                  </Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.university}
                      onChange={(e) =>
                        setFormData({ ...formData, university: e.target.value })
                      }
                    />
                  ) : (
                    <div className="text-sm flex items-center space-x-2 text-gray-900">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span>{teacherData.university}</span>
                    </div>
                  )}
                </div>

                {/* Graduation Year */}
                <div>
                  <Label className="mb-2 block">
                    Tahun Lulus
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.graduationYear}
                      onChange={(e) =>
                        setFormData({ ...formData, graduationYear: e.target.value })
                      }
                    />
                  ) : (
                    <div className="text-sm flex items-center space-x-2 text-gray-900">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{teacherData.graduationYear}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">Informasi Akun</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                <div className="text-sm flex items-center space-x-2 text-gray-900">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Bergabung sejak: {formatDate(teacherData.joinDate)}</span>
                </div>

                {/* Change Password Button */}
                <Button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full"
                >
                  <Lock className="h-4 w-4" />
                  <span>Ubah Password</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ubah Password
            </AlertDialogTitle>
            <AlertDialogDescription>
              Silakan masukkan password saat ini dan password baru Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <PasswordInput placeholder="Masukkan password saat ini" />
            <PasswordInput placeholder="Masukkan password baru" />
            <PasswordInput placeholder="Konfirmasi password baru" />
          </div>

          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel>
              Batal
            </AlertDialogCancel>
            <Button>
              Ubah Password
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeacherProfilePage;