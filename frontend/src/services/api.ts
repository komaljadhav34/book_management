import axios from 'axios';
import { getToken } from '@/lib/auth';
import { Book, BookListResponse, BookFormData, User } from '@/types/book';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<User>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ access_token: string; token_type: string }>('/auth/login', data),
  getProfile: () => api.get<User>('/auth/profile'),
};

// Books
export const booksApi = {
  getAll: (params?: {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    sort_by?: string;
    sort_order?: string;
  }) => api.get<BookListResponse>('/books', { params }),
  getById: (id: string) => api.get<Book>(`/books/${id}`),
  create: (data: BookFormData) => api.post<Book>('/books', data),
  update: (id: string, data: Partial<BookFormData>) => api.put<Book>(`/books/${id}`, data),
  delete: (id: string) => api.delete(`/books/${id}`),
  getStats: () => api.get('/stats'),
};

export const activityApi = {
  getRecent: (limit: number = 10) => api.get(`/activities?limit=${limit}`),
};

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};

export default api;
