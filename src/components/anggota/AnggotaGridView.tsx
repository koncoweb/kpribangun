
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash, User, Phone, Briefcase, CreditCard } from "lucide-react";
import { Anggota } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface AnggotaGridProps {
  anggota: Anggota[];
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  getTotalSimpanan: (id: string) => string;
  getTotalPinjaman: (id: string) => string;
}

export function AnggotaGridView({ 
  anggota, 
  onViewDetail,
  onEdit,
  onDelete,
  getTotalSimpanan,
  getTotalPinjaman
}: AnggotaGridProps) {
  if (anggota.length === 0) {
    return (
      <div className="text-center py-10">
        <p>Tidak ada data anggota yang ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
      {anggota.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center p-6 border-b">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {item.foto ? (
                  <img 
                    src={item.foto} 
                    alt={item.nama} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{item.nama}</h3>
                <p className="text-sm text-muted-foreground">ID: {item.id}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetail(item.id)} className="flex items-center gap-2">
                    <Eye size={14} /> Lihat Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(item.id)} className="flex items-center gap-2">
                    <Pencil size={14} /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive flex items-center gap-2">
                    <Trash size={14} /> Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">NIK</p>
                    <p className="font-medium">{item.nik}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">No HP</p>
                    <p className="font-medium">{item.noHp || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Jenis Kelamin</p>
                    <p className="font-medium">{item.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pekerjaan</p>
                    <p className="font-medium">{item.pekerjaan || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Simpanan</p>
                    <p className="font-semibold text-lg text-green-600">{getTotalSimpanan(item.id)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Pinjaman</p>
                    <p className="font-semibold text-lg text-amber-600">{getTotalPinjaman(item.id)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2 mt-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => onViewDetail(item.id)}
                >
                  Detail Anggota
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(item.id)}
                >
                  Edit Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
