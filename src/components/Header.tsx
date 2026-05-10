import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, ArrowRight } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks: { label: string; href?: string; isButton?: boolean; active?: boolean }[] = [
    { label: 'Products',    isButton: true, active: true },
    { label: 'Track Order', href: '/track-order' },
    { label: 'FAQ',         href: '/faq' },
    { label: 'COA',         href: '/coa' },
    { label: 'Protocols',   href: '/protocols' },
    { label: 'Calculator',  href: '/calculator' },
  ];

  const headerBg = 'rgba(10,26,46,0.95)';
  const headerBorder = scrolled ? '1px solid rgba(79,201,206,0.20)' : '1px solid rgba(255,255,255,0.06)';

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-md transition-all duration-300"
        style={{
          background: headerBg,
          borderBottom: headerBorder,
          boxShadow: scrolled ? '0 4px 20px rgba(10,26,46,0.30)' : 'none',
        }}
      >
        <div className="container mx-auto px-3 sm:px-5 md:px-8 h-14 sm:h-16 md:h-[72px] flex items-center justify-between gap-2 sm:gap-3 md:gap-4">

          <button
            onClick={() => { onMenuClick(); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            <img src="/ddp-logo-original.png" alt="Daily Dose Pep" className="h-8 sm:h-10 md:h-12 w-auto object-contain rounded-full" />
            <span className="hidden sm:inline font-sans font-bold text-white tracking-tight text-sm md:text-base">
              Daily Dose Pep
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ label, href, isButton, active }) => {
              const cls = `relative px-3.5 py-2 text-sm font-sans font-medium transition-colors`;
              const color = active ? '#A78BFA' : 'rgba(255,255,255,0.85)';
              const underline = active ? (
                <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #A78BFA, #4FC9CE)' }} />
              ) : null;
              return isButton ? (
                <button
                  key={label}
                  onClick={onMenuClick}
                  className={cls}
                  style={{ color }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#A78BFA'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = color; }}
                >
                  {label}
                  {underline}
                </button>
              ) : (
                <a
                  key={label}
                  href={href}
                  className={cls}
                  style={{ color }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#A78BFA'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = color; }}
                >
                  {label}
                  {underline}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              className="hidden sm:inline-flex p-2.5 rounded-full transition-all"
              style={{ color: 'rgba(255,255,255,0.85)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={onCartClick}
              className="relative p-2 sm:p-2.5 rounded-full transition-all"
              style={{ color: 'rgba(255,255,255,0.85)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-sans font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none"
                  style={{ background: '#8B5CF6', boxShadow: '0 2px 8px rgba(139,92,246,0.55)' }}
                >
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={onMenuClick}
              className="hidden md:inline-flex items-center gap-2 ml-2 rounded-full px-5 py-2.5 font-sans text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)',
                boxShadow: '0 8px 22px rgba(139,92,246,0.45)',
              }}
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 sm:p-2.5 rounded-full transition-colors"
              style={{ color: 'rgba(255,255,255,0.90)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(10,26,46,0.60)' }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-[300px] flex flex-col"
            style={{
              background: '#0A1A2E',
              boxShadow: '-8px 0 48px rgba(10,26,46,0.50)',
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}
            >
              <div className="flex items-center gap-2">
                <img src="/ddp-logo-original.png" alt="Daily Dose Pep" className="h-10 w-10 rounded-full" />
                <span className="font-sans font-bold text-white text-sm">Daily Dose Pep</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full transition-colors text-white/80 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navLinks.map(({ label, href, isButton }) =>
                isButton ? (
                  <button
                    key={label}
                    onClick={() => { onMenuClick(); setMobileMenuOpen(false); }}
                    className="w-full px-4 py-3.5 rounded-xl text-left font-sans font-medium text-white/90 hover:bg-white/10 transition-colors"
                  >
                    {label}
                  </button>
                ) : (
                  <a
                    key={label}
                    href={href}
                    className="block w-full px-4 py-3.5 rounded-xl font-sans font-medium text-white/90 hover:bg-white/10 transition-colors"
                  >
                    {label}
                  </a>
                )
              )}
            </nav>

            <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
              <button
                onClick={() => { onMenuClick(); setMobileMenuOpen(false); }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-sans font-semibold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)',
                  boxShadow: '0 8px 22px rgba(139,92,246,0.45)',
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
