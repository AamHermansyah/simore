export type NavigationItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
  role?: Roles;
};


export type Roles = 'SISWI' | 'GURU' | 'SEKOLAH' | 'PUSKESMAS' | 'SUPERADMIN'