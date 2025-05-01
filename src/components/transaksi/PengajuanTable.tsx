
import { Pengajuan } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface PengajuanTableProps {
  pengajuan: Pengajuan[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function PengajuanTable({ 
  pengajuan,
  onApprove,
  onReject
}: PengajuanTableProps) {
  const navigate = useNavigate();
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Anggota</TableHead>
          <TableHead>Jenis</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pengajuan.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10">
              Tidak ada data pengajuan yang ditemukan
            </TableCell>
          </TableRow>
        ) : (
          pengajuan.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{formatDate(item.tanggal)}</TableCell>
              <TableCell>{item.anggotaNama}</TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  item.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                  "bg-amber-100 text-amber-800"
                }`}>
                  {item.jenis}
                </span>
              </TableCell>
              <TableCell>{formatCurrency(item.jumlah)}</TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  item.status === "Disetujui" ? "bg-green-100 text-green-800" : 
                  item.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/transaksi/pengajuan/${item.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" /> Detail
                </Button>
                
                {item.status === "Menunggu" && onApprove && onReject && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600"
                      onClick={() => onApprove(item.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Setuju
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => onReject(item.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Tolak
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
