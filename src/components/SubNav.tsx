import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
    selectedCategory: string;
    onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
    const { categories, loading } = useCategories();

    if (loading) {
        return (
            <div className="hidden md:block" style={{ background: 'rgba(10,26,46,0.95)', borderBottom: '1px solid rgba(139,92,246,0.18)' }}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex space-x-3 overflow-x-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="animate-pulse h-10 w-32 rounded-lg" style={{ background: '#142442' }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <nav
            className="backdrop-blur-xl sticky top-14 sm:top-16 md:top-[72px] z-40"
            style={{ background: 'rgba(10,26,46,0.95)', borderBottom: '1px solid rgba(139,92,246,0.18)' }}
        >
            <div className="container mx-auto px-3 sm:px-4">
                <div className="flex items-center space-x-1.5 sm:space-x-2 py-2 sm:py-3 md:py-4 overflow-x-auto scrollbar-hide">
                    {categories.map((category) => {
                        const isSelected = selectedCategory === category.id;

                        return (
                            <button
                                key={category.id}
                                onClick={() => onCategoryClick(category.id)}
                                className={`
                  flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg font-bold whitespace-nowrap
                  transition-all duration-300 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider
                  ${isSelected
                                        ? 'bg-brand-500 text-charcoal-900 shadow-pink'
                                        : 'bg-charcoal-800 text-brand-100 hover:text-brand-400 hover:bg-charcoal-700 border border-brand-900'
                                    }
                `}
                            >
                                <span>{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Hide scrollbar for better aesthetics */}
            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </nav>
    );
};

export default SubNav;
