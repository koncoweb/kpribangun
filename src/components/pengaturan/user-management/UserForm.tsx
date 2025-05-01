
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Role } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface UserFormProps {
  user?: User;
  roles: Role[];
  onSubmit: (userData: any) => void;
  onCancel: () => void;
}

export function UserForm({ user, roles, onSubmit, onCancel }: UserFormProps) {
  const form = useForm({
    defaultValues: {
      username: user?.username || "",
      nama: user?.nama || "",
      email: user?.email || "",
      password: "",
      roleId: user?.roleId || "",
      aktif: user?.aktif || true
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        nama: user.nama,
        email: user.email,
        password: "",
        roleId: user.roleId,
        aktif: user.aktif
      });
    } else {
      form.reset({
        username: "",
        nama: "",
        email: "",
        password: "",
        roleId: "",
        aktif: true
      });
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
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
              <FormLabel>{user ? "Password Baru (kosongkan jika tidak berubah)" : "Password"}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
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
              <FormLabel>Peran Akses</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran akses" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map(role => (
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

        <FormField
          control={form.control}
          name="aktif"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Status Akun</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Akun aktif dapat login dan mengakses sistem
                </div>
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">
            {user ? "Perbarui" : "Tambah"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
