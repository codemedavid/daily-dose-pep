import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Users, FlaskConical } from 'lucide-react';

interface HeroProps {
  onShopAll: () => void;
}

const TRUST_ITEMS = [
  { icon: ShieldCheck,  label: 'Premium-grade sourcing' },
  { icon: Users,        label: 'Community supported' },
  { icon: FlaskConical, label: 'Structured wellness tools' },
];

const Hero: React.FC<HeroProps> = ({ onShopAll }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Deep navy gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(79,201,206,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.18) 0%, transparent 55%), linear-gradient(180deg, #0A1A2E 0%, #0F2347 60%, #142442 100%)',
        }}
      />

      {/* Decorative molecule pattern */}
      <svg
        className="absolute right-0 top-10 hidden lg:block opacity-30 pointer-events-none"
        width="520" height="420" viewBox="0 0 520 420" fill="none"
      >
        <g stroke="#4FC9CE" strokeWidth="1.2" fill="none">
          <circle cx="120" cy="80" r="4" fill="#4FC9CE" />
          <circle cx="260" cy="40" r="3" fill="#4FC9CE" />
          <circle cx="400" cy="120" r="5" fill="#4FC9CE" />
          <circle cx="340" cy="240" r="4" fill="#A78BFA" />
          <circle cx="180" cy="220" r="3" fill="#A78BFA" />
          <circle cx="80"  cy="320" r="4" fill="#4FC9CE" />
          <circle cx="440" cy="320" r="3" fill="#A78BFA" />
          <line x1="120" y1="80"  x2="260" y2="40"  />
          <line x1="260" y1="40"  x2="400" y2="120" />
          <line x1="400" y1="120" x2="340" y2="240" />
          <line x1="340" y1="240" x2="180" y2="220" />
          <line x1="180" y1="220" x2="120" y2="80"  />
          <line x1="180" y1="220" x2="80"  y2="320" />
          <line x1="340" y1="240" x2="440" y2="320" />
        </g>
      </svg>

      <div className="relative z-10 container mx-auto px-3 sm:px-5 md:px-8">
        <div className="grid grid-cols-2 items-center gap-3 sm:gap-6 md:gap-10 py-8 sm:py-14 md:py-24 lg:py-28 min-h-[320px] sm:min-h-[460px] md:min-h-[600px]">

          {/* Left: copy */}
          <div className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h1 className="font-sans font-extrabold tracking-tight text-white leading-[1.02] text-[1.4rem] xs:text-[1.6rem] sm:text-[2.4rem] md:text-[3.6rem] lg:text-[4.6rem]">
              Your glow up,
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #67E8F9 0%, #4FC9CE 50%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                simplified.
              </span>
            </h1>

            <p
              className="mt-2 sm:mt-4 md:mt-6 max-w-xl font-sans text-[0.7rem] sm:text-sm md:text-lg leading-snug sm:leading-6 md:leading-7"
              style={{ color: '#C2CCDF', transitionDelay: '120ms' }}
            >
              A smarter approach to wellness — built around consistency, guidance, and community support.
            </p>

            <div className="mt-3 sm:mt-6 md:mt-9 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={onShopAll}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-3 py-2 sm:px-5 sm:py-3 md:px-8 md:py-4 font-sans text-[0.65rem] sm:text-xs md:text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)',
                  boxShadow: '0 14px 34px rgba(139,92,246,0.45)',
                }}
              >
                Start Your Glow Up
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>

            <div className="mt-4 sm:mt-7 md:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-5 max-w-xl">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                  <div
                    className="flex-shrink-0 w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(139,92,246,0.18)',
                      border: '1px solid rgba(139,92,246,0.40)',
                    }}
                  >
                    <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" style={{ color: '#A78BFA' }} />
                  </div>
                  <span className="font-sans text-[0.6rem] sm:text-[0.7rem] md:text-xs leading-snug" style={{ color: '#C2CCDF' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: logo on glowing pedestal */}
          <div
            className={`relative flex items-center justify-center transition-all duration-1000 ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative">
              <div
                className="absolute inset-0 -m-6 sm:-m-8 md:-m-12 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(79,201,206,0.55) 0%, rgba(139,92,246,0.25) 50%, transparent 75%)',
                }}
              />
              <img
                src="/ddp-logo.png"
                alt="Daily Dose Pep"
                className="relative h-28 w-28 xs:h-32 xs:w-32 sm:h-48 sm:w-48 md:h-72 md:w-72 lg:h-[22rem] lg:w-[22rem] object-contain animate-float"
                style={{ filter: 'drop-shadow(0 20px 50px rgba(79,201,206,0.55))' }}
              />
              <div
                className="relative -mt-3 sm:-mt-4 md:-mt-6 mx-auto h-3 sm:h-5 md:h-8 w-24 sm:w-36 md:w-60 rounded-[50%]"
                style={{
                  background: 'radial-gradient(ellipse, rgba(79,201,206,0.55) 0%, rgba(79,201,206,0.20) 50%, transparent 80%)',
                  filter: 'blur(6px)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
