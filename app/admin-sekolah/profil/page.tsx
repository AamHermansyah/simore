"use client";

import BottomNav from "../components/BottomNav";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Settings, 
  MessageCircle, 
  Info, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  School,
  Building,
  Stethoscope
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function ProfilSekolahPage() {
  const router = useRouter();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Mock admin data
  const adminData = {
    name: "Budi Santoso",
    photo: null, // We'll handle this case and show initials if no photo
    school: "MTSN 4 Tasikmalaya",
    puskesmas: "Puskesmas Cihideung"
  };

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);

  const handleLogout = () => {
    // In a real app, you would handle the logout logic here
    // For now, we'll just redirect to the login page
    router.push("/");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!adminData.name) return "";
    return adminData.name.split(" ").map(n => n[0]).join("");
  };

  // Menu items
  const menuSections = [
    {
      title: "Sekolah",
      items: [
        { 
          icon: <User className="h-4 w-4 text-gray-500" />, 
          text: "Profil", 
          link: "profil/data_admin" 
        },
        { 
          icon: <Settings className="h-4 w-4 text-gray-500" />, 
          text: "Pengaturan", 
          link: "profil/settings" 
        }
      ]
    },
    {
      title: "Bantuan",
      items: [
        { 
          icon: <MessageCircle className="h-4 w-4 text-gray-500" />, 
          text: "WhatsApp Pusat", 
          link: "https://api.whatsapp.com/send/?phone=08985686144&text&type=phone_number&app_absent=0" 
        }
      ]
    },
    {
      title: "Tentang",
      items: [
        { 
          icon: <Info className="h-4 w-4 text-gray-500" />, 
          text: "SIMORE", 
          link: "/about" 
        },
        { 
          icon: <HelpCircle className="h-4 w-4 text-gray-500" />, 
          text: "FAQ", 
          link: "/faq" 
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with title */}
      <header className="sticky top-0 z-10 bg-red-500 shadow-sm">
        <div className="px-4 py-2.5 flex items-center justify-center">
          <h1 className="text-white text-base font-bold">Profil Sekolah</h1>
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 px-3 py-3 pb-20 w-full max-w-screen-sm mx-auto">
        <div className="w-full">
          {/* Profile Card */}
          <Card 
            className={`border-0 py-2 bg-red-500 rounded-lg shadow-md mb-4 transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="p-3.5 flex items-center">
              {/* Profile Photo */}
              <div className="mr-3.5 relative">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-white">
                  {adminData.photo ? (
                    <img 
                      src={adminData.photo} 
                      alt={adminData.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white text-base font-bold">
                      {getUserInitials()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Admin Info */}
              <div className="text-white">
                <h2 className="font-bold text-base">{adminData.name}</h2>
                <div className="flex items-center text-xs mt-0.5">
                  <Building className="h-3 w-3 mr-1" />
                  <span>{adminData.school}</span>
                </div>
                <div className="flex items-center text-xs mt-0.5">
                  <Stethoscope className="h-3 w-3 mr-1" />
                  <span className="opacity-90">{adminData.puskesmas}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Menu Sections */}
          <div className="space-y-2.5">
            {menuSections.map((section, sectionIndex) => (
              <div 
                key={section.title}
                className={`transition-all duration-500 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${(sectionIndex + 1) * 100}ms` }}
              >
                <h3 className="text-gray-500 font-medium text-xs mb-1.5 px-1">
                  {section.title}
                </h3>
                <Card className="border-0 py-3 rounded-lg overflow-hidden shadow-sm">
                  <div className="flex flex-col">
                    {section.items.map((item, itemIndex) => (
                      <Link 
                        key={item.text} 
                        href={item.link}
                        className={`flex items-center justify-between py-2 px-3 hover:bg-gray-50 transition-colors ${
                          itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="mr-2.5 bg-gray-100 p-1.5 rounded-full">
                            {item.icon}
                          </div>
                          <span className="text-sm font-medium">{item.text}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </Card>
              </div>
            ))}

            {/* Logout Button */}
            <div 
              className={`pt-3 transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${(menuSections.length + 1) * 100}ms` }}
            >
              <Button 
                className="w-full bg-red-500 hover:bg-red-600 text-white h-10 rounded-lg font-medium text-sm shadow-sm"
                onClick={() => setShowLogoutConfirmation(true)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
        <DialogContent className="sm:max-w-md border-0 rounded-lg shadow-2xl max-w-[90vw] mx-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600 text-base">Konfirmasi Keluar</DialogTitle>
            <DialogDescription className="text-sm">
              Apakah Anda yakin ingin keluar dari aplikasi SIMORE?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="sm:justify-between flex gap-2 mt-3">
            <Button 
              type="button"
              variant="outline"
              className="flex-1 text-sm h-9"
              onClick={() => setShowLogoutConfirmation(false)}
            >
              Batal
            </Button>
            <Button 
              type="button" 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm h-9"
              onClick={handleLogout}
            >
              Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}