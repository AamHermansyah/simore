import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users } from 'lucide-react';
import { JWT_SECRET, JwtPayload } from '@/lib/auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getAllAngkatan } from '@/data/angkatan';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

async function GuruAngkatanPage() {
  let decoded: JwtPayload;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // 1. Verifikasi token
    decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
    if (!decoded?.id) {
      throw new Error("Token tidak valid");
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }

  const res = await getAllAngkatan({ limit: 100, page: 1, guruId: decoded.id });
  if (!res.success) throw new Error(res.message);

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col justify-between gap-3 lg:mb-6 lg:flex-row lg:items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Kelola Laporan</h1>
          <p className="text-sm text-muted-foreground">
            Monitoring setiap laporan siswi dari berbagai angkatan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        {res.data?.items.map((angkatan) => (
          <Link href={`/guru/laporan/${angkatan.id}`} key={angkatan.id}>
            <Card className="bg-gradient-to-br from-secondary/50 to-sky-300 cursor-pointer group">
              <CardContent className="relative z-10">
                <div className="text-center mb-4">
                  <div className="bg-primary/60 border border-muted-foreground/50 inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
                    <GraduationCap className="h-8 w-8" />
                  </div>

                  <h3 className="text-2xl font-bold mb-1">{angkatan.nama}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="rounded-lg p-3 text-center backdrop-blur-sm transition-all duration-300">
                    <Users className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xl font-bold">{angkatan.totalSiswi}</div>
                    <div className="text-xs text-muted-foreground">Siswi</div>
                  </div>

                  <div className="rounded-lg p-3 text-center backdrop-blur-sm transition-all duration-300">
                    <Users className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xl font-bold">{angkatan.totalSiswiAktif}</div>
                    <div className="text-xs text-muted-foreground">Siswi Aktif</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-foreground">Kepatuhan Mingguan</span>
                    <span className="text-xs text-muted-foreground">
                      {angkatan.kepatuhan}%
                    </span>
                  </div>
                  <Progress value={angkatan.kepatuhan} className="bg-background" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default GuruAngkatanPage