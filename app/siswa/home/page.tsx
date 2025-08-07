"use client";

import BottomNav from "../components/BottomNav";
import { useState, useEffect, useRef } from "react";
import { Calendar, Check, X, Clock, Medal, Award, TrendingUp, Camera, Upload, History } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter

// Import shadcn components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function ProfilePage() {
  const router = useRouter(); // Initialize router

  // Mock user data - dalam implementasi nyata, ini akan diambil dari API
  const [user, setUser] = useState({
    name: "Anita Susanti",
    photo: "https://i.pravatar.cc/150?img=5",
    achievements: {
      completed: 6, // Completed 6 times, so gets silver badge
    },
    status: {
      completed: 8,
      inProgress: 3,
      notCompleted: 1,
    },
    // Status bulan ini
    currentMonth: {
      status: "notStarted", // bisa: "notStarted", "inProcess", "completed"
      nextSchedule: "15 Agustus 2025",
      lastTaken: "28 Juli 2025",
      lastConfirmed: null,
      ttdCount: 9, // Total TTD yang sudah dikonsumsi
      currentMonthTTD: 0 // TTD yang dikonsumsi bulan ini
    }
  });

  // Animation state
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);

  const getBadgeType = (completions) => {
    if (completions >= 12) return { type: "emas", color: "bg-yellow-600" };
    if (completions >= 6) return { type: "silver", color: "bg-gray-500" };
    if (completions >= 3) return { type: "perunggu", color: "bg-amber-700" };
    return null;
  };

  // State for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // States for form inputs
  const [intakeDate, setIntakeDate] = useState(new Date());
  const [medicineImage, setMedicineImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Cek apakah tombol konfirmasi bisa diklik (tidak dalam proses)
  const isButtonDisabled = user.currentMonth.status === "inProcess";
  
  // Fungsi untuk mendapatkan text tombol yang sesuai
  const getButtonText = () => {
    if (user.currentMonth.status === "inProcess") {
      return "Menunggu Konfirmasi Admin";
    } else if (user.currentMonth.status === "completed") {
      return "Sudah Selesai Bulan Ini";
    } else {
      return "Konfirmasi Minum Obat Tambah Darah";
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedicineImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Format date to Indonesian format
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('id-ID', options);
  };
  
  const handleConfirmation = () => {
    // Validate that both date and image are provided
    if (!intakeDate || !medicineImage) {
      return; // In a real app, show validation error
    }
    
    // Format the date
    const formattedDate = formatDate(intakeDate);
    
    // Calculate the next TTD number
    const nextTTDNumber = user.currentMonth.ttdCount + 1;
    
    // In a real app, you would upload the image to a server
    // and get a URL back. Here we use the preview as a placeholder.
    
    // Update user state
    setUser(prev => ({
      ...prev,
      currentMonth: {
        ...prev.currentMonth,
        status: "inProcess", // Ubah status menjadi dalam proses
        lastTaken: formattedDate,
        lastConfirmed: new Date().toISOString(),
        ttdCount: nextTTDNumber,
        currentMonthTTD: prev.currentMonth.currentMonthTTD + 1
      },
      status: {
        ...prev.status,
        inProgress: prev.status.inProgress + 1,
      }
    }));
    
    // Reset form states
    setMedicineImage(null);
    setImagePreview(null);
    setIntakeDate(new Date());
    setShowConfirmation(false);
  };

  // Handle navigation to history page
  const handleViewHistory = () => {
    router.push('/riwayat');
  };

  const badgeInfo = getBadgeType(user.achievements.completed);
  
  // Fungsi untuk mendapatkan warna dan text status
  const getStatusInfo = () => {
    switch(user.currentMonth.status) {
      case "completed":
        return {
          color: "bg-green-700",
          text: "Selesai",
          progressColor: "bg-green-700",
          progressWidth: "100%",
          iconBg: "bg-green-700",
          contentBg: "bg-green-50",
          textColor: "text-green-700",
          icon: <Check className="h-4 w-4" />,
          infoTitle: "Terakhir disetujui",
          infoContent: user.currentMonth.lastTaken
        };
      case "inProcess":
        return {
          color: "bg-blue-400",
          text: "Proses",
          progressColor: "bg-blue-400",
          progressWidth: "66%",
          iconBg: "bg-blue-400",
          contentBg: "bg-blue-50",
          textColor: "text-blue-400",
          icon: <Clock className="h-4 w-4" />,
          infoTitle: "Terakhir minum obat",
          infoContent: user.currentMonth.lastTaken
        };
      default:
        return {
          color: "bg-blue-800",
          text: "Belum Dimulai",
          progressColor: "bg-blue-800",
          progressWidth: "33%",
          iconBg: "bg-blue-800",
          contentBg: "bg-blue-50",
          textColor: "text-blue-800",
          icon: <Calendar className="h-4 w-4" />,
          infoTitle: "Jadwal minum obat berikutnya",
          infoContent: user.currentMonth.nextSchedule
        };
    }
  };
  
  const statusInfo = getStatusInfo();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main content container */}
      <main className="flex-1 px-4 py-4 pb-20 overflow-auto">
        <div className="max-w-md mx-auto flex flex-col h-full">
          {/* Profile Card */}
          <Card 
            className={`p-5 mb-4 shadow-md border-0 bg-white rounded-xl transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <div className="flex items-start gap-4">
              {/* Avatar - removed shadow */}
              <div className="relative group">
                <div className="relative h-20 w-20 rounded-xl overflow-hidden">
                  {user.photo ? (
                    <img 
                      src={user.photo} 
                      alt={user.name} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                </div>
              </div>
              
              {/* User info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-primary-600">{user.name}</h2>
                
                {/* TTD Counter Badge */}
                <div className="mt-1 flex items-center">
                  <div className="mr-2 p-1 bg-red-600 rounded-full shadow-sm">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Konsumsi TTD Ke-{user.currentMonth.ttdCount}
                  </span>
                </div>
                
                {/* Achievement badge */}
                {badgeInfo && (
                  <div className="mt-2 flex items-center">
                    <div className="mr-2 p-1 bg-red-600 rounded-full shadow-sm">
                      <Medal className="h-4 w-4 text-white" />
                    </div>
                    <Badge className={`${badgeInfo.color} text-white capitalize border-0 px-3 py-1 shadow-sm transition-all duration-300 hover:shadow-md`}>
                      {badgeInfo.type}
                    </Badge>
                    <span className="text-xs text-gray-500 ml-2">
                      {user.achievements.completed}/12 kali
                    </span>
                  </div>
                )}
            
              </div>
            </div>
          </Card>
          
          {/* Status Boxes - dengan ukuran lebih kecil */}
          <Card 
            className={`p-4 mb-4 shadow-md border-0 bg-white rounded-xl transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 -translate-y-4'}`}
          >
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <Award className="h-4 w-4 mr-2 text-red-600" />
              <span className="text-red-600">Status Kepatuhan</span>
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-green-50 p-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex justify-center mb-1 bg-green-700 text-white p-2 rounded-full w-8 h-8 mx-auto">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-xl font-bold text-green-700">{user.status.completed}</p>
                <p className="text-xs text-gray-600 font-medium">Selesai</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex justify-center mb-1 bg-blue-400 text-white p-2 rounded-full w-8 h-8 mx-auto">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-xl font-bold text-blue-400">{user.status.inProgress}</p>
                <p className="text-xs text-gray-600 font-medium">Proses</p>
              </div>
              
              <div className="bg-red-50 p-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex justify-center mb-1 bg-red-600 text-white p-2 rounded-full w-8 h-8 mx-auto">
                  <X className="h-4 w-4" />
                </div>
                <p className="text-xl font-bold text-red-600">{user.status.notCompleted}</p>
                <p className="text-xs text-gray-600 font-medium">Tidak Selesai</p>
              </div>
            </div>
          </Card>
          
          {/* Monthly Status - dengan ukuran lebih kecil */}
          <Card 
            className={`p-4 mb-4 shadow-md border-0 bg-white rounded-xl transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 -translate-y-4'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-800" />
                <span className="text-blue-800">Status Bulan Ini</span>
              </h3>
              <Badge className={`${statusInfo.color} text-white border-0 px-2 py-0.5 text-xs shadow-sm`}>
                {statusInfo.text}
              </Badge>
            </div>
            
            {/* Progress indicator */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${statusInfo.progressColor} transition-all duration-1000 ease-in-out`}
                style={{ 
                  width: isLoaded ? statusInfo.progressWidth : '0%'
                }}
              ></div>
            </div>
            
            <div className="border-t border-gray-100 pt-3">
              <div className={`flex items-center ${statusInfo.textColor} ${statusInfo.contentBg} p-3 rounded-xl`}>
                <div className={`${statusInfo.iconBg} text-white p-1.5 rounded-full mr-3`}>
                  {statusInfo.icon}
                </div>
                <div>
                  <p className="text-xs font-medium">{statusInfo.infoTitle}</p>
                  <p className="text-sm font-semibold">{statusInfo.infoContent}</p>
                </div>
              </div>
            </div>
          </Card>      
          
          {/* Confirmation Button - selalu ditampilkan, tapi dinonaktifkan jika status inProcess */}
          <div 
            className={`mt-auto mb-2 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4'}`}
          >
            <Button 
              className={`relative w-full py-3 rounded-xl border-0 transition-all duration-300 font-medium ${
                isButtonDisabled 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
              }`}
              onClick={() => !isButtonDisabled && setShowConfirmation(true)}
              disabled={isButtonDisabled}
            >
              {getButtonText()}
            </Button>
            {isButtonDisabled && (
              <p className="text-xs text-gray-500 text-center mt-1">
                Menunggu konfirmasi dari admin
              </p>
            )}
          </div>
          
          {/* Enhanced Confirmation Dialog with Form */}
          <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
            <DialogContent className="sm:max-w-md border-0 rounded-xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-red-600">Konfirmasi Konsumsi TTD</DialogTitle>
                <DialogDescription>
                  Silakan masukkan informasi konsumsi Tablet Tambah Darah Anda.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                {/* TTD Counter */}
                <div className="text-center mb-4">
                  <Badge className="bg-red-100 text-red-600 px-3 py-1.5 text-sm font-medium border-0">
                    Konsumsi TTD Ke-{user.currentMonth.ttdCount + 1}
                  </Badge>
                </div>
                
                {/* Date Picker */}
                <div className="space-y-2">
                  <Label htmlFor="intakeDate" className="text-sm font-medium">
                    Tanggal Minum Obat
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border border-gray-300 rounded-lg pl-3 pr-2 py-2 flex items-center justify-between"
                      >
                        {intakeDate ? formatDate(intakeDate) : <span>Pilih tanggal</span>}
                        <Calendar className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={intakeDate}
                        onSelect={setIntakeDate}
                        disabled={(date) => 
                          date > new Date() || date < new Date(new Date().setMonth(new Date().getMonth() - 1))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="medicineImage" className="text-sm font-medium">
                    Foto Bukti Konsumsi Obat
                  </Label>
                  <div className="flex flex-col items-center space-y-3">
                    {imagePreview ? (
                      <div className="w-full relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="absolute bottom-2 right-2 bg-white bg-opacity-75 hover:bg-opacity-100"
                          onClick={() => {
                            setMedicineImage(null);
                            setImagePreview(null);
                          }}
                        >
                          Ganti
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-400 transition-colors"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Camera className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 font-medium">Klik untuk mengambil foto</p>
                        <p className="text-xs text-gray-400">Atau upload gambar dari galeri</p>
                      </div>
                    )}
                    <input 
                      type="file"
                      id="medicineImage"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {!imagePreview && (
                      <Button 
                        variant="outline" 
                        className="w-full text-sm"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Foto
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="sm:justify-between flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirmation(false)}
                >
                  Batal
                </Button>
                <Button 
                  type="button" 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={!intakeDate || !medicineImage}
                  onClick={handleConfirmation}
                >
                  Konfirmasi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}