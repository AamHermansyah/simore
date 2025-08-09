'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, 'Nama sekolah harus memiliki minimal 2 karakter'),
  address: z.string().optional(),
});

// Form values type
export type SchoolFormValues = z.infer<typeof formSchema>;

interface School {
  id: string;
  nama: string;
  alamat: string;
  puskesmasId: string;
}

interface SchoolFormProps {
  school?: School;
  onSubmit: (data: SchoolFormValues) => void;
  onCancel: () => void;
}

export default function SchoolForm({ school, onSubmit, onCancel }: SchoolFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: school
      ? {
          name: school.nama,
          address: school.alamat || '',
        }
      : {
          name: '',
          address: '',
        },
  });

  const isEditMode = !!school;

  const handleSubmit = (values: SchoolFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Sekolah</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama sekolah" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan alamat sekolah"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">
            {isEditMode ? 'Simpan Perubahan' : 'Tambah Sekolah'}
          </Button>
        </div>
      </form>
    </Form>
  );
}