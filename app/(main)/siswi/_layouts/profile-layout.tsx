'use client'

import React, { useState } from 'react';
import {
  Edit3,
  School,
  User,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Angkatan, Siswi } from '@/lib/generated/prisma';
import { ChangePasswordForm } from '@/components/shared/change-password-form';
import { ProfileView } from '../_components/profile-view';
import { ProfileEditForm } from '../_components/profile-edit-form';

interface IProps {
  data: Siswi & {
    angkatan: Angkatan | null;
  };
}

function ProfileLayout({ data }: IProps) {
  const [profile, setProfile] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  return (
    <>
      <Card>
        <CardContent>
          {/* Basic Info */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.nama}</h1>
            <div className="flex items-center justify-center space-x-4 text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <School className="h-4 w-4" />
                <span>Angkatan {profile.angkatan?.nama}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>NISN: {profile.nisn}</span>
              </div>
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
          data={profile}
          onCancel={() => setIsEditing(false)}
          onSuccess={(data) => {
            setIsEditing(false);
            setProfile({ ...data });
          }}
        />
      ) : (
        <ProfileView
          data={profile}
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