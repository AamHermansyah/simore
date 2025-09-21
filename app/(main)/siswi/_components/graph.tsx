import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Laporan, StatusLaporan } from '@/lib/generated/prisma';
import { getWeekRange } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface IProps {
  data: Pick<Laporan, 'id' | 'status' | 'createdAt' | 'rewardPoint'>[];
}

function Graph({ data }: IProps) {
  const getStatusColor = (status: StatusLaporan) => {
    switch (status) {
      case 'DIVERIFIKASI': return 'bg-emerald-300';
      case 'TERLEWAT': return 'bg-muted-foreground/10';
      case 'TERKIRIM': return 'bg-sky-300';
      case 'DITOLAK': return 'bg-destructive/30';
      default: return '';
    }
  };

  const getStatusText = (status: StatusLaporan) => {
    switch (status) {
      case 'DIVERIFIKASI': return 'Laporan telah diverifikasi';
      case 'TERLEWAT': return 'Laporan terlewat';
      case 'TERKIRIM': return 'Laporan menunggu verifikasi';
      case 'DITOLAK': return 'Laporan ditolak oleh administator';
      default: return 'Tidak Diketahui';
    }
  };

  const getReward = (rewardPoint: number, status: StatusLaporan) => {
    switch (status) {
      case 'DIVERIFIKASI':
        return `${rewardPoint} Poin`;
      case 'TERKIRIM':
        return `${rewardPoint} Poin (Pending)`;
      case 'TERLEWAT':
      case 'DITOLAK':
      default:
        return '0 Poin';
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Riwayat Pelaporan</h2>
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="size-5 bg-emerald-300 rounded-full"></div>
            <span>Tepat Waktu</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="size-5 bg-sky-300 rounded-full"></div>
            <span>Pending (Terkirim)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="size-5 bg-muted-foreground/10 rounded-full"></div>
            <span>Terlewat</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="size-5 bg-destructive/30 rounded-full"></div>
            <span>Ditolak</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="grid grid-cols-5 sm:grid-cols-8 xl:grid-cols-12 gap-2">
            {data.map((laporan, index) => (
              <TooltipProvider key={laporan.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`h-8 rounded-sm ${getStatusColor(
                        laporan.status
                      )} hover:ring-2 hover:ring-primary/50 cursor-pointer transition-all duration-200 flex items-center justify-center`}
                    >
                      <span className="text-xs font-medium text-secondary-foreground">
                        {index + 1}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="space-y-1">
                    <div className="font-medium">Minggu {index + 1}</div>
                    <div>{getWeekRange(laporan.createdAt)}</div>
                    <div className="text-muted-foreground">
                      {getStatusText(laporan.status)}
                    </div>
                    <div className="text-muted-foreground">
                      Reward: {getReward(laporan.rewardPoint, laporan.status)}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm h-10">
            Laporan masih kosong
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default Graph