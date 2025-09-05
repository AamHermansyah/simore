import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function Graph() {
  // Generate sample report data for the last 24 weeks (6 months)
  const generateReportData = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (24 * 7)); // 24 weeks ago

    for (let i = 0; i < 24; i++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + (i * 7));

      // Simulate different report statuses - only 2 types: reported or missed
      const rand = Math.random();
      let status = 'reported';
      if (rand < 0.2) status = 'missed'; // 20% chance of missed report

      weeks.push({
        week: i + 1,
        date: weekDate,
        status: status, // 'reported' or 'missed'
        reportDate: status === 'reported' ? new Date(weekDate.getTime() + Math.random() * 24 * 60 * 60 * 1000) : null // reported on Thursday (same day)
      });
    }
    return weeks;
  };

  const reportData = generateReportData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-secondary';
      case 'missed': return 'bg-muted-foreground/10';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reported': return 'Laporan Tepat Waktu';
      case 'missed': return 'Tidak Ada Laporan';
      default: return 'Tidak Diketahui';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return `${startDate.getDate()} - ${endDate.getDate()} ${endDate.toLocaleDateString('id-ID', { month: 'short' })}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Riwayat Pelaporan</h2>
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="size-5 bg-muted-foreground/10 rounded-full"></div>
              <span>Terlewat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="size-5 bg-secondary rounded-full"></div>
              <span>Tepat Waktu</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 sm:grid-cols-8 xl:grid-cols-12 gap-2">
          {reportData.map((week, index) => (
            <div
              key={index}
              className={`h-8 rounded-sm ${getStatusColor(week.status)} hover:ring-2 hover:ring-primary/50 cursor-pointer transition-all duration-200 flex items-center justify-center relative`}
              title={`Minggu ${week.week}: ${getStatusText(week.status)}\n${getWeekRange(week.date)}`}
            >
              <span className="text-xs font-medium text-secondary-foreground">
                {week.week}
              </span>

              {/* Tooltip */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                <div className="font-medium">Minggu {week.week}</div>
                <div>{getWeekRange(week.date)}</div>
                <div className="text-gray-300">{getStatusText(week.status)}</div>
                {week.reportDate && (
                  <div className="text-gray-300">Dilaporkan: {formatDate(week.reportDate)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Graph