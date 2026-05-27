import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';

const WHATSAPP_INVITE = 'https://chat.whatsapp.com/FH8XjImM775ICwLgC7lAEW';

const CommunityBanner: React.FC = () => {
  return (
    <a
      href={WHATSAPP_INVITE}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full transition-all hover:brightness-110"
      style={{
        background: 'linear-gradient(90deg, #7C3AED 0%, #8B5CF6 45%, #4FC9CE 100%)',
      }}
    >
      <div className="container mx-auto px-3 sm:px-5 md:px-8 py-2 flex items-center justify-center gap-2 sm:gap-3 text-white">
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span className="font-sans text-xs sm:text-sm font-medium text-center">
          <span className="font-semibold">Join our PepTalk community</span>
          <span className="hidden sm:inline"> — connect, ask questions & get the latest drops</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
      </div>
    </a>
  );
};

export default CommunityBanner;
