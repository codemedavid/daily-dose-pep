import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Star, MessageSquare } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { useMenu } from '../hooks/useMenu';
import ImageUpload from './ImageUpload';
import type { ReviewWithProducts } from '../types/review';

interface ReviewsManagerProps {
  onBack: () => void;
}

interface FormState {
  customer_name: string;
  rating: number;
  title: string;
  content: string;
  image_url: string | null;
  featured: boolean;
  approved: boolean;
  sort_order: number;
  product_ids: string[];
}

const emptyForm: FormState = {
  customer_name: '',
  rating: 5,
  title: '',
  content: '',
  image_url: null,
  featured: false,
  approved: true,
  sort_order: 0,
  product_ids: [],
};

const ReviewsManager: React.FC<ReviewsManagerProps> = ({ onBack }) => {
  const { reviews, loading, addReview, updateReview, deleteReview } = useReviews({ adminMode: true });
  const { products } = useMenu();
  const [editing, setEditing] = useState<ReviewWithProducts | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (r: ReviewWithProducts) => {
    setEditing(r);
    setForm({
      customer_name: r.customer_name,
      rating: r.rating,
      title: r.title || '',
      content: r.content || '',
      image_url: r.image_url,
      featured: r.featured,
      approved: r.approved,
      sort_order: r.sort_order,
      product_ids: r.product_ids,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const toggleProduct = (id: string) => {
    setForm(f => ({
      ...f,
      product_ids: f.product_ids.includes(id)
        ? f.product_ids.filter(p => p !== id)
        : [...f.product_ids, id],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name.trim()) {
      alert('Customer name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        customer_name: form.customer_name.trim(),
        rating: form.rating,
        title: form.title.trim() || null,
        content: form.content.trim() || null,
        image_url: form.image_url || null,
        featured: form.featured,
        approved: form.approved,
        sort_order: form.sort_order,
      };
      if (editing) {
        await updateReview(editing.id, payload, form.product_ids);
      } else {
        await addReview(payload, form.product_ids);
      }
      closeForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    try {
      await deleteReview(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Customer Reviews</h1>
                <p className="text-sm text-gray-500">Add, edit, and link reviews to products</p>
              </div>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Review
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
            No reviews yet. Click <span className="font-semibold">Add Review</span> to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(r => {
              const linkedNames = r.product_ids
                .map(id => products.find(p => p.id === id)?.name)
                .filter(Boolean) as string[];
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{r.customer_name}</h3>
                        {r.featured && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            FEATURED
                          </span>
                        )}
                        {!r.approved && (
                          <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                            HIDDEN
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star
                            key={n}
                            className={`w-4 h-4 ${
                              n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {r.title && (
                        <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {r.image_url && (
                    <img
                      src={r.image_url}
                      alt="Review"
                      className="w-full h-40 object-cover rounded-lg mb-3"
                      loading="lazy"
                    />
                  )}

                  {r.content && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{r.content}</p>
                  )}

                  {linkedNames.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                      {linkedNames.map(name => (
                        <span
                          key={name}
                          className="text-[11px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full font-medium"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-lg font-bold text-gray-900">
                  {editing ? 'Edit Review' : 'Add Review'}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-700 p-1"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={e => setForm({ ...form, customer_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, rating: n })}
                        className="p-1"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            n <= form.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                    placeholder="Optional headline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 min-h-[100px]"
                    placeholder="What the customer said…"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo (optional)
                  </label>
                  <ImageUpload
                    folder="menu-images"
                    currentImage={form.image_url}
                    onImageChange={url => setForm({ ...form, image_url: url ?? null })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Linked Products
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select products this review applies to. The review will appear in each product's
                    detail modal.
                  </p>
                  {products.length === 0 ? (
                    <p className="text-sm text-gray-500">No products available</p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                      {products.map(p => (
                        <label
                          key={p.id}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.product_ids.includes(p.id)}
                            onChange={() => toggleProduct(p.id)}
                            className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-800 flex-1">{p.name}</span>
                          <span className="text-xs text-gray-400">{p.category}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.approved}
                      onChange={e => setForm({ ...form, approved: e.target.checked })}
                      className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Approved (visible)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={e =>
                      setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg font-medium shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving…' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManager;
