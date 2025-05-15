
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

export interface LoanSummaryProps {
  jumlah: number;
  kategori: string;
  bunga: number;
  tenor: number;
  angsuran: number;
}

export function LoanSummary({ jumlah, kategori, bunga, tenor, angsuran }: LoanSummaryProps) {
  // Calculate total amount to be paid
  const totalBunga = (bunga / 100) * jumlah * tenor;
  const totalBayar = jumlah + totalBunga;

  return (
    <div className="rounded-lg bg-gray-50 p-5 border border-gray-200">
      <h3 className="text-lg font-semibold mb-3">Ringkasan Pinjaman</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Pokok Pinjaman</p>
          <p className="font-medium">{formatCurrency(jumlah)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Kategori</p>
          <p className="font-medium">{kategori}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Bunga</p>
          <p className="font-medium">{bunga}% per bulan</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Tenor</p>
          <p className="font-medium">{tenor} bulan</p>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Bunga</p>
            <p className="font-medium">{formatCurrency(totalBunga)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Total Bayar</p>
            <p className="font-medium">{formatCurrency(totalBayar)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 font-semibold">Angsuran per Bulan</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(angsuran)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanSummary;
