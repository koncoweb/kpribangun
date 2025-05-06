
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Key, Shield, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loginWithAnggotaId } from "@/services/authService";

// Create schema for form validation
const formSchema = z.object({
  anggotaId: z.string().min(2, "ID Anggota minimal 2 karakter"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});

export default function AnggotaLoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      anggotaId: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const user = await loginWithAnggotaId(values.anggotaId, values.password);
      
      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${user.nama}`,
      });
      
      // Clear form after successful login
      form.reset();
      
      // Redirect to anggota profile
      navigate(`/anggota/${user.anggotaId}`);
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message || "ID Anggota atau password salah",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to handle demo login
  const handleDemoLogin = () => {
    form.setValue("anggotaId", "AG0001");
    form.setValue("password", "password123");
    
    // Auto-submit the form with demo credentials
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 z-0"></div>
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500"></div>
        
        <CardHeader className="space-y-1 text-center pb-2 relative z-10">
          <CardTitle className="text-2xl font-bold tracking-tight">
            KPRI BANGUN
          </CardTitle>
          <CardDescription>
            Login Anggota
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="anggotaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">ID Anggota</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Masukkan ID Anggota"
                          className="pl-10 h-12 border-muted/30 bg-white/50 backdrop-blur-sm"
                          {...field}
                        />
                      </div>
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
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
                          className="pl-10 h-12 pr-10 border-muted/30 bg-white/50 backdrop-blur-sm"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-md" 
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2 pt-0 relative z-10">
          <div className="relative w-full my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/40"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Demo
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleDemoLogin}
            className="w-full text-sm h-10 border-muted/30 bg-white/30 backdrop-blur-sm hover:bg-white/50"
          >
            <Shield className="mr-2 h-4 w-4" /> Demo Login Anggota
          </Button>
          
          <div className="flex justify-center w-full mt-4">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Login sebagai Admin/Superadmin
            </Link>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            Sistem Koperasi Pegawai Republik Indonesia
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
