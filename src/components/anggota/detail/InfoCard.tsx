
import { Card, CardContent } from "@/components/ui/card";
import { Anggota } from "@/types";
import { Badge } from "@/components/ui/badge";
import { File } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InfoCardProps {
  anggota: Anggota;
  totalSimpanan: number;
  totalPinjaman: number;
}

export function InfoCard({ anggota, totalSimpanan, totalPinjaman }: InfoCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-green-800 text-sm font-medium mb-1">Total Simpanan</h3>
            <p className="text-2xl font-bold text-green-700">
              Rp {totalSimpanan.toLocaleString("id-ID")}
            </p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h3 className="text-amber-800 text-sm font-medium mb-1">Sisa Pinjaman</h3>
            <p className="text-2xl font-bold text-amber-700">
              Rp {totalPinjaman.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">NIK</h3>
              <p>{anggota.nik}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Jenis Kelamin</h3>
              <p>{anggota.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Agama</h3>
              <p>{anggota.agama}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Pekerjaan</h3>
            <p>{anggota.pekerjaan}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Dokumen</h3>
            <div className="flex flex-wrap gap-2">
              {anggota.dokumen && anggota.dokumen.length > 0 ? (
                anggota.dokumen.map((doc) => (
                  <Dialog key={doc.id}>
                    <DialogTrigger asChild>
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent flex gap-1.5 items-center">
                        <File size={14} /> {doc.jenis}
                      </Badge>
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
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Tidak ada dokumen tersedia</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
