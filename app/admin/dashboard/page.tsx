'use client';

import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCog, Building, TrendingUp } from "lucide-react";
import dummyData, { 
  sekolah, 
  siswa, 
  adminSekolah, 
  adminPuskesmas 
} from "@/data/dummyData";

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSiswi: 0,
    totalAdminSekolah: 0,
    totalSekolah: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Hitung statistik dari data dummy
    const totalUsers = siswa.length + adminSekolah.length + adminPuskesmas.length;
    const totalSiswi = siswa.length;
    const totalAdminSekolah = adminSekolah.length;
    const totalSekolah = sekolah.length;

    // Hitung jumlah user per sekolah
    const usersPerSchool = sekolah.map(school => {
      const siswiCount = siswa.filter(s => s.sekolahId === school.id).length;
      const adminCount = adminSekolah.filter(a => a.instansiId === school.id).length;
      
      return {
        schoolId: school.id,
        schoolName: school.nama,
        siswiCount,
        adminCount,
        totalUsers: siswiCount + adminCount
      };
    });

    // Simulate data loading
    setTimeout(() => {
      setStats({
        totalUsers,
        totalSiswi,
        totalAdminSekolah,
        totalSekolah
      });
      setChartData(usersPerSchool);
      setIsLoaded(true);
    }, 100);
  }, []);

  // Compute max value for chart scaling
  const maxChartValue = Math.max(...chartData.map(item => item.totalUsers));

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header title="SIMORE" />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* School Stats Card with modern gradient */}
          <div 
            className={`overflow-hidden rounded-xl shadow-sm mb-6 transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 text-center">
              <h3 className="font-bold text-lg tracking-tight">Dashboard Admin</h3>
            </div>
            
            <div className="bg-gradient-to-r from-red-600 to-red-700 py-2 px-4">
              <div className="grid grid-cols-2 gap-2">
                {/* Total Users */}
                <div className="flex flex-col items-center bg-white py-2 px-1 rounded-lg shadow-sm">
                  <p className="text-lg font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500">Total Pengguna</p>
                </div>
                
                {/* Total Siswi */}
                <div className="flex flex-col items-center bg-white py-2 px-1 rounded-lg shadow-sm">
                  <p className="text-lg font-bold">{stats.totalSiswi}</p>
                  <p className="text-xs text-gray-500">Total Siswi</p>
                </div>
                
                {/* Total Admin */}
                <div className="flex flex-col items-center bg-white py-2 px-1 rounded-lg shadow-sm">
                  <p className="text-lg font-bold">{stats.totalAdminSekolah}</p>
                  <p className="text-xs text-gray-500">Total Admin</p>
                </div>
                
                {/* Total Schools */}
                <div className="flex flex-col items-center bg-white py-2 px-1 rounded-lg shadow-sm">
                  <p className="text-lg font-bold">{stats.totalSekolah}</p>
                  <p className="text-xs text-gray-500">Total Sekolah</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <Card className={`rounded-xl shadow-sm border-0 mb-6 transition-all duration-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="p-3 border-b flex items-center">
              <TrendingUp className="h-4 w-4 text-red-600 mr-2" />
              <h3 className="text-sm font-medium">Jumlah Pengguna per Sekolah</h3>
            </div>
            <CardContent className="p-3">
              <div className="h-[200px] w-full">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center mb-3">
                    <div className="w-24 mr-3 text-xs truncate" title={item.schoolName}>{item.schoolName}</div>
                    <div className="flex-1 flex items-center">
                      <div
                        className="bg-blue-700 h-4 rounded-sm relative"
                        style={{
                          width: `${(item.adminCount / maxChartValue) * 100}%`,
                          minWidth: item.adminCount > 0 ? '8px' : '0'
                        }}
                      >
                        {item.adminCount > 0 && (
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-medium">
                            {item.adminCount}
                          </span>
                        )}
                      </div>
                      <div
                        className="bg-red-600 h-4 ml-0.5 rounded-sm relative"
                        style={{
                          width: `${(item.siswiCount / maxChartValue) * 100}%`,
                          minWidth: item.siswiCount > 0 ? '8px' : '0'
                        }}
                      >
                        {item.siswiCount > 0 && (
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-medium">
                            {item.siswiCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end mt-2 text-xs">
                  <div className="flex items-center mr-3">
                    <div className="w-2.5 h-2.5 bg-blue-700 rounded-sm mr-1"></div>
                    <span>Admin</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-sm mr-1"></div>
                    <span>Siswi</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}