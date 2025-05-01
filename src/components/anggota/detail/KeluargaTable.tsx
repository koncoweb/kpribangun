
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnggotaKeluarga } from "@/types";
import { User, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KeluargaTableProps {
  keluarga: AnggotaKeluarga[];
}

export function KeluargaTable({ keluarga }: KeluargaTableProps) {
  if (!keluarga || keluarga.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">Tidak Ada Data Keluarga</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1.5">
          Anggota ini belum memiliki data keluarga.
          Anda dapat menambahkan data keluarga melalui halaman edit anggota.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Hubungan</TableHead>
          <TableHead>No. HP</TableHead>
          <TableHead>Alamat</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keluarga.map((k) => (
          <TableRow key={k.id}>
            <TableCell className="font-medium">{k.nama}</TableCell>
            <TableCell>
              <Badge variant="outline" className="font-normal">
                {k.hubungan}
              </Badge>
            </TableCell>
            <TableCell className="flex items-center gap-1">
              <Phone size={14} className="text-muted-foreground" />
              {k.noHp}
            </TableCell>
            <TableCell>{k.alamat}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
