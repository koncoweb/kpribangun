
import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Transaksi } from "@/types";
import { getRemainingLoanAmount } from "@/services/transaksi";
import { TransaksiReceipt } from "./TransaksiReceipt";
import { ReceiptActions } from "./ReceiptActions";
import { FileText } from "lucide-react";

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaksi: Transaksi | null;
}

export function ReceiptDialog({ open, onOpenChange, transaksi }: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [remainingAmount, setRemainingAmount] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const fetchRemainingAmount = async () => {
      if (transaksi?.jenis === "Angsuran") {
        const pinjamanIdMatch = transaksi.keterangan?.match(/pinjaman #(TR\d+)/);
        if (pinjamanIdMatch && pinjamanIdMatch[1]) {
          const amount = await getRemainingLoanAmount(pinjamanIdMatch[1]);
          setRemainingAmount(amount);
        }
      }
    };
    
    if (transaksi) {
      fetchRemainingAmount();
    }
  }, [transaksi]);
  
  if (!transaksi) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <FileText className="h-5 w-5" />
            Bukti Transaksi
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <TransaksiReceipt 
            ref={receiptRef} 
            transaksi={transaksi} 
            remainingAmount={remainingAmount} 
          />
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <ReceiptActions 
            receiptRef={receiptRef}
            transaksi={transaksi}
            onClose={() => onOpenChange(false)} 
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
