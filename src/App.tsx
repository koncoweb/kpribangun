import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { initUserManagementData } from "./services/userManagementService";
import { AuthGuard, AnggotaGuard } from "@/components/auth/AuthGuard";
import { isAuthenticated, getCurrentUser } from "@/services/authService";

// Login Page
import LoginPage from "./pages/Auth/LoginPage";

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
import Pemasok from "./pages/POS/Pemasok";
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

// Role constants
const ADMIN_ROLES = ["role_superadmin", "role_admin"];

const queryClient = new QueryClient();

const App = () => {
  // Initialize user data on app load
  useEffect(() => {
    initUserManagementData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Home Route - Redirect based on authentication */}
            <Route path="/" element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            } />
            
            {/* Protected Routes - Admin Only */}
            <Route path="/anggota" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <AnggotaList />
              </AuthGuard>
            } />
            <Route path="/anggota/tambah" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <AnggotaForm />
              </AuthGuard>
            } />
            
            {/* Anggota Detail - Special guard for anggota self-service */}
            <Route path="/anggota/:id" element={
              <AnggotaGuard>
                <AnggotaDetail />
              </AnggotaGuard>
            } />
            <Route path="/anggota/:id/edit" element={
              <AnggotaGuard>
                <AnggotaForm />
              </AnggotaGuard>
            } />
            
            {/* Other Protected Routes */}
            <Route path="/transaksi" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <TransaksiList />
              </AuthGuard>
            } />
            <Route path="/transaksi/baru" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <TransaksiForm />
              </AuthGuard>
            } />
            <Route path="/transaksi/:id" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <TransaksiDetail />
              </AuthGuard>
            } />
            
            {/* Pengajuan Routes */}
            <Route path="/transaksi/pengajuan" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <PengajuanList />
              </AuthGuard>
            } />
            <Route path="/transaksi/pengajuan/tambah" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <PengajuanForm />
              </AuthGuard>
            } />
            <Route path="/transaksi/pengajuan/:id" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <PengajuanDetail />
              </AuthGuard>
            } />
            <Route path="/transaksi/pengajuan/:id/edit" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <PengajuanForm />
              </AuthGuard>
            } />
            
            {/* Simpan Routes */}
            <Route path="/transaksi/simpan" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <SimpanList />
              </AuthGuard>
            } />
            <Route path="/transaksi/simpan/tambah" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <SimpanForm />
              </AuthGuard>
            } />
            <Route path="/transaksi/simpan/:id" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <SimpanDetail />
              </AuthGuard>
            } />
            
            {/* Pinjam Routes */}
            <Route path="/transaksi/pinjam" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <PinjamList />
              </AuthGuard>
            } />
            <Route path="/transaksi/pinjam/tambah" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <PinjamForm />
              </AuthGuard>
            } />
            <Route path="/transaksi/pinjam/:id" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <PinjamDetail />
              </AuthGuard>
            } />
            
            {/* Angsuran Routes */}
            <Route path="/transaksi/angsuran" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <AngsuranList />
              </AuthGuard>
            } />
            <Route path="/transaksi/angsuran/tambah" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <AngsuranForm />
              </AuthGuard>
            } />
            <Route path="/transaksi/angsuran/:id" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <AngsuranDetail />
              </AuthGuard>
            } />
            
            <Route path="/laporan" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Laporan />
              </AuthGuard>
            } />
            
            {/* KPRI Mart Routes */}
            <Route path="/pos" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <POSIndex />
              </AuthGuard>
            } />
            <Route path="/pos/pembelian" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Pembelian />
              </AuthGuard>
            } />
            <Route path="/pos/pemasok" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Pemasok />
              </AuthGuard>
            } />
            <Route path="/pos/penjualan" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Penjualan />
              </AuthGuard>
            } />
            <Route path="/pos/penjualan-list" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <PenjualanList />
              </AuthGuard>
            } />
            <Route path="/pos/penjualan/:id" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <PenjualanDetail />
              </AuthGuard>
            } />
            <Route path="/pos/stok" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <StokBarang />
              </AuthGuard>
            } />
            <Route path="/pos/inventori" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Inventori />
              </AuthGuard>
            } />
            <Route path="/pos/kasir" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <NamaKasir />
              </AuthGuard>
            } />
            <Route path="/pos/riwayat" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <RiwayatTransaksi />
              </AuthGuard>
            } />
            <Route path="/pos/kuitansi" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <KuitansiPembayaran />
              </AuthGuard>
            } />
            <Route path="/pos/laporan-jual-beli" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <LaporanJualBeli />
              </AuthGuard>
            } />
            <Route path="/pos/laporan-rugi-laba" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <LaporanRugiLaba />
              </AuthGuard>
            } />
            
            {/* Pengaturan Routes */}
            <Route path="/pengaturan" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Pengaturan />
              </AuthGuard>
            } />
            <Route path="/pengaturan/users" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Placeholder title="User Management" />
              </AuthGuard>
            } />
            <Route path="/pengaturan/roles" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Placeholder title="Hak Akses" />
              </AuthGuard>
            } />
            <Route path="/pengaturan/koperasi" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Placeholder title="Pengaturan Koperasi" />
              </AuthGuard>
            } />
            <Route path="/pengaturan/tenor" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Placeholder title="Pengaturan Tenor" />
              </AuthGuard>
            } />
            <Route path="/pengaturan/denda" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Placeholder title="Pengaturan Denda" />
              </AuthGuard>
            } />
            <Route path="/pengaturan/bunga" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Placeholder title="Pengaturan Suku Bunga" />
              </AuthGuard>
            } />
            <Route path="/pengaturan/backup" element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <Placeholder title="Backup Data" />
              </AuthGuard>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
