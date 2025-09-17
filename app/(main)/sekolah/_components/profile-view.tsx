// ProfileView.tsx
import { User, FileText, Mail, Phone, MapPin, Lock, Calendar, Award, School, Map, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { Sekolah } from "@/lib/generated/prisma";

interface IProps {
  onClickChangePassword: () => void;
  data: Sekolah;
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
              <p className="text-sm font-medium mb-2">Nama Sekolah</p>
              <div className="flex items-center space-x-2">
                <School className="h-4 w-4 text-muted-foreground" />
                <span>{data.nama}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Akreditasi</p>
              <div className="flex items-start space-x-2">
                <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{data.akreditasi || '-'}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">NPSN</p>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{data.nspn || '-'}</span>
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
              <p className="text-sm font-medium mb-2">Nomor Telepon Sekolah</p>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{data.nomorTeleponSekolah || '-'}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Website</p>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-blue-600 hover:underline cursor-pointer">{data.website}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Wilayah</p>
              <div className="flex items-start space-x-2">
                <Map className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{data.wilayah || '-'}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Alamat</p>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{data.alamatLengkap || '-'}</span>
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
                <p className="text-sm font-medium mb-2">Nama Kepala Sekolah</p>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{data.namaKepalaSekolah || '-'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">No. Telepon</p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{data.nomorTeleponKepalaSekolah || '-'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-semibold">Koordinator Program</h2>
            <Separator className="my-3" />
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-sm font-medium mb-2">Nama Koordinator</p>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{data.namaKoordinator || '-'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">No. Telepon</p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{data.nomorTeleponKoordinator || '-'}</span>
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
