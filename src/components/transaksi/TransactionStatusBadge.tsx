
import { Badge } from "@/components/ui/badge";

interface TransactionStatusBadgeProps {
  status: "sukses" | "dibatalkan";
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  return (
    <Badge variant={status === "sukses" ? "success" : "destructive"}>
      {status === "sukses" ? "Sukses" : "Dibatalkan"}
    </Badge>
  );
}
