
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, File, Trash2, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AnggotaDokumen } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface DokumenUploadCardProps {
  dokumen: AnggotaDokumen[];
  onDokumenChange: (dokumen: AnggotaDokumen[]) => void;
}

export function DokumenUploadCard({ dokumen, onDokumenChange }: DokumenUploadCardProps) {
  const { toast } = useToast();
  const [jenisDokumen, setJenisDokumen] = useState<"KTP" | "KK" | "Sertifikat" | "BPKB" | "SK">("KTP");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDokumen, setPreviewDokumen] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setFileError(null);
    
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Ukuran file terlalu besar (maksimum 5MB)");
      return false;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Format file tidak didukung (hanya PDF, JPG, PNG)");
      return false;
    }
    
    // Check if document of this type already exists
    const existingDoc = dokumen.find(d => d.jenis === jenisDokumen);
    if (existingDoc) {
      setFileError(`Dokumen ${jenisDokumen} sudah ada. Hapus terlebih dahulu untuk mengganti.`);
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        e.target.value = '';
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih file terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      const newDokumen: AnggotaDokumen = {
        id: `doc-${Date.now()}`,
        jenis: jenisDokumen,
        file: result,
        namaFile: selectedFile.name,
        tanggalUpload: new Date().toISOString(),
      };

      const updatedDokumen = [...dokumen, newDokumen];
      onDokumenChange(updatedDokumen);
      
      setSelectedFile(null);
      setIsUploading(false);
      
      toast({
        title: "Dokumen berhasil diupload",
        description: `${jenisDokumen} telah berhasil diupload`,
      });

      // Reset file input
      const fileInput = document.getElementById("dokumen") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Gagal membaca file",
        description: "Terjadi kesalahan saat membaca file dokumen",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(selectedFile);
  };

  const handleDelete = (id: string) => {
    const updatedDokumen = dokumen.filter((doc) => doc.id !== id);
    onDokumenChange(updatedDokumen);
    
    toast({
      title: "Dokumen berhasil dihapus",
    });
  };

  const handlePreview = (doc: AnggotaDokumen) => {
    setPreviewDokumen(doc.file);
  };

  const isDocTypeUsed = (type: string): boolean => {
    return dokumen.some(doc => doc.jenis === type);
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Dokumen Anggota</span>
          {dokumen.length > 0 && (
            <Badge variant="success">{dokumen.length} Dokumen</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="jenisDokumen">Jenis Dokumen</Label>
            <Select value={jenisDokumen} onValueChange={(value) => {
              setJenisDokumen(value as any);
              setFileError(null);
              if (isDocTypeUsed(value)) {
                setFileError(`Dokumen ${value} sudah ada. Hapus terlebih dahulu untuk mengganti.`);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis dokumen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KTP" disabled={isDocTypeUsed("KTP")}>
                  <div className="flex items-center gap-2">
                    <span>KTP</span>
                    {isDocTypeUsed("KTP") && <Check size={16} className="text-green-500" />}
                  </div>
                </SelectItem>
                <SelectItem value="KK" disabled={isDocTypeUsed("KK")}>
                  <div className="flex items-center gap-2">
                    <span>Kartu Keluarga</span>
                    {isDocTypeUsed("KK") && <Check size={16} className="text-green-500" />}
                  </div>
                </SelectItem>
                <SelectItem value="Sertifikat" disabled={isDocTypeUsed("Sertifikat")}>
                  <div className="flex items-center gap-2">
                    <span>Sertifikat</span>
                    {isDocTypeUsed("Sertifikat") && <Check size={16} className="text-green-500" />}
                  </div>
                </SelectItem>
                <SelectItem value="BPKB" disabled={isDocTypeUsed("BPKB")}>
                  <div className="flex items-center gap-2">
                    <span>BPKB</span>
                    {isDocTypeUsed("BPKB") && <Check size={16} className="text-green-500" />}
                  </div>
                </SelectItem>
                <SelectItem value="SK" disabled={isDocTypeUsed("SK")}>
                  <div className="flex items-center gap-2">
                    <span>Surat Keterangan</span>
                    {isDocTypeUsed("SK") && <Check size={16} className="text-green-500" />}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dokumen">File Dokumen</Label>
            <Input
              id="dokumen"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isUploading || isDocTypeUsed(jenisDokumen)}
              className={isUploading ? "opacity-50 cursor-not-allowed" : ""}
            />
            <div className="flex items-center h-5 mt-1">
              {fileError ? (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle size={12} /> {fileError}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Format: PDF, JPG, PNG. Maks: 5MB
                </p>
              )}
            </div>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={!selectedFile || isUploading || !!fileError}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  <span>Mengupload...</span>
                </span>
              ) : (
                <>
                  <Upload size={16} className="mr-1" /> Upload Dokumen
                </>
              )}
            </Button>
          </div>
        </div>

        {dokumen.length > 0 && (
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Nama File</TableHead>
                  <TableHead>Tanggal Upload</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dokumen.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Badge variant={doc.jenis === "KTP" || doc.jenis === "KK" ? "info" : "success"}>
                        {doc.jenis}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{doc.namaFile}</TableCell>
                    <TableCell>{new Date(doc.tanggalUpload).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
                              <File size={16} className="mr-1" /> Lihat
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Dokumen {doc.jenis}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-2 max-h-[70vh] overflow-auto">
                              {doc.file.includes("data:application/pdf") ? (
                                <iframe 
                                  src={doc.file} 
                                  className="w-full h-[500px]" 
                                  title={doc.namaFile} 
                                />
                              ) : (
                                <img 
                                  src={doc.file} 
                                  alt={doc.namaFile} 
                                  className="max-w-full h-auto" 
                                />
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.id)}>
                          <Trash2 size={16} className="mr-1" /> Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
