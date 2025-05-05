import { ChartBar, Download, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Transaksi } from "@/types";

interface ChartDataItem {
  name: string;
  [key: string]: number | string;
}

interface ChartData {
  simpanan: ChartDataItem[];
  pinjaman: ChartDataItem[];
  angsuran: ChartDataItem[];
  pengajuan: any[];
  anggota: ChartDataItem[];
}

interface PinjamanTabContentProps {
  transaksiList: Transaksi[];
  totalPinjaman: number;
  chartData: ChartData;
  chartColors: Record<string, string>;
  filterDateStart: Date;
  filterDateEnd: Date;
}

export function PinjamanTabContent({
  transaksiList,
  totalPinjaman,
  chartData,
  chartColors,
  filterDateStart,
  filterDateEnd,
}: PinjamanTabContentProps) {
  // Filter only pinjaman transactions
  const pinjamanTransaksi = transaksiList.filter(t => t.jenis === "Pinjam" && t.status === "Sukses");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ChartBar size={18} className="text-amber-600" />
              Grafik Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.pinjaman}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="pinjaman" name="Pinjaman" fill={chartColors.pinjaman} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp size={18} className="text-amber-600" />
              Ringkasan Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Pinjaman</p>
                <p className="text-2xl font-bold text-amber-700">{formatCurrency(totalPinjaman)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pinjaman Aktif</span>
                  <span className="font-medium">{formatCurrency(totalPinjaman * 0.85)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pinjaman Lunas</span>
                  <span className="font-medium">{formatCurrency(totalPinjaman * 0.15)}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Peminjam</p>
                <p className="text-xl font-bold text-amber-700">
                  {pinjamanTransaksi.reduce((acc, curr) => {
                    if (!acc.includes(curr.anggotaId)) {
                      acc.push(curr.anggotaId);
                    }
                    return acc;
                  }, [] as string[]).length} Anggota
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText size={18} className="text-amber-600" />
            Laporan Pinjaman
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={14} /> Export
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="statusPinjaman">Status Pinjaman</Label>
              <Select defaultValue="all">
                <SelectTrigger id="statusPinjaman">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="completed">Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jumlahPinjaman">Jumlah Pinjaman</Label>
              <Select defaultValue="all">
                <SelectTrigger id="jumlahPinjaman">
                  <SelectValue placeholder="Rentang jumlah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jumlah</SelectItem>
                  <SelectItem value="small">Kurang dari 5 juta</SelectItem>
                  <SelectItem value="medium">5 - 20 juta</SelectItem>
                  <SelectItem value="large">Lebih dari 20 juta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="namaPeminjam">Nama Anggota</Label>
              <Input id="namaPeminjam" placeholder="Cari nama anggota" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tenor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sisa Pinjaman</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pinjamanTransaksi.slice(0, 5).map((transaksi) => {
                  // Extract tenor from keterangan
                  const tenorMatch = transaksi.keterangan?.match(/Tenor: (\d+) bulan/);
                  const tenor = tenorMatch ? tenorMatch[1] : "12";
                  
                  return (
                    <TableRow key={transaksi.id}>
                      <TableCell className="font-medium">{transaksi.id}</TableCell>
                      <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
                      <TableCell>{transaksi.anggotaNama}</TableCell>
                      <TableCell>{formatCurrency(transaksi.jumlah)}</TableCell>
                      <TableCell>{tenor} bulan</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(transaksi.jumlah * 0.7)}</TableCell>
                    </TableRow>
                  );
                })}
                {pinjamanTransaksi.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Tidak ada data pinjaman yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
