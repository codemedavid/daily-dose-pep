import React from 'react';
import {
  GraduationCap, ListChecks, Users, FlaskConical,
  Gem, ShieldCheck, Heart, ArrowRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Educational Resources',
    desc: 'Learn the basics and stay informed with easy-to-understand guides.',
  },
  {
    icon: ListChecks,
    title: 'Beginner-Friendly Guidance',
    desc: 'Step-by-step support to help you build confidence in your wellness journey.',
  },
  {
    icon: Users,
    title: 'Community Support',
    desc: "You're not alone. Connect, share, and grow with our supportive community.",
  },
  {
    icon: FlaskConical,
    title: 'Wellness Tools',
    desc: 'Access helpful tools and calculators to keep you on track every day.',
  },
];

const MISSION_ITEMS = [
  {
    icon: Gem,
    title: 'Quality You Can Trust',
    desc: 'We share only premium-grade information and ensure it meets our high standards.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparency First',
    desc: 'Honest information and clear communication every step of the way.',
  },
  {
    icon: Users,
    title: 'Built For You',
    desc: 'Designed to support your lifestyle, goals, and wellness journey.',
  },
  {
    icon: Heart,
    title: 'Consistency Matters',
    desc: 'Small steps, done consistently, lead to extraordinary transformation.',
  },
];

interface HomeSectionsProps {
  onJoinCommunity?: () => void;
  onLearnMore?: () => void;
}

const HomeSections: React.FC<HomeSectionsProps> = ({ onJoinCommunity, onLearnMore }) => {
  return (
    <>
      {/* ── Floating Features card (overlaps hero/below) ── */}
      <section className="relative -mt-6 sm:-mt-10 md:-mt-20 z-20 px-3 sm:px-5 md:px-8">
        <div className="container mx-auto">
          <div
            className="rounded-2xl sm:rounded-3xl bg-white px-4 sm:px-6 md:px-10 py-5 sm:py-7 md:py-10"
            style={{
              boxShadow: '0 30px 80px rgba(10,26,46,0.18), 0 4px 16px rgba(10,26,46,0.06)',
              border: '1px solid rgba(10,26,46,0.06)',
            }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10 sm:divide-x divide-slate-100">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-2.5 sm:gap-3 md:gap-4 sm:px-3 md:px-4 first:sm:pl-0 last:sm:pr-0"
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(139,92,246,0.10)' }}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" style={{ color: '#7C3AED' }} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-[11px] sm:text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: '#0A1A2E' }}>
                      {title}
                    </h3>
                    <p className="font-sans text-[10px] sm:text-[11px] md:text-xs leading-relaxed" style={{ color: '#475A85' }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission section ── */}
      <section className="py-10 sm:py-14 md:py-28" style={{ background: '#F5F7FB' }}>
        <div className="container mx-auto px-3 sm:px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-start">
            <div>
              <p className="section-label mb-3">Our Mission</p>
              <h2
                className="font-sans font-extrabold tracking-tight mb-3 sm:mb-5 md:mb-6"
                style={{ fontSize: 'clamp(1.4rem, 4vw, 3rem)', color: '#0A1A2E', lineHeight: 1.1 }}
              >
                Empowering your{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #4FC9CE 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  best self.
                </span>
              </h2>
              <p className="font-sans text-xs sm:text-sm md:text-base leading-relaxed md:leading-7 mb-4 sm:mb-6 md:mb-8" style={{ color: '#475A85' }}>
                At Daily Dose Pep, we believe that wellness is a journey, not a destination. Our goal is to provide quality resources, trusted information, and a community that empowers you to become the best version of yourself.
              </p>
              <button onClick={onLearnMore} className="btn-pink py-3 px-7">
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {MISSION_ITEMS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    border: '1px solid rgba(10,26,46,0.06)',
                    boxShadow: '0 2px 12px rgba(10,26,46,0.05)',
                  }}
                >
                  <div
                    className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 sm:mb-3"
                    style={{ background: 'rgba(139,92,246,0.10)' }}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" style={{ color: '#7C3AED' }} />
                  </div>
                  <h3 className="font-sans font-semibold text-[11px] sm:text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: '#0A1A2E' }}>
                    {title}
                  </h3>
                  <p className="font-sans text-[10px] sm:text-[11px] md:text-xs leading-relaxed" style={{ color: '#475A85' }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Glow Up CTA banner ── */}
      <section className="py-8 sm:py-10 md:py-16 px-3 sm:px-5 md:px-8" style={{ background: '#F5F7FB' }}>
        <div className="container mx-auto">
          <div
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-12"
            style={{
              background:
                'radial-gradient(ellipse at 80% 50%, rgba(79,201,206,0.20) 0%, transparent 60%), linear-gradient(120deg, #0A1A2E 0%, #142442 60%, #1B2C4F 100%)',
            }}
          >
            <svg
              className="absolute right-6 top-6 hidden md:block opacity-50 pointer-events-none"
              width="180" height="180" viewBox="0 0 180 180"
            >
              <g stroke="#4FC9CE" strokeWidth="1.2" fill="none">
                <path d="M40 30 Q90 60 40 90 Q90 120 40 150" />
                <path d="M140 30 Q90 60 140 90 Q90 120 140 150" />
                <line x1="40" y1="50"  x2="140" y2="50"  stroke="#A78BFA" />
                <line x1="40" y1="80"  x2="140" y2="80"  stroke="#4FC9CE" />
                <line x1="40" y1="110" x2="140" y2="110" stroke="#A78BFA" />
                <line x1="40" y1="140" x2="140" y2="140" stroke="#4FC9CE" />
              </g>
            </svg>

            <div className="relative z-10 grid md:grid-cols-[1fr_1fr_auto] items-center gap-3 sm:gap-5 md:gap-10">
              <h3
                className="font-sans font-extrabold text-white"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2.2rem)', lineHeight: 1.15 }}
              >
                Ready to start<br className="hidden md:block" /> your glow up?
              </h3>
              <p className="font-sans text-xs sm:text-sm leading-5 sm:leading-6" style={{ color: '#C2CCDF' }}>
                Join our community and get access to exclusive updates, tools, and support to help you stay consistent.
              </p>
              <button
                onClick={onJoinCommunity}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-4 font-sans text-xs sm:text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)',
                  boxShadow: '0 14px 34px rgba(139,92,246,0.45)',
                }}
              >
                Join the PEP Community
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSections;
