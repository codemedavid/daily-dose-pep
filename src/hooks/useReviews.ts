import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Review, ReviewWithProducts } from '../types/review';

interface ReviewProductRow {
  review_id: string;
  product_id: string;
}

const attachProducts = (
  reviews: Review[],
  links: ReviewProductRow[]
): ReviewWithProducts[] => {
  const map = new Map<string, string[]>();
  for (const link of links) {
    const arr = map.get(link.review_id) || [];
    arr.push(link.product_id);
    map.set(link.review_id, arr);
  }
  return reviews.map(r => ({ ...r, product_ids: map.get(r.id) || [] }));
};

export const useReviews = (options: { adminMode?: boolean } = {}) => {
  const { adminMode = false } = options;
  const [reviews, setReviews] = useState<ReviewWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('reviews')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!adminMode) {
        query = query.eq('approved', true);
      }

      const { data: reviewsData, error: rErr } = await query;
      if (rErr) throw rErr;

      const { data: linkData, error: lErr } = await supabase
        .from('review_products')
        .select('review_id, product_id');
      if (lErr) throw lErr;

      setReviews(attachProducts(reviewsData || [], linkData || []));
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [adminMode]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (
    review: Omit<Review, 'id' | 'created_at' | 'updated_at'>,
    productIds: string[]
  ) => {
    const { data, error: insErr } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();
    if (insErr) throw insErr;

    if (productIds.length > 0) {
      const links = productIds.map(pid => ({
        review_id: data.id,
        product_id: pid,
      }));
      const { error: linkErr } = await supabase.from('review_products').insert(links);
      if (linkErr) throw linkErr;
    }

    await fetchReviews();
    return data;
  };

  const updateReview = async (
    id: string,
    updates: Partial<Review>,
    productIds?: string[]
  ) => {
    const { error: upErr } = await supabase
      .from('reviews')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (upErr) throw upErr;

    if (productIds) {
      const { error: delErr } = await supabase
        .from('review_products')
        .delete()
        .eq('review_id', id);
      if (delErr) throw delErr;

      if (productIds.length > 0) {
        const links = productIds.map(pid => ({
          review_id: id,
          product_id: pid,
        }));
        const { error: linkErr } = await supabase
          .from('review_products')
          .insert(links);
        if (linkErr) throw linkErr;
      }
    }

    await fetchReviews();
  };

  const deleteReview = async (id: string) => {
    const { error: delErr } = await supabase.from('reviews').delete().eq('id', id);
    if (delErr) throw delErr;
    await fetchReviews();
  };

  return {
    reviews,
    loading,
    error,
    addReview,
    updateReview,
    deleteReview,
    refetch: fetchReviews,
  };
};

export const useProductReviews = (productId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data: links, error: lErr } = await supabase
          .from('review_products')
          .select('review_id')
          .eq('product_id', productId);
        if (lErr) throw lErr;

        const ids = (links || []).map(l => l.review_id);
        if (ids.length === 0) {
          if (!cancelled) setReviews([]);
          return;
        }

        const { data, error: rErr } = await supabase
          .from('reviews')
          .select('*')
          .in('id', ids)
          .eq('approved', true)
          .order('created_at', { ascending: false });
        if (rErr) throw rErr;

        if (!cancelled) setReviews(data || []);
      } catch (err) {
        console.error('Error fetching product reviews:', err);
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  return { reviews, loading };
};
