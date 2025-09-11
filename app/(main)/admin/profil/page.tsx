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
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Edit3,
  Save,
  X,
  Lock,
  Users,
  School,
  FileText,
  Building2,
  UserCheck,
  Crown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/components/core/password-input';

const SuperAdminProfilePage = () => {
  // State untuk edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sample data - dalam implementasi sebenarnya dari API
  const [superAdminData, setSuperAdminData] = useState({
    id: 1,
    name: 'Dr. Sari Maharani, S.Kom, M.Kes',
    nip: '196812151990032001',
    position: 'Kepala Divisi Sistem Informasi Kesehatan',
    department: 'Dinas Kesehatan Provinsi Jawa Barat',
    email: 'sari.maharani@jabar.go.id',
    phone: '0811234567890',
    officePhone: '022-4567890',
    address: 'Jl. Soekarno Hatta No. 576, Bandung, Jawa Barat 40292',
    region: 'Provinsi Jawa Barat',
    accessLevel: 'National',
    totalPuskesmas: 156,
    totalSekolah: 1240,
    totalSiswi: 89560,
    totalUsers: 2845,
    systemUptime: 99.8,
    activeRegions: 27,
    monthlyReports: 98.5,
    criticalAlerts: 3,
    pendingApprovals: 8,
    lastLogin: '2024-09-09T08:30:00',
    joinDate: '2020-03-15',
    lastSystemMaintenance: '2024-09-01',
    totalDataProcessed: '2.4TB'
  });

  const [formData, setFormData] = useState({ ...superAdminData });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...superAdminData });
  };

  const handleSave = () => {
    // Simulate API call
    setSuperAdminData({ ...formData });
    setIsEditing(false);
    alert('Profil Super Admin berhasil diperbarui!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...superAdminData });
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-500 rounded-full mb-4 shadow-lg relative">
              <Shield className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-yellow-800" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{superAdminData.name}</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-4 text-center">
              <Building2 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{superAdminData.totalPuskesmas}</div>
              <div className="text-sm text-purple-600">Puskesmas</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-4 text-center">
              <School className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{superAdminData.totalSekolah.toLocaleString()}</div>
              <div className="text-sm text-blue-600">Sekolah</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 text-center">
              <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{(superAdminData.totalSiswi / 1000).toFixed(0)}K</div>
              <div className="text-sm text-emerald-600">Siswi</div>
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
              {/* Full Name */}
              <div>
                <Label className="mb-2 block">Nama Lengkap</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{superAdminData.name}</span>
                  </div>
                )}
              </div>

              {/* NIP */}
              <div>
                <Label className="mb-2 block">NIP</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.nip}
                    onChange={(e) =>
                      setFormData({ ...formData, nip: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{superAdminData.nip}</span>
                  </div>
                )}
              </div>

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
                    <span>{superAdminData.email}</span>
                  </div>
                )}
              </div>

              {/* Personal Phone */}
              <div>
                <Label className="mb-2 block">No. Telepon Pribadi</Label>
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
                    <span>{superAdminData.phone}</span>
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
                    <span>{superAdminData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Official & System Information */}
        <div className="space-y-6">
          {/* Official Information */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">Informasi Jabatan</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                {/* Position */}
                <div>
                  <Label className="mb-2 block">Jabatan</Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span>{superAdminData.position}</span>
                    </div>
                  )}
                </div>

                {/* Department */}
                <div>
                  <Label className="mb-2 block">Instansi</Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{superAdminData.department}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">Informasi Sistem</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Bergabung sejak: {formatDate(superAdminData.joinDate)}</span>
                </div>

                {/* Change Password Button */}
                <Button className="w-full" onClick={() => setIsChangingPassword(true)}>
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
            <AlertDialogTitle>Ubah Password Super Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Perubahan password Super Admin memerlukan verifikasi tambahan untuk keamanan sistem.
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
            <AlertDialogAction>
              Ubah Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SuperAdminProfilePage;