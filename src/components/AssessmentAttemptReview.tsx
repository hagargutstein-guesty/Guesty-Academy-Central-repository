import React, { useState } from "react";
import { 
  X, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Clock,
  User,
  ArrowLeft,
  ChevronLeft,
  Save,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { Assessment, AssessmentAttempt, Question } from "../types";
import { cn } from "../lib/utils";

interface AssessmentAttemptReviewProps {
  attempt: AssessmentAttempt;
  assessment: Assessment;
  onClose: () => void;
  onUpdateScore: (updatedAttempt: AssessmentAttempt) => void;
}

export const AssessmentAttemptReview: React.FC<AssessmentAttemptReviewProps> = ({
  attempt,
  assessment,
  onClose,
  onUpdateScore
}) => {
  const [editedAttempt, setEditedAttempt] = useState<AssessmentAttempt>({...attempt});
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const handleScoreChange = (questionId: string, score: number) => {
    // Basic score update logic
    // We'll update the 'score' field of the attempt
    // In a real app, we might store per-question scores in responses or a separate field
    setEditedAttempt(prev => {
      // This is a simplification. Usually we'd track points per question.
      // Since our schema is simple, we might need a more robust way to handle manual scoring.
      // Let's assume we recalculate total based on individual question overrides.
      return { ...prev }; 
    });
  };

  // Improved calculation logic for manual grading
  const [manualScores, setManualScores] = useState<Record<string, number>>(() => {
    // Initialize with current derived scores if possible
    // For now, we'll track them manually in this component
    const initial: Record<string, number> = {};
    assessment.questions.forEach(q => {
      // Find if user got it right in current automated score
      // This is hard to derive exactly without a per-question score in the db
      // We'll just start with 0 or max depending on correctness if it was automated
    });
    return initial;
  });

  const handleFinalSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      // Calculate final weighted score
      const totalScore = Object.values(manualScores).reduce((a, b) => a + b, 0);
      const percentage = Math.round((totalScore / attempt.max_score) * 100);
      
      onUpdateScore({
        ...editedAttempt,
        score: totalScore,
        percentage,
        passed: percentage >= assessment.passing_score
      });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="absolute inset-0 z-[110] bg-white flex flex-col"
    >
      {/* Sub-Header */}
      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="h-10 w-px bg-gray-100" />
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Review Attempt</h3>
            <p className="text-[10px] font-black text-guesty-nature uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" />
              {attempt.user_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Grade</p>
            <p className={cn(
              "text-2xl font-black",
              attempt.passed ? "text-guesty-nature" : "text-red-500"
            )}>
              {attempt.percentage}%
            </p>
          </div>
          <button 
            onClick={handleFinalSave}
            disabled={isSaving}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black shadow-xl shadow-black/10 transition-all disabled:opacity-50"
          >
            {isSaving ? "Saving..." : (
              <>
                <Save className="w-5 h-5 text-guesty-nature" />
                <span>Confirm Scores</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Review Area */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-gray-50/30">
        <div className="max-w-4xl mx-auto space-y-12 pb-24">
          {assessment.questions.map((question, index) => {
            const userResponse = attempt.responses[question.id];
            const isCorrect = question.type === "open_ended" ? null : 
              (Array.isArray(userResponse) 
                ? question.answers.filter(a => a.is_correct).every(a => userResponse.includes(a.id)) && userResponse.length === question.answers.filter(a => a.is_correct).length
                : question.answers.find(a => a.id === userResponse)?.is_correct
              );

            return (
              <div key={question.id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full transition-colors bg-gray-100" 
                  style={{ backgroundColor: isCorrect === true ? "#00A699" : isCorrect === false ? "#FF5A5F" : "#717171" }}
                />
                
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 font-black text-gray-400 text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900 leading-tight mb-2">{question.content}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{question.type?.replace('_', ' ')} • {question.points} Points Available</p>
                    </div>
                  </div>
                  
                  {isCorrect !== null && (
                    <div className={cn(
                      "px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                      isCorrect ? "bg-guesty-nature/10 text-guesty-nature" : "bg-red-50 text-red-500"
                    )}>
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {isCorrect ? "Correct" : "Incorrect"}
                    </div>
                  )}
                </div>

                {/* Response Display */}
                <div className="space-y-4 mb-8">
                  {question.type === "open_ended" ? (
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Learner Response:</label>
                      <p className="text-sm font-medium text-gray-900 leading-relaxed italic">
                        "{typeof userResponse === 'string' ? (userResponse || 'No response provided.') : (userResponse as any)?.text || 'No response provided.'}"
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {question.answers.map(answer => {
                        const isSelected = Array.isArray(userResponse) ? userResponse.includes(answer.id) : userResponse === answer.id;
                        return (
                          <div 
                            key={answer.id}
                            className={cn(
                              "p-4 rounded-2xl border flex items-center justify-between transition-all",
                              isSelected 
                                ? (answer.is_correct ? "bg-guesty-nature/5 border-guesty-nature" : "bg-red-50 border-red-200")
                                : (answer.is_correct ? "bg-guesty-nature/[0.02] border-dashed border-guesty-nature/30" : "bg-white border-gray-100 opacity-60")
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {isSelected ? (
                                answer.is_correct ? <CheckCircle2 className="w-4 h-4 text-guesty-nature" /> : <XCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-200" />
                              )}
                              <span className={cn("text-sm font-bold", isSelected ? "text-gray-900" : "text-gray-400")}>
                                {answer.content}
                              </span>
                            </div>
                            {answer.is_correct && <span className="text-[10px] font-black text-guesty-nature/40 uppercase tracking-widest">Correct Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Grading Action */}
                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex-1 max-w-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instructor Feedback</span>
                    </div>
                    <textarea 
                      placeholder="Add comments for the learner..."
                      value={feedback[question.id] || ""}
                      onChange={(e) => setFeedback(prev => ({ ...prev, [question.id]: e.target.value }))}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:bg-white focus:border-guesty-nature transition-all outline-none min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="pl-12 flex flex-col items-end">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Score Adjustment</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number"
                        defaultValue={isCorrect ? question.points : 0}
                        max={question.points}
                        min="0"
                        step="0.5"
                        onChange={(e) => setManualScores(prev => ({ ...prev, [question.id]: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-3 py-3 bg-white border border-gray-200 rounded-xl font-black text-center text-sm focus:border-guesty-nature outline-none"
                      />
                      <span className="text-sm font-bold text-gray-400">/ {question.points} pts</span>
                    </div>
                    {question.type === "open_ended" && !manualScores[question.id] && (
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg">
                           <AlertCircle className="w-3 h-3" />
                           Awaiting Score
                        </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-guesty-nature/5 p-4 flex items-center justify-center gap-4">
          <p className="text-[10px] font-black text-guesty-nature uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Check all responses and confirm the final scores to update the learner's record.
          </p>
      </div>
    </motion.div>
  );
};
