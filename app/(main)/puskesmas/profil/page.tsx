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
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Edit3,
  Save,
  X,
  Lock,
  Clock,
  Target,
  Users,
  School,
  BarChart3,
  FileText
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/components/core/password-input';

const PuskesmasProfilePage = () => {
  // State untuk edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sample data - dalam implementasi sebenarnya dari API
  const [puskesmasData, setPuskesmasData] = useState({
    id: 1,
    name: 'Puskesmas Tasikmalaya Kota',
    code: 'PSK001',
    address: 'Jl. Sutisna Senjaya No. 15, Tasikmalaya, Jawa Barat 46116',
    phone: '0265-331234',
    email: 'puskesmas.tskmlykota@kemkes.go.id',
    website: 'www.puskesmastasikmalaya.go.id',
    kepala: 'dr. Andi Wijaya, M.Kes',
    nip: '197805152008011003',
    phoneKepala: '081234567890',
    wilayahKerja: 'Kecamatan Tasikmalaya, Kecamatan Cihideung',
    totalSekolah: 25,
    totalSiswi: 2450,
    tingkatKepatuhan: 89,
    laporanBulanIni: 87,
    kasusAnemia: 12,
    siswiBelumLapor: 158,
    establishedDate: '1995-08-17',
    lastUpdate: '2024-09-09'
  });

  const [formData, setFormData] = useState({ ...puskesmasData });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...puskesmasData });
  };

  const handleSave = () => {
    // Simulate API call
    setPuskesmasData({ ...formData });
    setIsEditing(false);
    alert('Profil Puskesmas berhasil diperbarui!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...puskesmasData });
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{puskesmasData.name}</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 text-center">
              <School className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{puskesmasData.totalSekolah}</div>
              <div className="text-sm text-blue-600">Sekolah</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 text-center">
              <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{puskesmasData.totalSiswi.toLocaleString()}</div>
              <div className="text-sm text-emerald-600">Total Siswi</div>
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
        {/* Institution Information */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Institusi</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label className="mb-2 block">Nama Puskesmas</Label>
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
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{puskesmasData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="mb-2 block">Email Resmi</Label>
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
                    <span>{puskesmasData.email}</span>
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
                    <span>{puskesmasData.phone}</span>
                  </div>
                )}
              </div>

              {/* Website */}
              <div>
                <Label className="mb-2 block">Website</Label>
                {isEditing ? (
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-blue-600 hover:underline cursor-pointer">{puskesmasData.website}</span>
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
                    <span>{puskesmasData.address}</span>
                  </div>
                )}
              </div>

              {/* Wilayah Kerja */}
              <div>
                <Label className="mb-2 block">Wilayah Kerja</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.wilayahKerja}
                    onChange={(e) =>
                      setFormData({ ...formData, wilayahKerja: e.target.value })
                    }
                    rows={2}
                  />
                ) : (
                  <div className="flex items-start space-x-2 text-sm">
                    <Target className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{puskesmasData.wilayahKerja}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leadership & System Information */}
        <div className="space-y-6">
          {/* Leadership Information */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">Informasi Kepala Puskesmas</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                {/* Kepala Name */}
                <div>
                  <Label className="mb-2 block">Nama Kepala Puskesmas</Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.kepala}
                      onChange={(e) =>
                        setFormData({ ...formData, kepala: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{puskesmasData.kepala}</span>
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
                      <span>{puskesmasData.nip}</span>
                    </div>
                  )}
                </div>

                {/* Kepala Phone */}
                <div>
                  <Label className="mb-2 block">No. Telepon Kepala</Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={formData.phoneKepala}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneKepala: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{puskesmasData.phoneKepala}</span>
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
                <div className="text-sm flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Bergabung sejak: {formatDate(puskesmasData.lastUpdate)}</span>
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
              Silakan masukkan password saat ini dan password baru untuk akun Puskesmas.
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

export default PuskesmasProfilePage;