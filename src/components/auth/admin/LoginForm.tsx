
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "@/services/authService";
import { PasswordInput } from "@/components/auth/anggota/PasswordInput";
import { UsernameInput } from "./UsernameInput";
import { LoginFooter } from "./LoginFooter";
import { adminLoginFormSchema } from "./formSchema";
import { migrateAllData } from "@/utils/migrateToSupabase";

type FormValues = z.infer<typeof adminLoginFormSchema>;

interface LoginFormProps {
  title?: string;
  subtitle?: string;
  onSuccessRedirect?: string;
  demoCredentials?: Array<{
    label: string;
    username: string;
    password: string;
  }>;
}

export function LoginForm({
  title = "Login",
  subtitle = "Enter your credentials to access your account",
  onSuccessRedirect = "/",
  demoCredentials,
}: LoginFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    console.log("Login form submitted with values:", values);
    setIsLoading(true);
    
    try {
      const user = await loginUser(values.username, values.password);
      console.log("Login successful, user data:", user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.nama}`,
      });
      
      // Clear form after successful login
      form.reset();
      
      // Redirect to appropriate page
      console.log("Redirecting to:", onSuccessRedirect);
      navigate(onSuccessRedirect);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Username or password is incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to handle demo login
  const handleDemoLogin = (username: string, password: string) => {
    console.log("Demo login with:", { username, password });
    form.setValue("username", username);
    form.setValue("password", password);
    
    // Auto-submit the form with demo credentials
    form.handleSubmit(onSubmit)();
  };

  // Function to handle data migration
  const handleMigrateData = async () => {
    setIsMigrating(true);
    
    try {
      const result = await migrateAllData();
      
      if (result.success) {
        toast({
          title: "Data Migration Successful",
          description: "All data has been successfully migrated to Supabase.",
        });
      } else {
        toast({
          title: "Migration Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Migration error:", error);
      toast({
        title: "Migration Failed",
        description: error.message || "An error occurred during migration",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 z-0"></div>
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500"></div>
        
        <CardHeader className="space-y-1 relative z-10">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            {title}
          </CardTitle>
          <CardDescription className="text-center">
            {subtitle}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Username</FormLabel>
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
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 h-12 border-muted/30 bg-white/50 backdrop-blur-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10"
                onClick={handleMigrateData}
                disabled={isMigrating}
              >
                {isMigrating ? "Migrating Data..." : "Migrate Data to Supabase"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter>
          <LoginFooter 
            demoCredentials={demoCredentials}
            onDemoLogin={handleDemoLogin}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

// Import necessary components that were previously missing
import { Input } from "@/components/ui/input";
