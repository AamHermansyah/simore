"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Info, Download, Upload, PlusCircle,
  Package, MoreVertical
} from "lucide-react";
import { Header } from "../components/Header";
import BottomNav from "../components/BottomNav";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tipe data untuk distribusi tablet
interface TabletDistribution {
  id: number;
  date: Date;
  quantity: number;
  targetClass: string;
  notes: string;
  status: "Terdistribusi" | "Sebagian" | "Menunggu";
}

// Data dummy distribusi tablet
const DUMMY_DISTRIBUTIONS: TabletDistribution[] = [
  {
    id: 1,
    date: new Date("2025-08-01"),
    quantity: 120,
    targetClass: "Kelas 7",
    notes: "Distribusi awal tahun ajaran",
    status: "Terdistribusi"
  },
  {
    id: 2,
    date: new Date("2025-07-15"),
    quantity: 90,
    targetClass: "Kelas 8",
    notes: "Tambahan untuk siswi baru",
    status: "Terdistribusi"
  },
  {
    id: 3,
    date: new Date("2025-07-01"),
    quantity: 45,
    targetClass: "Kelas 9",
    notes: "Penggantian untuk yang habis",
    status: "Sebagian"
  },
  {
    id: 4,
    date: new Date("2025-06-15"),
    quantity: 60,
    targetClass: "Kelas 7 & 8",
    notes: "Stok tambahan dari Dinas Kesehatan",
    status: "Terdistribusi"
  },
  {
    id: 5,
    date: new Date("2025-06-01"),
    quantity: 30,
    targetClass: "Kelas 9",
    notes: "Persiapan ujian akhir",
    status: "Menunggu"
  }
];

// Class options
const CLASS_OPTIONS = [
  "Semua Kelas", "Kelas 7", "Kelas 8", "Kelas 9"
];

