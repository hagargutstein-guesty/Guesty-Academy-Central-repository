import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Check, Layers, Plus, Search, Info } from 'lucide-react';
import { FileItem } from '../types';

interface BulkAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: FileItem[];
  courses: any[];
  onAssign: (courseIds: string[], position: 'start' | 'end' | 'after', relativeToId?: string) => void;
}

const BulkAssignModal: React.FC<BulkAssignModalProps> = ({
  isOpen,
  onClose,
  selectedAssets,
  courses,
  onAssign
}) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState<'start' | 'end' | 'after'>('end');
  const [relativeToId, setRelativeToId] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.audience.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  // For "after" position, we only allow it if exactly ONE course is selected 
  // because relativeToId is course-specific. 
  // If multiple courses are selected, we'll force 'start' or 'end'.
  const canUseAfter = selectedCourseIds.length === 1;
  const activeCourse = selectedCourseIds.length === 1 ? courses.find(c => c.id === selectedCourseIds[0]) : null;

  const handleToggleCourse = (id: string) => {
    setSelectedCourseIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    if (selectedCourseIds.length === 0) return;
    onAssign(selectedCourseIds, position, relativeToId);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setSelectedCourseIds([]);
      setPosition('end');
      setRelativeToId('');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-guesty-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden border border-guesty-beige"
      >
        {/* Header */}
        <div className="p-8 border-b border-guesty-beige flex items-center justify-between bg-guesty-ice/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-guesty-nature rounded-[16px] flex items-center justify-center text-white shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-guesty-black tracking-tight">Bulk Assign to Courses</h2>
              <p className="text-xs text-guesty-forest/50 font-medium">Assigning {selectedAssets.length} assets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-guesty-ice rounded-full transition-colors text-guesty-forest/40 hover:text-guesty-forest">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-guesty-nature rounded-full flex items-center justify-center text-white shadow-lg shadow-guesty-nature/20">
                <Check className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-guesty-black">Successfully Assigned!</h3>
                <p className="text-sm text-guesty-forest/60 mt-1">All selected materials have been added to the courses.</p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-8">
                {/* Left: Course Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em] ml-1">Select Courses</label>
                    <span className="text-[10px] font-bold text-guesty-nature bg-guesty-lemon/20 px-2 py-0.5 rounded-full">
                      {selectedCourseIds.length} Selected
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/30 group-focus-within:text-guesty-nature transition-colors" />
                    <input 
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-guesty-ice/30 border border-guesty-beige/50 rounded-xl text-sm outline-none focus:bg-white focus:border-guesty-nature transition-all"
                    />
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {filteredCourses.map(course => (
                      <button
                        key={course.id}
                        onClick={() => handleToggleCourse(course.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-[16px] border transition-all text-left ${
                          selectedCourseIds.includes(course.id) 
                            ? "bg-guesty-lemon/20 border-guesty-nature ring-1 ring-guesty-nature" 
                            : "bg-guesty-ice/10 border-guesty-beige hover:border-guesty-nature/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${selectedCourseIds.includes(course.id) ? "bg-guesty-nature text-white" : "bg-guesty-beige text-guesty-forest/40"}`}>
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="truncate max-w-[160px]">
                            <p className="text-sm font-bold text-guesty-black truncate">{course.title}</p>
                            <p className="text-[10px] text-guesty-forest/50 font-medium">{course.audience}</p>
                          </div>
                        </div>
                        {selectedCourseIds.includes(course.id) && <Check className="w-4 h-4 text-guesty-nature" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Placement Options */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em] ml-1">Placement Position</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'start', label: 'Beginning of Course' },
                        { id: 'end', label: 'End of Course' },
                        { id: 'after', label: 'After Specific Item...', disabled: !canUseAfter }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          disabled={opt.disabled}
                          onClick={() => setPosition(opt.id as any)}
                          className={`flex items-center justify-between px-4 py-3 rounded-[16px] text-sm font-bold border transition-all ${
                            position === opt.id 
                              ? "bg-guesty-nature text-white border-guesty-nature shadow-sm" 
                              : "bg-white border-guesty-beige text-guesty-forest/60 hover:border-guesty-nature/50 disabled:opacity-30 disabled:hover:border-guesty-beige"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {position === opt.id && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                    {!canUseAfter && selectedCourseIds.length > 1 && (
                      <div className="flex items-start gap-2 p-3 bg-guesty-ice/50 rounded-xl border border-guesty-beige/30">
                        <Info className="w-4 h-4 text-guesty-ocean flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-guesty-forest/60 leading-relaxed">
                          "After Specific Item" is only available when a single course is selected.
                        </p>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {position === 'after' && activeCourse && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="space-y-2"
                      >
                        <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em] ml-1">Select Relative Item</label>
                        <select
                          value={relativeToId}
                          onChange={(e) => setRelativeToId(e.target.value)}
                          className="w-full bg-guesty-ice/30 border border-guesty-beige rounded-[16px] px-4 py-3 text-sm outline-none focus:border-guesty-nature font-medium"
                        >
                          <option value="">Select an item...</option>
                          {activeCourse.modules?.map((m: any) => (
                            <option key={m.id} value={m.id}>{m.title}</option>
                          ))}
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-[16px] font-bold text-sm text-guesty-forest hover:bg-guesty-ice/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={selectedCourseIds.length === 0 || (position === 'after' && !relativeToId)}
                  className="flex-[2] py-4 bg-guesty-nature text-white rounded-[16px] font-bold text-sm hover:bg-guesty-forest shadow-lg shadow-guesty-nature/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Assign {selectedAssets.length} Assets
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BulkAssignModal;
