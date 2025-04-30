
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Laporan() {
  // Data contoh untuk grafik simpanan
  const chartData = [
    { name: "Jan", simpanan: 15000000, pinjaman: 10000000 },
    { name: "Feb", simpanan: 17500000, pinjaman: 12500000 },
    { name: "Mar", simpanan: 20000000, pinjaman: 15000000 },
    { name: "Apr", simpanan: 22500000, pinjaman: 17500000 },
    { name: "Mei", simpanan: 25000000, pinjaman: 20000000 },
    { name: "Jun", simpanan: 27500000, pinjaman: 22500000 },
  ];

  return (
    <Layout pageTitle="Laporan">
      <h1 className="page-title">Laporan Koperasi</h1>
      
      <Tabs defaultValue="simpanan" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="simpanan">Simpanan</TabsTrigger>
          <TabsTrigger value="pinjaman">Pinjaman</TabsTrigger>
          <TabsTrigger value="anggota">Anggota</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simpanan">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart3 size={18} className="text-koperasi-blue" />
                  Grafik Simpanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => `Rp ${new Intl.NumberFormat('id-ID').format(value as number)}`}
                      />
                      <Legend />
                      <Bar dataKey="simpanan" name="Simpanan" fill="#0EA5E9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp size={18} className="text-koperasi-blue" />
                  Ringkasan Simpanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Simpanan</p>
                    <p className="text-2xl font-bold text-koperasi-dark">Rp 253.500.000</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Simpanan Pokok</span>
                      <span className="font-medium">Rp 12.000.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Simpanan Wajib</span>
                      <span className="font-medium">Rp 36.000.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Simpanan Sukarela</span>
                      <span className="font-medium">Rp 205.500.000</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah Anggota Menabung</p>
                    <p className="text-xl font-bold text-koperasi-dark">120 Anggota</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText size={18} className="text-koperasi-blue" />
                Laporan Simpanan
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={14} /> Export
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="tahun">Tahun</Label>
                  <Select defaultValue="2025">
                    <SelectTrigger id="tahun">
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
                  <Label htmlFor="bulan">Bulan</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="bulan">
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
                  <Label htmlFor="jenisSimpanan">Jenis Simpanan</Label>
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
                      <TableHead>Tanggal</TableHead>
                      <TableHead>ID Anggota</TableHead>
                      <TableHead>Nama Anggota</TableHead>
                      <TableHead>Jenis Simpanan</TableHead>
                      <TableHead>Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>20 Apr 2025</TableCell>
                      <TableCell>AG0001</TableCell>
                      <TableCell>Budi Santoso</TableCell>
                      <TableCell>Sukarela</TableCell>
                      <TableCell>Rp 500.000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>15 Apr 2025</TableCell>
                      <TableCell>AG0002</TableCell>
                      <TableCell>Dewi Lestari</TableCell>
                      <TableCell>Sukarela</TableCell>
                      <TableCell>Rp 750.000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>10 Apr 2025</TableCell>
                      <TableCell>AG0003</TableCell>
                      <TableCell>Ahmad Hidayat</TableCell>
                      <TableCell>Wajib</TableCell>
                      <TableCell>Rp 100.000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>05 Apr 2025</TableCell>
                      <TableCell>AG0004</TableCell>
                      <TableCell>Sri Wahyuni</TableCell>
                      <TableCell>Sukarela</TableCell>
                      <TableCell>Rp 1.000.000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>01 Apr 2025</TableCell>
                      <TableCell>AG0005</TableCell>
                      <TableCell>Agus Setiawan</TableCell>
                      <TableCell>Pokok</TableCell>
                      <TableCell>Rp 100.000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pinjaman">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart3 size={18} className="text-koperasi-blue" />
                  Grafik Pinjaman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => `Rp ${new Intl.NumberFormat('id-ID').format(value as number)}`}
                      />
                      <Legend />
                      <Bar dataKey="pinjaman" name="Pinjaman" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp size={18} className="text-amber-500" />
                  Ringkasan Pinjaman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pinjaman</p>
                    <p className="text-2xl font-bold text-koperasi-dark">Rp 175.750.000</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sudah Dibayar</span>
                      <span className="font-medium text-green-600">Rp 78.230.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Belum Dibayar</span>
                      <span className="font-medium text-amber-600">Rp 97.520.000</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah Peminjam Aktif</p>
                    <p className="text-xl font-bold text-koperasi-dark">68 Anggota</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText size={18} className="text-amber-500" />
                Laporan Pinjaman
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={14} /> Export
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="tahunPinjaman">Tahun</Label>
                  <Select defaultValue="2025">
                    <SelectTrigger id="tahunPinjaman">
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
                  <Label htmlFor="bulanPinjaman">Bulan</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="bulanPinjaman">
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
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="paid">Lunas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>ID Anggota</TableHead>
                      <TableHead>Nama Anggota</TableHead>
                      <TableHead>Jumlah Pinjaman</TableHead>
                      <TableHead>Tenor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>18 Apr 2025</TableCell>
                      <TableCell>AG0004</TableCell>
                      <TableCell>Sri Wahyuni</TableCell>
                      <TableCell>Rp 2.000.000</TableCell>
                      <TableCell>6 bulan</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>12 Apr 2025</TableCell>
                      <TableCell>AG0005</TableCell>
                      <TableCell>Agus Setiawan</TableCell>
                      <TableCell>Rp 5.000.000</TableCell>
                      <TableCell>12 bulan</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>05 Mar 2025</TableCell>
                      <TableCell>AG0001</TableCell>
                      <TableCell>Budi Santoso</TableCell>
                      <TableCell>Rp 5.000.000</TableCell>
                      <TableCell>12 bulan</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>20 Feb 2025</TableCell>
                      <TableCell>AG0003</TableCell>
                      <TableCell>Ahmad Hidayat</TableCell>
                      <TableCell>Rp 2.500.000</TableCell>
                      <TableCell>6 bulan</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>15 Jan 2025</TableCell>
                      <TableCell>AG0002</TableCell>
                      <TableCell>Dewi Lestari</TableCell>
                      <TableCell>Rp 1.500.000</TableCell>
                      <TableCell>3 bulan</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">Lunas</span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="anggota">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText size={18} className="text-purple-500" />
                Laporan Anggota
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={14} /> Export
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="periodeAnggota">Periode</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="periodeAnggota">
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Periode</SelectItem>
                      <SelectItem value="year">Tahun Ini</SelectItem>
                      <SelectItem value="month">Bulan Ini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="statusAnggota">Status Anggota</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="statusAnggota">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="jenisKelamin">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jenis Kelamin</TableHead>
                      <TableHead>Pekerjaan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Bergabung</TableHead>
                      <TableHead>Total Simpanan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>AG0001</TableCell>
                      <TableCell>Budi Santoso</TableCell>
                      <TableCell>Laki-laki</TableCell>
                      <TableCell>PNS</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      </TableCell>
                      <TableCell>15 Jan 2025</TableCell>
                      <TableCell>Rp 2.500.000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>AG0002</TableCell>
                      <TableCell>Dewi Lestari</TableCell>
                      <TableCell>Perempuan</TableCell>
                      <TableCell>Guru</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      </TableCell>
                      <TableCell>20 Jan 2025</TableCell>
                      <TableCell>Rp 3.750.000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>AG0003</TableCell>
                      <TableCell>Ahmad Hidayat</TableCell>
                      <TableCell>Laki-laki</TableCell>
                      <TableCell>Wiraswasta</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      </TableCell>
                      <TableCell>25 Jan 2025</TableCell>
                      <TableCell>Rp 1.250.000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>AG0004</TableCell>
                      <TableCell>Sri Wahyuni</TableCell>
                      <TableCell>Perempuan</TableCell>
                      <TableCell>Dosen</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      </TableCell>
                      <TableCell>05 Feb 2025</TableCell>
                      <TableCell>Rp 5.000.000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>AG0005</TableCell>
                      <TableCell>Agus Setiawan</TableCell>
                      <TableCell>Laki-laki</TableCell>
                      <TableCell>Pedagang</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      </TableCell>
                      <TableCell>10 Feb 2025</TableCell>
                      <TableCell>Rp 8.750.000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