// Komponen Summary Card
const SummaryCard = ({
  icon: Icon,
  title,
  value,
  color,
  secondaryValue,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: string;
  secondaryValue?: string;
}) => (
  <Card className="border-none shadow-sm">
    <CardContent className="py-2.5 px-3">
      <div className="flex items-center">
        <div className={`p-2 bg-${color}-100 rounded-full mr-3`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="text-center">
          <p className="font-bold text-xl">{value}</p>
          <p className="text-xs text-gray-600 mt-0.5">{title}</p>
          {secondaryValue && (
            <p className="text-xs text-gray-500">{secondaryValue}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Komponen Distribution Item
const DistributionItem = ({ distribution, index, isLoaded }: { distribution: TabletDistribution, index: number, isLoaded: boolean }) => {
  // Status badge color
  const getStatusBadge = (status: TabletDistribution["status"]) => {
    switch (status) {
      case "Terdistribusi":
        return {
          text: "Terdistribusi",
          color: "bg-red-700"
        };
      case "Sebagian":
        return {
          text: "Sebagian",
          color: "bg-blue-400"
        };
      case "Menunggu":
        return {
          text: "Menunggu",
          color: "bg-gray-400"
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gray-500"
        };
    }
  };

  const statusBadge = getStatusBadge(distribution.status);

  return (
    <Card 
      className={`border-none shadow-sm transition-all duration-500 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <CardContent className="px-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium text-sm">{formatDate(distribution.date)}</div>
              <Badge className={`${statusBadge.color} text-white border-0 px-2 py-0.5 text-xs`}>
                {statusBadge.text}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">
              {distribution.quantity} tablet - {distribution.targetClass}
            </p>
            
            {distribution.notes && (
              <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                {distribution.notes}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Page Component
export default function DistribusiPage() {
  const [filter, setFilter] = useState("Semua");
  const [isLoaded, setIsLoaded] = useState(false);
  const [distributions, setDistributions] = useState<TabletDistribution[]>([]);
  const [open, setOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: "",
    targetClass: "Semua Kelas",
    notes: ""
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Load distributions
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setDistributions(DUMMY_DISTRIBUTIONS);
      setIsLoaded(true);
    }, 300);
  }, []);
  
  // Filter distributions based on status
  const filteredDistributions = filter === "Semua"
    ? distributions
    : distributions.filter(d => d.status === filter);
  
  // Calculate statistics
  const totalDistributed = distributions
    .filter(d => d.status === "Terdistribusi")
    .reduce((sum, d) => sum + d.quantity, 0);
  
  const thisMonthDistributed = distributions
    .filter(d => {
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      return d.date.getMonth() === thisMonth && d.date.getFullYear() === thisYear;
    })
    .reduce((sum, d) => sum + d.quantity, 0);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new distribution
    const newDistribution: TabletDistribution = {
      id: Date.now(),
      date: new Date(formData.date),
      quantity: parseInt(formData.quantity),
      targetClass: formData.targetClass,
      notes: formData.notes,
      status: "Menunggu"
    };
    
    // Update state
    setDistributions([newDistribution, ...distributions]);
    
    // Close dialog
    setOpen(false);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      quantity: "",
      targetClass: "Semua Kelas",
      notes: ""
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-red-500 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-white font-semibold text-lg">Distribusi Tablet</h1>
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
                <DropdownMenuItem>
                  Ekspor Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Impor Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <div className="flex-1 p-4 space-y-3 pb-20">
        {/* Tabs for filtering */}
        <Tabs defaultValue="Semua" onValueChange={setFilter}>
          <TabsList className="grid grid-cols-4 w-full bg-gray-100 p-1 rounded-xl">
            <TabsTrigger 
              value="Semua" 
              className="text-xs py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Semua
            </TabsTrigger>
            <TabsTrigger 
              value="Terdistribusi" 
              className="text-xs py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Selesai
            </TabsTrigger>
            <TabsTrigger 
              value="Sebagian" 
              className="text-xs py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Sebagian
            </TabsTrigger>
            <TabsTrigger 
              value="Menunggu" 
              className="text-xs py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Menunggu
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center bg-red-600 p-2 rounded-lg shadow-sm">
            <p className="font-bold text-xl text-white">{totalDistributed}</p>
            <p className="text-xs text-white mt-0.5">Total Terdistribusi</p>
          </div>
          
          <div className="flex flex-col items-center bg-red-600 p-2 rounded-lg shadow-sm">
            <p className="font-bold text-xl text-white">{thisMonthDistributed}</p>
            <p className="text-xs text-white mt-0.5">Bulan Ini</p>
            <p className="text-xs text-white/80">Agustus 2025</p>
          </div>
        </div>
        
        {/* Add New Distribution Button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 rounded-lg h-10"
            >
              <PlusCircle className="h-4 w-4" />
              Tambah Distribusi Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Distribusi Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi distribusi tablet tambah darah
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Tanggal Distribusi
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Jumlah Tablet
                  </label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="Masukkan jumlah"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="targetClass" className="text-sm font-medium">
                  Kelas Penerima
                </label>
                <Select
                  value={formData.targetClass}
                  onValueChange={(value) => handleSelectChange("targetClass", value)}
                >
                  <SelectTrigger className="bg-white border border-gray-200 rounded-xl">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Catatan
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Tambahkan catatan jika diperlukan"
                  className="resize-none"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Distribution History */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-sm">Riwayat Distribusi</h3>
            </div>
          </div>
          
          {isLoaded ? (
            filteredDistributions.length > 0 ? (
              <div className="space-y-3">
                {filteredDistributions.map((distribution, index) => (
                  <DistributionItem 
                    key={distribution.id} 
                    distribution={distribution} 
                    index={index}
                    isLoaded={isLoaded}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-gray-100 rounded-full mb-3">
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">Tidak ada data distribusi</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Distribusi baru akan muncul di sini
                  </p>
                </CardContent>
              </Card>
            )
          ) : (
            // Skeleton loader
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}