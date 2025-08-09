'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { puskesmas } from "@/data/dummyData";

// Interface for School
interface School {
  id: string;
  nama: string;
  alamat: string;
  puskesmasId: string;
}

// Interface for form values
interface SchoolFormValues {
  name: string;
  address: string;
  puskesmasId: string;
}

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SchoolFormValues) => void;
  school?: School;
}

export default function SchoolFormModal({
  isOpen,
  onClose,
  onSubmit,
  school,
}: SchoolFormModalProps) {
  const [formValues, setFormValues] = useState<SchoolFormValues>({
    name: '',
    address: '',
    puskesmasId: ''
  });

  useEffect(() => {
    if (school) {
      setFormValues({
        name: school.nama,
        address: school.alamat,
        puskesmasId: school.puskesmasId
      });
    } else {
      // Reset form for new school
      setFormValues({
        name: '',
        address: '',
        puskesmasId: puskesmas.length > 0 ? puskesmas[0].id : ''
      });
    }
  }, [school, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormValues(prev => ({ ...prev, puskesmasId: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{school ? 'Edit Sekolah' : 'Tambah Sekolah'}</DialogTitle>
          <DialogDescription>
            {school 
              ? 'Ubah informasi sekolah di bawah ini.' 
              : 'Isi form di bawah untuk menambahkan sekolah baru.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* School Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Sekolah</Label>
              <Input
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama sekolah"
                required
              />
            </div>
            
            {/* School Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                name="address"
                value={formValues.address}
                onChange={handleInputChange}
                placeholder="Masukkan alamat lengkap"
                required
              />
            </div>
            
            {/* Puskesmas */}
            <div className="grid gap-2">
              <Label htmlFor="puskesmasId">Puskesmas</Label>
              <Select
                value={formValues.puskesmasId}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="puskesmasId">
                  <SelectValue placeholder="Pilih puskesmas" />
                </SelectTrigger>
                <SelectContent>
                  {puskesmas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}