"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Search, Download, MoreVertical, ChevronLeft } from "lucide-react";
import BottomNav from "../../components/BottomNav";
import { use } from "react"; // Import React.use
import StudentCard from "../../components/StudentCard"; // Import komponen StudentCard

// Import shadcn components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { Toaster } from "sonner";

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

export default function ClassDetailPage({ params }) {
  const router = useRouter();
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;
  
  // State for class data
  const [classDetail, setClassDetail] = useState<ClassData | null>(null);
  
  // Mock student data for this specific class
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
      class: "VII-7", 
      date: "31 Juli 2025", 
      status: "rejected",
      imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Citra" 
    },
    { 
      id: 4, 
      name: "Dian Purnama", 
      class: "VII-7", 
      date: "28 Juli 2025", 
      status: "pending",
      imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Dian" 
    },
    { 
      id: 5, 
      name: "Eka Pratiwi", 
      class: "VII-7", 
      date: "25 Juli 2025", 
      status: "pending",
      imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Eka" 
    },
  ]);

  // Animation state
  const [isLoaded, setIsLoaded] = useState(false);
  
  // State for filters and dialogs
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  
  // Fetch class data on mount
  useEffect(() => {
    // In a real app, you would fetch the class data from an API
    // For now, we'll mock it
    const mockClass = {
      id: parseInt(classId),
      name: "VII-7",
      code: "7A2025",
      completedCount: 2,
      totalStudents: 5
    };
    
    setClassDetail(mockClass);
    setNewClassName(mockClass.name);
    
    // Trigger animations after component mounts
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, [classId]);
  
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

  // Function to handle student validation
  const handleValidation = (studentId, newStatus) => {
    setStudentData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, status: newStatus } 
          : student
      )
    );
    
    // Update class completed count
    if (newStatus === "completed") {
      setClassDetail(prev => prev ? {
        ...prev,
        completedCount: prev.completedCount + 1
      } : null);
    } else if (newStatus === "inProcess" || newStatus === "rejected") {
      setClassDetail(prev => prev ? {
        ...prev,
        completedCount: Math.max(0, prev.completedCount - 1)
      } : null);
    }
  };
  
  // Function to handle validating all pending students
  const handleValidateAll = () => {
    const pendingStudents = studentData.filter(student => 
      student.status === "inProcess"
    );
    
    // Update only students with "inProcess" status to completed
    setStudentData(prev => 
      prev.map(student => 
        student.status === "inProcess"
          ? { ...student, status: "completed" } 
          : student
      )
    );
    
    // Update class completed count
    setClassDetail(prev => prev ? {
      ...prev,
      completedCount: prev.completedCount + pendingStudents.length
    } : null);
    
    // Show toast notification
    toast.success("Semua laporan divalidasi", {
      description: `${pendingStudents.length} laporan siswa telah divalidasi.`
    });
  };
  
  // Function to handle class deletion
  const handleDeleteClass = () => {
    // In a real app, you would call an API to delete the class
    router.push("/admin-sekolah/kelas");
    
    // Show toast notification
    toast.error("Kelas dihapus", {
      description: `Kelas ${classDetail?.name} telah dihapus.`
    });
    
    setIsDeleteDialogOpen(false);
  };
  
  // Function to handle class renaming
  const handleRenameClass = () => {
    if (!newClassName) return;
    
    // In a real app, you would call an API to rename the class
    setClassDetail(prev => prev ? {
      ...prev,
      name: newClassName
    } : null);
    
    // Show toast notification
    toast.success("Nama kelas diubah", {
      description: `Kelas telah diubah menjadi "${newClassName}".`
    });
    
    setIsRenameDialogOpen(false);
  };
  
  const filteredStudents = getFilteredStudents();

  if (!classDetail) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Toast container */}
      <Toaster position="top-center" />
      
      {/* Header with search, download and more options */}
      <header className="sticky top-0 z-10 bg-red-500 shadow-sm">
        <div className="px-4 py-3">
          {/* Search bar with back button, download and more options */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push("/admin-sekolah/kelas")}
              className="p-2 rounded-lg bg-red-600 text-white mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 relative">
              <Input 
                type="text" 
                placeholder="Cari nama siswa..." 
                className="h-9 rounded-lg border-none shadow-sm bg-white text-gray-800 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
            </div>
            <div className="flex">
              <Button variant="ghost" className="p-2 text-white">
                <Download className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2 text-white">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                    Ubah Nama Kelas
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-red-600"
                  >
                    Hapus Kelas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      {/* Class info and progress */}
      <div className="bg-white px-4 py-2 shadow-sm">
        {/* Class name and code */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-semibold text-lg">{classDetail.name}</h1>
          <Badge className="bg-blue-100 text-blue-800 border-0 px-2 py-0.5 text-xs">
            {classDetail.code}
          </Badge>
        </div>
        
        {/* Progress bar (with reduced height) */}
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-gray-600">Progress Siswa:</span>
          <span className="font-medium">{Math.round((classDetail.completedCount / classDetail.totalStudents) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-500"
            style={{ width: `${(classDetail.completedCount / classDetail.totalStudents) * 100}%` }}
          ></div>
        </div>
        <div className="mt-1 text-xs text-gray-600 mb-1">
          Selesai {classDetail.completedCount}/{classDetail.totalStudents} siswa
        </div>
      </div>

      {/* Main content container */}
      <main className="flex-1 px-4 py-2 pb-24">
        <div className="max-w-md mx-auto">
          {/* Filter section with validate all button */}
          <div className="flex gap-2 mb-4 items-center">
            <Select value={selectedFilter} onValueChange={setSelectedFilter} className="flex-1">
              <SelectTrigger className="bg-white border border-gray-200 rounded-xl">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="sudah">Sudah</SelectItem>
                <SelectItem value="belum">Belum</SelectItem>
                <SelectItem value="validasi">Proses</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleValidateAll}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 h-9"
            >
              Validasi Semua
            </Button>
          </div>
          
          {/* Student list */}
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
        </div>
      </main>
      
      {/* Delete Class Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Kelas</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Apakah Anda yakin ingin menghapus kelas {classDetail.name}? Semua data siswa dalam kelas ini akan dihapus.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="mr-2"
            >
              Batal
            </Button>
            <Button 
              onClick={handleDeleteClass} 
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus Kelas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rename Class Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ubah Nama Kelas</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nama Kelas (cth: VII-7)"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="mb-4"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRenameDialogOpen(false)}
              className="mr-2"
            >
              Batal
            </Button>
            <Button 
              onClick={handleRenameClass} 
              className="bg-red-600 hover:bg-red-700"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}