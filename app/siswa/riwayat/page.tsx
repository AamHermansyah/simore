"use client";

import BottomNav from "../components/BottomNav";
import { useState, useEffect } from "react";
import { Check, X, Clock, Calendar, Filter, ChevronLeft } from "lucide-react";

// Import shadcn components if available
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define TypeScript types
interface HistoryItem {
  id: number;
  date: string;
  status: "completed" | "inProcess" | "rejected";
  ttdNumber: number;
  image: string;
  admin: string | null;
  notes?: string;
  rejectionReason?: string;
}

export default function RiwayatPage() {
  // Mock history data - in a real app, this would come from an API
  const [historyData, setHistoryData] = useState<HistoryItem[]>([
    { 
      id: 10, 
      date: "5 Agustus 2025", 
      status: "inProcess", 
      ttdNumber: 10, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: null,
      notes: "Menunggu konfirmasi dari admin"
    },
    { 
      id: 9, 
      date: "15 Juli 2025", 
      status: "completed", 
      ttdNumber: 9, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: "Dr. Rina Wulandari"
    },
    { 
      id: 8, 
      date: "28 Juni 2025", 
      status: "completed", 
      ttdNumber: 8, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: "Dr. Budi Santoso" 
    },
    { 
      id: 7, 
      date: "15 Mei 2025", 
      status: "completed", 
      ttdNumber: 7, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: "Dr. Budi Santoso" 
    },
    { 
      id: 6, 
      date: "10 April 2025", 
      status: "rejected", 
      ttdNumber: 6, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: "Dr. Siti Fatimah",
      rejectionReason: "Gambar tidak jelas, tidak dapat memverifikasi konsumsi obat"
    },
    { 
      id: 5, 
      date: "15 Maret 2025", 
      status: "completed", 
      ttdNumber: 5, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: "Dr. Rina Wulandari" 
    },
    { 
      id: 4, 
      date: "10 Februari 2025", 
      status: "completed", 
      ttdNumber: 4, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: "Dr. Budi Santoso" 
    },
    { 
      id: 3, 
      date: "15 Januari 2025", 
      status: "rejected", 
      ttdNumber: 3, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: "Dr. Siti Fatimah",
      rejectionReason: "Tanggal tidak sesuai dengan jadwal minum obat"
    },
    { 
      id: 2, 
      date: "10 Desember 2024", 
      status: "completed", 
      ttdNumber: 2, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: "Dr. Budi Santoso" 
    },
    { 
      id: 1, 
      date: "15 November 2024", 
      status: "completed", 
      ttdNumber: 1, 
      image: "https://placehold.co/400x300/jpeg", 
      admin: "Dr. Rina Wulandari" 
    }
  ]);

  // Animation state
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Filter states
  const [selectedTab, setSelectedTab] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);
  
  // Function to filter history based on selected tab
  const getFilteredHistory = () => {
    let filtered = [...historyData];
    
    // Filter by status
    if (selectedTab === "completed") {
      filtered = filtered.filter(item => item.status === "completed");
    } else if (selectedTab === "inProcess") {
      filtered = filtered.filter(item => item.status === "inProcess");
    } else if (selectedTab === "rejected") {
      filtered = filtered.filter(item => item.status === "rejected");
    }
    
    // Filter by year if not "all"
    if (yearFilter !== "all") {
      filtered = filtered.filter(item => {
        const itemYear = item.date.split(" ").pop(); // Get the last part which is the year
        return itemYear === yearFilter;
      });
    }
    
    // Filter by month if not "all"
    if (monthFilter !== "all") {
      filtered = filtered.filter(item => {
        const itemMonth = item.date.split(" ")[1]; // Get the middle part which is the month
        return itemMonth === monthFilter;
      });
    }
    
    return filtered;
  };
  
  // Get status badge properties
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return {
          text: "Selesai",
          color: "bg-green-700",
          icon: <Check className="h-3 w-3" />
        };
      case "inProcess":
        return {
          text: "Proses",
          color: "bg-blue-400",
          icon: <Clock className="h-3 w-3" />
        };
      case "rejected":
        return {
          text: "Ditolak",
          color: "bg-red-600",
          icon: <X className="h-3 w-3" />
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gray-500",
          icon: null
        };
    }
  };
  
  // Get years from history data for filter
  const getAvailableYears = () => {
    const years = new Set<string>();
    historyData.forEach(item => {
      const year = item.date.split(" ").pop() || "";
      years.add(year);
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending
  };
  
  // Get months from history data for filter
  const getAvailableMonths = () => {
    const months = new Set<string>();
    historyData.forEach(item => {
      const month = item.date.split(" ")[1] || "";
      months.add(month);
    });
    return Array.from(months);
  };
  
  // Get Indonesian month names mapping
  const getMonthName = (monthIndex: number): string => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return months[monthIndex];
  };
  
  const filteredHistory = getFilteredHistory();
  const availableYears = getAvailableYears();
  const availableMonths = getAvailableMonths();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with back button */}
      <header className="sticky top-0 z-10 bg-red-500 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-center">
            <h1 className="text-white text-lg font-bold">Riwayat</h1>
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 px-4 py-4 pb-24">
        <div className="max-w-md mx-auto">
          {/* Tabs navigation */}
          <Tabs 
            defaultValue="all" 
            value={selectedTab} 
            onValueChange={setSelectedTab} 
            className="w-full mb-4"
          >
            <TabsList className="grid grid-cols-4 w-full bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="all" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Semua
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Selesai
              </TabsTrigger>
              <TabsTrigger 
                value="inProcess" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Proses
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Ditolak
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full bg-white border border-gray-200 rounded-xl">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-full bg-white border border-gray-200 rounded-xl">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Bulan</SelectItem>
                  {availableMonths.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* History List */}
          <div className="space-y-3">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => {
                const statusBadge = getStatusBadge(item.status);
                
                return (
                  <Card 
                    key={item.id}
                    className={`p-4 bg-white rounded-xl shadow-sm border-0 transition-all duration-500 ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="flex mb-2 items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-2 p-1 bg-red-600 rounded-full">
                          <Calendar className="h-3.5 w-3.5 text-white" />
                        </div>
                        <h3 className="font-medium text-sm">Konsumsi TTD Ke-{item.ttdNumber}</h3>
                      </div>
                      <Badge className={`${statusBadge.color} text-white border-0 px-2 py-0.5 text-xs flex items-center gap-1`}>
                        {statusBadge.icon} {statusBadge.text}
                      </Badge>
                    </div>
                    
                    <div className="flex">
                      <div className="w-24 h-24 rounded-lg overflow-hidden mr-3">
                        <img 
                          src={item.image} 
                          alt={`TTD ke-${item.ttdNumber}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 space-y-1">
                          <p className="flex justify-between">
                            <span>Tanggal Konsumsi:</span>
                            <span className="font-medium text-gray-700">{item.date}</span>
                          </p>
                          
                          {item.admin && (
                            <p className="flex justify-between">
                              <span>Dikonfirmasi oleh:</span>
                              <span className="font-medium text-gray-700">{item.admin}</span>
                            </p>
                          )}
                          
                          {item.status === "inProcess" && (
                            <p className="flex justify-between">
                              <span>Status:</span>
                              <span className="font-medium text-blue-500">
                                {item.notes || "Menunggu konfirmasi"}
                              </span>
                            </p>
                          )}
                          
                          {item.status === "rejected" && item.rejectionReason && (
                            <p className="flex justify-between mt-1">
                              <span>Alasan Penolakan:</span>
                              <span className="font-medium text-red-500 text-right max-w-[170px]">
                                {item.rejectionReason}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-gray-500 font-medium">Tidak ada data</h3>
                <p className="text-gray-400 text-sm">
                  Tidak ada riwayat konsumsi TTD yang ditemukan
                </p>
              </div>
            )}
          </div>
          
          {/* Show more button if there's pagination */}
          {filteredHistory.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              Muat Lebih Banyak
            </Button>
          )}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}