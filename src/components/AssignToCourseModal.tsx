import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Check, Layers, Plus } from 'lucide-react';
import { FileItem } from '../types';

interface AssignToCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: FileItem | null;
  courses: any[];
  onAssign: (courseId: string, position: 'start' | 'end' | 'after', relativeToId?: string) => void;
}

const AssignToCourseModal: React.FC<AssignToCourseModalProps> = ({
  isOpen,
  onClose,
  asset,
  courses,
  onAssign
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [position, setPosition] = useState<'start' | 'end' | 'after'>('end');
  const [relativeToId, setRelativeToId] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const handleAssign = () => {
    if (!selectedCourseId) return;
    onAssign(selectedCourseId, position, relativeToId);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setSelectedCourseId('');
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
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-guesty-beige"
      >
        {/* Header */}
        <div className="p-8 border-b border-guesty-beige flex items-center justify-between bg-guesty-ice/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-guesty-nature rounded-[16px] flex items-center justify-center text-white shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-guesty-black tracking-tight">Assign to Course</h2>
              <p className="text-xs text-guesty-forest/50 font-medium">{asset?.title || asset?.name}</p>
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
                <p className="text-sm text-guesty-forest/60 mt-1">The material has been added to the course.</p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Course Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em] ml-1">Select Course</label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {courses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`flex items-center justify-between p-4 rounded-[16px] border transition-all text-left ${
                        selectedCourseId === course.id 
                          ? "bg-guesty-lemon/20 border-guesty-nature ring-1 ring-guesty-nature" 
                          : "bg-guesty-ice/10 border-guesty-beige hover:border-guesty-nature/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${selectedCourseId === course.id ? "bg-guesty-nature text-white" : "bg-guesty-beige text-guesty-forest/40"}`}>
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-guesty-black">{course.title}</p>
                          <p className="text-[10px] text-guesty-forest/50 font-medium">{course.modules?.length || 0} items • {course.audience}</p>
                        </div>
                      </div>
                      {selectedCourseId === course.id && <Check className="w-5 h-5 text-guesty-nature" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Placement Options */}
              <AnimatePresence>
                {selectedCourseId && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="h-px bg-guesty-beige/50" />
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em] ml-1">Placement Position</label>
                      <div className="flex gap-2">
                        {[
                          { id: 'start', label: 'Beginning' },
                          { id: 'end', label: 'End' },
                          { id: 'after', label: 'After Item...' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setPosition(opt.id as any)}
                            className={`flex-1 py-2.5 rounded-[12px] text-xs font-bold border transition-all ${
                              position === opt.id 
                                ? "bg-guesty-nature text-white border-guesty-nature shadow-sm" 
                                : "bg-white border-guesty-beige text-guesty-forest/60 hover:border-guesty-nature/50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {position === 'after' && selectedCourse && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em] ml-1">Select Relative Item</label>
                        <select
                          value={relativeToId}
                          onChange={(e) => setRelativeToId(e.target.value)}
                          className="w-full bg-guesty-ice/30 border border-guesty-beige rounded-[12px] px-4 py-3 text-sm outline-none focus:border-guesty-nature font-medium"
                        >
                          <option value="">Select an item...</option>
                          {selectedCourse.modules?.map((m: any) => (
                            <option key={m.id} value={m.id}>{m.title}</option>
                          ))}
                        </select>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

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
                  disabled={!selectedCourseId || (position === 'after' && !relativeToId)}
                  className="flex-[2] py-4 bg-guesty-nature text-white rounded-[16px] font-bold text-sm hover:bg-guesty-forest shadow-lg shadow-guesty-nature/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Assign to Course
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AssignToCourseModal;
