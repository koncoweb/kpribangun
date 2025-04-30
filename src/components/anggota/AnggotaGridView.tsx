
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash, User } from "lucide-react";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {anggota.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center p-4 border-b">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {item.foto ? (
                  <img 
                    src={item.foto} 
                    alt={item.nama} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{item.nama}</h3>
                <p className="text-xs text-muted-foreground">{item.id}</p>
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
            
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">NIK</p>
                  <p className="font-medium">{item.nik}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jenis Kelamin</p>
                  <p>{item.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Total Simpanan</p>
                  <p className="font-medium text-green-600">{getTotalSimpanan(item.id)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Pinjaman</p>
                  <p className="font-medium text-amber-600">{getTotalPinjaman(item.id)}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onViewDetail(item.id)}
                >
                  Lihat Detail
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
