
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  getTransaksiById, 
  calculateTotalSimpanan, 
  getRemainingLoanAmount 
} from "@/adapters/serviceAdapters";

import { AngsuranListProps } from "./angsuran/types";
import { calculateAngsuran } from "./angsuran/utils";
import { LoanSelector } from "./angsuran/LoanSelector";
import { LoanSummary } from "./angsuran/LoanSummary";
import { AngsuranTable } from "./angsuran/AngsuranTable";
import { PaymentDialog } from "./angsuran/PaymentDialog";
import { Transaksi } from "@/types";

export interface ExtendedAngsuranListProps extends AngsuranListProps {
  disableSelfPayment?: boolean;
}

export function AngsuranList({ pinjamanTransaksi, disableSelfPayment = false }: ExtendedAngsuranListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPinjaman, setSelectedPinjaman] = useState<string>(
    pinjamanTransaksi.length > 0 ? pinjamanTransaksi[0].id : ""
  );
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [currentAngsuran, setCurrentAngsuran] = useState<any>(null);
  
  // State for loan data
  const [selectedLoan, setSelectedLoan] = useState<Transaksi | null>(null);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [simpananBalance, setSimpananBalance] = useState<number>(0);
  const [angsuranDetails, setAngsuranDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load loan data when selectedPinjaman changes
  useEffect(() => {
    const loadLoanData = async () => {
      if (!selectedPinjaman) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Get the selected loan
        const loan = await getTransaksiById(selectedPinjaman);
        setSelectedLoan(loan || null);

        // Calculate remaining amount
        if (loan) {
          const remaining = getRemainingLoanAmount(selectedPinjaman);
          setRemainingAmount(remaining);

          // Calculate simpanan balance for payment option
          const simpanan = calculateTotalSimpanan(loan.anggotaId);
          setSimpananBalance(simpanan);
          
          // Calculate angsuran details
          const details = await calculateAngsuran(selectedPinjaman);
          setAngsuranDetails(details);
        }
      } catch (error) {
        console.error("Error loading loan data:", error);
        toast({
          title: "Error",
          description: "Failed to load loan data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadLoanData();
  }, [selectedPinjaman, toast]);

  const handleBayarAngsuran = (pinjamanId: string) => {
    navigate("/transaksi/angsuran/tambah", { state: { pinjamanId } });
  };

  const handlePayWithSimpanan = (angsuran: any) => {
    setCurrentAngsuran(angsuran);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentComplete = async () => {
    // Re-render component with the latest data
    if (selectedPinjaman) {
      const loan = await getTransaksiById(selectedPinjaman);
      setSelectedLoan(loan || null);
      
      if (loan) {
        setRemainingAmount(getRemainingLoanAmount(selectedPinjaman));
        setSimpananBalance(calculateTotalSimpanan(loan.anggotaId));
        const details = await calculateAngsuran(selectedPinjaman);
        setAngsuranDetails(details);
      }
    }
  };

  if (pinjamanTransaksi.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Angsuran</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Anggota ini tidak memiliki pinjaman aktif.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Angsuran</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Riwayat Angsuran</CardTitle>
      </CardHeader>
      <CardContent>
        <LoanSelector 
          pinjamanTransaksi={pinjamanTransaksi}
          selectedPinjaman={selectedPinjaman}
          onLoanSelect={setSelectedPinjaman}
        />

        {selectedLoan && (
          <LoanSummary 
            selectedLoan={selectedLoan}
            remainingAmount={remainingAmount}
            simpananBalance={simpananBalance}
            onBayarAngsuran={handleBayarAngsuran}
            selectedPinjaman={selectedPinjaman}
            disableSelfPayment={disableSelfPayment}
          />
        )}

        <AngsuranTable 
          angsuranDetails={angsuranDetails}
          selectedPinjaman={selectedPinjaman}
          onBayarAngsuran={handleBayarAngsuran}
          onPayWithSimpanan={handlePayWithSimpanan}
          simpananBalance={simpananBalance}
          disableSelfPayment={disableSelfPayment}
        />
        
        {!disableSelfPayment && (
          <PaymentDialog
            isOpen={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
            currentAngsuran={currentAngsuran}
            selectedPinjaman={selectedPinjaman}
            simpananBalance={simpananBalance}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </CardContent>
    </Card>
  );
}
