
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import Layout from "@/components/layout/Layout";

import { 
  getUpcomingDueLoans, 
  getOverdueLoans, 
  calculatePenalty,
  getAllTransaksi
} from "@/services/transaksi";
import { getAnggotaList } from "@/services/anggotaService";
import { getPengajuanList } from "@/services/pengajuanService";
import { 
  getTotalAllSimpanan, 
  getTotalAllPinjaman,
  getTotalAllAngsuran
} from "@/services/transaksi/financialOperations";
import { Transaksi, Pengajuan, Anggota } from "@/types";

// Import refactored components
import { FinancialStatsCards } from "@/components/laporan/FinancialStatsCards";
import { DateRangeFilter } from "@/components/laporan/DateRangeFilter";
import { LaporanTabs } from "@/components/laporan/LaporanTabs";

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
  
  // Filter state
  const [filterDateStart, setFilterDateStart] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [filterDateEnd, setFilterDateEnd] = useState<Date>(new Date());
  
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
        { name: "Simpan", value: pengajuan.filter(p => p.jenis === "Simpan" && p.status === "Menunggu").length },
        { name: "Pinjam", value: pengajuan.filter(p => p.jenis === "Pinjam" && p.status === "Menunggu").length },
        { name: "Disetujui", value: pengajuan.filter(p => p.status === "Disetujui").length },
        { name: "Ditolak", value: pengajuan.filter(p => p.status === "Ditolak").length }
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

  // Filter transactions by date
  const handleApplyFilter = () => {
    if (dateRange?.from && dateRange?.to) {
      setFilterDateStart(dateRange.from);
      setFilterDateEnd(dateRange.to);
    }
    
    // Additional filtering logic can be added here
  };
  
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
        <FinancialStatsCards stats={stats} />
        
        {/* Date Range Filter */}
        <DateRangeFilter 
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApplyFilter={handleApplyFilter}
        />
        
        {/* Tabs */}
        <LaporanTabs 
          anggotaList={anggotaList}
          transaksiList={transaksiList}
          pengajuanList={pengajuanList}
          chartData={chartData}
          stats={stats}
          chartColors={CHART_COLORS}
          pieColors={pieColors}
          filterDateStart={filterDateStart}
          filterDateEnd={filterDateEnd}
          overdueLoans={overdueLoans}
          upcomingDueLoans={upcomingDueLoans}
        />
      </div>
    </Layout>
  );
}
