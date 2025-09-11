'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Home,
  HelpCircle,
  Mail,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// 404 Error Page Component
const NotFoundPage: React.FC = () => {
  const handleGoHome = () => {
    // In real implementation, use router navigation
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="relative w-24 h-24 bg-white rounded-full mx-auto mb-6 overflow-hidden">
            <Image
              src="/logo.png"
              alt="logo"
              fill
              className="p-1"
            />
          </div>
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground text-lg">
            Maaf, halaman yang kamu cari tidak dapat ditemukan di sistem kami.
          </p>
        </div>

        {/* Possible Reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary dark:text-secondary" />
              Kemungkinan Penyebab
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 pl-4 list-disc text-sm text-muted-foreground">
              <li>
                URL yang Anda masukkan salah atau tidak lengkap
              </li>
              <li>
                Halaman telah dipindahkan atau dihapus
              </li>
              <li>
                Anda tidak memiliki akses ke halaman tersebut
              </li>
              <li>
                Link yang Anda klik sudah kadaluarsa
              </li>
            </ul>
            <div className="mt-4">
              <Button onClick={handleGoHome} className="w-full">
                <Home className="w-4 h-4" />
                Ke Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Butuh Bantuan?</strong> Hubungi administrator sistem di{' '}
            <Link href="mailto:admin@informatika.unsil.ac.id" className="text-primary dark:text-secondary hover:underline">
              admin@simore.com
            </Link>{' '}
            atau telepon (0265) 330634.
          </AlertDescription>
        </Alert>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Simore TTD {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;