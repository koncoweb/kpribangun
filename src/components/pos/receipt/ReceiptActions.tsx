
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import React, { useState, RefObject } from "react";
import { Penjualan } from "@/types";

interface ReceiptActionsProps {
  receiptRef: RefObject<HTMLDivElement>;
  sale: Penjualan;
  onClose: () => void;
}

export function ReceiptActions({ receiptRef, sale, onClose }: ReceiptActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Receipt-${sale.nomorTransaksi}`,
    onAfterPrint: () => {
      console.log("Print completed");
    },
    contentRef: receiptRef
  });
  
  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Receipt-${sale.nomorTransaksi}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating receipt image:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <>
      <Button 
        className="w-full sm:w-auto gap-2" 
        variant="outline"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" /> Print
      </Button>
      <Button 
        className="w-full sm:w-auto gap-2" 
        variant="outline"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <Download className="h-4 w-4" /> {isDownloading ? "Processing..." : "Download"}
      </Button>
      <Button 
        className="w-full sm:w-auto" 
        onClick={onClose}
      >
        Tutup
      </Button>
    </>
  );
}
