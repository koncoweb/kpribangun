
import { Pembelian } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, FileEdit, Trash2 } from "lucide-react";

interface PembelianListProps {
  pembelianList: Pembelian[];
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PembelianList({ pembelianList, onViewDetail, onEdit, onDelete }: PembelianListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selesai":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "proses":
        return <Badge className="bg-blue-500">Proses</Badge>;
      case "dibatalkan":
        return <Badge className="bg-red-500">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nomor Transaksi</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pemasok</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pembelianList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  Tidak ada data pembelian
                </TableCell>
              </TableRow>
            ) : (
              pembelianList.map((pembelian) => (
                <TableRow key={pembelian.id}>
                  <TableCell>{pembelian.nomorTransaksi}</TableCell>
                  <TableCell>{pembelian.tanggal}</TableCell>
                  <TableCell>{pembelian.pemasok}</TableCell>
                  <TableCell>{formatCurrency(pembelian.total)}</TableCell>
                  <TableCell>{getStatusBadge(pembelian.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onViewDetail(pembelian.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEdit(pembelian.id)}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    {pembelian.status !== "selesai" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-700" 
                        onClick={() => onDelete(pembelian.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
