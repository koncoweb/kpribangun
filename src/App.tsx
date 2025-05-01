
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { initDemoUserData } from "@/services/authService";
import { initUserManagementData } from "@/services/user-management";

// Authentication
import LoginPage from "@/pages/Auth/LoginPage";
import AnggotaLoginPage from "@/pages/Auth/AnggotaLoginPage";
import { AuthGuard, AnggotaGuard } from "@/components/auth/AuthGuard";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import AnggotaList from "@/pages/Anggota/AnggotaList";
import AnggotaForm from "@/pages/Anggota/AnggotaForm";
import AnggotaDetail from "@/pages/Anggota/AnggotaDetail";
import AnggotaChangePassword from "@/pages/Anggota/AnggotaChangePassword";
import TransaksiList from "@/pages/Transaksi/TransaksiList";
import Pengaturan from "@/pages/Pengaturan/Pengaturan";
import UserManagement from "@/pages/UserManagement/UserManagement";

// Transaction Pages
import SimpanForm from "@/pages/Transaksi/Simpan/SimpanForm";
import SimpanList from "@/pages/Transaksi/Simpan/SimpanList";
import PinjamForm from "@/pages/Transaksi/Pinjam/PinjamForm";
import PinjamList from "@/pages/Transaksi/Pinjam/PinjamList";
import AngsuranForm from "@/pages/Transaksi/Angsuran/AngsuranForm";
import AngsuranList from "@/pages/Transaksi/Angsuran/AngsuranList";
import PengajuanForm from "@/pages/Transaksi/Pengajuan/PengajuanForm";
import PengajuanList from "@/pages/Transaksi/Pengajuan/PengajuanList";
import PengajuanDetail from "@/pages/Transaksi/Pengajuan/PengajuanDetail";
import TransaksiDetail from "@/pages/Transaksi/TransaksiDetail";

// POS Pages
import POSIndex from "@/pages/POS/POSIndex";
import Inventori from "@/pages/POS/Inventori";
import Penjualan from "@/pages/POS/Penjualan";
import PenjualanList from "@/pages/POS/PenjualanList";
import PenjualanDetail from "@/pages/POS/PenjualanDetail";
import LaporanJualBeli from "@/pages/POS/LaporanJualBeli";
import LaporanRugiLaba from "@/pages/POS/LaporanRugiLaba";
import Pembelian from "@/pages/POS/Pembelian";
import Pemasok from "@/pages/POS/Pemasok";

// Initialize demo data
initDemoUserData();
initUserManagementData();

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/anggota-login" element={<AnggotaLoginPage />} />

          {/* Protected routes */}
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          
          {/* User Management */}
          <Route path="/users" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><UserManagement /></AuthGuard>} />
          <Route path="/pengaturan/users" element={<AuthGuard allowedRoles={["role_superadmin"]}><UserManagement /></AuthGuard>} />
          
          {/* Anggota routes */}
          <Route path="/anggota" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><AnggotaList /></AuthGuard>} />
          <Route path="/anggota/new" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><AnggotaForm /></AuthGuard>} />
          <Route path="/anggota/:id/edit" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><AnggotaForm /></AuthGuard>} />
          <Route path="/anggota/:id" element={<AnggotaGuard><AnggotaDetail /></AnggotaGuard>} />
          <Route path="/anggota/change-password" element={<AuthGuard><AnggotaChangePassword /></AuthGuard>} />

          {/* Transaksi routes */}
          <Route path="/transaksi" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><TransaksiList /></AuthGuard>} />
          <Route path="/transaksi/:id" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><TransaksiDetail /></AuthGuard>} />
          
          {/* Simpan routes */}
          <Route path="/transaksi/simpan" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><SimpanList /></AuthGuard>} />
          <Route path="/transaksi/simpan/tambah" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><SimpanForm /></AuthGuard>} />
          
          {/* Pinjam routes */}
          <Route path="/transaksi/pinjam" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><PinjamList /></AuthGuard>} />
          <Route path="/transaksi/pinjam/tambah" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><PinjamForm /></AuthGuard>} />
          
          {/* Angsuran routes */}
          <Route path="/transaksi/angsuran" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><AngsuranList /></AuthGuard>} />
          <Route path="/transaksi/angsuran/tambah" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><AngsuranForm /></AuthGuard>} />
          
          {/* Pengajuan routes */}
          <Route path="/transaksi/pengajuan" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><PengajuanList /></AuthGuard>} />
          <Route path="/transaksi/pengajuan/tambah" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><PengajuanForm /></AuthGuard>} />
          <Route path="/transaksi/pengajuan/:id" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><PengajuanDetail /></AuthGuard>} />
          <Route path="/transaksi/pengajuan/:id/edit" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><PengajuanForm /></AuthGuard>} />
          
          {/* POS routes */}
          <Route path="/pos" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin", "role_kasir"]}><POSIndex /></AuthGuard>} />
          <Route path="/pos/inventory" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><Inventori /></AuthGuard>} />
          <Route path="/pos/penjualan" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin", "role_kasir"]}><Penjualan /></AuthGuard>} />
          <Route path="/pos/penjualan/list" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin", "role_kasir"]}><PenjualanList /></AuthGuard>} />
          <Route path="/pos/penjualan/:id" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin", "role_kasir"]}><PenjualanDetail /></AuthGuard>} />
          <Route path="/pos/laporan/jualbeli" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><LaporanJualBeli /></AuthGuard>} />
          <Route path="/pos/laporan/rugilaba" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><LaporanRugiLaba /></AuthGuard>} />
          <Route path="/pos/pembelian" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><Pembelian /></AuthGuard>} />
          <Route path="/pos/pemasok" element={<AuthGuard allowedRoles={["role_superadmin", "role_admin"]}><Pemasok /></AuthGuard>} />
          
          {/* Settings routes */}
          <Route path="/pengaturan" element={<AuthGuard allowedRoles={["role_superadmin"]}><Pengaturan /></AuthGuard>} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
