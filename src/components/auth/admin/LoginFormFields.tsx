
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { adminLoginFormSchema } from "./formSchema";
import { UsernameInput } from "./UsernameInput";
import PasswordInput from "../anggota/PasswordInput";
import { FormData } from "./types";

interface LoginFormFieldsProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  defaultValues?: FormData;
}

export function LoginFormFields({ 
  onSubmit, 
  isLoading,
  defaultValues = {
    username: "",
    password: "",
  }
}: LoginFormFieldsProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues,
  });

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
                <UsernameInput field={field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Masukkan password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span>Memproses...</span>
          ) : (
            <>
              Login <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default LoginFormFields;
