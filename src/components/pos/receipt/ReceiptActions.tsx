
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Penjualan } from "@/types";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, Share2, Check } from "lucide-react";

interface ReceiptActionsProps {
  receiptRef: React.RefObject<HTMLDivElement>;
  sale: Penjualan;
  onClose: () => void;
}

export function ReceiptActions({ receiptRef, sale, onClose }: ReceiptActionsProps) {
  const { toast } = useToast();

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt-${sale.nomorTransaksi}`,
    onAfterPrint: () => {
      toast({
        title: "Struk telah dicetak",
        description: `Struk ${sale.nomorTransaksi} berhasil dicetak.`,
      });
    },
  });

  // Handle sharing
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Struk Pembayaran ${sale.nomorTransaksi}`,
          text: `Pembayaran sebesar ${sale.total} berhasil dilakukan.`,
        });
      } else {
        throw new Error("Web Share API not supported");
      }
    } catch (error) {
      toast({
        title: "Berbagi struk",
        description: "Maaf, berbagi struk tidak didukung di perangkat ini.",
      });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-2 w-full sm:w-auto"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" /> Cetak Struk
      </Button>

      <Button
        variant="outline"
        className="gap-2 w-full sm:w-auto"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" /> Bagikan
      </Button>

      <Button
        className="gap-2 w-full sm:w-auto"
        onClick={onClose}
      >
        <Check className="h-4 w-4" /> Selesai
      </Button>
    </>
  );
}
