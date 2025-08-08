"use client";

import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

// Image Modal Component
const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative max-w-lg max-h-[80vh] overflow-hidden">
        <button 
          className="absolute top-2 right-2 bg-white rounded-full p-1"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <X className="h-5 w-5" />
        </button>
        <img 
          src={imageUrl} 
          alt="Laporan Siswa" 
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

// StudentCard Component
export default function StudentCard({ 
  student, 
  onValidation, 
  showValidationButtons = true,
  className = "", 
  transitionDelay = 0
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Get validation status
  const getStatusIcons = (status) => {
    switch(status) {
      case "completed":
        return (
          <button 
            className="p-1 rounded-full bg-red-100 text-red-600"
            onClick={() => onValidation?.(student.id, "inProcess")}
          >
            <Check className="h-4 w-4" />
          </button>
        );
      case "rejected":
        return (
          <button 
            className="p-1 rounded-full bg-red-100 text-red-600"
            onClick={() => onValidation?.(student.id, "inProcess")}
          >
            <X className="h-4 w-4" />
          </button>
        );
      case "inProcess":
        return (
          <>
            <button 
              className="p-1 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors"
              onClick={() => onValidation?.(student.id, "completed")}
            >
              <Check className="h-4 w-4" />
            </button>
            <button 
              className="p-1 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors"
              onClick={() => onValidation?.(student.id, "rejected")}
            >
              <X className="h-4 w-4" />
            </button>
          </>
        );
      case "pending":
      default:
        return null;
    }
  };

  return (
    <>
      <Card 
        className={`p-4 bg-white rounded-xl shadow-sm border-0 transition-all duration-500 ${className}`}
        style={{ transitionDelay: `${transitionDelay}ms` }}
      >
        <div className="flex gap-3">
          {/* Thumbnail - dengan klik untuk membuka modal */}
          <div 
            className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => setSelectedImage(student.imageUrl)}
          >
            <img 
              src={student.imageUrl} 
              alt={`Laporan ${student.name}`} 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-sm">{student.name}</h3>
              
              {/* Validation buttons - tampilkan jika showValidationButtons=true */}
              {showValidationButtons && (
                <div className="flex gap-1">
                  {getStatusIcons(student.status)}
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p className="flex justify-between">
                <span>Kelas:</span>
                <span className="font-medium text-gray-700">{student.class}</span>
              </p>
              
              <p className="flex justify-between">
                <span>Tanggal Konsumsi:</span>
                <span className="font-medium text-gray-700">{student.date}</span>
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Image Modal */}
      <ImageModal 
        isOpen={!!selectedImage} 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </>
  );
}