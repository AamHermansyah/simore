"use client";

import BottomNav from "../../components/BottomNav";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Edit, School, Mail, Phone, Calendar, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DataDiriPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Mock user data
  const userData = {
    name: "Annisa",
    photo: null,
    nis: "1234567890",
    email: "annisa@gmail.com",
    phone: "08123458888",
    gender: "Perempuan",
    birthDate: "17 Agustus 2006",
    school: "SMAN 1 Tasik",
    class: "XII IPA 2"
  };

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userData.name) return "";
    return userData.name.split(" ").map(n => n[0]).join("");
  };

  // Data fields to display
  const userDataFields = [
    { 
      icon: <User className="h-4 w-4 text-gray-500" />, 
      label: "Nama Lengkap", 
      value: userData.name 
    },
    { 
      icon: <UserCircle className="h-4 w-4 text-gray-500" />, 
      label: "NIS", 
      value: userData.nis 
    },
    { 
      icon: <Mail className="h-4 w-4 text-gray-500" />, 
      label: "Email", 
      value: userData.email 
    },
    { 
      icon: <Phone className="h-4 w-4 text-gray-500" />, 
      label: "No. Handphone (WhatsApp)", 
      value: userData.phone 
    },
    { 
      icon: <User className="h-4 w-4 text-gray-500" />, 
      label: "Jenis Kelamin", 
      value: userData.gender 
    },
    { 
      icon: <Calendar className="h-4 w-4 text-gray-500" />, 
      label: "Tanggal Lahir", 
      value: userData.birthDate 
    },
    { 
      icon: <School className="h-4 w-4 text-gray-500" />, 
      label: "Sekolah", 
      value: userData.school 
    },
    { 
      icon: <School className="h-4 w-4 text-gray-500" />, 
      label: "Kelas", 
      value: userData.class 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with title */}
      <header className="sticky top-0 z-10 bg-red-500 shadow-sm">
        <div className="px-4 py-2.5 flex items-center justify-center">
          <h1 className="text-white text-base font-bold">Data Diri</h1>
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 px-3 py-4 pb-20 w-full max-w-screen-sm mx-auto">
        <div className="w-full">
          {/* Profile Photo Section */}
          <div 
            className={`mb-6 flex flex-col items-center transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-white shadow-md">
                {userData.photo ? (
                  <img 
                    src={userData.photo} 
                    alt={userData.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {getUserInitials()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Data Card */}
          <Card 
            className={`border-0 rounded-lg overflow-hidden shadow-sm mb-6 transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="p-0">
              {userDataFields.map((field, index) => (
                <div 
                  key={field.label} 
                  className={`flex items-start p-3.5 ${
                    index < userDataFields.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="mr-3 bg-gray-100 p-1.5 rounded-full">
                    {field.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 font-medium mb-0.5">
                      {field.label}
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {field.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Edit Button */}
          <div 
            className={`mt-4 transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button 
              className="w-full bg-red-500 hover:bg-red-600 text-white h-10 rounded-lg font-medium text-sm shadow-sm"
              onClick={() => router.push('/edit-data-diri')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Ubah Data Diri
            </Button>
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}