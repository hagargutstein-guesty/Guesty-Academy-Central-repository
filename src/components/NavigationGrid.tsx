import React from 'react';
import { motion } from 'motion/react';
import { Compass, Award, Calendar } from 'lucide-react';

interface NavItem {
  id: string;
  title: string;
  targetTab: string;
  icon: React.ReactNode;
}

interface NavigationGridProps {
  onNavigate: (tabId: string) => void;
}

const navItems: NavItem[] = [
  {
    id: 'tour',
    title: 'Tour the platform',
    targetTab: 'catalog',
    icon: <Compass className="w-8 h-8" />
  },
  {
    id: 'pe',
    title: 'Monthly PE',
    targetTab: 'certifications',
    icon: <Award className="w-8 h-8" />
  },
  {
    id: 'sessions',
    title: 'Live sessions',
    targetTab: 'sessions',
    icon: <Calendar className="w-8 h-8" />
  }
];

export const NavigationGrid: React.FC<NavigationGridProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mb-12">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={() => onNavigate(item.targetTab)}
          className="relative h-64 rounded-[32px] overflow-hidden group border border-white/10 shadow-lg text-left"
        >
          {/* Theme-based Background - Using the "forest" color as base and "nature" for hover highlights */}
          <div className="absolute inset-0 bg-guesty-forest group-hover:bg-guesty-nature transition-colors duration-500" />
          
          {/* Subtle Radial Glow & Geometric Texture Overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/10 transition-colors duration-500" />
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          {/* Content Stack: Centered vertically and horizontally */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
            {/* Frosted Glass Icon Container */}
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 transform transition-all duration-500 group-hover:scale-110 shadow-xl group-hover:bg-white/20 group-hover:border-white/40">
              <div className="text-white drop-shadow-md">
                {item.icon}
              </div>
            </div>
            
            {/* Typography: Bold, white, uppercase Sans-serif text */}
            <h4 className="text-xl font-extrabold text-white uppercase tracking-tight transition-all duration-500 group-hover:scale-105">
              {item.title}
            </h4>
            
            {/* Link Indicator Area */}
            <div className="mt-8 flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Explore</span>
               <div className="h-px w-8 bg-white/50 group-hover:w-12 transition-all duration-500" />
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
