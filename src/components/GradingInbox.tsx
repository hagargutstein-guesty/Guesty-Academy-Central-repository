import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  ChevronRight, 
  Search, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Send,
  Target,
  FileText,
  User,
  LayoutDashboard,
  MoreVertical,
  History,
  X,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assessment, AssessmentAttempt, Question, QuestionGrade, FileItem } from '../types';
import { cn } from '../lib/utils';
import { useDropzone } from 'react-dropzone';

interface GradingInboxProps {
  assessments: FileItem[];
  attempts: AssessmentAttempt[];
  onUpdateAttempt: (attempt: AssessmentAttempt) => void;
  onReleaseGrades: (assessmentId: string) => void;
}

type DrillDownLevel = 'overview' | 'questions' | 'learners';

export const GradingInbox: React.FC<GradingInboxProps> = ({ 
  assessments, 
  attempts, 
  onUpdateAttempt,
  onReleaseGrades
}) => {
  const [level, setLevel] = useState<DrillDownLevel>('overview');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAutoSave, setShowAutoSave] = useState(false);

  // --- Data Preparation ---
  const activeAssessments = useMemo(() => {
    return assessments
      .filter(a => a.type === 'Assessment' && a.assessmentData)
      .map(a => {
        const assessmentAttempts = attempts.filter(att => att.assessment_id === a.id);
        const gradedCount = assessmentAttempts.filter(att => att.status === 'Graded').length;
        const totalSubmissions = assessmentAttempts.length;
        const pendingCount = totalSubmissions - gradedCount;
        
        return {
          ...a,
          totalSubmissions,
          gradedCount,
          pendingCount,
          progress: totalSubmissions > 0 ? (gradedCount / totalSubmissions) * 100 : 0
        };
      });
  }, [assessments, attempts]);

  const selectedAssessment = useMemo(() => 
    assessments.find(a => a.id === selectedAssessmentId)?.assessmentData,
  [assessments, selectedAssessmentId]);

  const questionsNeedingGrading = useMemo(() => {
    if (!selectedAssessment) return [];
    return selectedAssessment.questions.filter(q => q.type === 'open_ended');
  }, [selectedAssessment]);

  const learnersForQuestion = useMemo(() => {
    if (!selectedAssessmentId || !selectedQuestionId) return [];
    return attempts.filter(att => 
      att.assessment_id === selectedAssessmentId && 
      att.status !== 'In Progress'
    ).map(att => {
      const response = att.responses[selectedQuestionId];
      const isGraded = !!att.manual_grades?.[selectedQuestionId];
      return {
        ...att,
        response,
        isGraded
      };
    });
  }, [selectedAssessmentId, selectedQuestionId, attempts]);

  const currentAttempt = useMemo(() => 
    attempts.find(att => att.user_id === selectedLearnerId && att.assessment_id === selectedAssessmentId),
  [attempts, selectedLearnerId, selectedAssessmentId]);

  const activeQuestion = useMemo(() => 
    selectedAssessment?.questions.find(q => q.id === selectedQuestionId),
  [selectedAssessment, selectedQuestionId]);

  // --- Handlers ---
  const handleSelectAssessment = (id: string) => {
    setSelectedAssessmentId(id);
    setLevel('questions');
  };

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
    setLevel('learners');
    // Select first learner by default
    const firstLearner = learnersForQuestion.find(l => !l.isGraded) || learnersForQuestion[0];
    if (firstLearner) setSelectedLearnerId(firstLearner.user_id);
  };

  const handleSaveGrade = async (learnerId: string, grade: QuestionGrade) => {
    if (!currentAttempt || !selectedQuestionId) return;
    
    setIsSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedAttempt: AssessmentAttempt = {
      ...currentAttempt,
      manual_grades: {
        ...(currentAttempt.manual_grades || {}),
        [selectedQuestionId]: grade
      },
      // Check if all open-ended questions are graded
      status: selectedAssessment?.questions
        .filter(q => q.type === 'open_ended')
        .every(q => (q.id === selectedQuestionId ? true : !!currentAttempt.manual_grades?.[q.id]))
        ? 'Graded' : 'Submitted'
    };

    onUpdateAttempt(updatedAttempt);
    setIsSaving(false);
    setShowAutoSave(true);
    setTimeout(() => setShowAutoSave(false), 2000);
  };

  const handleNextLearner = () => {
    const currentIndex = learnersForQuestion.findIndex(l => l.user_id === selectedLearnerId);
    if (currentIndex < learnersForQuestion.length - 1) {
      setSelectedLearnerId(learnersForQuestion[currentIndex + 1].user_id);
    }
  };

  // --- Sub-Components ---

  const AssessmentOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Grading Inbox</h2>
          <p className="text-gray-500 font-medium">Manage evaluations for all active assessments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-guesty-ice rounded-xl border border-guesty-nature/10 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-guesty-nature" />
            <span className="text-xs font-black text-guesty-nature uppercase tracking-widest">
              {activeAssessments.reduce((sum, a) => sum + a.pendingCount, 0)} Pending Review
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeAssessments.map(assessment => (
          <motion.button 
            layoutId={assessment.id}
            key={assessment.id}
            onClick={() => handleSelectAssessment(assessment.id)}
            className="group w-full p-6 bg-white border border-gray-100 rounded-[32px] hover:border-guesty-nature/30 hover:shadow-xl hover:shadow-guesty-nature/5 transition-all text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-gray-400 group-hover:bg-guesty-ice/50 group-hover:text-guesty-nature transition-colors">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900 group-hover:text-guesty-nature transition-colors">{assessment.title}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                    <Users className="w-3.5 h-3.5" />
                    {assessment.totalSubmissions} Submissions
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-guesty-nature">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {assessment.gradedCount} Graded
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="w-48 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Progress</span>
                  <span className="text-guesty-nature">{Math.round(assessment.progress)}%</span>
                </div>
                <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${assessment.progress}%` }}
                    className="h-full bg-guesty-nature"
                  />
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:border-guesty-nature group-hover:text-guesty-nature transition-all">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const QuestionSelectionView = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => setLevel('overview')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedAssessment?.title}</h2>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Select question to grade</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {questionsNeedingGrading.map((question, idx) => {
          const learnersCount = attempts.filter(att => att.assessment_id === selectedAssessmentId).length;
          const gradedForThisQuestion = attempts.filter(att => 
            att.assessment_id === selectedAssessmentId && !!att.manual_grades?.[question.id]
          ).length;
          const progress = learnersCount > 0 ? (gradedForThisQuestion / learnersCount) * 100 : 0;

          return (
            <motion.button 
              key={question.id}
              onClick={() => handleSelectQuestion(question.id)}
              className="group p-8 bg-white border border-gray-100 rounded-[40px] hover:border-guesty-nature/30 hover:shadow-2xl hover:shadow-guesty-nature/5 transition-all text-left space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-guesty-ice text-[10px] font-black uppercase tracking-widest text-guesty-nature rounded-lg">
                      Question {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {question.points} Points Possible
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {question.content}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-guesty-ice group-hover:text-guesty-nature transition-all">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-guesty-ice flex items-center justify-center text-[10px] font-black text-guesty-nature">
                      +{learnersCount - 3}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    {learnersCount} learners submitted
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</p>
                    <p className="text-sm font-black text-guesty-nature">{gradedForThisQuestion} / {learnersCount} Graded</p>
                  </div>
                  <div className="w-16 h-16 relative">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="transparent" stroke="#f3f4f6" strokeWidth="4" />
                      <motion.circle 
                        cx="32" cy="32" r="28" fill="transparent" stroke="#00C16A" strokeWidth="4" 
                        strokeDasharray={2 * Math.PI * 28}
                        initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                        animate={{ strokeDashoffset: (2 * Math.PI * 28) * (1 - progress / 100) }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-guesty-nature">
                      {Math.round(progress)}%
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="p-8 bg-gray-900 rounded-[40px] text-white flex items-center justify-between shadow-xl shadow-black/10">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Release Grades</h3>
          <p className="text-white/60 text-sm">Make all graded results visible to learners for this assessment.</p>
        </div>
        <button 
          disabled={questionsNeedingGrading.some(q => {
             const learnersCount = attempts.filter(att => att.assessment_id === selectedAssessmentId).length;
             const gradedForThisQuestion = attempts.filter(att => att.assessment_id === selectedAssessmentId && !!att.manual_grades?.[q.id]).length;
             return gradedForThisQuestion < learnersCount;
          })}
          onClick={() => onReleaseGrades(selectedAssessmentId!)}
          className="px-8 py-4 bg-guesty-nature text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-guesty-nature transition-all disabled:opacity-50 disabled:hover:bg-guesty-nature disabled:hover:text-white"
        >
          Publish All Scores
        </button>
      </div>
    </div>
  );

  const GradingWorkspace = () => {
    const response = currentAttempt?.responses?.[selectedQuestionId!] as { text: string; files: string[] } | string;
    const responseText = typeof response === 'string' ? response : response?.text;
    const responseFiles = typeof response === 'object' ? response?.files : [];

    const [feedback, setFeedback] = useState(currentAttempt?.manual_grades?.[selectedQuestionId!]?.feedback || '');
    const [score, setScore] = useState(currentAttempt?.manual_grades?.[selectedQuestionId!]?.score || 0);
    const [feedbackImages, setFeedbackImages] = useState<string[]>(currentAttempt?.manual_grades?.[selectedQuestionId!]?.feedback_images || []);

    const onDrop = (acceptedFiles: File[]) => {
      // Mock upload
      const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
      setFeedbackImages(prev => [...prev, ...newImages]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
      onDrop,
      accept: { 'image/*': [] }
    });

    const isGraded = learnersForQuestion.find(l => l.user_id === selectedLearnerId)?.isGraded;

    return (
      <div className="h-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLevel('questions')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">{currentAttempt?.user_name}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Submitted {currentAttempt ? new Date(currentAttempt.completed_at).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {showAutoSave && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-[10px] font-black text-guesty-nature uppercase"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-guesty-nature animate-pulse" />
                All changes saved
              </motion.div>
            )}
            <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-100">
              <button 
                disabled={learnersForQuestion.findIndex(l => l.user_id === selectedLearnerId) === 0}
                onClick={() => {
                  const idx = learnersForQuestion.findIndex(l => l.user_id === selectedLearnerId);
                  setSelectedLearnerId(learnersForQuestion[idx - 1].user_id);
                }}
                className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="px-4 flex items-center text-xs font-black text-gray-500">
                {learnersForQuestion.findIndex(l => l.user_id === selectedLearnerId) + 1} / {learnersForQuestion.length}
              </div>
              <button 
                onClick={handleNextLearner}
                disabled={learnersForQuestion.findIndex(l => l.user_id === selectedLearnerId) === learnersForQuestion.length - 1}
                className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
          {/* Left: Learner Response */}
          <div className="flex flex-col gap-6 min-h-0 overflow-y-auto pr-4 custom-scrollbar">
            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Question Prompt</h4>
              <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 italic text-gray-600 leading-relaxed font-medium">
                "{activeQuestion?.content}"
              </div>
            </section>

            <section className="space-y-4 flex-1">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Learner Response</h4>
              <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm space-y-6">
                <p className="text-gray-900 leading-relaxed font-bold whitespace-pre-wrap">
                  {responseText || "No text provided."}
                </p>
                
                {responseFiles.length > 0 && (
                  <div className="pt-6 border-t border-gray-50 space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attached Files</p>
                    <div className="grid grid-cols-2 gap-3">
                      {responseFiles.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-guesty-nature shadow-sm">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[10px] font-bold text-gray-900 truncate">Work_Sample_{i+1}.pdf</p>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">2.4 MB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="p-6 bg-guesty-ice/20 border border-guesty-nature/10 rounded-[32px] flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-guesty-nature shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Grading Rubric</h4>
                <p className="text-xs font-bold text-gray-500">View criteria for consistent marking</p>
              </div>
              <button className="ml-auto text-xs font-black text-guesty-nature hover:underline">Open Rules</button>
            </section>
          </div>

          {/* Right: Grading Panel */}
          <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-guesty-nature uppercase tracking-[0.2em]">Feedback & Evaluation</h4>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                <Target className="w-4 h-4 text-guesty-nature font-black" />
                <input 
                  type="number"
                  max={activeQuestion?.points}
                  value={score}
                  onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                  className="w-12 bg-transparent text-sm font-black text-guesty-nature focus:outline-none text-right"
                />
                <span className="text-sm font-black text-gray-300">/ {activeQuestion?.points}</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-white border border-gray-100 rounded-[28px] shadow-sm flex flex-col overflow-hidden ring-2 ring-guesty-nature/5">
                {/* TOOLBAR */}
                <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><Bold className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><Italic className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><List className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><LinkIcon className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-gray-100 mx-2" />
                  <button {...getRootProps()} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400">
                    <input {...getInputProps()} />
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>

                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide detailed feedback here..."
                  className="flex-1 p-6 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none resize-none min-h-[150px]"
                />

                {feedbackImages.length > 0 && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-50 flex flex-wrap gap-3">
                    {feedbackImages.map((img, i) => (
                      <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setFeedbackImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-1 bg-white/90 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div {...getRootProps()} className={cn(
                  "px-6 py-4 border-t border-dashed border-gray-100 text-center transition-colors",
                  isDragActive ? "bg-guesty-ice/50" : "bg-white"
                )}>
                  <input {...getInputProps()} />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:text-guesty-nature transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Drag & Drop screenshots or diagrams
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleSaveGrade(selectedLearnerId!, {
                  score,
                  max_score: activeQuestion?.points || 100,
                  feedback,
                  feedback_images: feedbackImages
                })}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-black/10 disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 text-guesty-nature" />
                    Save & Next Learner
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-8 bg-guesty-cream/30 overflow-hidden">
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {level === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <AssessmentOverview />
            </motion.div>
          )}

          {level === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <QuestionSelectionView />
            </motion.div>
          )}

          {level === 'learners' && (
            <motion.div
              key="learners"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-full"
            >
              <GradingWorkspace />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
