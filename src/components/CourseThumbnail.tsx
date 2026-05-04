import React from 'react';
import { cn } from '../lib/utils';
import { Layout } from 'lucide-react';

interface CourseThumbnailProps {
  title: string;
  audience: string; // 'Internal' or 'External'
  status: string; // 'Published', 'Under Maintenance', 'Draft', etc.
  backgroundImage?: string;
  category?: string;
  className?: string;
}

export const CourseThumbnail: React.FC<CourseThumbnailProps> = ({ 
  title, 
  audience, 
  status,
  backgroundImage,
  category,
  className 
}) => {
  const isInternal = audience.toLowerCase().includes('internal');
  
  const presets: Record<string, { bg: string, accent: string, accentText: string }> = {
    'Soft Skills': { bg: '#5C1E3A', accent: '#FDE2E4', accentText: '#5C1E3A' },
    'Product Education': { bg: '#0D332D', accent: '#D5F0F1', accentText: '#0D332D' },
    'Onboarding': { bg: '#536DDE', accent: '#EEF2FF', accentText: '#1E2952' },
    'Guesty': { bg: '#3C4858', accent: '#EBEFF2', accentText: '#3C4858' },
    'ILT': { bg: '#E68A7B', accent: '#FDE2E4', accentText: '#5C1E3A' },
    'GLite': { bg: '#82B5B2', accent: '#DDF5F2', accentText: '#0D332D' },
  };

  const activePreset = category ? presets[category] : null;

  // Colors based on Guesty palette
  // Green for Internal, Blue for External
  const themeColors = activePreset 
    ? {
        main: activePreset.bg,
        accent: activePreset.accent,
        accentText: activePreset.accentText,
        text: 'text-white',
        overlay: activePreset.bg
      }
    : (isInternal 
    ? {
        main: '#0F2922',
        accent: '#136353', // guesty-nature hex approximation
        accentText: '#FFFFFF',
        text: 'text-white',
        overlay: '#0F2922'
      }
    : {
        main: '#0A1A2F',
        accent: '#00D1FF', // guesty-ocean hex approximation
        accentText: '#FFFFFF',
        text: 'text-white',
        overlay: '#0A1A2F'
      });

  return (
    <div 
      className={cn(
        "relative w-full aspect-video rounded-[16px] overflow-hidden flex flex-col justify-end p-6 group transition-colors duration-500",
        className
      )}
      style={{ backgroundColor: !backgroundImage ? themeColors.main : undefined }}
    >
      {/* Background Image Layer */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img 
            src={backgroundImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            referrerPolicy="no-referrer"
          />
          <div 
            className="absolute inset-0 opacity-60" 
            style={{ backgroundColor: themeColors.overlay }}
          />
        </div>
      )}

      {/* Decorative SVG Pattern (Only if no background image) */}
      {!backgroundImage && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Top Section: Status Label */}
      <div className="absolute top-4 left-4 z-10">
        <div 
          className="px-3 py-1 rounded-[6px] text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md border border-white/10"
          style={{ 
            backgroundColor: activePreset ? activePreset.accent + '33' : 'rgba(255,255,255,0.2)',
            color: activePreset ? activePreset.accent : 'white'
          }}
        >
          {status}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
          <Layout className="w-4 h-4 text-white/70" />
        </div>
      </div>

      {/* Content Section: Audience & Title */}
      <div className="z-10 relative">
        <div className="flex flex-wrap gap-2 mb-2">
          <div className={cn(
            "text-[10px] font-bold uppercase tracking-widest opacity-80 flex items-center",
            themeColors.text
          )}>
            {isInternal ? 'Internal' : 'External'}
          </div>
          {category && (
            <div className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm",
              themeColors.text
            )}>
              {category}
            </div>
          )}
        </div>
        <h3 className={cn(
          "text-xl font-extrabold leading-tight tracking-tight drop-shadow-md line-clamp-2",
          themeColors.text
        )}>
          {title}
        </h3>
      </div>

      {/* Bottom Accent */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1.5 z-20"
        style={{ backgroundColor: themeColors.accent }}
      />
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10" />
    </div>
  );
};
