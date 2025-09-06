'use client'

import React, { useState } from 'react';
import {
  School,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Users,
  Calendar,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Lock,
  Building,
  Award,
  TrendingUp,
  Target,
  Shield,
  Camera,
  UserCheck,
  GraduationCap,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trophy
} from 'lucide-react';

const SchoolProfileDetail = () => {
  // State untuk edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    activePrograms: 15,
    joinDate: '2024-01-10',
    lastSync: '2024-09-06 14:30:00'
  });

  const [formData, setFormData] = useState({ ...schoolData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  const handlePasswordChange = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password minimal 8 karakter!');
      return;
    }

    // Simulate API call
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
    alert('Password berhasil diubah!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccreditationColor = (accreditation: string) => {
    switch (accreditation) {
      case 'A': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'B': return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'C': return 'bg-gradient-to-r from-yellow-500 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-blue-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
          {/* Cover Background */}
          <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 relative">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute bottom-4 left-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{schoolData.name}</h1>
              <p className="text-blue-100 text-lg">{schoolData.type} • NPSN: {schoolData.npsn}</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8 pt-6">
            {/* School Logo */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white">
                  <School className="h-16 w-16" />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="text-center mb-6">
              {/* Accreditation Badge */}
              <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-white font-bold text-lg ${getAccreditationColor(schoolData.accreditation)} shadow-lg mb-4`}>
                <Award className="h-6 w-6" />
                <span>Akreditasi {schoolData.accreditation}</span>
              </div>

              <div className="flex items-center justify-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Didirikan {schoolData.establishedYear}</span>
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
                <div className="text-3xl font-bold text-purple-700">{schoolData.activePrograms}</div>
                <div className="text-sm text-purple-600">Program Aktif</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-6 text-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-700">{monitoringStats.complianceRate}%</div>
                <div className="text-sm text-orange-600">Tingkat Kepatuhan</div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-center">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg text-lg"
                >
                  <Edit3 className="h-6 w-6" />
                  <span>Edit Profil Sekolah</span>
                </button>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg text-lg"
                  >
                    <Save className="h-6 w-6" />
                    <span>Simpan Perubahan</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg text-lg"
                  >
                    <X className="h-6 w-6" />
                    <span>Batal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monitoring Stats */}
        <div className="bg-white rounded-3xl shadow-lg border-0 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="h-7 w-7 text-indigo-600 mr-3" />
            Statistik Program Tablet Tambah Darah
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-6 text-center">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-indigo-700">{monitoringStats.totalParticipants}</div>
              <div className="text-sm text-indigo-600">Siswi Peserta</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-700">{monitoringStats.activeThisWeek}</div>
              <div className="text-sm text-green-600">Aktif Minggu Ini</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className={`text-2xl font-bold ${getComplianceColor(monitoringStats.complianceRate)}`}>
                {monitoringStats.complianceRate}%
              </div>
              <div className="text-sm text-blue-600">Tingkat Kepatuhan</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-yellow-700">{monitoringStats.averageXP.toLocaleString()}</div>
              <div className="text-sm text-yellow-600">Rata-rata XP</div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-6 text-center">
              <Trophy className="h-8 w-8 text-pink-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-pink-700">{monitoringStats.topPerformers}</div>
              <div className="text-sm text-pink-600">Top Performers</div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* School Information */}
          <div className="bg-white rounded-3xl shadow-lg border-0 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <School className="h-6 w-6 text-blue-600 mr-3" />
              Informasi Sekolah
            </h2>

            <div className="space-y-6">
              {/* School Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Nama Sekolah</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900 text-lg font-medium">
                    <School className="h-5 w-5 text-gray-400" />
                    <span>{schoolData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email Sekolah</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{schoolData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">No. Telepon</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{schoolData.phone}</span>
                  </div>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a href={schoolData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                      {schoolData.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Alamat Lengkap</label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                ) : (
                  <div className="flex items-start space-x-2 text-gray-900">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <span>{schoolData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Persons & Security */}
          <div className="space-y-6">
            {/* Principal Information */}
            <div className="bg-white rounded-3xl shadow-lg border-0 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="h-6 w-6 text-purple-600 mr-3" />
                Kepala Sekolah
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Nama Kepala Sekolah</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.principalName}
                      onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <User className="h-5 w-5 text-gray-400" />
                      <span>{schoolData.principalName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">No. Telepon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.principalPhone}
                      onChange={(e) => setFormData({ ...formData, principalPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{schoolData.principalPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coordinator Information */}
            <div className="bg-white rounded-3xl shadow-lg border-0 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserCheck className="h-6 w-6 text-green-600 mr-3" />
                Koordinator Program
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Nama Koordinator</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.coordinatorName}
                      onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <User className="h-5 w-5 text-gray-400" />
                      <span>{schoolData.coordinatorName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">No. Telepon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.coordinatorPhone}
                      onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{schoolData.coordinatorPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-3xl shadow-lg border-0 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="h-6 w-6 text-red-600 mr-3" />
                Informasi Sistem
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">Bergabung sejak:</span>
                  </div>
                  <span className="text-gray-900 font-medium">{formatDate(schoolData.joinDate)}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">Sinkronisasi terakhir:</span>
                  </div>
                  <span className="text-gray-900 font-medium">{formatDateTime(schoolData.lastSync)}</span>
                </div>

                {/* Change Password Button */}
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-xl hover:from-red-700 hover:to-pink-800 transition-all duration-200 shadow-lg text-lg font-medium mt-6"
                >
                  <Lock className="h-6 w-6" />
                  <span>Ubah Password Sistem</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="h-6 w-6 text-red-600 mr-3" />
                Ubah Password Sistem
              </h2>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Password Saat Ini</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Masukkan password saat ini"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Konfirmasi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Security Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium mb-2">Syarat Keamanan Password:</p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Minimal 8 karakter</li>
                        <li>• Kombinasi huruf besar dan kecil</li>
                        <li>• Minimal 1 angka dan 1 karakter khusus</li>
                        <li>• Tidak menggunakan informasi sekolah</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handlePasswordChange}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-xl hover:from-red-700 hover:to-pink-800 transition-all duration-200 shadow-lg font-medium"
                  >
                    Ubah Password
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg font-medium"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="bg-white rounded-3xl shadow-lg border-0 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 mr-3" />
            Status Sistem & Integrasi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Database Status */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-600 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Database</h3>
              <p className="text-sm text-green-700">Status: Terhubung</p>
              <p className="text-xs text-green-600 mt-1">Terakhir sync: {formatDateTime(schoolData.lastSync)}</p>
            </div>

            {/* Puskesmas Integration */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-blue-800 mb-2">Puskesmas</h3>
              <p className="text-sm text-blue-700">Status: Terintegrasi</p>
              <p className="text-xs text-blue-600 mt-1">Data monitoring aktif</p>
            </div>

            {/* Backup Status */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-purple-800 mb-2">Backup</h3>
              <p className="text-sm text-purple-700">Status: Otomatis</p>
              <p className="text-xs text-purple-600 mt-1">Backup harian aktif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfileDetail;