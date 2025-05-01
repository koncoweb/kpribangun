
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAnggotaById } from "@/services/anggotaService";
import { getCurrentUser } from "@/services/authService";
import Layout from "@/components/layout/Layout";
import AnggotaLayout from "@/components/layout/AnggotaLayout";
import { AnggotaDetailHeader } from "@/components/anggota/detail/AnggotaDetailHeader";
import { MainInfoSection } from "@/components/anggota/detail/MainInfoSection";
import { ProfileCard } from "@/components/anggota/detail/ProfileCard";
import { TransactionSection } from "@/components/anggota/detail/TransactionSection";
import { KeluargaSection } from "@/components/anggota/detail/KeluargaSection";
import { LoadingState } from "@/components/anggota/detail/LoadingState";

export default function AnggotaDetail() {
  const { id } = useParams<{ id: string }>();
  const [anggota, setAnggota] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();
  const isAnggotaUser = currentUser?.roleId !== 'role_superadmin' && currentUser?.roleId !== 'role_admin';
  
  // Load anggota data
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    const anggotaData = getAnggotaById(id);
    
    if (anggotaData) {
      setAnggota(anggotaData);
    }
    
    // Simulate loading delay for demo
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id]);

  const Content = () => (
    <>
      {isLoading ? (
        <LoadingState />
      ) : anggota ? (
        <>
          <AnggotaDetailHeader anggota={anggota} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProfileCard anggota={anggota} />
            </div>
            
            <div className="lg:col-span-2">
              <MainInfoSection anggota={anggota} />
              <div className="mt-6">
                <TransactionSection anggotaId={anggota.id} />
              </div>
              <div className="mt-6">
                <KeluargaSection anggotaId={anggota.id} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-gray-800">Data Anggota tidak ditemukan</h2>
          <p className="text-gray-600 mt-2">
            Anggota dengan ID {id} tidak terdaftar dalam sistem
          </p>
        </div>
      )}
    </>
  );

  // Use appropriate layout based on user role
  if (isAnggotaUser) {
    return (
      <AnggotaLayout pageTitle="Profil Anggota">
        <Content />
      </AnggotaLayout>
    );
  }

  return (
    <Layout pageTitle="Detail Anggota">
      <Content />
    </Layout>
  );
}
