'use client'

import React, { useState } from 'react';
import {
  Edit3,
  Target,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sekolah } from '@/lib/generated/prisma';
import { ChangePasswordForm } from '@/components/shared/change-password-form';
import { ProfileView } from '../_components/profile-view';
import { ProfileEditForm } from '../_components/profile-edit-form';

interface IProps {
  data: {
    totalGuru: number;
    totalAngkatan: number;
    totalSiswi: number;
    sekolah: Sekolah;
  }
}

function ProfileLayout({ data }: IProps) {
  const [profile, setProfile] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { sekolah, totalGuru, totalAngkatan, totalSiswi } = profile;

  return (
    <>
      <Card>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-center mb-2">
              <h1 className="text-2xl font-semibold">{sekolah.nama}</h1>
              <p>NPSN: {sekolah.nspn}</p>
            </div>
          </div>

          {/* School Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-700">{totalSiswi}</div>
              <div className="text-sm text-blue-600">Total Siswi</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 text-center">
              <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-700">{totalGuru}</div>
              <div className="text-sm text-green-600">Total Guru</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-700">{totalAngkatan}</div>
              <div className="text-sm text-purple-600">Jumlah Angkatan</div>
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
          data={sekolah}
          onCancel={() => setIsEditing(false)}
          onSuccess={(data) => {
            setIsEditing(false);
            setProfile((prev) => ({
              ...prev,
              sekolah: { ...data }
            }));
          }}
        />
      ) : (
        <ProfileView
          data={sekolah}
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

export default ProfileLayout;