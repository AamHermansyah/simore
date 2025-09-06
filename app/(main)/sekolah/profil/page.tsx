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
  School,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Edit3,
  Save,
  X,
  Lock,
  Building,
  Award,
  TrendingUp,
  Target,
  UserCheck,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/components/core/password-input';

const SchoolProfilePage = () => {
  // State untuk edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sample data - dalam implementasi sebenarnya dari API
  const [schoolData, setSchoolData] = useState({
    id: 1,
    name: 'SMAN 1 Tasikmalaya',
    npsn: '20234567',
    type: 'SMA Negeri',
    accreditation: 'A',
    email: 'admin@sman1tasik.sch.id',
    phone: '0265-123456',
    website: 'https://sman1tasik.sch.id',
    address: 'Jl. Pendidikan No. 10, Tasikmalaya, Jawa Barat 46116',
    principalName: 'Dr. Ahmad Sudrajat, M.Pd',
    principalPhone: '081234567890',
    coordinatorName: 'Siti Nurhalimah, S.Pd',
    coordinatorPhone: '081987654321',
    establishedYear: '1985',
    totalStudents: 1248,
    totalTeachers: 78,
    totalClasses: 36,
    totalClass: 15,
    joinDate: '2024-01-10',
    lastSync: '2024-09-06 14:30:00'
  });

  const [formData, setFormData] = useState({ ...schoolData });

  // Stats untuk monitoring tablet
  const monitoringStats = {
    totalParticipants: 624, // 50% dari total siswi
    activeThisWeek: 580,
    complianceRate: 87,
    averageXP: 1650,
    topPerformers: 45
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...schoolData });
  };

  const handleSave = () => {
    // Simulate API call
    setSchoolData({ ...formData });
    setIsEditing(false);
    // Show success message
    alert('Profil sekolah berhasil diperbarui!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...schoolData });
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
      <Card>
        <CardContent>

          <div className="text-center mb-6">
            <div className="text-center mb-2">
              <h1 className="text-2xl font-semibold">{schoolData.name}</h1>
              <p>NPSN: {schoolData.npsn}</p>
            </div>

            <div className="flex items-center justify-center space-x-6 text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>Akreditasi {schoolData.accreditation}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{schoolData.totalClasses} Kelas</span>
              </div>
            </div>
          </div>

          {/* School Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-700">{schoolData.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-blue-600">Total Siswi</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 text-center">
              <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-700">{schoolData.totalTeachers}</div>
              <div className="text-sm text-green-600">Total Guru</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-700">{schoolData.totalClass}</div>
              <div className="text-sm text-purple-600">Total Kelas</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-6 text-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-orange-700">{monitoringStats.complianceRate}%</div>
              <div className="text-sm text-orange-600">Tingkat Kepatuhan</div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-center gap-4">
            {!isEditing ? (
              <Button onClick={handleEdit}>
                <Edit3 className="h-6 w-6" />
                <span>Edit Profil</span>
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={handleSave}>
                  <Save className="h-6 w-6" />
                  <span>Simpan</span>
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-6 w-6" />
                  <span>Batal</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
        {/* School Information */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Sekolah</h2>
            <Separator className="my-2" />
            <div className="space-y-6">
              {/* School Name */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Nama Sekolah</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <School className="h-4 w-4 text-gray-400" />
                    <span>{schoolData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email Sekolah</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{schoolData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">No. Telepon</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{schoolData.phone}</span>
                  </div>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a href={schoolData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                      {schoolData.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Alamat Lengkap</label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                ) : (
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>{schoolData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Persons & Security */}
        <div className="space-y-6">
          {/* Principal Information */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">
                Kepala Sekolah
              </h2>
              <Separator className="my-2" />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Nama Kepala Sekolah</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.principalName}
                      onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{schoolData.principalName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">No. Telepon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.principalPhone}
                      onChange={(e) => setFormData({ ...formData, principalPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{schoolData.principalPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordinator Information */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">Koordinator Program</h2>
              <Separator className="my-2" />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Nama Koordinator</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.coordinatorName}
                      onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{schoolData.coordinatorName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">No. Telepon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.coordinatorPhone}
                      onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{schoolData.coordinatorPhone}</span>
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
              <Separator className="my-2" />
              <div className="space-y-4 pt-2">
                <div className="text-sm flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Bergabung sejak: {formatDate(schoolData.joinDate)}</span>
                </div>

                {/* Change Password Button */}
                <Button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full"
                >
                  <Lock className="h-4 w-4" />
                  Ubah Password
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

export default SchoolProfilePage;