import React from 'react';
import { Star, ArrowLeft, MessageSquare } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { useMenu } from '../hooks/useMenu';

const StarRow: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(n => (
      <Star
        key={n}
        className={`w-4 h-4 ${
          n <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/30'
        }`}
      />
    ))}
  </div>
);

const Reviews: React.FC = () => {
  const { reviews, loading } = useReviews();
  const { products } = useMenu();

  const featured = reviews.filter(r => r.featured);
  const rest = reviews.filter(r => !r.featured);

  const avg =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen" style={{ background: '#0A1A2E' }}>
      <div className="container mx-auto px-5 md:px-8 py-10 max-w-5xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 font-sans text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </a>

        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
            style={{
              background: 'rgba(139,92,246,0.18)',
              border: '1px solid rgba(139,92,246,0.30)',
            }}
          >
            <MessageSquare className="w-6 h-6" style={{ color: '#A78BFA' }} />
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">
            Customer Reviews
          </h1>
          <p className="font-sans text-white/60 max-w-xl mx-auto">
            Real stories and results from our community.
          </p>

          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star
                    key={n}
                    className={`w-5 h-5 ${
                      n <= Math.round(parseFloat(avg))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-sans font-semibold">{avg}</span>
              <span className="text-white/50 text-sm font-sans">
                ({reviews.length} review{reviews.length === 1 ? '' : 's'})
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center text-white/60 py-12">Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-white/60">No reviews yet — be the first to share your story.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {featured.length > 0 && (
              <section>
                <h2 className="font-heading font-semibold text-xl text-white mb-5">
                  Featured Reviews
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {featured.map(r => (
                    <ReviewCard key={r.id} review={r} products={products} />
                  ))}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section>
                {featured.length > 0 && (
                  <h2 className="font-heading font-semibold text-xl text-white mb-5">
                    All Reviews
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {rest.map(r => (
                    <ReviewCard key={r.id} review={r} products={products} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ReviewCardProps {
  review: ReturnType<typeof useReviews>['reviews'][number];
  products: ReturnType<typeof useMenu>['products'];
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, products }) => {
  const linkedNames = review.product_ids
    .map(id => products.find(p => p.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <article
      className="rounded-2xl p-5 transition-all hover:translate-y-[-2px]"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {review.image_url && (
        <img
          src={review.image_url}
          alt={review.title || 'Review photo'}
          className="w-full h-56 object-cover rounded-xl mb-4"
          loading="lazy"
        />
      )}

      <div className="flex items-center justify-between mb-2">
        <h3 className="font-sans font-semibold text-white">{review.customer_name}</h3>
        <StarRow rating={review.rating} />
      </div>

      {review.title && (
        <p className="font-heading font-semibold text-white text-lg leading-snug mb-2">
          {review.title}
        </p>
      )}

      {review.content && (
        <p className="font-sans text-white/70 text-sm leading-relaxed whitespace-pre-line">
          {review.content}
        </p>
      )}

      {linkedNames.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 mt-4 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {linkedNames.map(name => (
            <span
              key={name}
              className="text-[11px] px-2.5 py-1 rounded-full font-medium"
              style={{
                background: 'rgba(139,92,246,0.15)',
                color: '#DDD6FE',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default Reviews;
