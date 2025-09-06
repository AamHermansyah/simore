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
  Award,
  TrendingUp,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/components/core/password-input';

const StudentProfilePage = () => {
  // State untuk edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sample data - dalam implementasi sebenarnya dari API
  const [studentData, setStudentData] = useState({
    id: 1,
    name: 'Siti Aminah',
    nis: '2024001',
    class: '10A',
    email: 'siti.aminah@school.edu',
    phone: '081234567890',
    address: 'Jl. Merdeka No. 123, Tasikmalaya',
    birthDate: '2008-05-15',
    bloodType: 'O+',
    parentName: 'Budi Santoso',
    parentPhone: '081987654321',
    totalXP: 2450,
    currentStreak: 12,
    longestStreak: 18,
    completionRate: 92,
    joinDate: '2024-01-15'
  });

  const [formData, setFormData] = useState({ ...studentData });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...studentData });
  };

  const handleSave = () => {
    // Simulate API call
    setStudentData({ ...formData });
    setIsEditing(false);
    // Show success message (bisa implement toast)
    alert('Profil berhasil diperbarui!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...studentData });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{studentData.name}</h1>
            <div className="flex items-center justify-center space-x-4 text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <School className="h-4 w-4" />
                <span>Kelas {studentData.class}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>NIS: {studentData.nis}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 text-center">
              <Award className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{studentData.totalXP}</div>
              <div className="text-sm text-emerald-600">Total XP</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-4 text-center">
              <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">{studentData.currentStreak}</div>
              <div className="text-sm text-orange-600">Current Streak</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 text-center">
              <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{studentData.completionRate}%</div>
              <div className="text-sm text-blue-600">Completion Rate</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-4 text-center">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{studentData.longestStreak}</div>
              <div className="text-sm text-purple-600">Best Streak</div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Pribadi</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{studentData.email}</span>
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{studentData.phone}</span>
                  </div>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Tanggal Lahir</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(studentData.birthDate)}</span>
                  </div>
                )}
              </div>

              {/* Blood Type */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Golongan Darah</label>
                {isEditing ? (
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🩸</span>
                    </div>
                    <span>{studentData.bloodType}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Alamat</label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  />
                ) : (
                  <div className="flex items-start space-x-2 text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>{studentData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent Information & Security */}
        <div className="space-y-6">
          {/* Parent Information */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">Informasi Orang Tua</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                {/* Parent Name */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Nama Orang Tua</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{studentData.parentName}</span>
                    </div>
                  )}
                </div>

                {/* Parent Phone */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">No. Telepon Orang Tua</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{studentData.parentPhone}</span>
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
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Bergabung sejak: {formatDate(studentData.joinDate)}</span>
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

export default StudentProfilePage;