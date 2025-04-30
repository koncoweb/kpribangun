
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import AnggotaList from "./pages/Anggota/AnggotaList";
import AnggotaForm from "./pages/Anggota/AnggotaForm";
import TransaksiList from "./pages/Transaksi/TransaksiList";
import TransaksiForm from "./pages/Transaksi/TransaksiForm";
import Laporan from "./pages/Laporan/Laporan";
import Pengaturan from "./pages/Pengaturan/Pengaturan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anggota" element={<AnggotaList />} />
          <Route path="/anggota/tambah" element={<AnggotaForm />} />
          <Route path="/transaksi" element={<TransaksiList />} />
          <Route path="/transaksi/baru" element={<TransaksiForm />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
