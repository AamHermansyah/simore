'use client'

import React, { useState } from 'react';
import {
  Edit3,
  School,
  Users,
  MapPin,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChangePasswordForm } from '@/components/shared/change-password-form';
import { Puskesmas } from '@/lib/generated/prisma';
import { ProfileView } from '../_components/profile-view';
import { ProfileEditForm } from '../_components/profile-edit-form';

interface IProps {
  data: {
    puskesmas: Puskesmas;
    totalSekolah: number;
    totalSiswi: number;
  }
}

function ProfileLayout({ data }: IProps) {
  const [profile, setProfile] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { puskesmas, totalSekolah, totalSiswi } = profile;

  return (
    <>
      <Card>
        <CardContent>
          {/* Basic Info */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">{puskesmas.nama}</h1>
            <div className="flex justify-center items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{puskesmas.wilayahKerja || '-'}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 text-center">
              <School className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{totalSekolah}</div>
              <div className="text-sm text-blue-600">Sekolah</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 text-center">
              <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{totalSiswi.toLocaleString()}</div>
              <div className="text-sm text-emerald-600">Total Siswi</div>
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
          data={puskesmas}
          onCancel={() => setIsEditing(false)}
          onSuccess={(data) => {
            setIsEditing(false);
            setProfile((prev) => ({
              ...prev,
              puskesmas: { ...data }
            }));
          }}
        />
      ) : (
        <ProfileView
          data={puskesmas}
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