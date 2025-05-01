
import { ReactNode } from "react";
import Header from "./Header";
import { SidebarNav } from "./SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/styles/form-styles.css";

type LayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

export default function Layout({ children, pageTitle }: LayoutProps) {
  // Set document title when page changes
  document.title = `${pageTitle} | Koperasi Simpan Pinjam`;
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background">
        <SidebarNav />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header pageTitle={pageTitle} />
          
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
