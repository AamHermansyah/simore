"use client";

import { useState } from "react";
import { Loader2, User, Mail, Phone, Lock, School, FileText, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    nisn: "",
    school: "",
    inviteCode: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRadioChange = (value) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Nama harus diisi minimal 2 karakter";
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    }
    
    // Validate phone
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Nomor telepon minimal 10 digit";
    }
    
    // Validate NISN
    if (!formData.nisn || formData.nisn.length < 10) {
      newErrors.nisn = "NISN harus diisi 10 digit";
    }
    
    // Validate school
    if (!formData.school || formData.school.length < 2) {
      newErrors.school = "Nama sekolah harus diisi";
    }
    
    // Validate invite code
    if (!formData.inviteCode || formData.inviteCode.length < 6) {
      newErrors.inviteCode = "Kode undangan harus diisi";
    }
    
    // Validate password
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter";
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Kata sandi tidak sama";
    } else if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi kata sandi minimal 6 karakter";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    try {
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form data:", formData);
      
      // Redirect to login page after successful registration
      // In a real app: router.push("/Login");
      alert("Pendaftaran berhasil! Anda akan diarahkan ke halaman login.");
    } catch (err) {
      setFormError("Pendaftaran gagal. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-4 flex items-center justify-center">
        <h2 className="text-xl font-bold">SIMORE</h2>
      </div>

      {/* Registration Form */}
      <div className="flex-1 px-4 pb-16 overflow-y-auto max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Silakan isi data diri Anda untuk mendaftar sebagai siswa
          </p>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {formError}
            </div>
          )}

          <div className="space-y-4">
            {/* Personal Information Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    name="name"
                    placeholder="Nama Lengkap" 
                    className="w-full pl-10 h-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    className="w-full pl-10 h-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    name="phone"
                    placeholder="Nomor Telepon" 
                    className="w-full pl-10 h-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Gender Field */}
              <div className="bg-gray-50 p-3 rounded-xl">
                <label className="text-sm font-medium mb-2 block">Jenis Kelamin</label>
                <div className="flex flex-row space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="gender-male"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={() => handleRadioChange("male")}
                      className="w-4 h-4 text-blue-600"
                      disabled={isLoading}
                    />
                    <label htmlFor="gender-male" className="font-normal cursor-pointer text-sm">
                      Laki-laki
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="gender-female"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={() => handleRadioChange("female")}
                      className="w-4 h-4 text-blue-600"
                      disabled={isLoading}
                    />
                    <label htmlFor="gender-female" className="font-normal cursor-pointer text-sm">
                      Perempuan
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Student-specific Fields */}
            <div className="space-y-4 mt-4 pt-4 border-t border-gray-100">
              {/* NISN Field */}
              <div>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    name="nisn"
                    placeholder="NISN" 
                    className="w-full pl-10 h-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={formData.nisn}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {errors.nisn && <p className="text-red-500 text-xs mt-1">{errors.nisn}</p>}
              </div>

              {/* School Field */}
              <div>
                <div className="relative">
                  <School className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    name="school"
                    placeholder="Nama Sekolah" 
                    className="w-full pl-10 h-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={formData.school}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {errors.school && <p className="text-red-500 text-xs mt-1">{errors.school}</p>}
              </div>

              {/* Invite Code Field */}
              <div>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    name="inviteCode"
                    placeholder="Kode Undangan" 
                    className="w-full pl-10 h-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={formData.inviteCode}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {/* <p className="text-xs text-gray-500 mt-1">
                  Kode undangan diberikan oleh pihak sekolah
                </p> */}
                {errors.inviteCode && <p className="text-red-500 text-xs mt-1">{errors.inviteCode}</p>}
              </div>
            </div>
            {/* Password Fields */}
            <div className="space-y-4 border-t border-gray-100">
              {/* Password Field */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Kata Sandi" 
                    className="w-full pl-10 h-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Konfirmasi Kata Sandi" 
                    className="w-full pl-10 h-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button 
              type="button" 
              className="w-full h-12 rounded-xl font-medium text-base mt-6 bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline mr-2 h-5 w-5 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  Daftar 
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Sudah memiliki akun?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Masuk
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 text-center text-xs text-gray-500 fixed bottom-0 w-full">
        © 2025 SIMORE • Versi 1.0
      </div>
    </div>
  );
}