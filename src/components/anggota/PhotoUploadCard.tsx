
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PhotoUploadCardProps {
  previewImage: string | null;
  onImageChange: (imageDataUrl: string) => void;
}

export function PhotoUploadCard({ previewImage, onImageChange }: PhotoUploadCardProps) {
  const { toast } = useToast();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Ukuran file terlalu besar",
          description: "Ukuran file maksimum adalah 2MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 relative">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-dashed border-gray-300">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <Upload className="h-10 w-10 text-gray-400" />
              )}
            </div>
          </div>
          
          <div className="w-full">
            <Label htmlFor="photo" className="block mb-2 text-center">
              Foto Anggota
            </Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-xs text-center text-gray-500 mt-2">
              Ukuran maksimum 2MB. Format: JPG, PNG
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
