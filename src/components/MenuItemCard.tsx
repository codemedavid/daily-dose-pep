import React, { useState } from 'react';
import { ShoppingCart, Package, Plus, Sparkles } from 'lucide-react';
import type { Product, ProductVariation } from '../types';

interface MenuItemCardProps {
  product: Product;
  onAddToCart?: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  cartQuantity?: number;
  onUpdateQuantity?: (index: number, quantity: number) => void;
  onProductClick?: (product: Product) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  product,
  onAddToCart,
  cartQuantity = 0,
  onProductClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const currentPrice = (product.discount_active && product.discount_price)
    ? product.discount_price
    : product.base_price;

  const hasDiscount = product.discount_active && product.discount_price !== null;
  const originalPrice = product.base_price;
  const discountPct = hasDiscount ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;

  const hasAnyStock = product.variations && product.variations.length > 0
    ? product.variations.some(v => v.stock_quantity > 0)
    : product.stock_quantity > 0;

  const isAvailable = product.available && hasAnyStock;
  const hasVariations = product.variations && product.variations.length > 0;

  return (
    <div
      className="group relative h-full flex flex-col bg-white overflow-hidden rounded-2xl cursor-pointer"
      style={{
        border: '1px solid rgba(10,26,46,0.06)',
        boxShadow: hovered
          ? '0 20px 50px -12px rgba(10,26,46,0.18), 0 4px 12px rgba(124,58,237,0.08)'
          : '0 1px 3px rgba(10,26,46,0.04)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1), box-shadow 320ms cubic-bezier(0.4,0,0.2,1), border-color 320ms',
        borderColor: hovered ? 'rgba(124,58,237,0.35)' : 'rgba(10,26,46,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onProductClick?.(product)}
    >
      {/* ── Image ── */}
      <div
        className="relative overflow-hidden flex-shrink-0 aspect-[4/3]"
        style={{
          background: 'linear-gradient(135deg, #fafafa 0%, #f0ede5 100%)',
        }}
      >
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 600ms cubic-bezier(0.4,0,0.2,1)',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12" style={{ color: '#7C3AED', opacity: 0.45 }} />
          </div>
        )}

        {/* Subtle vignette on hover for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(10,26,46,0.18) 0%, transparent 45%)',
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 320ms',
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-sans font-semibold uppercase tracking-[0.08em] rounded-full backdrop-blur-md"
              style={{
                background: 'rgba(255,255,255,0.92)',
                color: '#7C3AED',
                border: '1px solid rgba(124,58,237,0.25)',
              }}
            >
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
          {hasDiscount && (
            <span
              className="px-2.5 py-1 text-[10px] font-sans font-bold tracking-wider rounded-full text-white"
              style={{ background: '#0A1A2E' }}
            >
              −{discountPct}%
            </span>
          )}
        </div>

        {/* Cart quantity badge */}
        {cartQuantity > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className="w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-sans font-bold text-white"
              style={{
                background: '#7C3AED',
                boxShadow: '0 4px 12px rgba(124,58,237,0.45), 0 0 0 2px rgba(255,255,255,0.95)',
              }}
            >
              {cartQuantity}
            </span>
          </div>
        )}

        {/* Quick-add floating button (desktop hover) */}
        {isAvailable && (
          <button
            onClick={e => {
              e.stopPropagation();
              if (hasVariations) {
                onProductClick?.(product);
                return;
              }
              onAddToCart?.(product, undefined, 1);
            }}
            aria-label={hasVariations ? 'View options' : 'Add to cart'}
            className="absolute bottom-3 right-3 z-10 hidden md:flex w-10 h-10 items-center justify-center rounded-full text-white"
            style={{
              background: '#0A1A2E',
              boxShadow: '0 8px 20px rgba(10,26,46,0.30)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.92)',
              transition: 'opacity 280ms, transform 280ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        )}

        {/* Out of stock overlay */}
        {!isAvailable && (
          <div
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(3px)' }}
          >
            <span
              className="text-[10px] font-sans font-semibold px-3 py-1.5 rounded-full uppercase tracking-[0.12em]"
              style={{ background: '#0A1A2E', color: 'white' }}
            >
              {!product.available ? 'Unavailable' : 'Sold Out'}
            </span>
          </div>
        )}
      </div>

      {/* ── Details ── */}
      <div className="p-2.5 sm:p-4 md:p-5 flex-1 flex flex-col">

        {/* Name */}
        <h3
          className="font-heading font-semibold text-sm sm:text-lg md:text-xl mb-1 sm:mb-1.5 line-clamp-2 leading-tight"
          style={{
            color: hovered ? '#7C3AED' : '#0A1A2E',
            transition: 'color 220ms',
          }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p
          className="font-sans text-[10px] sm:text-[11.5px] md:text-xs leading-snug sm:leading-relaxed mb-2 sm:mb-3 line-clamp-2"
          style={{ color: '#6b6b6b' }}
        >
          {product.description}
        </p>

        {/* Variations hint */}
        {hasVariations && (
          <div className="mb-3">
            <span
              className="inline-flex items-center text-[10px] font-sans font-medium tracking-wide"
              style={{ color: '#8a8a8a' }}
            >
              {product.variations!.length} size{product.variations!.length > 1 ? 's' : ''} available
            </span>
          </div>
        )}

        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="pt-3 mt-2" style={{ borderTop: '1px solid rgba(10,26,46,0.06)' }}>
          <div className="flex items-end justify-between gap-2 mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-sans uppercase tracking-[0.1em]" style={{ color: '#9a9a9a' }}>
                {hasVariations ? 'From' : 'Price'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="font-heading font-semibold text-base sm:text-lg md:text-xl leading-none"
                  style={{ color: '#0A1A2E' }}
                >
                  ₱{currentPrice.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                </span>
                {hasDiscount && (
                  <span
                    className="font-sans text-[11px] line-through"
                    style={{ color: '#b0b0b0' }}
                  >
                    ₱{originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              if (!isAvailable) return;
              if (hasVariations) {
                onProductClick?.(product);
                return;
              }
              onAddToCart?.(product, undefined, 1);
            }}
            disabled={!isAvailable}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs md:text-sm font-sans font-semibold tracking-wide"
            style={
              isAvailable
                ? {
                    background: hovered ? '#7C3AED' : '#0A1A2E',
                    color: 'white',
                    transition: 'background 280ms, transform 200ms',
                    boxShadow: hovered ? '0 6px 16px rgba(124,58,237,0.32)' : '0 2px 6px rgba(10,26,46,0.10)',
                  }
                : { background: '#f0f0f0', color: '#b0b0b0', cursor: 'not-allowed' }
            }
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {hasVariations ? 'Choose Options' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
