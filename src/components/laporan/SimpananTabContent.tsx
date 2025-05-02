
import { Transaksi } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { ChartBar, Download, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
import { filterTransaksi } from "@/utils/filterTransaksi";
import { formatDate } from "@/utils/formatters";

interface SimpananTabContentProps {
  transaksiList: Transaksi[];
  totalSimpanan: number;
  chartData: {
    simpanan: Array<{
      name: string;
      simpanan: number;
    }>;
  };
  chartColors: {
    simpanan: string;
  };
  filterDateStart: Date;
  filterDateEnd: Date;
}

export function SimpananTabContent({
  transaksiList,
  totalSimpanan,
  chartData,
  chartColors,
  filterDateStart,
  filterDateEnd,
}: SimpananTabContentProps) {
  const simpananTransaksi = transaksiList.filter(t => t.jenis === "Simpan");
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ChartBar size={18} className="text-blue-600" />
              Grafik Simpanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.simpanan}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="simpanan" name="Simpanan" fill={chartColors.simpanan} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              Ringkasan Simpanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Simpanan</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalSimpanan)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Simpanan Pokok</span>
                  <span className="font-medium">{formatCurrency(totalSimpanan * 0.05)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Simpanan Wajib</span>
                  <span className="font-medium">{formatCurrency(totalSimpanan * 0.15)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Simpanan Sukarela</span>
                  <span className="font-medium">{formatCurrency(totalSimpanan * 0.80)}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Anggota Menabung</p>
                <p className="text-xl font-bold text-blue-700">
                  {simpananTransaksi.reduce((acc, curr) => {
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
            <FileText size={18} className="text-blue-600" />
            Laporan Simpanan
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={14} /> Export
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="tahunSimpanan">Tahun</Label>
              <Select defaultValue="2025">
                <SelectTrigger id="tahunSimpanan">
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bulanSimpanan">Bulan</Label>
              <Select defaultValue="all">
                <SelectTrigger id="bulanSimpanan">
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Bulan</SelectItem>
                  <SelectItem value="01">Januari</SelectItem>
                  <SelectItem value="02">Februari</SelectItem>
                  <SelectItem value="03">Maret</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="05">Mei</SelectItem>
                  <SelectItem value="06">Juni</SelectItem>
                  <SelectItem value="07">Juli</SelectItem>
                  <SelectItem value="08">Agustus</SelectItem>
                  <SelectItem value="09">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Desember</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jenisSimpanan">Jenis</Label>
              <Select defaultValue="all">
                <SelectTrigger id="jenisSimpanan">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="pokok">Simpanan Pokok</SelectItem>
                  <SelectItem value="wajib">Simpanan Wajib</SelectItem>
                  <SelectItem value="sukarela">Simpanan Sukarela</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead>Jenis Simpanan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaksiList.filter(t => t.jenis === "Simpan").slice(0, 5).map((transaksi) => {
                  // Apply date filtering if needed
                  const filteredTransaksi = filterTransaksi(
                    [transaksi],
                    filterDateStart.toISOString().split('T')[0],
                    filterDateEnd.toISOString().split('T')[0]
                  );
                  
                  if (filteredTransaksi.length === 0) return null;
                  
                  return (
                    <TableRow key={transaksi.id}>
                      <TableCell>{transaksi.id}</TableCell>
                      <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
                      <TableCell>{transaksi.anggotaNama}</TableCell>
                      <TableCell>{"Simpanan"}</TableCell>
                      <TableCell>{formatCurrency(transaksi.jumlah)}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                          transaksi.status === "Gagal" ? "bg-red-100 text-red-800" : 
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {transaksi.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {transaksiList.filter(t => t.jenis === "Simpan").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Tidak ada data simpanan yang ditemukan
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
