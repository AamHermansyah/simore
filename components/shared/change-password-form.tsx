"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordFormValues } from "@/lib/schemas/auth";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { PasswordInput } from "@/components/core/password-input";
import { useState, useTransition } from "react";
import { changePassword } from "@/actions/auth";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { FormError } from "./form-error";
import { toast } from "sonner";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordForm({ open, onOpenChange }: IProps) {
  const [loading, startServer] = useTransition();
  const [error, setError] = useState('');

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ChangePasswordFormValues) {
    startServer(async () => {
      const res = await changePassword(values);

      if (res.success) {
        toast.success(res.message);
        onOpenChange(false);
      } else setError(res.message);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Ubah Password</AlertDialogTitle>
          <AlertDialogDescription>
            Lupa password bisa menghubungi pihak administator untuk melakukan reset.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Saat Ini</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Masukkan password saat ini" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Masukkan password baru" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password Baru</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Konfirmasi password baru" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Batal</AlertDialogCancel>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
                Konfirmasi
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
