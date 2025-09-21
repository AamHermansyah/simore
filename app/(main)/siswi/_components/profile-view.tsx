import {
  User,
  Mail,
  FileText,
  Phone,
  MapPin,
  Calendar,
  Droplets,
  Users,
  Award,
  Lock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Siswi } from "@/lib/generated/prisma"

interface IProps {
  onClickChangePassword: () => void;
  data: Siswi
}

export function ProfileView({ onClickChangePassword, data }: IProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
      {/* Informasi Pribadi */}
      <Card>
        <CardContent>
          <h2 className="font-semibold">Informasi Pribadi</h2>
          <Separator className="my-3" />
          <div className="space-y-4">
            {/* Nama */}
            <div>
              <Label className="mb-2 block">Nama</Label>
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
                <span>{data.email || "-"}</span>
              </div>
            </div>
            {/* NISN */}
            <div>
              <Label className="mb-2 block">NISN</Label>
              <div className="text-sm flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{data.nisn}</span>
              </div>
            </div>
            {/* No. Telepon */}
            <div>
              <Label className="mb-2 block">No. WA Aktif</Label>
              <div className="text-sm flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{data.nomorTelepon || "-"}</span>
              </div>
            </div>
            {/* Tanggal Lahir */}
            <div>
              <Label className="mb-2 block">Tanggal Lahir</Label>
              <div className="text-sm flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {data.tanggalLahir
                    ? format(data.tanggalLahir, "dd MMMM yyyy", { locale: id })
                    : "-"}
                </span>
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
            {/* Golongan Darah */}
            <div>
              <Label className="mb-2 block">Golongan Darah</Label>
              <div className="text-sm flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span>{data.golonganDarah || "-"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informasi Akademik & Sistem */}
      <div className="space-y-6">
        {/* Informasi Akademik */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Akademik</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              {/* Jurusan */}
              <div>
                <Label className="mb-2 block">Jurusan</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>{data.jurusan || "-"}</span>
                </div>
              </div>
              {/* Nama Orang Tua */}
              <div>
                <Label className="mb-2 block">Nama Orang Tua</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{data.namaOrtu || "-"}</span>
                </div>
              </div>
              {/* Nomor Telepon Orang Tua */}
              <div>
                <Label className="mb-2 block">Nomor Telepon Orang Tua</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{data.nomorTeleponOrtu || "-"}</span>
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