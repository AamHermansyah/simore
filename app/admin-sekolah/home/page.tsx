'use client';

import { useState, useEffect, use } from "react";
import { 
  BarChart3, Users, AlertTriangle, Clock, Eye, PlusCircle,
  Check, X, Medal, TrendingUp, Calendar, ClipboardCheck,
  Info, School, Image as ImageIcon
} from "lucide-react";
import { Header } from "../components/Header";
import BottomNav from "../components/BottomNav";
import StudentCard from "../components/StudentCard"; // Import komponen StudentCard

// Type definitions
interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  reportedThisMonth: number;
  complianceRate: number;
}

interface RecentReport {
  id: number;
  name: string;
  class: string;
  date: Date | string;
  status: "pending" | "approved" | "rejected" | "completed" | "inProcess";
  imageUrl: string;
}

interface ChartData {
  labels: string[];
  reported: number[];
  notReported: number[];
  average: number;
}

// Helper function to format dates
const formatDate = (date) => {
  if (typeof date === 'string') return date;
  
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
};

// Helper function to get current month name in Indonesian
const getCurrentMonthName = () => {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const currentMonth = new Date().getMonth();
  return months[currentMonth];
};

// Generic Badge Component
const Badge = ({ variant, children }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  
  const variantClasses = {
    success: "bg-blue-700 text-white",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

// Generic Button Component
const Button = ({ variant, children, className, onClick }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-red-600 text-white hover:bg-red-700 rounded-lg",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg",
    ghost: "hover:bg-gray-100 text-gray-700",
  };
  
  const sizeClasses = "px-4 py-2.5 text-sm";
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Card Components
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className || ""}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-4 ${className || ""}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`font-semibold ${className || ""}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 pt-0 ${className || ""}`}>
    {children}
  </div>
);

// School Info Card with modern gradient
const SchoolInfoCard = ({ stats }) => (
  <Card className="overflow-hidden">
    {/* Header with gradient */}
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 text-center">
      <h2 className="font-bold text-xl tracking-tight">MTSN 4 TASIKMALAYA</h2>
    </div>
    
    <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
      <div className="grid grid-cols-3 gap-3">
        {/* Total Siswa */}
        <div className="flex flex-col items-center bg-white p-3 rounded-xl shadow-sm transition-transform hover:scale-105">
          <div className="p-2 bg-red-100 rounded-full mb-1">
            <Users className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-xl font-bold">{stats.totalStudents}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Siswa</p>
        </div>
        
        {/* Total Kelas */}
        <div className="flex flex-col items-center bg-white p-3 rounded-xl shadow-sm transition-transform hover:scale-105">
          <div className="p-2 bg-red-100 rounded-full mb-1">
            <School className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-xl font-bold">{stats.totalClasses}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Kelas</p>
        </div>
        
        {/* Kepatuhan */}
        <div className="flex flex-col items-center bg-white p-3 rounded-xl shadow-sm transition-transform hover:scale-105">
          <div className="p-2 bg-red-100 rounded-full mb-1">
            <Medal className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-xl font-bold">{stats.complianceRate}%</p>
          <p className="text-xs text-gray-500 mt-0.5">Kepatuhan</p>
        </div>
      </div>
    </div>
  </Card>
);

