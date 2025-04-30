
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

export default function Layout({ children, pageTitle }: LayoutProps) {
  // Set document title when page changes
  document.title = `${pageTitle} | Koperasi Simpan Pinjam`;
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
