
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, File, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AnggotaDokumen } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface DokumenUploadCardProps {
  dokumen: AnggotaDokumen[];
  onDokumenChange: (dokumen: AnggotaDokumen[]) => void;
}

export function DokumenUploadCard({ dokumen, onDokumenChange }: DokumenUploadCardProps) {
  const { toast } = useToast();
  const [jenisDokumen, setJenisDokumen] = useState<"KTP" | "KK" | "Sertifikat" | "BPKB" | "SK">("KTP");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDokumen, setPreviewDokumen] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Ukuran file terlalu besar",
          description: "Ukuran file maksimum adalah 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
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
      
      toast({
        title: "Dokumen berhasil diupload",
        description: `${jenisDokumen} telah berhasil diupload`,
      });

      // Reset file input
      const fileInput = document.getElementById("dokumen") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
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

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Dokumen Anggota</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="jenisDokumen">Jenis Dokumen</Label>
            <Select value={jenisDokumen} onValueChange={(value) => setJenisDokumen(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis dokumen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KTP">KTP</SelectItem>
                <SelectItem value="KK">Kartu Keluarga</SelectItem>
                <SelectItem value="Sertifikat">Sertifikat</SelectItem>
                <SelectItem value="BPKB">BPKB</SelectItem>
                <SelectItem value="SK">Surat Keterangan</SelectItem>
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
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: PDF, JPG, PNG. Maks: 5MB
            </p>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={!selectedFile}
            >
              <Upload size={16} /> Upload Dokumen
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
                    <TableCell>{doc.jenis}</TableCell>
                    <TableCell>{doc.namaFile}</TableCell>
                    <TableCell>{new Date(doc.tanggalUpload).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
                              <File size={16} /> Lihat
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
                          <Trash2 size={16} /> Hapus
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
