
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Anggota } from "@/types";

export interface AnggotaSelectorProps {
  anggotaList: Anggota[];
  value: string;
  onChange: (anggotaId: string) => void;
}

export function AnggotaSelector({ anggotaList, value, onChange }: AnggotaSelectorProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="anggota" className="required">Pilih Anggota</Label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger id="anggota">
          <SelectValue placeholder="Pilih anggota" />
        </SelectTrigger>
        <SelectContent>
          {anggotaList.length === 0 ? (
            <SelectItem value="empty" disabled>Tidak ada data anggota</SelectItem>
          ) : (
            anggotaList.map((anggota: any) => (
              <SelectItem key={anggota.id} value={anggota.id}>
                {anggota.nama} ({anggota.nip || 'Tanpa NIP'})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
