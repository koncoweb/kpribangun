
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PersyaratanDokumen, RequiredDocument } from "./types";
import { DokumenUploadForm } from "./DokumenUploadForm";
import { DokumenList } from "./DokumenList";

interface DokumenPersyaratanUploadProps {
  selectedKategori: string;
  dokumenList: PersyaratanDokumen[];
  onChange: (dokumenList: PersyaratanDokumen[]) => void;
}

export function DokumenPersyaratanUpload({ 
  selectedKategori, 
  dokumenList, 
  onChange 
}: DokumenPersyaratanUploadProps) {
  const [uploading, setUploading] = useState<string | null>(null);

  // Define required documents based on loan category
  const requiredDocuments: RequiredDocument[] = [
    { jenis: "KTP", kategori: "All", required: true },
    { jenis: "KK", kategori: "All", required: true },
    { jenis: "Sertifikat Tanah", kategori: "Reguler", required: true },
    { jenis: "Sertifikat Sertifikasi", kategori: "Sertifikasi", required: true },
    { jenis: "Buku Rekening", kategori: "All", required: true },
    { jenis: "ATM Sertifikasi", kategori: "Sertifikasi", required: false }
  ];
  
  // Filter documents based on selected category
  const relevantDocuments = requiredDocuments.filter(
    doc => doc.kategori === "All" || doc.kategori === selectedKategori
  );

  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    const requiredDocs = relevantDocuments.filter(doc => doc.required);
    const uploadedRequiredDocs = dokumenList.filter(
      doc => doc.file && relevantDocuments.some(rd => rd.jenis === doc.jenis && rd.required)
    );
    
    if (requiredDocs.length === 0) return 100;
    return Math.round((uploadedRequiredDocs.length / requiredDocs.length) * 100);
  };
  
  const completionPercentage = calculateCompletionPercentage();

  // Generate a unique ID for new documents
  const generateId = () => {
    return `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleFileUpload = (jenis: PersyaratanDokumen["jenis"]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploading(jenis);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      // Check if document already exists
      const existingDocIndex = dokumenList.findIndex(doc => doc.jenis === jenis);
      
      if (existingDocIndex >= 0) {
        // Update existing document
        const updatedDokumenList = [...dokumenList];
        updatedDokumenList[existingDocIndex] = {
          ...updatedDokumenList[existingDocIndex],
          file: reader.result as string,
          namaFile: file.name
        };
        onChange(updatedDokumenList);
      } else {
        // Add new document
        const requiredDoc = relevantDocuments.find(doc => doc.jenis === jenis);
        const newDokumen: PersyaratanDokumen = {
          id: generateId(),
          jenis,
          file: reader.result as string,
          namaFile: file.name,
          required: requiredDoc?.required || false,
          kategori: (requiredDoc?.kategori as "Reguler" | "Sertifikasi" | "Musiman" | "All") || "All"
        };
        onChange([...dokumenList, newDokumen]);
      }
      setUploading(null);
    };
    
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    const updatedDokumenList = dokumenList.filter(doc => doc.id !== id);
    onChange(updatedDokumenList);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Dokumen Persyaratan Pinjaman</span>
          <Badge variant={completionPercentage === 100 ? "success" : "secondary"}>
            {completionPercentage}% Lengkap
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="space-y-6">
          <DokumenUploadForm
            relevantDocuments={relevantDocuments}
            dokumenList={dokumenList}
            uploading={uploading}
            onFileUpload={handleFileUpload}
            onDelete={handleDelete}
          />
          
          <DokumenList 
            dokumenList={dokumenList} 
            onDelete={handleDelete} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
