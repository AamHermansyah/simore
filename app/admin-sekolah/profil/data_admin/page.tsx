"use client";

import BottomNav from "../../components/BottomNav";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Edit, School, Mail, Phone, Building, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DataAdminPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Mock admin data
  const adminData = {
    name: "Budi Santoso",
    photo: null,
    institution: "MTSN 4 Tasikmalaya",
    email: "budi.santoso@gmail.com",
    phone: "081234567890",
    gender: "Laki-laki",
    puskesmas: "Puskesmas Cihideung"
  };

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);

  // Get admin initials for avatar fallback
  const getAdminInitials = () => {
    if (!adminData.name) return "";
    return adminData.name.split(" ").map(n => n[0]).join("");
  };

  // Data fields to display
  const adminDataFields = [
    { 
      icon: <User className="h-4 w-4 text-gray-500" />, 
      label: "Nama Lengkap", 
      value: adminData.name 
    },
    { 
      icon: <Building className="h-4 w-4 text-gray-500" />, 
      label: "Instansi", 
      value: adminData.institution 
    },
    { 
      icon: <Mail className="h-4 w-4 text-gray-500" />, 
      label: "Email", 
      value: adminData.email 
    },
    { 
      icon: <Phone className="h-4 w-4 text-gray-500" />, 
      label: "No. Handphone (WhatsApp)", 
      value: adminData.phone 
    },
    { 
      icon: <User className="h-4 w-4 text-gray-500" />, 
      label: "Jenis Kelamin", 
      value: adminData.gender 
    },
    { 
      icon: <Stethoscope className="h-4 w-4 text-gray-500" />, 
      label: "Puskesmas", 
      value: adminData.puskesmas 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with title */}
      <header className="sticky top-0 z-10 bg-red-500 shadow-sm">
        <div className="px-4 py-2.5 flex items-center justify-center">
          <h1 className="text-white text-base font-bold">Data Admin Sekolah</h1>
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
                {adminData.photo ? (
                  <img 
                    src={adminData.photo} 
                    alt={adminData.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {getAdminInitials()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Data Card */}
          <Card 
            className={`border-0 rounded-lg overflow-hidden shadow-sm mb-6 transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="p-0">
              {adminDataFields.map((field, index) => (
                <div 
                  key={field.label} 
                  className={`flex items-start p-3.5 ${
                    index < adminDataFields.length - 1 ? 'border-b border-gray-100' : ''
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
              onClick={() => router.push('edit_data')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Ubah Data Admin
            </Button>
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}