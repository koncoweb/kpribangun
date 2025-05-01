
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
  BarChart3,
  Clock,
  AlertTriangle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { 
  formatCurrency, 
  formatDate, 
  getDaysOverdue, 
  isPastDue 
} from "@/utils/formatters";
import { 
  getUpcomingDueLoans, 
  getOverdueLoans, 
  calculatePenalty,
  getAllTransaksi,
  getAllPinjaman,
  calculateJatuhTempo 
} from "@/services/transaksiService";
import { getPengaturan } from "@/services/pengaturanService";
import { Transaksi } from "@/types";

export default function Laporan() {
  // Data for charts
  const chartData = [
    { name: "Jan", simpanan: 15000000, pinjaman: 10000000 },
    { name: "Feb", simpanan: 17500000, pinjaman: 12500000 },
    { name: "Mar", simpanan: 20000000, pinjaman: 15000000 },
    { name: "Apr", simpanan: 22500000, pinjaman: 17500000 },
    { name: "Mei", simpanan: 25000000, pinjaman: 20000000 },
    { name: "Jun", simpanan: 27500000, pinjaman: 22500000 },
  ];

  // State for storing overdue and upcoming loans
  const [overdueLoans, setOverdueLoans] = useState<any[]>([]);
  const [upcomingDueLoans, setUpcomingDueLoans] = useState<any[]>([]);
  const [totalPenalty, setTotalPenalty] = useState<number>(0);
  const [allTransactions, setAllTransactions] = useState<Transaksi[]>([]);
  const [allPinjaman, setAllPinjaman] = useState<Transaksi[]>([]);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      const overdue = getOverdueLoans();
      const upcoming = getUpcomingDueLoans(30);
      const transactions = getAllTransaksi();
      const pinjaman = getAllPinjaman();
      
      setOverdueLoans(overdue);
      setUpcomingDueLoans(upcoming);
      setAllTransactions(transactions);
      setAllPinjaman(pinjaman);
      
      // Calculate total penalty
      const total = overdue.reduce((sum, loan) => {
        const penalty = calculatePenalty(loan.transaksi.jumlah, loan.daysOverdue);
        return sum + penalty;
      }, 0);
      
      setTotalPenalty(total);
    };
    
    loadData();
  }, []);

  return (
    <Layout pageTitle="Laporan">
      <h1 className="page-title">Laporan Koperasi</h1>
      
      <Tabs defaultValue="simpanan" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="simpanan">Simpanan</TabsTrigger>
          <TabsTrigger value="pinjaman">Pinjaman</TabsTrigger>
          <TabsTrigger value="jatuhtempo">Jatuh Tempo</TabsTrigger>
          <TabsTrigger value="tunggakan">Tunggakan</TabsTrigger>
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
                        formatter={(value) => formatCurrency(value as number)}
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
                    <p className="text-2xl font-bold text-koperasi-dark">
                      {formatCurrency(253500000)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Simpanan Pokok</span>
                      <span className="font-medium">{formatCurrency(12000000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Simpanan Wajib</span>
                      <span className="font-medium">{formatCurrency(36000000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Simpanan Sukarela</span>
                      <span className="font-medium">{formatCurrency(205500000)}</span>
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
                    {allTransactions
                      .filter(t => t.jenis === "Simpan")
                      .slice(0, 5)
                      .map((transaksi) => (
                        <TableRow key={transaksi.id}>
                          <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
                          <TableCell>{transaksi.anggotaId}</TableCell>
                          <TableCell>{transaksi.anggotaNama}</TableCell>
                          <TableCell>Sukarela</TableCell>
                          <TableCell>{formatCurrency(transaksi.jumlah)}</TableCell>
                        </TableRow>
                      ))}
                    {allTransactions.filter(t => t.jenis === "Simpan").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          Tidak ada data simpanan yang ditemukan
                        </TableCell>
                      </TableRow>
                    )}
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
                        formatter={(value) => formatCurrency(value as number)}
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
                    <p className="text-2xl font-bold text-koperasi-dark">{formatCurrency(175750000)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sudah Dibayar</span>
                      <span className="font-medium text-green-600">{formatCurrency(78230000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Belum Dibayar</span>
                      <span className="font-medium text-amber-600">{formatCurrency(97520000)}</span>
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
                    {allPinjaman.slice(0, 5).map((transaksi) => (
                      <TableRow key={transaksi.id}>
                        <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
                        <TableCell>{transaksi.anggotaId}</TableCell>
                        <TableCell>{transaksi.anggotaNama}</TableCell>
                        <TableCell>{formatCurrency(transaksi.jumlah)}</TableCell>
                        <TableCell>
                          {getPengaturan().tenor.defaultTenor} bulan
                        </TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            Aktif
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {allPinjaman.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          Tidak ada data pinjaman yang ditemukan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* New Tab: Jatuh Tempo */}
        <TabsContent value="jatuhtempo">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  Pinjaman Mendekati Jatuh Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pinjaman</TableHead>
                        <TableHead>Nama Anggota</TableHead>
                        <TableHead>Tanggal Pinjam</TableHead>
                        <TableHead>Jatuh Tempo</TableHead>
                        <TableHead>Jumlah Pinjaman</TableHead>
                        <TableHead>Sisa Hari</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingDueLoans.map((loan) => (
                        <TableRow key={loan.transaksi.id}>
                          <TableCell className="font-medium">{loan.transaksi.id}</TableCell>
                          <TableCell>{loan.transaksi.anggotaNama}</TableCell>
                          <TableCell>{formatDate(loan.transaksi.tanggal)}</TableCell>
                          <TableCell>{formatDate(loan.jatuhTempo)}</TableCell>
                          <TableCell>{formatCurrency(loan.transaksi.jumlah)}</TableCell>
                          <TableCell>{loan.daysUntilDue} hari</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                              ${loan.daysUntilDue <= 7 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-blue-100 text-blue-800"
                              }`}>
                              {loan.daysUntilDue <= 7 ? "Segera" : "Mendatang"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {upcomingDueLoans.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            Tidak ada pinjaman yang akan jatuh tempo dalam 30 hari ke depan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                Laporan Jatuh Tempo
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={14} /> Export
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="tahunJatuhTempo">Tahun</Label>
                  <Select defaultValue="2025">
                    <SelectTrigger id="tahunJatuhTempo">
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bulanJatuhTempo">Bulan</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="bulanJatuhTempo">
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
                  <Label htmlFor="periodeJatuhTempo">Periode</Label>
                  <Select defaultValue="upcoming">
                    <SelectTrigger id="periodeJatuhTempo">
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="upcoming">Akan Datang</SelectItem>
                      <SelectItem value="overdue">Terlambat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah Pinjaman Jatuh Tempo</p>
                    <p className="text-xl font-bold text-koperasi-dark">{upcomingDueLoans.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Nilai</p>
                    <p className="text-xl font-bold text-koperasi-dark">
                      {formatCurrency(
                        upcomingDueLoans.reduce((sum, loan) => sum + loan.transaksi.jumlah, 0)
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Rata-rata Tenor</p>
                  <p className="text-xl font-bold text-koperasi-dark">
                    {getPengaturan().tenor.defaultTenor} Bulan
                  </p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Pinjaman</TableHead>
                      <TableHead>Nama Anggota</TableHead>
                      <TableHead>Tanggal Pinjam</TableHead>
                      <TableHead>Tanggal Jatuh Tempo</TableHead>
                      <TableHead>Jumlah Pinjaman</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPinjaman.slice(0, 5).map((transaksi) => {
                      const jatuhTempo = calculateJatuhTempo(transaksi.tanggal, getPengaturan().tenor.defaultTenor);
                      const isOverdue = isPastDue(jatuhTempo);
                      
                      return (
                        <TableRow key={transaksi.id}>
                          <TableCell className="font-medium">{transaksi.id}</TableCell>
                          <TableCell>{transaksi.anggotaNama}</TableCell>
                          <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
                          <TableCell>{formatDate(jatuhTempo)}</TableCell>
                          <TableCell>{formatCurrency(transaksi.jumlah)}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                              ${isOverdue 
                                ? "bg-red-100 text-red-800" 
                                : "bg-green-100 text-green-800"
                              }`}>
                              {isOverdue ? "Terlambat" : "Aktif"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {allPinjaman.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          Tidak ada data pinjaman yang ditemukan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* New Tab: Tunggakan */}
        <TabsContent value="tunggakan">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-600" />
                  Daftar Pinjaman Menunggak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pinjaman</TableHead>
                        <TableHead>Nama Anggota</TableHead>
                        <TableHead>Tanggal Jatuh Tempo</TableHead>
                        <TableHead>Jumlah Pinjaman</TableHead>
                        <TableHead>Lama Tunggakan</TableHead>
                        <TableHead>Denda</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overdueLoans.map((loan) => {
                        const denda = calculatePenalty(loan.transaksi.jumlah, loan.daysOverdue);
                        return (
                          <TableRow key={loan.transaksi.id}>
                            <TableCell className="font-medium">{loan.transaksi.id}</TableCell>
                            <TableCell>{loan.transaksi.anggotaNama}</TableCell>
                            <TableCell>{formatDate(loan.jatuhTempo)}</TableCell>
                            <TableCell>{formatCurrency(loan.transaksi.jumlah)}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                                ${loan.daysOverdue > 30 
                                  ? "bg-red-100 text-red-800" 
                                  : "bg-yellow-100 text-yellow-800"
                                }`}>
                                {loan.daysOverdue} hari
                              </span>
                            </TableCell>
                            <TableCell className="text-red-600 font-medium">{formatCurrency(denda)}</TableCell>
                          </TableRow>
                        );
                      })}
                      {overdueLoans.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            Tidak ada pinjaman yang menunggak saat ini
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp size={18} className="text-red-600" />
                  Ringkasan Tunggakan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pinjaman Menunggak</p>
                    <p className="text-2xl font-bold text-koperasi-dark">
                      {formatCurrency(overdueLoans.reduce((sum, loan) => sum + loan.transaksi.jumlah, 0))}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Denda</span>
                      <span className="font-medium text-red-600">{formatCurrency(totalPenalty)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Jumlah Peminjam Menunggak</span>
                      <span className="font-medium">{overdueLoans.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rata-rata Keterlambatan</span>
                      <span className="font-medium">
                        {overdueLoans.length > 0
                          ? Math.round(
                              overdueLoans.reduce((sum, loan) => sum + loan.daysOverdue, 0) / overdueLoans.length
                            )
                          : 0}{" "}
                        hari
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Keterlambatan</span>
                      <span className="text-sm font-medium">Jumlah</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{"< 7 hari"}</span>
                        <span>
                          {overdueLoans.filter(loan => loan.daysOverdue < 7).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">7-30 hari</span>
                        <span>
                          {overdueLoans.filter(loan => loan.daysOverdue >= 7 && loan.daysOverdue <= 30).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{"> 30 hari"}</span>
                        <span>
                          {overdueLoans.filter(loan => loan.daysOverdue > 30).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText size={18} className="text-red-600" />
                Laporan Tunggakan
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={14} /> Export
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="tahunTunggakan">Tahun</Label>
                  <Select defaultValue="2025">
                    <SelectTrigger id="tahunTunggakan">
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
                  <Label htmlFor="bulanTunggakan">Bulan</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="bulanTunggakan">
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
                  <Label htmlFor="kategoriTunggakan">Kategori Tunggakan</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="kategoriTunggakan">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="short">{"< 7 hari"}</SelectItem>
                      <SelectItem value="medium">7-30 hari</SelectItem>
                      <SelectItem value="long">{"> 30 hari"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tunggakan</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(
                      overdueLoans.reduce((sum, loan) => sum + loan.transaksi.jumlah + calculatePenalty(loan.transaksi.jumlah, loan.daysOverdue), 0)
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <Button variant="destructive" size="sm" className="gap-1">
                    <AlertTriangle size={14} /> Kirim Pengingat
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Anggota</TableHead>
                      <TableHead>Nama Anggota</TableHead>
                      <TableHead>Jumlah Pinjaman</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead>Keterlambatan</TableHead>
                      <TableHead>Total Denda</TableHead>
                      <TableHead>Total Harus Dibayar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueLoans.map((loan) => {
                      const denda = calculatePenalty(loan.transaksi.jumlah, loan.daysOverdue);
                      const totalBayar = loan.transaksi.jumlah + denda;
                      
                      return (
                        <TableRow key={loan.transaksi.id}>
                          <TableCell>{loan.transaksi.anggotaId}</TableCell>
                          <TableCell>{loan.transaksi.anggotaNama}</TableCell>
                          <TableCell>{formatCurrency(loan.transaksi.jumlah)}</TableCell>
                          <TableCell>{formatDate(loan.jatuhTempo)}</TableCell>
                          <TableCell>{loan.daysOverdue} hari</TableCell>
                          <TableCell className="text-red-600">{formatCurrency(denda)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(totalBayar)}</TableCell>
                        </TableRow>
                      );
                    })}
                    {overdueLoans.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          Tidak ada data tunggakan yang ditemukan
                        </TableCell>
                      </TableRow>
                    )}
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
