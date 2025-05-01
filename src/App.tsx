
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import AnggotaList from "./pages/Anggota/AnggotaList";
import AnggotaForm from "./pages/Anggota/AnggotaForm";
import AnggotaDetail from "./pages/Anggota/AnggotaDetail";
import TransaksiList from "./pages/Transaksi/TransaksiList";
import TransaksiForm from "./pages/Transaksi/TransaksiForm";
import TransaksiDetail from "./pages/Transaksi/TransaksiDetail";
import Laporan from "./pages/Laporan/Laporan";
import Pengaturan from "./pages/Pengaturan/Pengaturan";
import NotFound from "./pages/NotFound";

// POS Pages
import POSIndex from "./pages/POS/POSIndex";
import Pembelian from "./pages/POS/Pembelian";
import Penjualan from "./pages/POS/Penjualan";
import PenjualanList from "./pages/POS/PenjualanList";
import PenjualanDetail from "./pages/POS/PenjualanDetail";
import StokBarang from "./pages/POS/StokBarang";
import Inventori from "./pages/POS/Inventori";
import NamaKasir from "./pages/POS/NamaKasir";
import RiwayatTransaksi from "./pages/POS/RiwayatTransaksi";
import KuitansiPembayaran from "./pages/POS/KuitansiPembayaran";
import LaporanJualBeli from "./pages/POS/LaporanJualBeli";
import LaporanRugiLaba from "./pages/POS/LaporanRugiLaba";

// Transaksi Subsection Pages
import PengajuanList from "./pages/Transaksi/Pengajuan/PengajuanList";
import PengajuanForm from "./pages/Transaksi/Pengajuan/PengajuanForm";
import PengajuanDetail from "./pages/Transaksi/Pengajuan/PengajuanDetail";
import SimpanList from "./pages/Transaksi/Simpan/SimpanList";
import SimpanForm from "./pages/Transaksi/Simpan/SimpanForm";
import SimpanDetail from "./pages/Transaksi/Simpan/SimpanDetail";
import PinjamList from "./pages/Transaksi/Pinjam/PinjamList";
import PinjamForm from "./pages/Transaksi/Pinjam/PinjamForm";
import PinjamDetail from "./pages/Transaksi/Pinjam/PinjamDetail";
import AngsuranList from "./pages/Transaksi/Angsuran/AngsuranList";
import AngsuranForm from "./pages/Transaksi/Angsuran/AngsuranForm";
import AngsuranDetail from "./pages/Transaksi/Angsuran/AngsuranDetail";

// Placeholder components for new routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>Halaman ini belum diimplementasikan</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Koperasi Routes */}
          <Route path="/anggota" element={<AnggotaList />} />
          <Route path="/anggota/tambah" element={<AnggotaForm />} />
          <Route path="/anggota/:id" element={<AnggotaDetail />} />
          <Route path="/anggota/:id/edit" element={<AnggotaForm />} />
          <Route path="/transaksi" element={<TransaksiList />} />
          <Route path="/transaksi/baru" element={<TransaksiForm />} />
          <Route path="/transaksi/:id" element={<TransaksiDetail />} />
          
          {/* Pengajuan Routes */}
          <Route path="/transaksi/pengajuan" element={<PengajuanList />} />
          <Route path="/transaksi/pengajuan/tambah" element={<PengajuanForm />} />
          <Route path="/transaksi/pengajuan/:id" element={<PengajuanDetail />} />
          <Route path="/transaksi/pengajuan/:id/edit" element={<PengajuanForm />} />
          
          {/* Simpan Routes */}
          <Route path="/transaksi/simpan" element={<SimpanList />} />
          <Route path="/transaksi/simpan/tambah" element={<SimpanForm />} />
          <Route path="/transaksi/simpan/:id" element={<SimpanDetail />} />
          
          {/* Pinjam Routes */}
          <Route path="/transaksi/pinjam" element={<PinjamList />} />
          <Route path="/transaksi/pinjam/tambah" element={<PinjamForm />} />
          <Route path="/transaksi/pinjam/:id" element={<PinjamDetail />} />
          
          {/* Angsuran Routes */}
          <Route path="/transaksi/angsuran" element={<AngsuranList />} />
          <Route path="/transaksi/angsuran/tambah" element={<AngsuranForm />} />
          <Route path="/transaksi/angsuran/:id" element={<AngsuranDetail />} />
          
          <Route path="/laporan" element={<Laporan />} />
          
          {/* KPRI Mart Routes */}
          <Route path="/pos" element={<POSIndex />} />
          <Route path="/pos/pembelian" element={<Pembelian />} />
          <Route path="/pos/penjualan" element={<Penjualan />} />
          <Route path="/pos/penjualan-list" element={<PenjualanList />} />
          <Route path="/pos/penjualan/:id" element={<PenjualanDetail />} />
          <Route path="/pos/stok" element={<StokBarang />} />
          <Route path="/pos/inventori" element={<Inventori />} />
          <Route path="/pos/kasir" element={<NamaKasir />} />
          <Route path="/pos/riwayat" element={<RiwayatTransaksi />} />
          <Route path="/pos/kuitansi" element={<KuitansiPembayaran />} />
          <Route path="/pos/laporan-jual-beli" element={<LaporanJualBeli />} />
          <Route path="/pos/laporan-rugi-laba" element={<LaporanRugiLaba />} />
          
          {/* Pengaturan Routes */}
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="/pengaturan/users" element={<Placeholder title="User Management" />} />
          <Route path="/pengaturan/roles" element={<Placeholder title="Hak Akses" />} />
          <Route path="/pengaturan/koperasi" element={<Placeholder title="Pengaturan Koperasi" />} />
          <Route path="/pengaturan/tenor" element={<Placeholder title="Pengaturan Tenor" />} />
          <Route path="/pengaturan/denda" element={<Placeholder title="Pengaturan Denda" />} />
          <Route path="/pengaturan/bunga" element={<Placeholder title="Pengaturan Suku Bunga" />} />
          <Route path="/pengaturan/backup" element={<Placeholder title="Backup Data" />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
