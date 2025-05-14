
export interface PinjamanFormData {
  jumlah: string;
  keterangan: string;
  kategori: string;
}

export interface PinjamanFormProps {
  anggotaId: string;
  anggotaNama: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PinjamanFormData) => void;
  isSubmitting: boolean;
}

export interface PinjamanFormSummaryProps {
  kategori: string;
  jumlah: string;
  bunga: number;
  pengaturan: any;
}
