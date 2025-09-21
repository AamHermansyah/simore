import { Mail, Phone, MapPin, Calendar, GraduationCap, School, Briefcase, Lock, User, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Guru } from "@/lib/generated/prisma"

interface IProps {
  onClickChangePassword: () => void;
  data: Guru;
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
                <span>{data.email}</span>
              </div>
            </div>
            {/* NIP */}
            <div>
              <Label className="mb-2 block">NIP</Label>
              <div className="text-sm flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{data.nip}</span>
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
          </div>
        </CardContent>
      </Card>

      {/* Informasi Profesional & Sistem */}
      <div className="space-y-6">
        {/* Informasi Profesional */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Profesional</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              {/* Posisi */}
              <div>
                <Label className="mb-2 block">Posisi</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{data.posisi || "-"}</span>
                </div>
              </div>
              {/* Pendidikan Terakhir */}
              <div>
                <Label className="mb-2 block">Pendidikan Terakhir</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{data.pendidikanTerakhir || "-"}</span>
                </div>
              </div>
              {/* Universitas */}
              <div>
                <Label className="mb-2 block">Universitas</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <span>{data.universitas || "-"}</span>
                </div>
              </div>
              {/* Tahun Lulus */}
              <div>
                <Label className="mb-2 block">Tahun Lulus</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{data.tahunLulus || "-"}</span>
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
