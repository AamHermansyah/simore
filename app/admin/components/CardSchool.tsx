'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface School {
  id: string;
  nama: string;
  alamat: string;
  puskesmasId: string;
}

interface SchoolStats {
  totalUsers: number;
  totalAdmins: number;
  totalSiswi: number;
  kelasCount: number;
  completion: number;
}

interface CardSchoolProps {
  school: School;
  stats: SchoolStats;
  onClick: () => void;
  className?: string;
  transitionDelay?: number;
}

const CardSchool: React.FC<CardSchoolProps> = ({
  school,
  stats,
  onClick,
  className = '',
  transitionDelay = 0
}) => {
  return (
    <Card 
      key={school.id}
      className={`p-4 bg-white rounded-xl shadow-sm border-0 transition-all duration-500 cursor-pointer ${className}`}
      style={{ transitionDelay: `${transitionDelay}ms` }}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{school.nama}</h3>
        <Badge className="bg-blue-100 text-blue-800 border-0 px-2 py-0.5 text-xs">
          {school.id}
        </Badge>
      </div>
      
      <div className="mt-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Admin / Siswa:</span>
          <span className="font-medium">{stats.totalAdmins} / {stats.totalSiswi}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-500"
            style={{ width: `${stats.completion}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Total {stats.totalUsers} pengguna
        </div>
      </div>
    </Card>
  );
};

export default CardSchool;