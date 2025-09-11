import React, { Suspense } from 'react';
import {
  Calendar,
  Activity,
  Heart
} from 'lucide-react';
import LoginForm from '../_components/login-form';
import { features } from '@/lib/constants';
import Image from 'next/image';

const LoginPage = () => {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen">

      {/* Left Column - Information */}
      <div className="hidden lg:flex flex-col justify-center px-12 xl:px-16 bg-gradient-to-r from-emerald-500 to-sky-500">
        <div className="max-w-lg">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative w-16 h-16 bg-white rounded-full overflow-hidden border">
              <Image
                src="/logo.png"
                alt="logo"
                fill
                className="p-2"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Simore TTD
              </h1>
              <p className="text-pink-100 mt-1">
                Tablet Tambah Darah untuk Siswi
              </p>
            </div>
          </div>

          {/* Main Description */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              <i>&quot;Kesehatan Siswi adalah Prioritas&quot;</i>
            </h2>
            <p className="text-lg text-pink-100 leading-relaxed">
              Platform monitoring konsumsi tablet tambah darah yang terintegrasi
              untuk meningkatkan kesehatan dan mencegah anemia pada siswi di seluruh Indonesia.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-pink-100 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile Header (hidden on desktop) */}
          <div className="lg:hidden text-center mb-8">
            <div className="relative w-16 h-16 bg-white rounded-full mx-auto overflow-hidden border mb-4">
              <Image
                src="/logo.png"
                alt="logo"
                fill
                className="p-2"
              />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Sistem Monitoring TTD
            </h1>
            <p className="text-muted-foreground text-sm">
              Tablet Tambah Darah untuk Siswi
            </p>
          </div>

          {/* Login Card */}
          <Suspense>
            <LoginForm />
          </Suspense>

          {/* Mobile Stats (hidden on desktop) */}
          <div className="lg:hidden mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border">
              <Calendar className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Laporan</div>
              <div className="text-xs text-gray-600">Mingguan</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border">
              <Activity className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Real-time</div>
              <div className="text-xs text-gray-600">Monitoring</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border">
              <Heart className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Kesehatan</div>
              <div className="text-xs text-gray-600">Siswi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;