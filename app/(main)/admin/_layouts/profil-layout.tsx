'use client'

import React, { useState } from 'react';
import {
  Shield,
  Edit3,
  Users,
  School,
  Building2,
  Crown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileEditForm } from '../_components/profie-edit-form';
import { ProfileView } from '../_components/profile-view';
import { SuperAdmin } from '@/lib/generated/prisma';
import { ChangePasswordForm } from '@/components/shared/change-password-form';

interface IProps {
  data: {
    totalSekolah: number;
    totalPuskesmas: number;
    totalSiswi: number;
    superAdmin: SuperAdmin;
  }
}

function ProfilLayout({ data }: IProps) {
  const [profile, setProfile] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { superAdmin, totalPuskesmas, totalSekolah, totalSiswi } = profile;

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent>
          {/* Basic Info */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-500 rounded-full mb-4 shadow-lg relative">
              <Shield className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-yellow-800" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{superAdmin.nama}</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-4 text-center">
              <Building2 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{totalPuskesmas}</div>
              <div className="text-sm text-purple-600">Puskesmas</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-4 text-center">
              <School className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{totalSekolah.toLocaleString()}</div>
              <div className="text-sm text-blue-600">Sekolah</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 text-center">
              <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{totalSiswi}</div>
              <div className="text-sm text-emerald-600">Siswi</div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-center">
            {!isEditing && (
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profil</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isEditing ? (
        <ProfileEditForm
          data={superAdmin}
          onCancel={() => setIsEditing(false)}
          onSuccess={(data) => {
            setIsEditing(false);
            setProfile((prev) => ({
              ...prev,
              superAdmin: { ...data }
            }));
          }}
        />
      ) : (
        <ProfileView
          data={superAdmin}
          onClickChangePassword={() => setIsChangingPassword(true)}
        />
      )}

      <ChangePasswordForm
        open={isChangingPassword}
        onOpenChange={setIsChangingPassword}
      />
    </>
  );
};

export default ProfilLayout;