import { Roles } from '@/lib/types';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

async function HomePage() {
  const c = await cookies();
  const role = c.get('role')!.value as Roles;

  switch (role) {
    case 'SISWI':
      return redirect('/siswi');
    case 'GURU':
      return redirect('/guru');
    case 'SEKOLAH':
      return redirect('/sekolah');
    case 'PUSKESMAS':
      return redirect('/puskesmas');
    case 'SUPERADMIN':
      return redirect('/admin');
    default:
      return redirect('/login');
  }
}

export default HomePage