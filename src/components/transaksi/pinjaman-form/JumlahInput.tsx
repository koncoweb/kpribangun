
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface JumlahInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function JumlahInput({ value, onChange }: JumlahInputProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="jumlah" className="required">Jumlah (Rp)</Label>
      <Input
        id="jumlah"
        placeholder="Masukkan jumlah pinjaman"
        value={value}
        onChange={onChange}
        required
      />
      <p className="text-xs text-muted-foreground mt-1">
        Format akan otomatis ditambahkan, contoh: 5.000.000
      </p>
    </div>
  );
}
