
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PersyaratanDokumen } from "./types";

interface DokumenListProps {
  dokumenList: PersyaratanDokumen[];
  onDelete: (id: string) => void;
}

export function DokumenList({ dokumenList, onDelete }: DokumenListProps) {
  if (dokumenList.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Dokumen Terunggah</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jenis Dokumen</TableHead>
            <TableHead>Nama File</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dokumenList.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                {doc.jenis}
                {doc.required && <span className="text-red-500 ml-1">*</span>}
              </TableCell>
              <TableCell>{doc.namaFile}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(doc.id)}
                  className="text-destructive"
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
