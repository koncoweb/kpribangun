
import { PersyaratanDokumen, RequiredDocument } from "./types";
import { DokumenCard } from "./DokumenCard";

interface DokumenUploadFormProps {
  relevantDocuments: RequiredDocument[];
  dokumenList: PersyaratanDokumen[];
  uploading: string | null;
  onFileUpload: (jenis: PersyaratanDokumen["jenis"]) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: string) => void;
}

export function DokumenUploadForm({
  relevantDocuments,
  dokumenList,
  uploading,
  onFileUpload,
  onDelete
}: DokumenUploadFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {relevantDocuments.map((doc) => {
        const uploadedDoc = dokumenList.find(d => d.jenis === doc.jenis);
        
        return (
          <DokumenCard
            key={doc.jenis}
            jenis={doc.jenis}
            required={doc.required}
            uploadedDoc={uploadedDoc}
            onDelete={onDelete}
            onFileUpload={onFileUpload}
            uploading={uploading}
          />
        );
      })}
    </div>
  );
}
