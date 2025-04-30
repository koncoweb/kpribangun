
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Clock, 
  Percent, 
  AlertTriangle,
} from "lucide-react";
import { getPengaturan } from "@/services/pengaturanService";
import { Pengaturan as PengaturanType } from "@/types";
import { TenorSettings } from "@/components/pengaturan/TenorSettings";
import { SukuBungaSettings } from "@/components/pengaturan/SukuBungaSettings";
import { DendaSettings } from "@/components/pengaturan/DendaSettings";

export default function Pengaturan() {
  const [settings, setSettings] = useState<PengaturanType>(getPengaturan());
  
  return (
    <Layout pageTitle="Pengaturan">
      <h1 className="page-title">Pengaturan Koperasi</h1>
      
      <Tabs defaultValue="tenor" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="tenor" className="gap-2">
            <Clock size={16} /> Tenor
          </TabsTrigger>
          <TabsTrigger value="bunga" className="gap-2">
            <Percent size={16} /> Suku Bunga
          </TabsTrigger>
          <TabsTrigger value="denda" className="gap-2">
            <AlertTriangle size={16} /> Denda
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenor">
          <TenorSettings settings={settings} setSettings={setSettings} />
        </TabsContent>
        
        <TabsContent value="bunga">
          <SukuBungaSettings settings={settings} setSettings={setSettings} />
        </TabsContent>
        
        <TabsContent value="denda">
          <DendaSettings settings={settings} setSettings={setSettings} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
