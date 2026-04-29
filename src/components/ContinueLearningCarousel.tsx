import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Course } from '../types';
import { cn } from '../lib/utils';

interface ContinueLearningCarouselProps {
  courses: Course[];
  onCourseClick: (courseId: string) => void;
  themeAccent: string;
}

export const ContinueLearningCarousel: React.FC<ContinueLearningCarouselProps> = ({
  courses,
  onCourseClick,
  themeAccent
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (courses.length === 0) return null;

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-guesty-black flex items-center gap-2">
          <PlayCircle className={cn("w-6 h-6", themeAccent)} />
          Continue Learning
        </h4>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white border border-guesty-beige text-guesty-forest/40 hover:text-guesty-black transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white border border-guesty-beige text-guesty-forest/40 hover:text-guesty-black transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -4 }}
            className="flex-shrink-0 w-72 bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden group cursor-pointer snap-start"
            onClick={() => onCourseClick(course.id)}
          >
            <div className="h-40 relative overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <PlayCircle className={cn("w-7 h-7", themeAccent)} />
                 </div>
              </div>
            </div>
            
            <div className="p-6 pb-8">
              <h5 className="text-base font-bold text-guesty-black line-clamp-2 mb-2 group-hover:text-guesty-nature transition-colors">
                {course.title}
              </h5>
              <p className="text-[10px] font-black uppercase tracking-widest text-guesty-forest/40">
                {course.category} • {course.duration}
              </p>
            </div>

            {/* Progress Bar at the very bottom */}
            <div className="h-1.5 w-full bg-guesty-beige/30">
              <div 
                className={cn("h-full transition-all duration-1000", themeAccent.replace('text-', 'bg-'))}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
