
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnggotaKeluarga } from "@/types";
import { User, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface KeluargaTableProps {
  keluarga: AnggotaKeluarga[];
  anggotaId?: string;
  readOnly?: boolean;
}

export function KeluargaTable({ keluarga, anggotaId, readOnly = true }: KeluargaTableProps) {
  if (!keluarga || keluarga.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">Tidak Ada Data Keluarga</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1.5">
          Anggota ini belum memiliki data keluarga.
          {anggotaId && !readOnly && (
            <span> Anda dapat menambahkan data keluarga melalui halaman <Link to={`/anggota/edit/${anggotaId}`} className="text-primary hover:underline">edit anggota</Link>.</span>
          )}
          {!anggotaId && !readOnly && (
            <span> Anda dapat menambahkan data keluarga melalui halaman edit anggota.</span>
          )}
        </p>
        {anggotaId && !readOnly && (
          <div className="mt-4">
            <Button asChild>
              <Link to={`/anggota/edit/${anggotaId}`}>
                Edit Data Keluarga
              </Link>
            </Button>
          </div>
        )}
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
              <Badge variant={getBadgeVariantByRelationship(k.hubungan)} className="font-normal">
                {k.hubungan}
              </Badge>
            </TableCell>
            <TableCell className="flex items-center gap-1.5">
              <Phone size={14} className="text-muted-foreground" />
              {k.noHp}
            </TableCell>
            <TableCell className="flex items-start gap-1.5">
              <MapPin size={14} className="mt-1 text-muted-foreground" />
              <span className="line-clamp-2">{k.alamat}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Helper function to determine badge variant based on relationship
function getBadgeVariantByRelationship(hubungan: string): "default" | "secondary" | "outline" | "destructive" | "primary" {
  switch (hubungan) {
    case "Suami":
    case "Istri":
      return "primary";
    case "Anak":
      return "default";
    case "Orang Tua":
      return "secondary";
    case "Saudara Kandung":
      return "outline";
    default:
      return "outline";
  }
}
