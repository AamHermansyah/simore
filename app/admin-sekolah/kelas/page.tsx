"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Search, Download, PlusCircle } from "lucide-react";
import BottomNav from "../components/BottomNav";
import StudentCard from "../components/StudentCard"; // Import komponen StudentCard

// Import shadcn components
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
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define TypeScript types
interface ClassData {
  id: number;
  name: string;
  code: string;
  completedCount: number;
  totalStudents: number;
}

interface StudentData {
  id: number;
  name: string;
  class: string;
  date: string;
  status: "completed" | "inProcess" | "rejected" | "pending";
  imageUrl: string;
}

export default function LaporanPage() {
  const router = useRouter();
  
  // Mock class data
  const [classData, setClassData] = useState([
    { id: 1, name: "VII-7", code: "7A2025", completedCount: 27, totalStudents: 30 },
    { id: 2, name: "VII-8", code: "7B2025", completedCount: 25, totalStudents: 32 },
    { id: 3, name: "VIII-1", code: "8A2025", completedCount: 28, totalStudents: 29 },
    { id: 4, name: "VIII-2", code: "8B2025", completedCount: 26, totalStudents: 30 },
    { id: 5, name: "IX-3", code: "9C2025", completedCount: 24, totalStudents: 28 },
  ]);

  // Mock student data
  const [studentData, setStudentData] = useState([
    { 
      id: 1, 
      name: "Aisyah Putri", 
      class: "VII-7", 
      date: "5 Agustus 2025", 
      status: "inProcess",
      imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Aisyah" 
    },
    { 
      id: 2, 
      name: "Bella Safira", 
      class: "VII-7", 
      date: "1 Agustus 2025", 
      status: "completed",
      imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Bella" 
    },
    { 
      id: 3, 
      name: "Citra Dewi", 
      class: "VIII-1", 
      date: "31 Juli 2025", 
      status: "rejected",
      imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Citra" 
    },
    { 
      id: 4, 
      name: "Dian Purnama", 
      class: "VIII-2", 
      date: "28 Juli 2025", 
      status: "completed",
      imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Dian" 
    },
    { 
      id: 5, 
      name: "Eka Pratiwi", 
      class: "IX-3", 
      date: "25 Juli 2025", 
      status: "pending",
      imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Eka" 
    },
  ]);

  // Animation state
  const [isLoaded, setIsLoaded] = useState(false);
  
  // State for view mode and filters
  const [selectedTab, setSelectedTab] = useState("kelas");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);
  
  // Function to generate random class code
  const generateClassCode = (className) => {
    const prefix = className.split('-')[0].charAt(0);
    const number = Math.floor(Math.random() * 10);
    const year = new Date().getFullYear();
    return `${prefix}${number}${year}`;
  };
  
  // Function to handle class creation
  const handleCreateClass = () => {
    if (!newClassName) return;
    
    const newClass = {
      id: classData.length + 1,
      name: newClassName,
      code: generateClassCode(newClassName),
      completedCount: 0,
      totalStudents: 0
    };
    
    setClassData([...classData, newClass]);
    setNewClassName("");
    setIsDialogOpen(false);
  };
  
  // Function to filter student data based on selected filter
  const getFilteredStudents = () => {
    let filtered = [...studentData];
    
    if (searchQuery) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedFilter === "sudah") {
      filtered = filtered.filter(student => student.status === "completed");
    } else if (selectedFilter === "belum") {
      filtered = filtered.filter(student => student.status === "pending");
    } else if (selectedFilter === "validasi") {
      filtered = filtered.filter(student => student.status === "inProcess");
    } else if (selectedFilter === "ditolak") {
      filtered = filtered.filter(student => student.status === "rejected");
    }
    
    return filtered;
  };
  
  // Function to navigate to class detail page
  const handleClassClick = (classId) => {
    router.push(`kelas/${classId}`);
  };

  // Function to handle student validation
  const handleValidation = (studentId, newStatus) => {
    setStudentData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, status: newStatus } 
          : student
      )
    );
  };
  
  const filteredStudents = getFilteredStudents();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with search and download */}
      <header className="sticky top-0 z-10 bg-red-500 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex-1 mr-2 relative">
            {/* Icon pencarian */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            {/* Input dengan padding kiri tambahan untuk memberi ruang ke icon */}
            <Input 
            type="text" 
            placeholder="Cari nama atau NIS..." 
            className="h-9 rounded-lg border-none shadow-sm bg-white text-gray-800 pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" className="p-2 text-white">
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 px-4 py-4 pb-24">
        <div className="max-w-md mx-auto">
          {/* Tabs navigation */}
          <Tabs 
            defaultValue="kelas" 
            value={selectedTab} 
            onValueChange={setSelectedTab} 
            className="w-full mb-4"
          >
            <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="kelas" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Kelas
              </TabsTrigger>
              <TabsTrigger 
                value="siswa" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Siswa
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Filter section - only show on siswa tab */}
          {selectedTab === "siswa" && (
            <div className="flex gap-2 mb-4">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full bg-white border border-gray-200 rounded-xl">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="sudah">Sudah</SelectItem>
                  <SelectItem value="belum">Belum</SelectItem>
                  <SelectItem value="validasi">Validasi</SelectItem>
                  <SelectItem value="ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Content based on selected tab */}
          {selectedTab === "kelas" ? (
            // Class list
            <div className="space-y-3">
              {classData.map((classItem, index) => (
                <Card 
                  key={classItem.id}
                  className={`p-4 bg-white rounded-xl shadow-sm border-0 transition-all duration-500 cursor-pointer ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => handleClassClick(classItem.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{classItem.name}</h3>
                    <Badge className="bg-blue-100 text-blue-800 border-0 px-2 py-0.5 text-xs">
                      {classItem.code}
                    </Badge>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Progress Siswa:</span>
                      <span className="font-medium">{Math.round((classItem.completedCount / classItem.totalStudents) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: `${(classItem.completedCount / classItem.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Selesai {classItem.completedCount}/{classItem.totalStudents} siswa
                    </div>
                  </div>
                </Card>
              ))}
              
              {/* No classes found message */}
              {classData.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-500 font-medium">Tidak ada kelas</h3>
                  <p className="text-gray-400 text-sm">
                    Belum ada kelas yang ditambahkan
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Student list with validation controls
            <div className="space-y-3">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onValidation={handleValidation}
                    className={isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    transitionDelay={index * 50}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-500 font-medium">Tidak ada data</h3>
                  <p className="text-gray-400 text-sm">
                    Tidak ada siswa yang ditemukan
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Create Class Button - only on kelas tab */}
      {selectedTab === "kelas" && (
        <div className="fixed bottom-20 right-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 shadow-lg">
                <PlusCircle className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Buat Kelas Baru</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Nama Kelas (cth: VII-7)"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="mb-4"
                />
                <Button 
                  onClick={handleCreateClass} 
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Buat Kelas
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}