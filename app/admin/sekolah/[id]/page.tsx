'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Header } from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import UserCard from '../../components/UserCard';
import UserFormModal from '../../components/UserFormModal';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Search, Users, User } from 'lucide-react';
import { 
  sekolah, 
  siswa, 
  adminSekolah,
  kelas
} from '@/data/dummyData';
import { toast } from 'sonner';

interface User {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  role: 'admin' | 'siswi';
  instansiId?: string;
  sekolahId?: string;
  kelasId?: string;
  nis?: string;
  tanggalLahir?: string;
}

interface School {
  id: string;
  nama: string;
  alamat: string;
  puskesmasId: string;
}

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
  password?: string;
}

interface SchoolDetailPageProps {
  params: {
    id: string;
  };
}

export default function SchoolDetailPage({ params }: SchoolDetailPageProps) {
  const router = useRouter();
  const id = use(params).id;
  
  const [school, setSchool] = useState<School | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [kelasCount, setKelasCount] = useState(0);

  useEffect(() => {
    // Fetch school, admin users, and student users
    const fetchedSchool = sekolah.find((s) => s.id === id);
    const schoolAdmins = adminSekolah.filter((a) => a.instansiId === id);
    const schoolStudents = siswa.filter((s) => s.sekolahId === id);
    const schoolKelas = kelas.filter((k) => k.sekolahId === id);

    // Combine admin and student users
    const allUsers: User[] = [
      ...schoolAdmins.map(admin => ({
        ...admin,
        role: 'admin' as const
      })),
      ...schoolStudents.map(student => ({
        ...student,
        role: 'siswi' as const
      }))
    ];

    if (fetchedSchool) {
      setSchool(fetchedSchool);
      setUsers(allUsers);
      setKelasCount(schoolKelas.length);
      setTimeout(() => {
        setIsLoaded(true);
      }, 100);
    } else {
      // School not found, redirect to schools list
      router.push('/admin/kelola-akun');
    }
  }, [id, router]);

  const handleBack = () => {
    router.back();
  };

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsUserFormOpen(true);
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
            noHp: data.phoneNumber || user.noHp,
            jenisKelamin: data.gender || user.jenisKelamin,
          };
          
          if (data.role === 'admin') {
            updatedUser.instansiId = data.schoolId;
          } else {
            updatedUser.sekolahId = data.schoolId;
            updatedUser.kelasId = data.classId;
            updatedUser.nis = data.nis;
            updatedUser.tanggalLahir = data.birthDate;
          }
          
          return updatedUser;
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      toast.success("Pengguna diperbarui", {
        description: "Informasi pengguna berhasil diperbarui."
      });
    } else {
      // Create new user with this school's ID
      const newId = `user-${Date.now().toString()}`;
      
      const newUser: User = {
        id: newId,
        nama: data.name,
        email: data.email,
        noHp: data.phoneNumber || '',
        jenisKelamin: data.gender || 'Perempuan',
        role: data.role,
      };
      
      if (data.role === 'admin') {
        newUser.instansiId = id;
      } else {
        newUser.sekolahId = id;
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

  // Get filtered users based on selected tab and search query
  const getFilteredUsers = () => {
    let filtered = [...users];

    // Filter by role based on selected tab
    if (selectedTab === 'admin') {
      filtered = filtered.filter(user => user.role === 'admin');
    } else if (selectedTab === 'siswa') {
      filtered = filtered.filter(user => user.role === 'siswi');
    }

    // Filter by search query (name or email)
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  // Count school stats
  const adminCount = users.filter(user => user.role === 'admin').length;
  const siswiCount = users.filter(user => user.role === 'siswi').length;
  
  if (!school) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header title={school.nama} />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* Back button */}
          <button 
            onClick={handleBack}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Kembali</span>
          </button>
          
          {/* School info card with modern gradient - more compact */}
          <div 
            className={`overflow-hidden rounded-xl shadow-sm mb-6 transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 text-center">
              <h3 className="font-bold text-lg tracking-tight">{school.nama}</h3>
              
              {school.alamat && (
                <p className="text-white text-xs mt-0.5 opacity-90">{school.alamat}</p>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-red-600 to-red-700 py-2 px-4">
              <div className="grid grid-cols-3 gap-2">
                {/* Admin Count */}
                <div className="flex flex-col items-center bg-white py-2 px-1 rounded-lg shadow-sm">
                  <p className="text-lg font-bold">{adminCount}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                
                {/* Siswa Count */}
                <div className="flex flex-col items-center bg-white py-2 px-1 rounded-lg shadow-sm">
                  <p className="text-lg font-bold">{siswiCount}</p>
                  <p className="text-xs text-gray-500">Siswi</p>
                </div>
                
                {/* Kelas Count */}
                <div className="flex flex-col items-center bg-white py-2 px-1 rounded-lg shadow-sm">
                  <p className="text-lg font-bold">{kelasCount}</p>
                  <p className="text-xs text-gray-500">Kelas</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              type="text" 
              placeholder="Cari nama atau email..." 
              className="h-9 rounded-lg border bg-gray-50 text-gray-800 pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Tabs navigation */}
          <div className="flex justify-between items-center mb-4">
            <Tabs 
              defaultValue="admin" 
              value={selectedTab} 
              onValueChange={setSelectedTab} 
              className="w-full mb-4"
            >
              <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="admin" 
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <User className="mr-1 h-4 w-4" />
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
            
            <Button onClick={handleAddUser} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* User list */}
          <div className="space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <UserCard
                  key={user.id}
                  user={user}
                  schoolName={school.nama}
                  onEdit={() => handleEditUser(user)}
                  onDelete={() => handleDeleteUser(user.id)}
                  className={isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  transitionDelay={index * 50}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-gray-500 font-medium">Tidak ada data</h3>
                <p className="text-gray-400 text-sm">
                  Tidak ada {selectedTab === 'admin' ? 'admin' : 'siswi'} yang ditemukan
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        schools={[school]} // Only allow this school
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