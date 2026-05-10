import React, { useState, useRef } from 'react';
import MenuItemCard from './MenuItemCard';
import Hero from './Hero';
import HomeSections from './HomeSections';
import ProductDetailModal from './ProductDetailModal';
import type { Product, ProductVariation, CartItem } from '../types';
import { Search, SlidersHorizontal, Package, FlaskConical, ShieldCheck, Truck, BadgeCheck, Microscope, ArrowRight } from 'lucide-react';

interface MenuProps {
  menuItems: Product[];
  addToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  cartItems: CartItem[];
  updateQuantity: (index: number, quantity: number) => void;
}

const WHY_ITEMS = [
  {
    icon: FlaskConical,
    title: 'Pharmaceutical Grade',
    desc: 'Every peptide is synthesized to pharmaceutical-grade standards with verified purity certificates from accredited labs.',
    iconColor: '#7C3AED',
    iconBg: '#E3F1FE',
    accent: '#7C3AED',
  },
  {
    icon: ShieldCheck,
    title: 'Third-Party Tested',
    desc: 'Independent COA testing on every batch ensures what is on the label is exactly what you receive — nothing more, nothing less.',
    iconColor: '#7C3AED',
    iconBg: '#142442',
    accent: '#7C3AED',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    desc: 'Fast, discreet delivery across all regions of the Philippines with real-time order tracking from dispatch to your door.',
    iconColor: '#7C3AED',
    iconBg: '#E3F1FE',
    accent: '#7C3AED',
  },
  {
    icon: BadgeCheck,
    title: 'Expert Protocols',
    desc: 'Access evidence-based dosing guides, reconstitution protocols, and storage best practices developed with medical professionals.',
    iconColor: '#7C3AED',
    iconBg: '#142442',
    accent: '#7C3AED',
  },
  {
    icon: Microscope,
    title: 'Research-Backed',
    desc: 'Our catalog features only peptides with established research profiles, ensuring your wellness journey is built on science.',
    iconColor: '#7C3AED',
    iconBg: '#E3F1FE',
    accent: '#7C3AED',
  },
  {
    icon: Package,
    title: 'Secure Packaging',
    desc: 'Temperature-controlled packaging and cold-chain logistics protect peptide integrity from our facility to your hands.',
    iconColor: '#7C3AED',
    iconBg: '#142442',
    accent: '#7C3AED',
  },
];

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems }) => {
  const [searchQuery, setSearchQuery]   = useState('');
  const [sortBy, setSortBy]             = useState<'name' | 'price' | 'purity'>('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productsRef = useRef<HTMLDivElement | null>(null);

  // Expand products with variations into one listing per variation.
  type Listing = {
    card: Product;
    sourceProduct: Product;
    variation?: ProductVariation;
  };

  const listings: Listing[] = menuItems.flatMap(product => {
    if (!product.variations || product.variations.length === 0) {
      return [{ card: product, sourceProduct: product }];
    }
    return product.variations.map(v => {
      const useDiscount = v.discount_active && v.discount_price !== null;
      const card: Product = {
        ...product,
        id: `${product.id}::${v.id}`,
        name: `${product.name} ${v.name}`.trim(),
        base_price: v.price,
        discount_price: useDiscount ? v.discount_price : null,
        discount_active: !!useDiscount,
        stock_quantity: v.stock_quantity,
        variations: undefined,
      };
      return { card, sourceProduct: product, variation: v };
    });
  });

  const filteredListings = listings.filter(({ card }) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedListings = [...filteredListings].sort((a, b) => {
    const an = a.card.name;
    const bn = b.card.name;
    if (an.startsWith('Tirzepatide') && !bn.startsWith('Tirzepatide')) return -1;
    if (bn.startsWith('Tirzepatide') && !an.startsWith('Tirzepatide')) return 1;
    if (a.card.featured && !b.card.featured) return -1;
    if (!a.card.featured && b.card.featured) return 1;
    switch (sortBy) {
      case 'name':  return an.localeCompare(bn);
      case 'price': return a.card.base_price - b.card.base_price;
      case 'purity':return b.card.purity_percentage - a.card.purity_percentage;
      default:      return 0;
    }
  });

  const getCartQuantity = (productId: string, variationId?: string) =>
    cartItems
      .filter(item =>
        item.product.id === productId &&
        (variationId ? item.variation?.id === variationId : !item.variation)
      )
      .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, variation, quantity) => addToCart(product, variation, quantity)}
        />
      )}

      <div className="min-h-screen" style={{ background: '#ffffff' }}>

        {/* ── Hero ── */}
        <Hero onShopAll={() => productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />

        {/* ── Feature cards + Mission + Glow-up CTA ── */}
        <HomeSections
          onJoinCommunity={() => productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          onLearnMore={() => productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />

        {/* ── Products Section ── */}
        <section
          className="py-10 sm:py-14 md:py-24"
          ref={productsRef}
          style={{ background: '#ffffff' }}
        >
          <div className="container mx-auto px-3 sm:px-5 md:px-8">

            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-12">
              <div>
                <p className="section-label mb-2">Catalog</p>
                <div className="divider mb-4" style={{ margin: '0 0 1rem 0' }} />
                <h2
                  className="font-heading font-light"
                  style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.75rem)', color: '#0A1A2E' }}
                >
                  Our Peptide Collection
                </h2>
              </div>

              {/* Search + Sort */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:max-w-[400px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#D29797' }} />
                  <input
                    type="text"
                    placeholder="Search peptides..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input-field pl-10 h-11 text-sm"
                  />
                </div>
                <div
                  className="flex items-center gap-2 bg-white px-4 h-11 min-w-[156px] rounded-xl"
                  style={{ border: '1px solid rgba(10,26,46,0.09)' }}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#D29797' }} />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as 'name' | 'price' | 'purity')}
                    className="flex-1 bg-transparent text-sm font-sans font-medium focus:outline-none"
                    style={{ color: '#142442' }}
                  >
                    <option value="name">Sort: Name</option>
                    <option value="price">Sort: Price</option>
                    <option value="purity">Sort: Purity</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mb-7 flex items-center gap-2 flex-wrap">
              <span className="font-sans text-xs font-medium uppercase tracking-wider" style={{ color: '#D29797' }}>
                {sortedListings.length} {sortedListings.length === 1 ? 'product' : 'products'}
              </span>
              {searchQuery && (
                <>
                  <span style={{ color: '#E5C0C0' }}>·</span>
                  <span className="font-sans text-xs" style={{ color: '#424242' }}>
                    Results for <strong style={{ color: '#0A1A2E' }}>"{searchQuery}"</strong>
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-sans text-xs font-medium hover:underline"
                    style={{ color: '#7C3AED' }}
                  >
                    Clear
                  </button>
                </>
              )}
            </div>

            {/* Grid */}
            {sortedListings.length === 0 ? (
              <div className="text-center py-24">
                <div className="bg-white rounded-2xl p-14 max-w-sm mx-auto"
                  style={{ border: '1px solid rgba(10,26,46,0.07)' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: '#142442' }}>
                    <Package className="w-8 h-8" style={{ color: '#DDD6FE' }} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2" style={{ color: '#0A1A2E' }}>No products found</h3>
                  <p className="font-sans text-sm mb-6" style={{ color: '#424242' }}>
                    {searchQuery ? `No results for "${searchQuery}".` : 'No products available right now.'}
                  </p>
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="btn-mint text-sm py-2.5 px-6">
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
                {sortedListings.map(({ card, sourceProduct, variation }) => (
                  <MenuItemCard
                    key={card.id}
                    product={card}
                    cartQuantity={getCartQuantity(sourceProduct.id, variation?.id)}
                    onProductClick={() => setSelectedProduct(sourceProduct)}
                    onAddToCart={(_p, _v, qty) => addToCart(sourceProduct, variation, qty)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA Banner — soft luxury gradient ── */}
        <section className="py-10 sm:py-14 md:py-24 relative overflow-hidden">
          {/* Gradient background — gold gradient */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #142442 0%, #DDD6FE 35%, #E3F1FE 75%, #E3F1FE 100%)' }}
          />

          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, #DDD6FE, transparent 65%)', opacity: 0.5, filter: 'blur(40px)' }} />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, #C7E2FB, transparent 65%)', opacity: 0.45, filter: 'blur(40px)' }} />

          <div className="relative z-10 container mx-auto px-3 sm:px-5 md:px-8 text-center max-w-2xl">
            <p className="section-label mb-3 sm:mb-4">Get Started</p>
            <div className="divider mb-4 sm:mb-6" />
            <h2
              className="font-sans font-extrabold tracking-tight mb-3 sm:mb-5"
              style={{ fontSize: 'clamp(1.3rem, 4vw, 3rem)', color: '#0A1A2E' }}
            >
              Browse the{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #4FC9CE 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>full collection.</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm leading-relaxed mb-5 sm:mb-7 md:mb-9" style={{ color: '#475A85' }}>
              Quality you can trust, supported by an empowering community — every step of your wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
              <button
                onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="btn-mint px-5 py-3 sm:px-7 sm:py-3.5 md:px-9 md:py-4 text-xs sm:text-sm"
              >
                Shop All Products
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <a href="/protocols" className="btn-outline px-5 py-3 sm:px-7 sm:py-3.5 md:px-9 md:py-4 text-xs sm:text-sm">
                View Protocols
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Menu;
