import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  GripVertical, 
  CheckCircle2, 
  Settings2, 
  Save, 
  ChevronRight,
  HelpCircle,
  Clock,
  Shuffle,
  Target,
  AlertCircle,
  X,
  Edit3,
  Eye,
  Link,
  RotateCcw,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Assessment, Question, Answer, QuestionType, AssessmentAttempt } from "../types";
import { AssessmentPlayer } from "./AssessmentPlayer";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../lib/utils";

interface AssessmentBuilderProps {
  initialData?: Assessment;
  onSave: (data: Assessment) => Promise<void>;
  onCancel: () => void;
  onAttemptComplete?: (attempt: AssessmentAttempt) => void;
  userRole?: string;
  currentUser?: any;
}

export const AssessmentBuilder: React.FC<AssessmentBuilderProps> = ({ 
  initialData, 
  onSave, 
  onCancel,
  onAttemptComplete,
  userRole = "Admin",
  currentUser
}) => {
  const [assessment, setAssessment] = useState<Assessment>(initialData || {
    id: uuidv4(),
    tenant_id: "default-tenant",
    title: "New Assessment",
    description: "",
    passing_score: 80,
    settings: {
      timeLimit: 30,
      shuffleQuestions: false,
      shuffleAnswers: false,
      maxAttempts: 1,
      scoringType: "binary"
    },
    questions: []
  });

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    assessment.questions[0]?.id || null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const activeQuestion = assessment.questions.find(q => q.id === activeQuestionId);

  // --- Handlers ---

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: uuidv4(),
      assessment_id: assessment.id,
      type,
      content: "New Question",
      points: 1,
      order_index: assessment.questions.length,
      answers: type === "open_ended" ? [] : [
        { id: uuidv4(), question_id: "", content: "Option 1", is_correct: true },
        { id: uuidv4(), question_id: "", content: "Option 2", is_correct: false }
      ]
    };
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setActiveQuestionId(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === id) {
          const updatedQ = { ...q, ...updates };
          
          // If partial credit mode is active on this question, 
          // sync total points with the sum of correct answer points
          if (updatedQ.scoring_type === "partial" && updatedQ.type === "multiple_choice") {
            const sumOfCorrectPoints = updatedQ.answers.reduce((sum, a) => 
              a.is_correct ? sum + (a.points || 0) : sum, 
            0);
            if (sumOfCorrectPoints > 0) {
              updatedQ.points = sumOfCorrectPoints;
            }
          }
          
          return updatedQ;
        }
        return q;
      })
    }));
  };

  const deleteQuestion = (id: string) => {
    setAssessment(prev => {
      const newQuestions = prev.questions.filter(q => q.id !== id);
      if (activeQuestionId === id) {
        setActiveQuestionId(newQuestions[0]?.id || null);
      }
      return { ...prev, questions: newQuestions };
    });
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= assessment.questions.length) return;

    const newQuestions = [...assessment.questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[newIndex];
    newQuestions[newIndex] = temp;

    setAssessment(prev => ({
      ...prev,
      questions: newQuestions.map((q, i) => ({ ...q, order_index: i }))
    }));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinalSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Basic validation
      if (assessment.questions.length === 0) throw new Error("Add at least one question.");
      
      for (const q of assessment.questions) {
        if (q.type !== "open_ended" && !q.answers.some(a => a.is_correct)) {
          throw new Error(`Question "${q.content}" requires at least one correct answer.`);
        }
      }

      await onSave(assessment);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaUpload = async (qId: string, aId?: string) => {
    try {
      // Simulate file picker
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        // Call backend API
        const response = await fetch("/api/media/upload", { method: "POST" });
        const data = await response.json();
        
        if (aId) {
          // Update Answer
          updateQuestion(qId, {
            answers: activeQuestion?.answers.map(a => a.id === aId ? { ...a, media_url: data.url } : a)
          });
        } else {
          // Update Question
          updateQuestion(qId, { media_url: data.url });
        }
      };
      input.click();
    } catch (err) {
      setError("Failed to upload media. Please try again.");
    }
  };

  const updateSettings = (updates: Partial<typeof assessment.settings>) => {
    setAssessment(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white overflow-hidden rounded-3xl border border-gray-100 shadow-xl">
      {/* --- Left Pane: Question Navigation --- */}
      <div className="w-1/4 min-w-[300px] border-r border-gray-50 flex flex-col bg-gray-50/50">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Questions</h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-widest">
            {assessment.questions.length} total
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {assessment.questions.map((q, idx) => (
            <motion.div
              layout
              key={q.id}
              onClick={() => setActiveQuestionId(q.id)}
              className={cn(
                "group flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border",
                activeQuestionId === q.id
                  ? "bg-white border-guesty-nature shadow-md ring-1 ring-guesty-nature/20"
                  : "bg-transparent border-transparent hover:bg-white hover:border-gray-200"
              )}
            >
              <div className="flex-shrink-0 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); moveQuestion(idx, 'up'); }}
                  disabled={idx === 0}
                  className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                >
                  <GripVertical className="w-3 h-3 rotate-180" />
                </button>
              </div>

              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
                activeQuestionId === q.id ? "bg-guesty-nature text-white" : "bg-gray-200 text-gray-500"
              )}>
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {q.content || "Untitled Question"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 bg-gray-100 px-1.5 rounded">
                    {q.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-guesty-nature">
                    {q.points} pt
                  </span>
                </div>
              </div>

              {activeQuestionId === q.id && (
                <ChevronRight className="w-4 h-4 text-guesty-nature" />
              )}
            </motion.div>
          ))}

          {assessment.questions.length === 0 && (
            <div className="text-center py-12 text-gray-400 italic text-sm">
              No questions yet. Add one below.
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-2">
          <button 
            onClick={() => addQuestion("single_choice")}
            className="flex items-center justify-center gap-2 p-3 bg-guesty-ice/50 hover:bg-guesty-ice rounded-xl transition-all border border-transparent hover:border-guesty-nature/20 group"
          >
            <Plus className="w-4 h-4 text-guesty-nature group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-guesty-nature">Single</span>
          </button>
          <button 
            onClick={() => addQuestion("multiple_choice")}
            className="flex items-center justify-center gap-2 p-3 bg-guesty-ice/50 hover:bg-guesty-ice rounded-xl transition-all border border-transparent hover:border-guesty-nature/20 group"
          >
            <Plus className="w-4 h-4 text-guesty-nature group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-guesty-nature">Multi</span>
          </button>
          <button 
            onClick={() => addQuestion("open_ended")}
            className="col-span-2 flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all border border-transparent hover:border-gray-300 group"
          >
            <Plus className="w-4 h-4 text-gray-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-600">Open Ended / Text</span>
          </button>
        </div>
      </div>

      {/* --- Right Pane: Question Editor --- */}
      <div className="flex-1 flex flex-col bg-white min-h-0">
        <AnimatePresence mode="wait">
          {activeQuestion ? (
            <motion.div
              key={activeQuestion.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Question Editor</h2>
                  <p className="text-sm text-gray-500 font-medium">Fine-tune your question content and scoring.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => deleteQuestion(activeQuestion.id)}
                    className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    title="Delete Question"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                {/* Question Stem */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Question Stem</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <Target className="w-3.5 h-3.5 text-guesty-nature" />
                        <label className="text-[10px] font-black text-gray-500 uppercase">Points:</label>
                        <input 
                          type="number"
                          value={activeQuestion.points}
                          onChange={(e) => updateQuestion(activeQuestion.id, { points: parseInt(e.target.value) || 0 })}
                          className="w-12 bg-transparent text-xs font-black text-guesty-nature focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      value={activeQuestion.content}
                      onChange={(e) => updateQuestion(activeQuestion.id, { content: e.target.value })}
                      placeholder="Type your question here..."
                      className="w-full min-h-[140px] p-6 text-lg font-bold text-gray-800 placeholder:text-gray-300 bg-gray-50/50 border border-gray-100 rounded-[32px] focus:bg-white focus:border-guesty-nature focus:ring-4 focus:ring-guesty-nature/10 transition-all outline-none resize-none"
                    />

                    <div className="flex items-center gap-4">
                      {activeQuestion.media_url ? (
                        <div className="relative w-40 h-32 rounded-2xl overflow-hidden group shadow-lg">
                          <img src={activeQuestion.media_url} className="w-full h-full object-cover" alt="Question" />
                          <button 
                            onClick={() => updateQuestion(activeQuestion.id, { media_url: undefined })}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleMediaUpload(activeQuestion.id)}
                          className="flex flex-col items-center justify-center w-full max-w-[200px] aspect-video border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 hover:text-guesty-nature hover:border-guesty-nature/50 hover:bg-guesty-ice/20 transition-all group"
                        >
                          <ImageIcon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Add Image</span>
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                {/* Answers / Options */}
                {activeQuestion.type !== "open_ended" && (
                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Answer Options</h4>
                        {activeQuestion.type === "multiple_choice" && (
                          <div className="flex items-center gap-2 bg-guesty-ice/20 px-3 py-1 rounded-full border border-guesty-nature/10">
                            <span className="text-[10px] font-black text-guesty-nature uppercase">Partial Credit:</span>
                            <button 
                              onClick={() => updateQuestion(activeQuestion.id, { 
                                scoring_type: activeQuestion.scoring_type === "partial" ? "binary" : "partial" 
                              })}
                              className={cn(
                                "w-8 h-4 rounded-full relative transition-all duration-300",
                                activeQuestion.scoring_type === "partial" ? "bg-guesty-nature" : "bg-gray-200"
                              )}
                            >
                              <div className={cn(
                                "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm",
                                activeQuestion.scoring_type === "partial" ? "left-4.5" : "left-0.5"
                              )} />
                            </button>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => updateQuestion(activeQuestion.id, {
                          answers: [...activeQuestion.answers, { id: uuidv4(), question_id: activeQuestion.id, content: `Option ${activeQuestion.answers.length + 1}`, is_correct: false }]
                        })}
                        className="text-xs font-black text-guesty-nature flex items-center gap-2 hover:bg-guesty-ice px-3 py-1.5 rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Option
                      </button>
                    </div>

                    <div className="space-y-4">
                      {activeQuestion.answers.map((answer, aIdx) => (
                        <div 
                          key={answer.id}
                          className={cn(
                            "group p-6 rounded-3xl border transition-all flex flex-col gap-4",
                            answer.is_correct 
                              ? "bg-guesty-ice/30 border-guesty-nature/30 ring-1 ring-guesty-nature/10" 
                              : "bg-gray-50/30 border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <button 
                              onClick={() => {
                                let newAnswers;
                                if (activeQuestion.type === "single_choice") {
                                  newAnswers = activeQuestion.answers.map(a => ({ ...a, is_correct: a.id === answer.id }));
                                } else {
                                  newAnswers = activeQuestion.answers.map(a => a.id === answer.id ? { ...a, is_correct: !a.is_correct } : a);
                                }
                                updateQuestion(activeQuestion.id, { answers: newAnswers });
                              }}
                              className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all",
                                answer.is_correct 
                                  ? "bg-guesty-nature border-guesty-nature text-white shadow-lg shadow-guesty-nature/30" 
                                  : "bg-white border-gray-200 text-transparent hover:border-guesty-nature/50"
                              )}
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>

                            <div className="flex-1 space-y-3">
                              <input
                                value={answer.content}
                                onChange={(e) => updateQuestion(activeQuestion.id, {
                                  answers: activeQuestion.answers.map(a => a.id === answer.id ? { ...a, content: e.target.value } : a)
                                })}
                                className="w-full bg-transparent text-sm font-bold text-gray-800 placeholder:text-gray-300 focus:outline-none"
                              />
                              
                              <div className="grid grid-cols-2 gap-4">
                                {activeQuestion.scoring_type === "partial" && answer.is_correct && (
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-black text-guesty-nature uppercase tracking-widest">Points for this Opt</label>
                                    <input
                                      type="number"
                                      value={answer.points || 0}
                                      onChange={(e) => updateQuestion(activeQuestion.id, {
                                        answers: activeQuestion.answers.map(a => a.id === answer.id ? { ...a, points: parseInt(e.target.value) || 0 } : a)
                                      })}
                                      className="w-full bg-white border border-guesty-nature/20 p-2 rounded-xl text-xs font-bold focus:outline-none focus:border-guesty-nature transition-all"
                                    />
                                  </div>
                                )}
                                <div className={cn("space-y-1", (activeQuestion.scoring_type !== "partial" || !answer.is_correct) && "col-span-2")}>
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Feedback (Optional)</label>
                                  <input
                                    value={answer.feedback || ""}
                                    onChange={(e) => updateQuestion(activeQuestion.id, {
                                      answers: activeQuestion.answers.map(a => a.id === answer.id ? { ...a, feedback: e.target.value } : a)
                                    })}
                                    placeholder="Explanation for this choice..."
                                    className="w-full bg-white/50 border border-gray-100 p-2 rounded-xl text-xs focus:outline-none focus:border-guesty-nature transition-all"
                                  />
                                </div>
                                <div className="flex items-end justify-end gap-2">
                                  {answer.media_url ? (
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-1 ring-gray-100 group/img shadow-sm">
                                      <img src={answer.media_url} className="w-full h-full object-cover" />
                                      <button 
                                        onClick={() => updateQuestion(activeQuestion.id, {
                                          answers: activeQuestion.answers.map(a => a.id === answer.id ? { ...a, media_url: undefined } : a)
                                        })}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                      >
                                        <X className="w-3 h-3 text-white" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => handleMediaUpload(activeQuestion.id, answer.id)}
                                      className="p-2 text-gray-400 hover:text-guesty-nature bg-white border border-gray-100 rounded-xl transition-all"
                                      title="Add Option Image"
                                    >
                                      <ImageIcon className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => updateQuestion(activeQuestion.id, {
                                      answers: activeQuestion.answers.filter(a => a.id !== answer.id)
                                    })}
                                    className="p-2 text-gray-300 hover:text-red-500 bg-white border border-gray-100 rounded-xl transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {activeQuestion.type === "open_ended" && (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-dashed border-gray-200 rounded-[32px] text-center">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-sm border border-gray-100 text-gray-400">
                      <Edit3 className="w-8 h-8" />
                    </div>
                    <h5 className="text-lg font-black text-gray-900 tracking-tight">Manual Grading Enabled</h5>
                    <p className="text-sm text-gray-500 mt-2 max-w-sm">
                      Open-ended questions require administrators to manually review and assign points after the user submits the assessment.
                    </p>
                  </div>
                )}

                {/* Automated Feedback Section */}
                <section className="space-y-6 pt-6 border-t border-gray-50">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Automated Feedback</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-guesty-nature uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Correct Feedback
                      </label>
                      <textarea
                        value={activeQuestion.correct_feedback || ""}
                        onChange={(e) => updateQuestion(activeQuestion.id, { correct_feedback: e.target.value })}
                        placeholder="Message for correct answers..."
                        rows={2}
                        className="w-full p-4 bg-guesty-ice/20 border border-guesty-nature/10 rounded-2xl text-xs font-bold focus:outline-none focus:border-guesty-nature transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" /> Incorrect Feedback
                      </label>
                      <textarea
                        value={activeQuestion.incorrect_feedback || ""}
                        onChange={(e) => updateQuestion(activeQuestion.id, { incorrect_feedback: e.target.value })}
                        placeholder="Message for incorrect answers..."
                        rows={2}
                        className="w-full p-4 bg-red-50/50 border border-red-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-400 transition-all resize-none"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-24 h-24 bg-guesty-ice/30 rounded-[32px] flex items-center justify-center border border-guesty-nature/10 text-guesty-nature">
                <HelpCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Select a Question</h3>
              <p className="text-gray-500 max-w-xs">
                Pick a question from the sidebar to edit its content, media, and answer options.
              </p>
            </div>
          )}
        </AnimatePresence>

          {/* --- Bottom Settings Bar --- */}
          <div className="p-6 border-t border-gray-100 bg-white space-y-6">
            {/* Settings Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {/* Time Limit */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Time (min)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="number"
                    value={assessment.settings.timeLimit || ""}
                    onChange={(e) => updateSettings({ timeLimit: parseInt(e.target.value) || 0 })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:bg-white focus:border-guesty-nature transition-all outline-none"
                    placeholder="0 = Unlimited"
                  />
                </div>
              </div>
              {/* Passing Score */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Passing %</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="number"
                    value={assessment.passing_score}
                    onChange={(e) => setAssessment(prev => ({ ...prev, passing_score: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:bg-white focus:border-guesty-nature transition-all outline-none"
                  />
                </div>
              </div>
              {/* Max Attempts */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Attempts</label>
                <div className="relative">
                  <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="number"
                    value={assessment.settings.maxAttempts || ""}
                    onChange={(e) => updateSettings({ maxAttempts: parseInt(e.target.value) || 0 })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:bg-white focus:border-guesty-nature transition-all outline-none"
                    placeholder="0 = Unlimited"
                  />
                </div>
              </div>
              {/* Toggles */}
              <div className="flex items-center gap-3 pt-5">
                <button 
                  onClick={() => updateSettings({ shuffleQuestions: !assessment.settings.shuffleQuestions })}
                  title="Shuffle Questions"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest",
                    assessment.settings.shuffleQuestions ? "bg-guesty-ice border-guesty-nature text-guesty-nature" : "bg-gray-50 border-gray-100 text-gray-400"
                  )}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Q's
                </button>
                <button 
                  onClick={() => updateSettings({ shuffleAnswers: !assessment.settings.shuffleAnswers })}
                  title="Shuffle Answers"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest",
                    assessment.settings.shuffleAnswers ? "bg-guesty-ice border-guesty-nature text-guesty-nature" : "bg-gray-50 border-gray-100 text-gray-400"
                  )}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  A's
                </button>
              </div>
              {/* Answer Key URL */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Answer Key Link (Drive)</label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="text"
                    value={assessment.answer_key_url || ""}
                    onChange={(e) => setAssessment(prev => ({ ...prev, answer_key_url: e.target.value }))}
                    placeholder="Link for Instructors..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:bg-white focus:border-guesty-nature transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Scoring:</p>
                <div className="flex bg-gray-50 p-0.5 rounded-xl border border-gray-100">
                  <button 
                    onClick={() => updateSettings({ scoringType: "binary" })}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      assessment.settings.scoringType === "binary" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Binary
                  </button>
                  <button 
                    onClick={() => updateSettings({ scoringType: "partial" })}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      assessment.settings.scoringType === "partial" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Partial
                  </button>
                </div>
                {error && (
                  <p className="text-[10px] font-bold text-red-500 animate-pulse flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-6 py-2.5 text-xs font-black text-guesty-nature hover:bg-guesty-ice rounded-xl transition-all uppercase tracking-widest border border-transparent hover:border-guesty-nature/20 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <div className="h-6 w-px bg-gray-100" />
                <button 
                  onClick={onCancel}
                  className="text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest px-4 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFinalSave}
                  disabled={isSaving}
                  className="flex items-center gap-3 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black shadow-xl shadow-black/10 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="w-5 h-5 text-guesty-nature" />
                      <span>Save Assessment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
      </div>

      {/* Preview Player */}
      <AnimatePresence>
        {isPreviewOpen && (
          <AssessmentPlayer 
            assessment={assessment}
            userId={currentUser?.id || "preview-admin"}
            userName={currentUser?.name || "Admin Preview"}
            userGroupIds={currentUser?.groups || []}
            onClose={() => setIsPreviewOpen(false)}
            isPreview={true}
            userRole={userRole}
            onAttemptComplete={onAttemptComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper components missing from imports but used for styling
const HelpCircle_ = HelpCircle;
