'use client';

import React, { useState } from 'react';
import { Edit, Trash, Mail, X, Calendar, School, User as UserIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface UserCardProps {
  user: User;
  schoolName: string;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
  transitionDelay?: number;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  schoolName,
  onEdit,
  onDelete,
  className = '',
  transitionDelay = 0
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Fungsi untuk mendapatkan badge role dengan warna yang sesuai
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800 border-0 text-xs px-2 py-0.5">Admin</Badge>;
      case 'siswi':
        return <Badge className="bg-green-100 text-green-800 border-0 text-xs px-2 py-0.5">Siswi</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0 text-xs px-2 py-0.5">{role}</Badge>;
    }
  };

  // Mendapatkan tanggal yang diformat
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Menampilkan popup detail user dengan gaya Android
  const UserDetailsPopup = () => {
    if (!showDetails) return null;

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
        <div 
          className="bg-white rounded-lg w-full max-w-xs shadow-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header compact */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-3 flex justify-between items-center">
            <h3 className="font-medium text-sm">Detail {user.role === 'admin' ? 'Admin' : 'Siswi'}</h3>
            <button 
              onClick={() => setShowDetails(false)}
              className="rounded-full p-0.5 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* User Info compact */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                {user.nama.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)}
              </div>
              <div>
                <h4 className="font-medium text-sm">{user.nama}</h4>
                {getRoleBadge(user.role)}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                <p className="truncate">{user.email}</p>
              </div>
              
              <div className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
                <School className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                <p className="truncate">{schoolName}</p>
              </div>
              
              {user.role === 'siswi' && user.tanggalLahir && (
                <div className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                  <p className="text-gray-700">{formatDate(user.tanggalLahir)}</p>
                </div>
              )}
              
              {user.role === 'siswi' && user.nis && (
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 text-gray-500 flex-shrink-0 flex items-center justify-center">
                    #
                  </div>
                  <p className="text-gray-700">NIS: {user.nis}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons compact */}
          <div className="flex p-2 bg-gray-50 gap-2 text-xs">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(false);
                onEdit();
              }}
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-1"
            >
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(false);
                onDelete();
              }}
              className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center gap-1"
            >
              <Trash className="h-3 w-3" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card
        className={`px-3 py-2 bg-white rounded-lg shadow-sm border-0 transition-all duration-500 hover:bg-gray-50 cursor-pointer ${className}`}
        style={{ transitionDelay: `${transitionDelay}ms` }}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-center">
          {/* Nama Pengguna */}
          <h3 className="font-medium text-sm">{user.nama}</h3>
          
          {/* Badge Role */}
          {getRoleBadge(user.role)}
        </div>
        
        {/* Sekolah */}
        <p className="text-xs text-gray-500 mt-0.5">{schoolName}</p>
      </Card>
      
      {/* Popup Detail User */}
      <UserDetailsPopup />
    </>
  );
};

export default UserCard;