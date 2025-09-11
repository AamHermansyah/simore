'use client'

import React, { useState } from 'react';
import { Crown, Star, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const generateLeaderboardData = () => {
  const students = [
    { id: 1, name: 'Siti Aminah', class: '10A', xp: 2450, streak: 12, avatar: 'SA' },
    { id: 2, name: 'Dewi Sari', class: '11B', xp: 2380, streak: 10, avatar: 'DS' },
    { id: 3, name: 'Rina Putri', class: '10C', xp: 2320, streak: 15, avatar: 'RP' },
    { id: 4, name: 'Maya Indah', class: '11A', xp: 2180, streak: 8, avatar: 'MI' },
    { id: 5, name: 'Ayu Lestari', class: '10B', xp: 2150, streak: 11, avatar: 'AL' },
    { id: 6, name: 'Fitri Handayani', class: '11C', xp: 2080, streak: 9, avatar: 'FH' },
    { id: 7, name: 'Sari Dewi', class: '10A', xp: 2020, streak: 7, avatar: 'SD' },
    { id: 8, name: 'Nina Kartika', class: '11B', xp: 1980, streak: 13, avatar: 'NK' },
    { id: 9, name: 'Lila Permata', class: '10C', xp: 1920, streak: 6, avatar: 'LP' },
    { id: 10, name: 'Indah Sari', class: '11A', xp: 1850, streak: 14, avatar: 'IS' },
    { id: 11, name: 'Putri Ayu', class: '10B', xp: 1780, streak: 5, avatar: 'PA' },
    { id: 12, name: 'Eka Putri', class: '11C', xp: 1720, streak: 8, avatar: 'EP' },
  ];

  return students.sort((a, b) => b.xp - a.xp);
};

const LeaderboardSiswi = () => {
  const [selectedClass, setSelectedClass] = useState('Semua Angkatan');

  const leaderboardData = generateLeaderboardData();
  const classes = ['Semua Angkatan', '10A', '10B', '10C', '11A', '11B', '11C'];

  const filteredData = selectedClass === 'Semua Angkatan'
    ? leaderboardData
    : leaderboardData.filter(student => student.class === selectedClass);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
      case 2:
      case 3: return <Crown className="h-6 w-6 text-yellow-600" />;
      default: return <div className="h-6 w-6 flex items-center justify-center bg-slate-200 text-slate-600 rounded-full text-sm font-bold">#{rank}</div>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-300 to-orange-600';
      case 2: return 'bg-gradient-to-r from-primary to-orange-400';
      case 3: return 'bg-gradient-to-r from-gray-300 via-gray-400 to-slate-500';
      default: return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
  };

  const getXPColor = (xp: number) => {
    if (xp >= 2000) return 'text-emerald-600';
    if (xp >= 1500) return 'text-blue-600';
    return 'text-purple-600';
  };

  return (
    <div className="space-y-6">
      <Select value={selectedClass} onValueChange={setSelectedClass}>
        <SelectTrigger className="w-42">
          <SelectValue placeholder="Pilih angkatan" />
        </SelectTrigger>
        <SelectContent>
          {classes.map((className) => (
            <SelectItem key={className} value={className}>
              {className}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Top 3 Podium */}
      <Card className="py-10">
        <CardContent>
          <h2 className="text-2xl text-yellow-500 font-bold text-center mb-8">🏆 Top 3 Champions 🏆</h2>
          <div className="flex justify-center items-end space-x-8">
            {filteredData.slice(0, 3).map((student, index) => {
              const heights = ['h-38', 'h-48', 'h-34']; // 2nd, 1st, 3rd
              const orders = [1, 0, 2]; // Reorder untuk 2nd, 1st, 3rd
              const actualIndex = orders.indexOf(index);
              const actualStudent = filteredData[actualIndex];
              const actualRank = actualIndex + 1;

              return (
                <div key={actualStudent.id} className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className={`relative mb-4 ${actualRank === 1 ? 'transform scale-110' : ''}`}>
                    <div className={`w-20 h-20 rounded-full ${getRankBg(actualRank)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {actualStudent.avatar}
                    </div>
                    <div className="absolute -top-2 -right-2">
                      {getRankIcon(actualRank)}
                    </div>
                  </div>

                  {/* Podium */}
                  <div className={`${heights[index]} w-32 ${getRankBg(actualRank)} rounded-t-2xl flex flex-col justify-center items-center text-white shadow-lg`}>
                    <div className="text-center p-4">
                      <div className="font-bold text-lg mb-1">{actualStudent.name}</div>
                      <div className="text-sm opacity-90 mb-2">{actualStudent.class}</div>
                      <div className="font-black text-xl">{actualStudent.xp} XP</div>
                      <div className="text-xs opacity-80 mt-1">🔥 {actualStudent.streak} streak</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="py-0 overflow-hidden">
        <CardContent className="px-0">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Top Peringkat</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredData.map((student, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;

              return (
                <div
                  key={student.id}
                  className={`p-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 ${isTopThree ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : ''
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {getRankIcon(rank)}
                      </div>

                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full ${getRankBg(rank)} flex items-center justify-center text-white font-bold shadow-md`}>
                        {student.avatar}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
                          {isTopThree && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <p className="text-gray-600">Kelas {student.class}</p>
                      </div>
                    </div>

                    {/* XP and Streak */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getXPColor(student.xp)}`}>
                        {student.xp} XP
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-end space-x-1">
                        <Zap className="h-3 w-3 text-orange-500" />
                        <span>{student.streak} streak</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* XP System Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start space-x-3">
          <Star className="h-6 w-6 text-yellow-300 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-2">Sistem Poin XP:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm opacity-90">
              <div>• Laporan tepat waktu: +100 XP</div>
              <div>• Bonus streak mingguan: +25 XP</div>
              <div>• Bonus streak bulanan: +200 XP</div>
              <div>• Tidak laporan: -50 XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSiswi;