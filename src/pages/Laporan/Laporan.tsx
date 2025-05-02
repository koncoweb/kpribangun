import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  ResponsiveContainer 
} from 'recharts';

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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  ChartBar,
  ChartLine,
  ChartPie,
  Clock,
  AlertTriangle,
  User,
  FileCheck,
  Wallet,
  CreditCard,
  Receipt,
  Calendar
} from "lucide-react";

import { 
  formatCurrency, 
  formatDate, 
  formatNumber,
  getDaysOverdue, 
  isPastDue 
} from "@/utils/formatters";
import { 
  getUpcomingDueLoans, 
  getOverdueLoans, 
  calculatePenalty,
  getAllTransaksi,
  calculateJatuhTempo 
} from "@/services/transaksi";
import { getPengaturan } from "@/services/pengaturanService";
import { getAnggotaList } from "@/services/anggotaService";
import { getPengajuanList, getPengajuanByStatus } from "@/services/pengajuanService";
import { 
  getTotalAllSimpanan, 
  getTotalAllPinjaman,
  getTotalAllAngsuran
} from "@/services/transaksi/financialOperations";
import { Transaksi, Pengajuan, Anggota } from "@/types";

// Color palette for charts
const CHART_COLORS = {
  simpanan: "#0EA5E9", // blue
  pinjaman: "#F59E0B", // amber
  angsuran: "#10B981", // green
  tunggakan: "#EF4444", // red
  pengajuan: "#8B5CF6", // purple
  anggota: "#EC4899", // pink
  jatuhTempo: "#6366F1" // indigo
};

export default function Laporan() {
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  // Stats state
  const [stats, setStats] = useState({
    totalAnggota: 0,
    totalSimpanan: 0,
    totalPinjaman: 0,
    totalAngsuran: 0,
    totalPengajuan: 0,
    totalTunggakan: 0,
    totalJatuhTempo: 0
  });

  // Chart data
  const [chartData, setChartData] = useState({
    simpanan: [],
    pinjaman: [],
    angsuran: [],
    pengajuan: [],
    anggota: []
  });
  
  // State for storing entity lists
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>([]);
  const [overdueLoans, setOverdueLoans] = useState<any[]>([]);
  const [upcomingDueLoans, setUpcomingDueLoans] = useState<any[]>([]);
  const [totalPenalty, setTotalPenalty] = useState<number>(0);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      // Load basic entities
      const anggota = getAnggotaList();
      const transaksi = getAllTransaksi();
      const pengajuan = getPengajuanList();
      
      // Fix: Pass "ALL" as parameter to getOverdueLoans and getUpcomingDueLoans
      const overdue = getOverdueLoans("ALL");
      const upcoming = getUpcomingDueLoans("ALL", 30);
      
      setAnggotaList(anggota);
      setTransaksiList(transaksi);
      setPengajuanList(pengajuan);
      setOverdueLoans(overdue);
      setUpcomingDueLoans(upcoming);
      
      // Calculate totals
      const totalSimpanan = getTotalAllSimpanan();
      const totalPinjaman = getTotalAllPinjaman();
      const totalAngsuran = getTotalAllAngsuran();
      const totalPenaltyAmount = overdue.reduce((sum, loan) => {
        const penalty = calculatePenalty(loan.transaksi.jumlah, loan.daysOverdue);
        return sum + penalty;
      }, 0);
      
      setTotalPenalty(totalPenaltyAmount);
      
      setStats({
        totalAnggota: anggota.length,
        totalSimpanan,
        totalPinjaman,
        totalAngsuran,
        totalPengajuan: pengajuan.length,
        totalTunggakan: overdue.length,
        totalJatuhTempo: upcoming.length
      });
      
      // Prepare chart data (using dummy data for now, would be replaced with real data)
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const simpananData = months.map((name, index) => ({
        name,
        simpanan: 15000000 + (index * 2500000)
      }));
      
      const pinjamanData = months.map((name, index) => ({
        name,
        pinjaman: 10000000 + (index * 2000000)
      }));
      
      const angsuranData = months.map((name, index) => ({
        name,
        angsuran: 5000000 + (index * 1000000)
      }));
      
      const pengajuanData = [
        { name: "Simpan", value: getPengajuanByStatus("Menunggu").filter(p => p.jenis === "Simpan").length },
        { name: "Pinjam", value: getPengajuanByStatus("Menunggu").filter(p => p.jenis === "Pinjam").length },
        { name: "Disetujui", value: getPengajuanByStatus("Disetujui").length },
        { name: "Ditolak", value: getPengajuanByStatus("Ditolak").length }
      ];
      
      const anggotaGrowthData = months.map((name, index) => ({
        name,
        anggota: 50 + (index * 10)
      }));
      
      setChartData({
        simpanan: simpananData,
        pinjaman: pinjamanData,
        angsuran: angsuranData,
        pengajuan: pengajuanData,
        anggota: anggotaGrowthData
      });
    };
    
    loadData();
  }, []);

  const pieColors = [
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#10B981", // green
    "#EF4444", // red
  ];

  return (
    <Layout pageTitle="Laporan">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Laporan Koperasi</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <Wallet size={20} />
                <span className="font-medium text-sm">Total Simpanan</span>
              </div>
              <span className="text-2xl font-bold text-blue-700">{formatCurrency(stats.totalSimpanan)}</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center space-x-2 text-amber-600 mb-2">
                <CreditCard size={20} />
                <span className="font-medium text-sm">Total Pinjaman</span>
              </div>
              <span className="text-2xl font-bold text-amber-700">{formatCurrency(stats.totalPinjaman)}</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center space-x-2 text-green-600 mb-2">
                <Receipt size={20} />
                <span className="font-medium text-sm">Total Angsuran</span>
              </div>
              <span className="text-2xl font-bold text-green-700">{formatCurrency(stats.totalAngsuran)}</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center space-x-2 text-purple-600 mb-2">
                <User size={20} />
                <span className="font-medium text-sm">Jumlah Anggota</span>
              </div>
              <span className="text-2xl font-bold text-purple-700">{formatNumber(stats.totalAnggota)}</span>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Filter Periode Laporan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
                <Label htmlFor="dateRange">Rentang Waktu</Label>
                <DateRangePicker 
                  value={dateRange}
                  onValueChange={setDateRange}
                  className="w-full"
                />
              </div>
              <div className="pt-6">
                <Button variant="default">
                  Terapkan Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="anggota" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-6">
            <TabsTrigger value="anggota">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Anggota</span>
            </TabsTrigger>
            <TabsTrigger value="pengajuan">
              <FileCheck className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Pengajuan</span>
            </TabsTrigger>
            <TabsTrigger value="simpanan">
              <Wallet className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Simpanan</span>
            </TabsTrigger>
            <TabsTrigger value="pinjaman">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Pinjaman</span>
            </TabsTrigger>
            <TabsTrigger value="angsuran">
              <Receipt className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Angsuran</span>
            </TabsTrigger>
            <TabsTrigger value="jatuhtempo">
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Jatuh Tempo</span>
            </TabsTrigger>
            <TabsTrigger value="tunggakan">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Tunggakan</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Anggota */}
          <TabsContent value="anggota">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <ChartLine size={18} className="text-purple-500" />
                    Grafik Pertumbuhan Anggota
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData.anggota}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [
                            `${value} anggota`,
                            "Jumlah Anggota"
                          ]}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="anggota" name="Jumlah Anggota" stroke={CHART_COLORS.anggota} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <ChartPie size={18} className="text-purple-500" />
                    Komposisi Anggota
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Laki-laki", value: 75 },
                            { name: "Perempuan", value: 45 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#8B5CF6" />
                          <Cell fill="#EC4899" />
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} anggota`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4 mt-4 w-full">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Anggota</p>
                      <p className="text-2xl font-bold text-purple-700">{stats.totalAnggota} Anggota</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <div className="w-3 h-3 bg-[#8B5CF6] mr-2 rounded-sm"></div>
                          Laki-laki
                        </span>
                        <span className="font-medium">75 (62.5%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <div className="w-3 h-3 bg-[#EC4899] mr-2 rounded-sm"></div>
                          Perempuan
                        </span>
                        <span className="font-medium">45 (37.5%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
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
                    <Label htmlFor="periodeAnggota">Status Anggota</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="periodeAnggota">
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
                  <div>
                    <Label htmlFor="pekerjaan">Pekerjaan</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="pekerjaan">
                        <SelectValue placeholder="Pilih pekerjaan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="pns">PNS</SelectItem>
                        <SelectItem value="swasta">Karyawan Swasta</SelectItem>
                        <SelectItem value="wiraswasta">Wiraswasta</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
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
                      {anggotaList.slice(0, 5).map((anggota) => (
                        <TableRow key={anggota.id}>
                          <TableCell>{anggota.id}</TableCell>
                          <TableCell>{anggota.nama}</TableCell>
                          <TableCell>{anggota.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
                          <TableCell>{anggota.pekerjaan || "-"}</TableCell>
                          <TableCell>
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              {anggota.status === "active" ? "Aktif" : "Tidak Aktif"}
                            </span>
                          </TableCell>
                          <TableCell>{anggota.tanggalBergabung ? formatDate(anggota.tanggalBergabung) : "-"}</TableCell>
                          <TableCell>{formatCurrency(750000)}</TableCell>
                        </TableRow>
                      ))}
                      {anggotaList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            Tidak ada data anggota yang ditemukan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Pengajuan */}
          <TabsContent value="pengajuan">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <ChartPie size={18} className="text-purple-600" />
                    Distribusi Pengajuan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.pengajuan}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.pengajuan.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <TrendingUp size={18} className="text-purple-600" />
                    Ringkasan Pengajuan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Pengajuan</p>
                      <p className="text-2xl font-bold text-purple-700">{pengajuanList.length} Pengajuan</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <div className="w-3 h-3 bg-amber-500 mr-2 rounded-sm"></div>
                          Menunggu
                        </span>
                        <span className="font-medium">{getPengajuanByStatus("Menunggu").length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <div className="w-3 h-3 bg-green-500 mr-2 rounded-sm"></div>
                          Disetujui
                        </span>
                        <span className="font-medium">{getPengajuanByStatus("Disetujui").length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <div className="w-3 h-3 bg-red-500 mr-2 rounded-sm"></div>
                          Ditolak
                        </span>
                        <span className="font-medium">{getPengajuanByStatus("Ditolak").length}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <div className="w-3 h-3 bg-blue-500 mr-2 rounded-sm"></div>
                          Simpanan
                        </span>
                        <span className="font-medium">{pengajuanList.filter(p => p.jenis === "Simpan").length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <div className="w-3 h-3 bg-amber-500 mr-2 rounded-sm"></div>
                          Pinjaman
                        </span>
                        <span className="font-medium">{pengajuanList.filter(p => p.jenis === "Pinjam").length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <FileText size={18} className="text-purple-600" />
                  Laporan Pengajuan
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download size={14} /> Export
                </Button>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="jenisPengajuan">Jenis Pengajuan</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="jenisPengajuan">
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="Simpan">Simpanan</SelectItem>
                        <SelectItem value="Pinjam">Pinjaman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="statusPengajuan">Status Pengajuan</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="statusPengajuan">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Menunggu">Menunggu</SelectItem>
                        <SelectItem value="Disetujui">Disetujui</SelectItem>
                        <SelectItem value="Ditolak">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="namaPengaju">Nama Anggota</Label>
                    <Input id="namaPengaju" placeholder="Cari nama anggota" />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Nama Anggota</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Keterangan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pengajuanList.slice(0, 5).map((pengajuan) => (
                        <TableRow key={pengajuan.id}>
                          <TableCell>{pengajuan.id}</TableCell>
                          <TableCell>{formatDate(pengajuan.tanggal)}</TableCell>
                          <TableCell>{pengajuan.anggotaNama}</TableCell>
                          <TableCell>{pengajuan.jenis}</TableCell>
                          <TableCell>{formatCurrency(pengajuan.jumlah)}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              pengajuan.status === "Disetujui" ? "bg-green-100 text-green-800" : 
                              pengajuan.status === "Ditolak" ? "bg-red-100 text-red-800" : 
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {pengajuan.status}
                            </span>
                          </TableCell>
                          <TableCell>{pengajuan.keterangan?.substring(0, 30) || "-"}</TableCell>
                        </TableRow>
                      ))}
                      {pengajuanList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            Tidak ada data pengajuan yang ditemukan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Simpanan */}
          <TabsContent value="simpanan">
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
                        <Bar dataKey="simpanan" name="Simpanan" fill={CHART_COLORS.simpanan} />
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
                      <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.totalSimpanan)}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Simpanan Pokok</span>
                        <span className="font-medium">{formatCurrency(stats.totalSimpanan * 0.05)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Simpanan Wajib</span>
                        <span className="font-medium">{formatCurrency(stats.totalSimpanan * 0.15)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Simpanan Sukarela</span>
                        <span className="font-medium">{formatCurrency(stats.totalSimpanan * 0.80)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Jumlah Anggota Menabung</p>
                      <p className="text-xl font-bold text-blue-700">
                        {transaksiList.filter(t => t.jenis === "Simpan").reduce((acc, curr) => {
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
                      </
