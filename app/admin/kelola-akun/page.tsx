'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import BottomNav from "../components/BottomNav";
import UserTable from "../components/UserTable";
import UserCard from "../components/UserCard";
import CardSchool from "../components/CardSchool";
import UserFormModal from "../components/UserFormModal";
import SchoolFormModal from "../components/SchoolFormModal";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Users, Building, User as UserIcon } from "lucide-react";
import { 
  sekolah, 
  siswa, 
  adminSekolah, 
  kelas 
} from "@/data/dummyData";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interface for User (based on dummyData.ts)
interface User {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  instansiId?: string;
  sekolahId?: string;
  kelasId?: string;
  nis?: string;
  tanggalLahir?: string;
  role: 'admin' | 'siswi';
}

// Interface for School (based on dummyData.ts)
interface School {
  id: string;
  nama: string;
  alamat: string;
  puskesmasId: string;
}

// Interface for UserFormValues
interface UserFormValues {
  name: string;
  email: string;
  role: 'admin' | 'siswi';
  schoolId: string;
  phoneNumber?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  nis?: string;
  birthDate?: string;
  classId?: string;
}

// CSS untuk membuat scrollbar custom
const customScrollbarStyle = `
  /* Membuat scrollbar tipis */
  .scrollbar-thin::-webkit-scrollbar {
    width: 0px;
    display: none;
  }
  
  /* Sembunyikan scrollbar untuk IE, Edge, dan Firefox */
  .scrollbar-thin {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

export default function KelolaAkun() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [selectedSchool, setSelectedSchool] = useState<School | undefined>(undefined);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isSchoolFormOpen, setIsSchoolFormOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("sekolah");
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");

  useEffect(() => {
    // Convert adminSekolah to User format
    const adminUsers: User[] = adminSekolah.map(admin => ({
      id: admin.id,
      nama: admin.nama,
      email: admin.email,
      noHp: admin.noHp,
      jenisKelamin: admin.jenisKelamin,
      instansiId: admin.instansiId,
      role: 'admin'
    }));

    // Convert siswa to User format
    const siswaUsers: User[] = siswa.map(s => ({
      id: s.id,
      nama: s.nama,
      email: s.email,
      noHp: s.noHp,
      jenisKelamin: s.jenisKelamin,
      sekolahId: s.sekolahId,
      kelasId: s.kelasId,
      nis: s.nis,
      tanggalLahir: s.tanggalLahir,
      role: 'siswi'
    }));

    // Combine users
    const allUsers = [...adminUsers, ...siswaUsers];

    // Simulate data loading
    setTimeout(() => {
      setUsers(allUsers);
      setSchools(sekolah);
      setIsLoaded(true);
    }, 100);
  }, []);

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsUserFormOpen(true);
  };

  const handleAddSchool = () => {
    setSelectedSchool(undefined);
    setIsSchoolFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    
    // In a real app, you would call an API to delete the user
    // For now, we'll just update the local state
    setUsers(users.filter(user => user.id !== userToDelete));
    
    toast.success("Pengguna dihapus", {
      description: "Pengguna berhasil dihapus dari sistem."
    });
    
    setUserToDelete(null);
  };

  const handleFormSubmit = (data: UserFormValues) => {
    if (selectedUser) {
      // Update existing user
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          const updatedUser = {
            ...user,
            nama: data.name,
            email: data.email,
            role: data.role
          };
          
          if (data.role === 'admin') {
            updatedUser.instansiId = data.schoolId;
          } else {
            updatedUser.sekolahId = data.schoolId;
            updatedUser.kelasId = data.classId;
            updatedUser.nis = data.nis;
            updatedUser.tanggalLahir = data.birthDate;
          }
          
          if (data.phoneNumber) updatedUser.noHp = data.phoneNumber;
          if (data.gender) updatedUser.jenisKelamin = data.gender;
          
          return updatedUser;
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      toast.success("Pengguna diperbarui", {
        description: "Informasi pengguna berhasil diperbarui."
      });
    } else {
      // Create new user
      const newId = `user-${Date.now().toString()}`;
      
      const newUser: User = {
        id: newId,
        nama: data.name,
        email: data.email,
        noHp: data.phoneNumber || '',
        jenisKelamin: data.gender || 'Laki-laki',
        role: data.role
      };
      
      if (data.role === 'admin') {
        newUser.instansiId = data.schoolId;
      } else {
        newUser.sekolahId = data.schoolId;
        newUser.kelasId = data.classId;
        newUser.nis = data.nis;
        newUser.tanggalLahir = data.birthDate;
      }
      
      setUsers([...users, newUser]);
      
      toast.success("Pengguna ditambahkan", {
        description: "Pengguna baru berhasil ditambahkan ke sistem."
      });
    }
    
    setIsUserFormOpen(false);
  };

  const handleSchoolFormSubmit = (data: any) => {
    if (selectedSchool) {
      // Update existing school
      const updatedSchools = schools.map(school => {
        if (school.id === selectedSchool.id) {
          return {
            ...school,
            nama: data.name,
            alamat: data.address,
            puskesmasId: data.puskesmasId || school.puskesmasId
          };
        }
        return school;
      });
      
      setSchools(updatedSchools);
      
      toast.success("Sekolah diperbarui", {
        description: "Informasi sekolah berhasil diperbarui."
      });
    } else {
      // Create new school
      const newId = `sekolah-${Date.now().toString()}`;
      
      const newSchool: School = {
        id: newId,
        nama: data.name,
        alamat: data.address,
        puskesmasId: data.puskesmasId || 'puskesmas-001', // Default to first puskesmas
      };
      
      setSchools([...schools, newSchool]);
      
      toast.success("Sekolah ditambahkan", {
        description: "Sekolah baru berhasil ditambahkan ke sistem."
      });
    }
    
    setIsSchoolFormOpen(false);
  };

  const handleSchoolClick = (schoolId: string) => {
    router.push(`/admin/sekolah/${schoolId}`);
  };

  // Get filtered users based on selected tab, search query, and school filter
  const getFilteredUsers = () => {
    let filtered = [...users];

    // Filter by role based on selected tab
    if (selectedTab === "adminSekolah") {
      filtered = filtered.filter(user => user.role === "admin");
    } else if (selectedTab === "siswa") {
      filtered = filtered.filter(user => user.role === "siswi");
    }

    // Filter by search query (name or email)
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by school
    if (schoolFilter !== "all") {
      filtered = filtered.filter(user => 
        (user.role === 'admin' && user.instansiId === schoolFilter) ||
        (user.role === 'siswi' && user.sekolahId === schoolFilter)
      );
    }

    return filtered;
  };

  // Get school stats
  const getSchoolStats = (schoolId: string) => {
    const totalAdmins = users.filter(user => 
      user.role === "admin" && user.instansiId === schoolId
    ).length;
    
    const totalSiswi = users.filter(user => 
      user.role === "siswi" && user.sekolahId === schoolId
    ).length;
    
    const totalUsers = totalAdmins + totalSiswi;
    
    const kelasCount = kelas.filter(k => k.sekolahId === schoolId).length;
    
    return {
      totalUsers,
      totalAdmins,
      totalSiswi,
      kelasCount,
      completion: totalUsers > 0 ? Math.round((totalAdmins / totalUsers) * 100) : 0
    };
  };

  const filteredUsers = getFilteredUsers();
  
  const getSchoolName = (userId: string, role: string) => {
    if (role === 'admin') {
      const user = adminSekolah.find(a => a.id === userId);
      if (user) {
        const school = schools.find(s => s.id === user.instansiId);
        return school ? school.nama : '-';
      }
    } else {
      const user = siswa.find(s => s.id === userId);
      if (user) {
        const school = schools.find(s => s.id === user.sekolahId);
        return school ? school.nama : '-';
      }
    }
    return '-';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header title="SIMORE" />

      {/* Custom Scrollbar Style */}
      <style>{customScrollbarStyle}</style>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-0">
        <div className="max-w-md mx-auto">
          
          {/* Tabs navigation */}
          <Tabs 
            defaultValue="sekolah" 
            value={selectedTab} 
            onValueChange={setSelectedTab} 
            className="w-full mb-4"
          >
            <TabsList className="grid grid-cols-3 w-full bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="sekolah" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Building className="mr-1 h-4 w-4" />
                Sekolah
              </TabsTrigger>
              <TabsTrigger 
                value="adminSekolah" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <UserIcon className="mr-1 h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger 
                value="siswa" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Users className="mr-1 h-4 w-4" />
                Siswa
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Filter section - only show on admin and siswa tabs */}
          {(selectedTab === "adminSekolah" || selectedTab === "siswa") && (
            <div className="space-y-3">
              {/* Filter and search bar in one row */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    type="text" 
                    placeholder="Cari..." 
                    className="h-9 rounded-lg border pl-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                  <SelectTrigger className="w-32 bg-white border border-gray-200 rounded-xl">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>{school.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button onClick={handleAddUser} className="bg-red-600 hover:bg-red-700 h-9 w-9 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Content based on selected tab */}
          {selectedTab === "sekolah" ? (
            // School list
            <div className="space-y-3 mt-4">
              {/* Add School button */}
              <Button 
                onClick={handleAddSchool} 
                className="bg-red-600 hover:bg-red-700 text-white w-full rounded-xl py-3 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Sekolah
              </Button>
              
              <div className="h-[calc(100vh-220px)] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                {schools.map((school, index) => (
                  <CardSchool
                    key={school.id}
                    school={school}
                    stats={getSchoolStats(school.id)}
                    onClick={() => handleSchoolClick(school.id)}
                    className={isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    transitionDelay={index * 50}
                  />
                ))}
              </div>
              
              {/* No schools found message */}
              {schools.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Building className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-500 font-medium">Tidak ada sekolah</h3>
                  <p className="text-gray-400 text-sm">
                    Belum ada sekolah yang ditambahkan
                  </p>
                </div>
              )}
            </div>
          ) : (
            // User list with UserCard component or UserTable based on availability
            <div className="mt-4">
              {filteredUsers.length > 0 ? (
                <div>
                  {/* If UserCard component is available, use it */}
                  {typeof UserCard !== 'undefined' ? (
                    <div className="h-[calc(100vh-220px)] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                      {filteredUsers.map((user, index) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          schoolName={getSchoolName(user.id, user.role)}
                          onEdit={() => handleEditUser(user)}
                          onDelete={() => handleDeleteUser(user.id)}
                          className={isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                          transitionDelay={index * 50}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Fall back to UserTable if UserCard is not available */
                    <div className="h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin">
                      <UserTable
                        users={filteredUsers}
                        schools={schools}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-500 font-medium">Tidak ada data</h3>
                  <p className="text-gray-400 text-sm">
                    Tidak ada pengguna yang ditemukan
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        schools={schools}
      />

      {/* School Form Modal */}
      <SchoolFormModal
        isOpen={isSchoolFormOpen}
        onClose={() => setIsSchoolFormOpen(false)}
        onSubmit={handleSchoolFormSubmit}
        school={selectedSchool}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
        title="Hapus Pengguna"
        description="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}