
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, FileText, Upload, X } from "lucide-react";
import { PersyaratanDokumen } from "./types";

interface DokumenCardProps {
  jenis: PersyaratanDokumen["jenis"];
  required: boolean;
  uploadedDoc: PersyaratanDokumen | undefined;
  onDelete: (id: string) => void;
  onFileUpload: (jenis: PersyaratanDokumen["jenis"]) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: string | null;
}

export function DokumenCard({ 
  jenis, 
  required, 
  uploadedDoc, 
  onDelete, 
  onFileUpload,
  uploading 
}: DokumenCardProps) {
  const isUploaded = !!uploadedDoc;
  
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-start mb-2">
        <Label className="flex items-center gap-2">
          <span>{jenis}</span>
          {required && <span className="text-red-500">*</span>}
        </Label>
        {isUploaded ? (
          <Badge variant="success" className="flex gap-1">
            <Check size={14} /> Terunggah
          </Badge>
        ) : (
          <Badge variant={required ? "destructive" : "outline"} className="flex gap-1">
            {required ? (
              <>
                <X size={14} /> Wajib
              </>
            ) : (
              "Opsional"
            )}
          </Badge>
        )}
      </div>
      
      <div className="mt-2">
        {isUploaded ? (
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-1 text-muted-foreground">
              <FileText size={14} />
              {uploadedDoc.namaFile}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(uploadedDoc.id)}
              className="text-destructive"
            >
              Hapus
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <Input
              id={`upload-${jenis}`}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={onFileUpload(jenis)}
              disabled={uploading !== null}
            />
            <label
              htmlFor={`upload-${jenis}`}
              className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Upload size={14} />
              {uploading === jenis ? "Mengunggah..." : "Unggah Dokumen"}
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
