"use client"

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

let user: User | null = null

export function useAuth() {
  const isAdmin = (): boolean => {
    return user?.role === "ADMIN"
  }

  return {
    user,
    isAdmin
  }
}
