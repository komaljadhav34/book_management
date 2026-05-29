export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  price: number;
  published_date: string;
  description: string;
  cover_image?: string;
  stock: number;
  created_by: string;
  created_at: string;
}

export interface BookListResponse {
  items: Book[];
  total: number;
  page: number;
  size: number;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  price: number;
  published_date: string;
  description: string;
  cover_image?: string;
  stock: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}
