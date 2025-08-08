// Generate random integer between min and max (inclusive)
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format date to Indonesia locale
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Calculate days difference between two dates
export function daysDifference(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get report status based on last report date
export function getReportStatus(lastReportDate: Date | null): {
  status: 'Belum Pernah' | 'Terlambat' | 'Tepat Waktu' | 'Hampir Terlambat';
  color: string;
} {
  if (!lastReportDate) {
    return { status: 'Belum Pernah', color: 'badge-danger' };
  }
  
  const today = new Date();
  const daysDiff = daysDifference(lastReportDate, today);
  
  if (daysDiff > 14) {
    return { status: 'Terlambat', color: 'badge-danger' };
  } else if (daysDiff > 10) {
    return { status: 'Hampir Terlambat', color: 'badge-warning' };
  } else {
    return { status: 'Tepat Waktu', color: 'badge-success' };
  }
}