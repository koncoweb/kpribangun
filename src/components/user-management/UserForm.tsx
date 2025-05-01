
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user";
import { UserFormData } from "@/types/user";
import { getRoles } from "@/services/userManagementService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PhotoUpload } from "./PhotoUpload";

// Form validation schema
const userFormSchema = z.object({
  username: z.string().min(3, "Username harus minimal 3 karakter"),
  nama: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  jabatan: z.string().optional(),
  noHP: z.string().optional(),
  alamat: z.string().optional(),
  roleId: z.string().min(1, "Hak akses harus dipilih"),
  aktif: z.boolean().default(true),
  foto: z.string().optional(),
  password: z
    .string()
    .min(6, "Password harus minimal 6 karakter")
    .optional()
    .or(z.string().length(0))
});

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [roles] = useState(getRoles());
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(user?.foto);

  // Initialize form
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: user?.username || "",
      nama: user?.nama || "",
      email: user?.email || "",
      jabatan: user?.jabatan || "",
      noHP: user?.noHP || "",
      alamat: user?.alamat || "",
      roleId: user?.roleId || "",
      aktif: user?.aktif !== undefined ? user.aktif : true,
      foto: user?.foto || "",
      password: "", // Empty for edit mode
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || "",
        nama: user.nama || "",
        email: user.email || "",
        jabatan: user.jabatan || "",
        noHP: user.noHP || "",
        alamat: user.alamat || "",
        roleId: user.roleId || "",
        aktif: user.aktif !== undefined ? user.aktif : true,
        foto: user.foto || "",
        password: "", // Empty for edit mode
      });
      setPhotoPreview(user.foto);
    } else {
      form.reset({
        username: "",
        nama: "",
        email: "",
        jabatan: "",
        noHP: "",
        alamat: "",
        roleId: "",
        aktif: true,
        foto: "",
        password: "",
      });
      setPhotoPreview(undefined);
    }
  }, [user, form]);

  // Handle photo upload
  const handlePhotoChange = (photoData: string) => {
    form.setValue("foto", photoData);
    setPhotoPreview(photoData);
  };

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    // If editing and password is empty, remove it
    if (user && (!data.password || data.password.trim() === "")) {
      const { password, ...rest } = data;
      onSubmit({ ...rest, id: user.id });
    } else {
      // For new user or if password is provided
      if (user) {
        onSubmit({ ...data, id: user.id });
      } else {
        onSubmit(data);
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <PhotoUpload 
              initialImage={photoPreview} 
              onImageChange={handlePhotoChange}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username*</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{user ? "Password (kosongkan jika tidak diubah)" : "Password*"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aktif"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Pengguna</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Pengguna aktif dapat login ke sistem
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap*</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="jabatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jabatan</FormLabel>
                <FormControl>
                  <Input placeholder="Jabatan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hak Akses*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hak akses" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="noHP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor HP</FormLabel>
              <FormControl>
                <Input placeholder="Nomor HP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea placeholder="Alamat lengkap" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">
            {user ? "Perbarui" : "Tambah Pengguna"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
