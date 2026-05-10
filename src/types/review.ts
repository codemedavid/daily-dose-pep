// src/types/review.ts
export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  content: string | null;
  image_url: string | null;
  featured: boolean;
  approved: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithProducts extends Review {
  product_ids: string[];
}
