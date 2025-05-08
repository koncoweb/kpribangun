
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface NeracaItemProps {
  label: string;
  amount: number;
  isTotal?: boolean;
  isNegative?: boolean;
  indented?: boolean;
}

interface NeracaTableProps {
  title: string;
  items: {
    assets: NeracaItemProps[];
    liabilities: NeracaItemProps[];
  };
  totalAssets: number;
  totalLiabilities: number;
  saldoAwal: number;
  saldoAkhir: number;
}

export default function NeracaTable({ 
  title, 
  items, 
  totalAssets, 
  totalLiabilities,
  saldoAwal,
  saldoAkhir
}: NeracaTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Keterangan</TableHead>
              <TableHead className="text-right">Jumlah (Rp)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="font-medium">
              <TableCell colSpan={2}>Aktiva</TableCell>
            </TableRow>
            
            {items.assets.map((item, index) => (
              <TableRow key={`asset-${index}`} className={item.isTotal ? "font-semibold" : ""}>
                <TableCell className={item.indented ? "pl-8" : ""}>
                  {item.label}
                </TableCell>
                <TableCell className="text-right">
                  {item.isNegative 
                    ? `(${formatCurrency(item.amount).replace('Rp', '')})`
                    : formatCurrency(item.amount)
                  }
                </TableCell>
              </TableRow>
            ))}
            
            <TableRow className="font-medium">
              <TableCell colSpan={2}>Pasiva</TableCell>
            </TableRow>
            
            {items.liabilities.map((item, index) => (
              <TableRow key={`liability-${index}`} className={item.isTotal ? "font-semibold" : ""}>
                <TableCell className={item.indented ? "pl-8" : ""}>
                  {item.label}
                </TableCell>
                <TableCell className="text-right">
                  {item.isNegative 
                    ? `(${formatCurrency(item.amount).replace('Rp', '')})`
                    : formatCurrency(item.amount)
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Saldo Awal</TableCell>
              <TableCell className="text-right">{formatCurrency(saldoAwal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Perubahan Saldo</TableCell>
              <TableCell className="text-right">
                {totalAssets - totalLiabilities >= 0 
                  ? formatCurrency(totalAssets - totalLiabilities)
                  : `(${formatCurrency(Math.abs(totalAssets - totalLiabilities)).replace('Rp', '')})`
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Saldo Akhir</TableCell>
              <TableCell className="text-right">{formatCurrency(saldoAkhir)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
