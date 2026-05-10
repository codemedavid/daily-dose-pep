import React from 'react';
import { FlaskConical, Truck, HelpCircle, FileText, BookOpen, Leaf, Facebook, Phone, ShieldCheck, Award, Lock, Heart, MessageSquare } from 'lucide-react';

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Third-Party Tested' },
  { icon: Award,       label: 'Premium Grade' },
  { icon: Lock,        label: 'Secure Checkout' },
  { icon: Truck,       label: 'Fast & Discreet Shipping' },
  { icon: Heart,       label: 'Supportive Community' },
];

const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#0A1A2E' }}>

      {/* Trust badge row */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container mx-auto px-5 md:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.30)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#A78BFA' }} />
                </div>
                <span className="font-sans text-xs font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cyan→purple gradient accent edge */}
      <div
        className="h-0.5 w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #4FC9CE 25%, #8B5CF6 75%, transparent)' }}
      />

      <div className="container mx-auto px-5 md:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <img
              src="/ddp-logo.png"
              alt="Daily Dose Pep"
              className="h-20 w-20 object-contain mb-5 rounded-full"
              style={{ boxShadow: '0 4px 24px rgba(79,201,206,0.35)' }}
            />
            <p className="font-sans text-base font-bold leading-relaxed mb-2" style={{ color: '#FFFFFF' }}>
              Daily Dose Pep
            </p>
            <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              A smarter approach to wellness — built around consistency, guidance, and community support.
            </p>
            <div className="flex items-center gap-2 text-xs font-sans mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <Leaf className="w-3.5 h-3.5" style={{ color: '#4FC9CE' }} />
              Educational content on peptide-based wellness
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://www.facebook.com/share/14hsbXd8st3/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-sans text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#DDD6FE'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'; }}
              >
                <Facebook className="w-4 h-4" style={{ color: '#4FC9CE' }} />
                Facebook Page
              </a>
              <a
                href="tel:09998207315"
                className="flex items-center gap-2 font-sans text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#DDD6FE'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'; }}
              >
                <Phone className="w-4 h-4" style={{ color: '#4FC9CE' }} />
                09998207315
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-sans font-semibold text-sm mb-5 tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Products
            </h4>
            <ul className="space-y-3">
              {['Weight Management', 'Performance Peptides', 'Recovery & Repair', 'Anti-Aging', 'Cognitive Support'].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-sans text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#DDD6FE'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'; }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-sans font-semibold text-sm mb-5 tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { icon: BookOpen,    label: 'Protocols',      href: '/protocols' },
                { icon: FileText,    label: 'COA Documents',  href: '/coa' },
                { icon: HelpCircle,  label: 'FAQ',            href: '/faq' },
                { icon: Truck,       label: 'Track Order',    href: '/track-order' },
                { icon: MessageSquare,label: 'Customer Reviews', href: '/reviews' },
                { icon: FlaskConical,label: 'Product Catalog',href: '/' },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-2 font-sans text-sm transition-colors group"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#DDD6FE'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'; }}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
            © {new Date().getFullYear()} Daily Dose Pep. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map(item => (
              <a
                key={item}
                href="#"
                className="font-sans text-xs transition-colors"
                style={{ color: 'rgba(255,255,255,0.28)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.28)'; }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
