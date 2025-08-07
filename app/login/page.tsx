"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight, Mail, Lock } from "lucide-react";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would call your API here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, route based on email domain
      if (data.email.includes("siswa")) {
        router.push("/siswa");
      } else if (data.email.includes("adminsekolah")) {
        router.push("/admin_sekolah");
      } else if (data.email.includes("adminpuskesmas")) {
        router.push("/admin_puskesmas");
      } else if (data.email.includes("admin")) {
        router.push("/admin");
      } else {
        // Default to siswa
        router.push("/siswa");
      }
    } catch (err) {
      setError("Login gagal. Periksa email dan kata sandi Anda.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-12">
        {/* Logo */}

        <h2 className="text-2xl font-bold text-center mb-1">SIMORE</h2>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Sistem Monitoring dan Reminder 
          Program Tablet Tambah Darah (TTD)
        </p>

        {/* Login Form */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-5 text-center">Masuk ke Akun Anda</h3>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Email"
                          className="pl-10 h-12 rounded-xl"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="Kata Sandi"
                          className="pl-10 h-12 rounded-xl"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link
                  href="/Login/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-medium text-base" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...
                  </>
                ) : (
                  <>
                    Masuk <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Registration Link */}
        <div className="flex items-center space-x-1">
          <p className="text-sm text-gray-600">Belum memiliki akun?</p>
          <Link href="/login/register" className="text-sm font-medium text-primary hover:underline">
            Daftar
          </Link>
        </div>
      </div>

      {/* Bottom Navigation Bar (optional) */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 text-center text-xs text-gray-500">
        © 2025 SIMORE • Versi 1.0
      </div>
    </div>
  );
}