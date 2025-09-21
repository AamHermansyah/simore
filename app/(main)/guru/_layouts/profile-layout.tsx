'use client'

import React, { useState } from 'react';
import {
  Edit3,
  School,
  User,
  Users,
  CheckCircle,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Guru } from '@/lib/generated/prisma';
import { ChangePasswordForm } from '@/components/shared/change-password-form';
import { ProfileView } from '../_components/profile-view';
import { ProfileEditForm } from '../_components/profile-edit-form';

interface IProps {
  data: {
    totalSiswi: number;
    totalSiswiAktif: number;
    totalAngkatan: number;
    guru: Guru;
  }
}

function ProfileLayout({ data }: IProps) {
  const [profile, setProfile] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { guru, totalSiswiAktif, totalAngkatan, totalSiswi } = profile;

  return (
    <>
      <Card>
        <CardContent>
          {/* Basic Info */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">{guru.nama}</h1>
            <div className="flex flex-col sm:flex-row items-center justify-center space-x-4 text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <School className="h-4 w-4" />
                <span>{guru.posisi || '-'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>NIP: {guru.nip}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards - Khusus untuk monitoring tablet tambah darah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{totalSiswi}</div>
              <div className="text-sm text-blue-600">Jumlah Siswi</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 text-center">
              <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{totalSiswiAktif}</div>
              <div className="text-sm text-emerald-600">Siswi Aktif</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-4 text-center">
              <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{totalAngkatan}</div>
              <div className="text-sm text-purple-600">Angkatan</div>
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
          data={guru}
          onCancel={() => setIsEditing(false)}
          onSuccess={(data) => {
            setIsEditing(false);
            setProfile((prev) => ({
              ...prev,
              guru: { ...data }
            }));
          }}
        />
      ) : (
        <ProfileView
          data={guru}
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