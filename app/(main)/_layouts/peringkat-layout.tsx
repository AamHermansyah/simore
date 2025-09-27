"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Crown, Star, Zap } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { MyRankCard } from "@/components/shared/my-rank-card"

interface IProps {
  data: {
    id: string;
    rank: number
    nama: string
    angkatan: string
    totalPoint: number
    bestStrike: number
  }[];
  angkatanData: {
    id: string;
    nama: string;
    guru: {
      id: string;
      nama: string;
    } | null;
    status: boolean;
    totalSiswi: number;
    totalSiswiAktif: number;
    kepatuhan: number;
    createdAt: Date;
  }[];
  siswi?: {
    angkatan: {
      id: string;
      nama: string;
    } | null;
    id: string;
    nama: string;
    poin: number;
    bestStreak: number;
    sekolahId: string | null;
  }
}

function PeringkatLayout({ data, angkatanData, siswi }: IProps) {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const angkatanId = searchParams.get('angkatanId');

  const angkatan = [
    {
      value: 'all',
      label: 'Semua Angkatan'
    },
    ...angkatanData.map((angkatan) => ({ value: angkatan.id, label: angkatan.nama }))
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
      case 2:
      case 3:
        return <Crown className="h-6 w-6 text-yellow-600" />
      default:
        return (
          <div className="h-6 w-6 flex items-center justify-center bg-slate-200 text-slate-600 rounded-full text-sm font-bold">
            #{rank}
          </div>
        )
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-300 to-orange-600"
      case 2:
        return "bg-gradient-to-r from-primary to-orange-400"
      case 3:
        return "bg-gradient-to-r from-gray-300 via-gray-400 to-slate-500"
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-600"
    }
  }

  const getXPColor = (xp: number) => {
    if (xp >= 2000) return "text-emerald-600"
    if (xp >= 1500) return "text-blue-600"
    return "text-purple-600"
  }

  const displayCount = data.length > 99 ? "99+" : data.length.toString()

  return (
    <div className="space-y-6">
      {/* Dropdown pilih angkatan */}
      <Select
        defaultValue={angkatanId || 'all'}
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams.toString())
          if (value === "all") {
            params.delete("angkatanId")
          } else {
            params.set("angkatanId", value)
          }

          navigate.replace(`?${params.toString()}`)
        }}
      >
        <SelectTrigger className="w-42">
          <SelectValue placeholder="Pilih angkatan" />
        </SelectTrigger>
        <SelectContent>
          {angkatan.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {siswi && (!angkatanId || (angkatanId === siswi.angkatan?.id)) && (
        <MyRankCard
          nama={siswi.nama}
          angkatan={siswi.angkatan!.nama}
          rank={
            (() => {
              const idx = data.findIndex((d) => d.id === siswi.id)
              return idx !== -1 ? idx + 1 : "99+"
            })()
          }
          totalPoint={siswi.poin}
          bestStrike={siswi.bestStreak}
        />
      )}


      {/* Top 3 Podium */}
      {data.length >= 3 && (
        <Card className="py-10">
          <CardContent>
            <h2 className="text-2xl text-yellow-500 font-bold text-center mb-8">
              🏆 Top 3 Champions 🏆
            </h2>
            <div className="flex justify-center items-end space-x-8">
              {[1, 0, 2].map((orderIndex, idx) => {
                const student = data[orderIndex]
                const rank = orderIndex + 1
                const heights = ["h-38", "h-48", "h-34"]

                if (!student) return null

                return (
                  <div key={student.rank} className="flex flex-col items-center">
                    {/* Avatar */}
                    <div
                      className={`relative mb-4 ${rank === 1 ? "transform scale-110" : ""}`}
                    >
                      <div
                        className={`w-20 h-20 rounded-full ${getRankBg(
                          rank
                        )} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                      >
                        {student.nama.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -top-2 -right-2">{getRankIcon(rank)}</div>
                    </div>

                    {/* Podium */}
                    <div
                      className={`${heights[idx]} w-32 ${getRankBg(
                        rank
                      )} rounded-t-2xl flex flex-col justify-center items-center text-white shadow-lg`}
                    >
                      <div className="text-center p-4">
                        <div className="font-bold text-lg mb-1 leading-5 line-clamp-2">{student.nama}</div>
                        <div className="text-sm opacity-90 mb-2">{student.angkatan}</div>
                        <div className="font-black text-xl leading-4">{student.totalPoint} XP</div>
                        <div className="text-xs opacity-80 mt-2">
                          🔥 {student.bestStrike} streak
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Ranking */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="px-0">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Top Peringkat</h2>
            <span className="text-white text-sm">
              Total: {displayCount} siswi
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {data.map((student) => {
              const rank = student.rank
              const isTopThree = rank <= 3

              return (
                <div
                  key={student.rank}
                  className={cn(
                    "p-6 transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50",
                    isTopThree && "bg-gradient-to-r from-yellow-50 to-amber-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">{getRankIcon(rank)}</div>

                      {/* Avatar */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md",
                          getRankBg(rank)
                        )}
                      >
                        {student.nama.substring(0, 2).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {student.nama}
                          </h3>
                          {isTopThree && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <p className="text-gray-600">Angkatan {student.angkatan}</p>
                      </div>
                    </div>

                    {/* XP and Streak */}
                    <div className="text-right">
                      <div
                        className={cn(
                          "text-2xl font-bold",
                          getXPColor(student.totalPoint)
                        )}
                      >
                        {student.totalPoint} XP
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-end space-x-1">
                        <Zap className="h-3 w-3 text-orange-500" />
                        <span>{student.bestStrike} streak</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PeringkatLayout
