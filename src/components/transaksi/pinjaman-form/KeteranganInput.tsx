
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface KeteranganInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function KeteranganInput({ value, onChange }: KeteranganInputProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="keterangan">Keterangan</Label>
      <Textarea
        id="keterangan"
        placeholder="Masukkan keterangan pinjaman (opsional)"
        value={value}
        onChange={onChange}
        rows={3}
      />
    </div>
  );
}
