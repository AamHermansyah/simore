"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PasswordInput } from "@/components/core/password-input"
import { Separator } from "@/components/ui/separator"
import { getColorClasses, roles } from "@/lib/constants"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { loginSchema, LoginSchemaValues } from "@/lib/schemas/auth"
import { cn } from "@/lib/utils"
import { loginAction } from "@/actions/auth"
import { LoaderCircle } from "lucide-react"
import { FormError } from "@/components/shared/form-error"
import { useSearchParams } from "next/navigation"

function LoginForm() {
  const [loading, startServer] = React.useTransition();
  const [error, setError] = React.useState('');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const form = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchRole = form.watch('role');

  const onSubmit = (values: LoginSchemaValues) => {
    setError('');
    startServer(() => {
      loginAction(values, callbackUrl)
        .then((res) => {
          if (res.message) setError(res.message);
        });
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Masuk ke Sistem</CardTitle>
        <p className="text-gray-600 mt-2">
          Pilih role dan masukkan kredensial Anda
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Masuk Sebagai</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger className={cn('w-full', !!watchRole && '!h-14')}>
                        <SelectValue placeholder="Pilih role Anda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => {
                        const Icon = role.icon
                        const colorClass = getColorClasses(role.color)
                        return (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center space-x-3 py-1">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass.bg} flex items-center justify-center`}
                              >
                                <Icon className={`h-4 w-4 ${colorClass.icon}`} />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{role.label}</div>
                                <div className="text-xs text-gray-500">
                                  {role.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-4" />

            {watchRole === 'SISWI' ? (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor WA</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="tel"
                        placeholder="Cth: 08xxxxxxxxxx"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan email"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Password Input */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Masukkan password"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />

            {/* Login Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>

        {/* Forgot Password */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Lupa password?{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-yellow-500 hover:underline cursor-pointer">
                    Hubungi administrator
                  </span>
                </TooltipTrigger>
                <TooltipContent className="border border-foreground/20">
                  <p className="w-[200px]">
                    Segera hubungi administrator yang mengelola akun Anda untuk
                    pemulihan password.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default LoginForm
