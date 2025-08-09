"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Loader2, 
  ArrowLeft,
  ChevronDown,
  Search,
  X,
  Stethoscope
} from "lucide-react";
import BottomNav from "../../components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EditDataAdminPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showPuskesmasDropdown, setShowPuskesmasDropdown] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [puskesmasSearch, setPuskesmasSearch] = useState("");
  const schoolDropdownRef = useRef(null);
  const puskesmasDropdownRef = useRef(null);
  
  // Sample school list
  const schoolList = [
    "MTSN 4 Tasikmalaya",
    "MTSN 1 Tasikmalaya",
    "MTSN 2 Tasikmalaya",
    "SMAN 1 Tasik",
    "SMAN 2 Tasik",
    "SMKN 1 Tasik",
    "MAN 1 Tasik",
    "MAN 2 Tasik"
  ];

  // Sample puskesmas list
  const puskesmasList = [
    "Puskesmas Cihideung",
    "Puskesmas Tawang",
    "Puskesmas Indihiang",
    "Puskesmas Kawalu",
    "Puskesmas Mangkubumi",
    "Puskesmas Tamansari",
    "Puskesmas Purbaratu",
    "Puskesmas Bungursari"
  ];
  
  // Use the same data structure from the Data Admin page
  const initialAdminData = {
    name: "Budi Santoso",
    institution: "MTSN 4 Tasikmalaya",
    email: "budi.santoso@gmail.com",
    phone: "081234567890",
    gender: "Laki-laki",
    puskesmas: "Puskesmas Cihideung"
  };
  
  // State for form data
  const [formData, setFormData] = useState(initialAdminData);
  
  // State for validation errors
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
    
    // Add event listener to close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target)) {
        setShowSchoolDropdown(false);
      }
      if (puskesmasDropdownRef.current && !puskesmasDropdownRef.current.contains(event.target)) {
        setShowPuskesmasDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleSchoolSelect = (institution) => {
    setFormData(prev => ({
      ...prev,
      institution
    }));
    setShowSchoolDropdown(false);
    setSchoolSearch("");
    
    // Clear error when selecting
    if (errors.institution) {
      setErrors(prev => ({
        ...prev,
        institution: null
      }));
    }
  };

  const handlePuskesmasSelect = (puskesmas) => {
    setFormData(prev => ({
      ...prev,
      puskesmas
    }));
    setShowPuskesmasDropdown(false);
    setPuskesmasSearch("");
    
    // Clear error when selecting
    if (errors.puskesmas) {
      setErrors(prev => ({
        ...prev,
        puskesmas: null
      }));
    }
  };
  
  const filteredSchools = schoolSearch.trim() === "" 
    ? schoolList 
    : schoolList.filter(school => 
        school.toLowerCase().includes(schoolSearch.toLowerCase())
      );
  
  const filteredPuskesmas = puskesmasSearch.trim() === "" 
    ? puskesmasList 
    : puskesmasList.filter(puskesmas => 
        puskesmas.toLowerCase().includes(puskesmasSearch.toLowerCase())
      );
  
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
    
    // Validate institution
    if (!formData.institution) {
      newErrors.institution = "Instansi harus dipilih";
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

    // Validate puskesmas
    if (!formData.puskesmas) {
      newErrors.puskesmas = "Puskesmas harus dipilih";
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
      
      console.log("Updated admin data:", formData);
      
      // Redirect back to data admin page after successful update
      router.push("data_admin");
    } catch (err) {
      setFormError("Pembaruan gagal. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with title - using red-500 from data diri page */}
      <header className="sticky top-0 z-10 bg-red-500 shadow-sm">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <button 
            onClick={() => router.push("data_admin")}
            className="text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-white text-base font-bold">Ubah Data Admin</h1>
          <div className="w-5"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 px-4 py-4 pb-20 w-full max-w-screen-sm mx-auto">
        <div 
          className={`w-full transition-all duration-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Card className="bg-white rounded-2xl shadow-sm p-5 mb-4">

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="text-sm font-medium mb-2 block">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input 
                    name="name"
                    placeholder="Nama Lengkap" 
                    className="w-full pl-10 h-11 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" 
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Institution Field as Modern Search-Select Dropdown */}
              <div ref={schoolDropdownRef} className="relative">
                <label className="text-sm font-medium mb-2 block">Instansi</label>
                <div 
                  className="relative flex items-center cursor-pointer h-11 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent"
                  onClick={() => setShowSchoolDropdown(true)}
                >
                  <Building className="absolute left-3 h-4 w-4 text-gray-400" />
                  <div className="flex-1 pl-10 pr-4 py-2 truncate text-sm">
                    {formData.institution ? formData.institution : (
                      <span className="text-gray-400">Pilih Instansi</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 mr-3" />
                </div>
                {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
                
                {/* School Search Dropdown */}
                {showSchoolDropdown && (
                  <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-60 overflow-auto">
                    <div className="px-2 pb-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Cari instansi..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-md border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                          value={schoolSearch}
                          onChange={(e) => setSchoolSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="mt-1">
                      {filteredSchools.length > 0 ? (
                        filteredSchools.map((school) => (
                          <div
                            key={school}
                            className="px-3 py-1.5 text-sm hover:bg-red-50 cursor-pointer truncate"
                            onClick={() => handleSchoolSelect(school)}
                          >
                            {school}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                          Tidak ada instansi yang cocok
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    className="w-full pl-10 h-11 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" 
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading} 
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="text-sm font-medium mb-2 block">Nomor Telepon (WhatsApp)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input 
                    name="phone"
                    placeholder="Nomor Telepon (WhatsApp)" 
                    className="w-full pl-10 h-11 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" 
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
                      value="Laki-laki"
                      checked={formData.gender === "Laki-laki"}
                      onChange={() => handleRadioChange("Laki-laki")}
                      className="w-4 h-4 text-red-600"
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
                      value="Perempuan"
                      checked={formData.gender === "Perempuan"}
                      onChange={() => handleRadioChange("Perempuan")}
                      className="w-4 h-4 text-red-600"
                      disabled={isLoading}
                    />
                    <label htmlFor="gender-female" className="font-normal cursor-pointer text-sm">
                      Perempuan
                    </label>
                  </div>
                </div>
              </div>

              {/* Puskesmas Field as Modern Search-Select Dropdown */}
              <div ref={puskesmasDropdownRef} className="relative">
                <label className="text-sm font-medium mb-2 block">Puskesmas</label>
                <div 
                  className="relative flex items-center cursor-pointer h-11 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent"
                  onClick={() => setShowPuskesmasDropdown(true)}
                >
                  <Stethoscope className="absolute left-3 h-4 w-4 text-gray-400" />
                  <div className="flex-1 pl-10 pr-4 py-2 truncate text-sm">
                    {formData.puskesmas ? formData.puskesmas : (
                      <span className="text-gray-400">Pilih Puskesmas</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 mr-3" />
                </div>
                {errors.puskesmas && <p className="text-red-500 text-xs mt-1">{errors.puskesmas}</p>}
                
                {/* Puskesmas Search Dropdown */}
                {showPuskesmasDropdown && (
                  <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-60 overflow-auto">
                    <div className="px-2 pb-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Cari puskesmas..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-md border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                          value={puskesmasSearch}
                          onChange={(e) => setPuskesmasSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="mt-1">
                      {filteredPuskesmas.length > 0 ? (
                        filteredPuskesmas.map((puskesmas) => (
                          <div
                            key={puskesmas}
                            className="px-3 py-1.5 text-sm hover:bg-red-50 cursor-pointer truncate"
                            onClick={() => handlePuskesmasSelect(puskesmas)}
                          >
                            {puskesmas}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                          Tidak ada puskesmas yang cocok
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button - using red-500 from data diri page */}
              <button 
                type="button" 
                className="w-full h-12 rounded-xl font-medium text-base mt-6 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="inline mr-2 h-5 w-5 animate-spin" /> Memproses...
                  </>
                ) : (
                  <>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}