// Reporting Status Card with animated progress and current month name
const ReportingStatusCard = ({ totalStudents, reportedThisMonth }) => {
  const notReported = totalStudents - reportedThisMonth;
  const reportRate = Math.round((reportedThisMonth / totalStudents) * 100);
  const currentMonthName = getCurrentMonthName();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-red-600" />
          <CardTitle className="text-base">Status Pelaporan {currentMonthName}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{reportRate}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000 ease-out"
              style={{ width: `${reportRate}%` }}
            />
          </div>
        </div>
        
        {/* Stats breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center bg-blue-700 p-2 rounded-lg transition-transform hover:scale-102">
            <p className="font-bold text-xl text-white">{reportedThisMonth}</p>
            <p className="text-xs text-white mt-0.5">Sudah Melapor</p>
          </div>
          
          <div className="flex flex-col items-center bg-red-600 p-2 rounded-lg transition-transform hover:scale-102">
            <p className="font-bold text-xl text-white">{notReported}</p>
            <p className="text-xs text-white mt-0.5">Belum Melapor</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Improved Bar Chart Component 
const BarChartComponent = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate the maximum value for scaling
  const maxValue = Math.max(
    ...data.reported, 
    ...data.notReported
  ) * 1.1; // Add 10% padding

  return (
    <Card>
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            <CardTitle className="text-base">Tren Kepatuhan</CardTitle>
          </div>
          <select className="text-xs border rounded-lg px-1.5 py-0.5 text-gray-600 bg-gray-50">
            <option>6 Bulan</option>
            <option>3 Bulan</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-48 w-full relative">
          {/* SVG Bar Chart */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#f0f0f0" strokeWidth="0.8" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#f0f0f0" strokeWidth="0.8" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#f0f0f0" strokeWidth="0.8" />
            
            {/* Grid labels (percentages) */}
            <text x="0" y="75" fontSize="2.5" fill="#9ca3af" dominantBaseline="middle" textAnchor="start">25%</text>
            <text x="0" y="50" fontSize="2.5" fill="#9ca3af" dominantBaseline="middle" textAnchor="start">50%</text>
            <text x="0" y="25" fontSize="2.5" fill="#9ca3af" dominantBaseline="middle" textAnchor="start">75%</text>
            
            {/* Bars */}
            {mounted && data.labels.map((label, index) => {
              const barWidth = 5; // Width of each bar
              const gapWidth = 2; // Gap between bar groups
              const groupWidth = barWidth * 2 + gapWidth; // Width of a group of 2 bars
              const totalGroups = data.labels.length;
              const totalWidth = groupWidth * totalGroups;
              const startOffset = (100 - totalWidth) / 2; // Center the bars
              
              const x1 = startOffset + (index * groupWidth); // Position of first bar in group
              const x2 = x1 + barWidth + gapWidth; // Position of second bar in group
              
              const reportedHeight = (data.reported[index] / maxValue) * 75;
              const notReportedHeight = (data.notReported[index] / maxValue) * 75;
              
              return (
                <g key={index} className="transition-all duration-1000" style={{ transitionDelay: `${index * 100}ms` }}>
                  {/* Reported bar */}
                  <rect
                    x={x1}
                    y={95 - reportedHeight}
                    width={barWidth}
                    height={reportedHeight}
                    fill="#1d4ed8" // Blue-700
                    rx="1"
                  />
                  
                  {/* Not reported bar */}
                  <rect
                    x={x2}
                    y={95 - notReportedHeight}
                    width={barWidth}
                    height={notReportedHeight}
                    fill="#ef4444" // Red-500
                    rx="1"
                  />
                  
                  {/* Bar values */}
                  <text 
                    x={x1 + barWidth/2} 
                    y={92 - reportedHeight} 
                    fontSize="2.5" 
                    fill="#1d4ed8" 
                    dominantBaseline="middle" 
                    textAnchor="middle"
                  >
                    {data.reported[index]}
                  </text>
                  
                  <text 
                    x={x2 + barWidth/2} 
                    y={92 - notReportedHeight} 
                    fontSize="2.5" 
                    fill="#ef4444" 
                    dominantBaseline="middle" 
                    textAnchor="middle"
                  >
                    {data.notReported[index]}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Month Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6">
            {data.labels.map((label, index) => (
              <span key={index} className="text-xs text-gray-500">{label}</span>
            ))}
          </div>
        </div>
        
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-blue-700"></div>
            <span>Sudah Melapor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-red-500"></div>
            <span>Belum Melapor</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Komponen Laporan Terbaru yang Menggunakan StudentCard
const RecentReports = ({ reports, onUpdateStatus }) => {
  // Konversi format status untuk StudentCard
  const convertStatus = (status) => {
    switch(status) {
      case "approved": return "completed";
      case "rejected": return "rejected";
      case "pending": return "inProcess";
      default: return status;
    }
  };
  
  // Format data siswa untuk StudentCard
  const formatStudentData = (report) => {
    return {
      id: report.id,
      name: report.name,
      class: report.class,
      date: typeof report.date === 'string' ? report.date : formatDate(report.date),
      status: convertStatus(report.status),
      imageUrl: report.imageUrl
    };
  };

  // Handle validasi untuk StudentCard
  const handleValidation = (studentId, newStatus) => {
    // Konversi format status kembali ke format dashboard
    let dashboardStatus;
    switch(newStatus) {
      case "completed": dashboardStatus = "approved"; break;
      case "rejected": dashboardStatus = "rejected"; break;
      case "inProcess": dashboardStatus = "pending"; break;
      default: dashboardStatus = newStatus;
    }
    
    onUpdateStatus(studentId, dashboardStatus);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-red-600" />
            <CardTitle className="text-base">Laporan Terbaru</CardTitle>
          </div>
          <Button variant="ghost" className="text-red-600 h-8 px-2 text-sm">
            Lihat <Eye className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {reports.length > 0 ? (
            reports.slice(0, 3).map((report, index) => (
              <div key={report.id} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all">
                <StudentCard
                  student={formatStudentData(report)}
                  onValidation={handleValidation}
                  showValidationButtons={true}
                  className="bg-transparent shadow-none p-0 m-0"
                />
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Belum ada laporan terbaru</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    reportedThisMonth: 0,
    complianceRate: 0
  });

  const [chartData, setChartData] = useState({
    labels: [],
    reported: [],
    notReported: [],
    average: 0
  });
  
  const [recentReports, setRecentReports] = useState([]);

  // Simulate data loading
  useEffect(() => {
    // Data statistik
    setStats({
      totalStudents: 240,
      totalClasses: 9,
      reportedThisMonth: 218,
      complianceRate: 91
    });
    
    // Data chart
    setChartData({
      labels: ["Mar", "Apr", "Mei", "Jun", "Jul", "Agt"],
      reported: [204, 187, 216, 211, 220, 218],
      notReported: [36, 53, 24, 29, 20, 22],
      average: 88
    });
    
    // Data laporan terbaru - urutkan berdasarkan tanggal terbaru
    setRecentReports([
      { 
        id: 1, 
        name: "Aisyah Putri", 
        class: "7A", 
        date: new Date("2025-08-02"), 
        status: "pending",
        imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Aisyah"
      },
      { 
        id: 2, 
        name: "Bella Safira", 
        class: "8B", 
        date: new Date("2025-08-01"), 
        status: "pending",
        imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Bella" 
      },
      { 
        id: 3, 
        name: "Citra Dewi", 
        class: "9C", 
        date: new Date("2025-07-31"), 
        status: "pending",
        imageUrl: "https://placehold.co/400x500/e2e8f0/64748b?text=Laporan+Citra" 
      },
    ]);
    
    // Trigger animations after data loads
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Update report status handler
  const handleUpdateStatus = (reportId, newStatus) => {
    setRecentReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus } 
          : report
      )
    );
  };

  // Simulate a page navigation function
  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header title="SIMORE" />
      
      <div className="flex-1 p-4 space-y-4 pb-20">
        {/* School Info Card */}
        <SchoolInfoCard stats={stats} />
        
        {/* Status Pelaporan Card */}
        <ReportingStatusCard 
          totalStudents={stats.totalStudents}
          reportedThisMonth={stats.reportedThisMonth}
        />
        
        {/* Bar Chart for trend */}
        <BarChartComponent data={chartData} />
        
        {/* Recent Reports */}
        <RecentReports 
          reports={recentReports} 
          onUpdateStatus={handleUpdateStatus}
        />
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button 
            variant="primary" 
            className="h-10 text-xs font-medium rounded-md shadow"
            onClick={() => handleNavigation("/admin-sekolah/kelas")}
          >
            <Eye className="h-4 w-4 mr-1.5" />
            Laporan Lengkap
          </Button>
          <Button 
            variant="outline" 
            className="h-10 text-xs font-medium rounded-md shadow"
            onClick={() => handleNavigation("/admin-sekolah/siswi/tambah-keluhan")}
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Tambah Keluhan
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}