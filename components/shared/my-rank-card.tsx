import { cn } from "@/lib/utils"
import { Star, Zap } from "lucide-react"

interface MyRankCardProps {
  nama: string
  angkatan: string
  rank: string | number
  totalPoint: number
  bestStrike: number
}

export function MyRankCard({
  nama,
  angkatan,
  rank,
  totalPoint,
  bestStrike,
}: MyRankCardProps) {
  const isTopThree = typeof rank === "number" && rank <= 3

  return (
    <div
      className={cn(
        "p-6 rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50"
      )}
    >
      <h2 className="mb-3">Peringkat kamu</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className="flex-shrink-0 text-2xl font-bold text-indigo-600">
            #{rank}
          </div>

          {/* Avatar */}
          <div
            className={cn(
              "w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shadow-md"
            )}
          >
            {nama.substring(0, 2).toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-gray-900 text-lg">{nama}</h3>
              {isTopThree && <Star className="h-4 w-4 text-yellow-500" />}
            </div>
            <p className="text-gray-600">Angkatan {angkatan}</p>
          </div>
        </div>

        {/* XP and Streak */}
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">
            {totalPoint} XP
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-end space-x-1">
            <Zap className="h-3 w-3 text-orange-500" />
            <span>{bestStrike} streak</span>
          </div>
        </div>
      </div>
    </div>
  )
}