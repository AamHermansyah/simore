export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'siswi';
  schoolId: string;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  createdAt: string;
}