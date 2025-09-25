import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  Calendar,
  Lock,
  UserCircle,
  PhoneCall,
  Briefcase,
} from "lucide-react"

interface IProps {
  onClickChangePassword: () => void;
  data: {
    id: string;
    nama: string;
    status: boolean;
    email: string;
    nomorTelepon: string | null;
    website: string | null;
    alamat: string | null;
    wilayahKerja: string | null;
    namaKepalaPuskesmas: string | null;
    nip: string | null;
    nomorTeleponKepalaPuskesmas: string | null;
    password: string;
    createdAt: Date;
    sekolahId: string | null; // bisa dihapus kalau tidak dipakai
  };
}

export function ProfileView({ onClickChangePassword, data }: IProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
      {/* Informasi Puskesmas */}
      <Card>
        <CardContent>
          <h2 className="font-semibold">Informasi Puskesmas</h2>
          <Separator className="my-3" />
          <div className="space-y-4">
            {/* Nama */}
            <div>
              <Label className="mb-2 block">Nama Puskesmas</Label>
              <div className="text-sm flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{data.nama}</span>
              </div>
            </div>
            {/* Email */}
            <div>
              <Label className="mb-2 block">Email</Label>
              <div className="text-sm flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{data.email}</span>
              </div>
            </div>
            {/* Website */}
            <div>
              <Label className="mb-2 block">Website</Label>
              <div className="text-sm flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{data.website || "-"}</span>
              </div>
            </div>
            {/* No. Telepon */}
            <div>
              <Label className="mb-2 block">No. Telepon</Label>
              <div className="text-sm flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{data.nomorTelepon || "-"}</span>
              </div>
            </div>
            {/* Alamat */}
            <div>
              <Label className="mb-2 block">Alamat</Label>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{data.alamat || "-"}</span>
              </div>
            </div>
            {/* Wilayah Kerja */}
            <div>
              <Label className="mb-2 block">Wilayah Kerja</Label>
              <div className="flex items-start space-x-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{data.wilayahKerja || "-"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informasi Kepala Puskesmas & Sistem */}
      <div className="space-y-6">
        {/* Kepala Puskesmas */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Kepala Puskesmas</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              {/* Nama Kepala Puskesmas */}
              <div>
                <Label className="mb-2 block">Nama</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{data.namaKepalaPuskesmas || "-"}</span>
                </div>
              </div>
              {/* NIP */}
              <div>
                <Label className="mb-2 block">NIP</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{data.nip || "-"}</span>
                </div>
              </div>
              {/* No. Telepon Kepala Puskesmas */}
              <div>
                <Label className="mb-2 block">No. Telepon</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                  <span>{data.nomorTeleponKepalaPuskesmas || "-"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Sistem */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Sistem</h2>
            <Separator className="my-3" />
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Bergabung sejak:{" "}
                  {format(data.createdAt, "dd MMMM yyyy", { locale: id })}
                </span>
              </div>
              <Button className="w-full" onClick={onClickChangePassword}>
                <Lock className="h-4 w-4" />
                <span>Ubah Password</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
