// ProfileView.tsx
import { User, FileText, Mail, Phone, MapPin, UserCheck, Building2, Lock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { SuperAdmin } from "@/lib/generated/prisma";

interface IProps {
  onClickChangePassword: () => void;
  data: SuperAdmin;
}

export function ProfileView({ onClickChangePassword, data }: IProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
      {/* Personal Information */}
      <Card>
        <CardContent>
          <h2 className="font-semibold">Informasi Pribadi</h2>
          <Separator className="my-3" />
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-sm font-medium mb-2">Nama Lengkap</p>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{data.nama}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">NIP</p>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{data.nip || '-'}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Email</p>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{data.email}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">No. Telepon Pribadi</p>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{data.nomorTelepon || '-'}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Alamat</p>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{data.alamat || '-'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Jabatan</h2>
            <Separator className="my-3" />
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-sm font-medium mb-2">Jabatan</p>
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span>{data.jabatan || '-'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Instansi</p>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{data.instansi || '-'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Sistem</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Bergabung sejak: {format(data.createdAt, "dd MMMM yyyy", { locale: id })}</span>
              </div>

              {/* Change Password Button */}
              <Button className="w-full" onClick={onClickChangePassword}>
                <Lock className="h-4 w-4" />
                <span>Ubah Password</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
