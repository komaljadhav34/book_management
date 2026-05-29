"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken, removeToken, isAuthenticated } from '@/lib/auth';
import { authApi } from '@/services/api';
import { User } from '@/types/book';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authApi.getProfile();
        setUser(data);
      } catch {
        removeToken();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    setToken(data.access_token);
    const profile = await authApi.getProfile();
    setUser(profile.data);
    toast.success('Welcome back!');
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string, role = 'User') => {
    await authApi.register({ name, email, password, role });
    toast.success('Account created! Please log in.');
    router.push('/login');
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, register, logout, isAuthenticated: isAuthenticated() };
}
