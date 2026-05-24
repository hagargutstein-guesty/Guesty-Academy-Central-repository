import React, { useState, useEffect, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XSquare, 
  AlertCircle, 
  Send,
  RotateCcw,
  Trophy,
  Target,
  ExternalLink,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Assessment, Question, Answer, QuestionType, AssessmentAttempt } from "../types";
import { calculateAssessmentScore, GradingResult } from "../lib/grading";
import { cn } from "../lib/utils";
import { v4 as uuidv4 } from "uuid";

interface AssessmentPlayerProps {
  assessment: Assessment;
  courseId?: string;
  userId: string;
  userName: string;
  userGroupIds: string[];
  onComplete?: (result: GradingResult) => void;
  onAttemptComplete?: (attempt: AssessmentAttempt) => void;
  onClose: () => void;
  isPreview?: boolean;
  userRole?: string;
}

export const AssessmentPlayer: React.FC<AssessmentPlayerProps> = ({ 
  assessment, 
  courseId,
  userId,
  userName,
  userGroupIds,
  onComplete, 
  onAttemptComplete,
  onClose,
  isPreview = false,
  userRole = "Learner"
}) => {
  const [startTime] = useState(new Date().toISOString());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(assessment.settings.timeLimit * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [lockedQuestions, setLockedQuestions] = useState<Record<string, boolean>>({});

  const isSurvey = assessment.subType === "Survey";

  // Shuffle questions if setting is enabled
  const shuffledQuestions = useMemo(() => {
    if (!assessment.settings.shuffleQuestions) return assessment.questions;
    return [...assessment.questions].sort(() => Math.random() - 0.5);
  }, [assessment]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const isQuestionLocked = currentQuestion ? lockedQuestions[currentQuestion.id] === true : false;
  const hasSelectedValue = currentQuestion
    ? (currentQuestion.type === "multiple_choice"
      ? (Array.isArray(responses[currentQuestion.id]) && (responses[currentQuestion.id] as string[]).length > 0)
      : !!responses[currentQuestion.id])
    : false;
  const isNavigable = currentQuestion
    ? (currentQuestion.type === "open_ended" || isQuestionLocked)
    : true;

  const getQuestionFeedback = (q: Question) => {
    if (!q || q.type === "open_ended") return null;

    const userResponse = responses[q.id];
    let isCorrect = false;
    let selectedAnswersFeedback: string[] = [];

    if (q.type === "single_choice" || q.type === "likert_scale") {
      const selectedId = userResponse as string;
      const answer = q.answers.find(a => a.id === selectedId);
      isCorrect = answer?.is_correct === true;
      if (answer?.feedback) {
        selectedAnswersFeedback.push(answer.feedback);
      }
    } else if (q.type === "multiple_choice") {
      const selectedIds = (userResponse as string[]) || [];
      const correctIds = q.answers.filter(a => a.is_correct).map(a => a.id);
      isCorrect = selectedIds.length === correctIds.length && selectedIds.every(id => correctIds.includes(id));
      
      selectedIds.forEach(id => {
        const answer = q.answers.find(a => a.id === id);
        if (answer?.feedback) {
          selectedAnswersFeedback.push(`${answer.content}: ${answer.feedback}`);
        }
      });
    }

    const mainFeedback = isCorrect 
      ? (q.correct_feedback || "Well done! Correct.") 
      : (q.incorrect_feedback || "Incorrect. Review the material.");

    return {
      isCorrect,
      mainFeedback,
      optionFeedback: selectedAnswersFeedback
    };
  };

  if (!currentQuestion && !isFinished) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 mb-4">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-black text-gray-900">No Questions Found</h3>
        <p className="text-gray-500 mt-2">Add some questions in the editor to preview this quiz.</p>
        <button onClick={onClose} className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest">
          Go Back
        </button>
      </div>
    );
  }

  // Shuffle answers if setting is enabled
  const shuffledAnswers = useMemo(() => {
    if (!currentQuestion || !assessment.settings.shuffleAnswers) return currentQuestion?.answers || [];
    return [...currentQuestion.answers].sort(() => Math.random() - 0.5);
  }, [currentQuestion, assessment]);

  // Timer logic
  useEffect(() => {
    if (assessment.settings.timeLimit <= 0 || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, assessment.settings.timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelect = (qId: string, aId: string) => {
    if (isFinished || lockedQuestions[qId]) return;

    if (currentQuestion.type === "single_choice") {
      setResponses(prev => ({ ...prev, [qId]: aId }));
    } else if (currentQuestion.type === "multiple_choice") {
      const current = (responses[qId] as string[]) || [];
      const updated = current.includes(aId) 
        ? current.filter(id => id !== aId)
        : [...current, aId];
      setResponses(prev => ({ ...prev, [qId]: updated }));
    }
  };

  const handleTextChange = (qId: string, text: string) => {
    if (isFinished || lockedQuestions[qId]) return;
    setResponses(prev => ({ ...prev, [qId]: text }));
  };

  const handleSubmit = () => {
    const result = calculateAssessmentScore(assessment, responses);
    setGradingResult(result);
    setIsFinished(true);
    onComplete?.(result);

    // Create and save attempt
    const attempt: AssessmentAttempt = {
      id: uuidv4(),
      assessment_id: assessment.id,
      course_id: courseId,
      user_id: assessment.settings.isAnonymous ? "anonymous" : userId,
      user_name: assessment.settings.isAnonymous ? "Anonymous" : userName,
      group_ids: assessment.settings.isAnonymous ? [] : userGroupIds,
      score: result.score,
      max_score: result.maxScore,
      percentage: result.percentage,
      passed: result.isPassed,
      started_at: startTime,
      completed_at: new Date().toISOString(),
      responses,
      status: 'Submitted'
    };
    
    onAttemptComplete?.(attempt);
  };

  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  if (isFinished && gradingResult) {
    if (isSurvey) {
      return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="w-24 h-24 mx-auto rounded-[32px] bg-[#FF9D00] flex items-center justify-center text-white shadow-2xl shadow-[#FF9D00]/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Thank you!</h2>
              <p className="text-gray-500 font-medium">Your feedback has been successfully recorded.</p>
            </div>

            <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center">
              <BarChart3 className="w-10 h-10 text-[#FF9D00]/20 mb-4" />
              <p className="text-sm font-bold text-gray-600">Your responses will help us improve our training programs for all learners.</p>
            </div>

            <div className="pt-8">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10"
              >
                {isPreview ? "Back to Editor" : "Return to Home"}
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full space-y-8 py-12"
        >
          <div className={cn(
            "w-24 h-24 mx-auto rounded-[32px] flex items-center justify-center shadow-2xl transition-all",
            gradingResult.isPassed ? "bg-guesty-nature text-white" : "bg-red-500 text-white"
          )}>
            {gradingResult.isPassed ? <Trophy className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
          </div>

          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              {gradingResult.isPassed ? "Assessment Passed!" : "Assessment Not Passed"}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Target: {assessment.passing_score}% • Attempted: {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Your Score</span>
              <p className={cn(
                "text-5xl font-black",
                gradingResult.isPassed ? "text-guesty-nature" : "text-red-500"
              )}>
                {Math.round(gradingResult.percentage)}%
              </p>
              <p className="text-xs font-bold text-gray-500 mt-2">
                {gradingResult.score} / {gradingResult.maxScore} pts
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center">
              <Target className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs font-black text-gray-900 uppercase">Status</span>
              <div className={cn(
                "mt-1 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                gradingResult.isPassed ? "bg-guesty-nature/10 text-guesty-nature" : "bg-red-100 text-red-600"
              )}>
                {gradingResult.isPassed ? "Success" : "Failed"}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Question Breakdown</h4>
            <div className="space-y-3">
              {shuffledQuestions.map((q, idx) => {
                const res = gradingResult.questionResults.find(r => r.questionId === q.id);
                return (
                  <div key={q.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black",
                        res?.status === "correct" ? "bg-guesty-nature/10 text-guesty-nature" : 
                        res?.status === "partial" ? "bg-yellow-100 text-yellow-700" : "bg-red-50 text-red-500"
                      )}>
                        {idx + 1}
                      </div>
                      <p className="text-sm font-bold text-gray-800 truncate max-w-sm">{q.content}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                          {res?.pointsEarned} / {res?.pointsPossible} Pts
                        </p>
                        <p className={cn(
                          "text-[9px] font-bold",
                          res?.status === "correct" ? "text-guesty-nature" : 
                          res?.status === "partial" ? "text-yellow-600" : "text-red-500"
                        )}>
                          {res?.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-8 flex items-center justify-center gap-4">
            {isPreview ? (
              <button 
                onClick={onClose}
                className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10"
              >
                Back to Editor
              </button>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setIsFinished(false);
                    setResponses({});
                    setCurrentQuestionIndex(0);
                    setGradingResult(null);
                    setTimeLeft(assessment.settings.timeLimit * 60);
                  }}
                  className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10"
                >
                  Return to Home
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Header */}
      <div className="h-20 border-b border-gray-100 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
            isSurvey ? "bg-[#FF9D00]/10 text-[#FF9D00] border-[#FF9D00]/10" : "bg-guesty-ice/30 text-guesty-nature border-guesty-nature/10"
          )}>
            {isSurvey ? <BarChart3 className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight">{assessment.title}</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {isSurvey ? "Survey" : "Quiz"} Section • Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {assessment.answer_key_url && (userRole === "Admin" || userRole === "Instructor") && (
            <a 
              href={assessment.answer_key_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-guesty-ice text-guesty-nature rounded-xl border border-guesty-nature/20 hover:bg-guesty-nature hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Answer Key (Instructor Only)
            </a>
          )}
          {assessment.settings.timeLimit > 0 && (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
              timeLeft < 60 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-gray-50 border-gray-100 text-gray-900"
            )}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-black mono">{formatTime(timeLeft)}</span>
            </div>
          )}
          <button 
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
          >
            <XSquare className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn("h-full", isSurvey ? "bg-[#FF9D00]" : "bg-guesty-nature")}
        />
      </div>

      {/* Question Stage */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto py-12 px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                    isSurvey ? "bg-[#FF9D00]/10 text-[#FF9D00]" : "bg-guesty-ice text-guesty-nature"
                  )}>
                    {currentQuestion.type.replace('_', ' ')}
                  </span>
                  {!isSurvey && (
                    <span className="text-[10px] font-bold text-gray-400">
                      {currentQuestion.points} Points Possible
                    </span>
                  )}
                  {isSurvey && (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Your response is anonymous
                    </span>
                  )}
                </div>
                
                <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                  {currentQuestion.content}
                </h2>

                {currentQuestion.media_url && (
                  <div className="rounded-[40px] overflow-hidden shadow-2xl border border-gray-100">
                    <img src={currentQuestion.media_url} className="w-full h-auto object-cover" alt="Question" />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.type === "open_ended" ? (
                  <textarea 
                    value={(responses[currentQuestion.id] as string) || ""}
                    onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                    placeholder="Type your response here..."
                    className={cn(
                      "w-full min-h-[200px] p-8 text-lg font-bold text-gray-800 bg-gray-50 border border-gray-100 rounded-[32px] transition-all outline-none resize-none",
                      isSurvey ? "focus:border-[#FF9D00] focus:ring-[#FF9D00]/5" : "focus:bg-white focus:border-guesty-nature focus:ring-8 focus:ring-guesty-nature/5"
                    )}
                  />
                ) : currentQuestion.type === "likert_scale" ? (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {currentQuestion.answers.map((answer, idx) => {
                      const isSelected = responses[currentQuestion.id] === answer.id;
                      let btnStyle = "bg-white border-gray-100 hover:border-gray-200";
                      if (isQuestionLocked) {
                        if (isSelected) {
                          btnStyle = "bg-[#FF9D00]/15 border-[#FF9D00] shadow-sm";
                        } else {
                          btnStyle = "bg-white border-gray-50 opacity-40";
                        }
                      } else if (isSelected) {
                        btnStyle = "bg-[#FF9D00]/10 border-[#FF9D00] shadow-lg shadow-[#FF9D00]/10 scale-[1.02]";
                      }

                      return (
                        <button
                          key={answer.id}
                          onClick={() => handleSelect(currentQuestion.id, answer.id)}
                          disabled={isQuestionLocked}
                          className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-4 text-center group",
                            btnStyle
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all text-sm font-black",
                            isSelected 
                              ? "bg-[#FF9D00] border-[#FF9D00] text-white" 
                              : "bg-white border-gray-100 text-gray-300 group-hover:border-[#FF9D00]/30"
                          )}>
                            {idx + 1}
                          </div>
                          <span className={cn(
                            "text-xs font-bold leading-tight",
                            isSelected ? "text-gray-900" : "text-gray-500"
                          )}>
                            {answer.content}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  shuffledAnswers.map((answer) => {
                    const isSelected = Array.isArray(responses[currentQuestion.id]) 
                      ? (responses[currentQuestion.id] as string[]).includes(answer.id)
                      : responses[currentQuestion.id] === answer.id;

                    let optionStyle = "bg-white border-gray-100 hover:border-gray-200";
                    if (isQuestionLocked) {
                      if (answer.is_correct) {
                        optionStyle = "bg-green-50/50 border-green-500 scale-[1.01] shadow-sm";
                      } else if (isSelected) {
                        optionStyle = "bg-red-50/50 border-red-350";
                      } else {
                        optionStyle = "bg-white border-gray-50 opacity-40";
                      }
                    } else if (isSelected) {
                      optionStyle = isSurvey ? "bg-[#FF9D00]/5 border-[#FF9D00] shadow-lg shadow-[#FF9D00]/5" : "bg-guesty-ice/30 border-guesty-nature shadow-lg shadow-guesty-nature/10 scale-[1.02]";
                    }

                    return (
                      <button
                        key={answer.id}
                        onClick={() => handleSelect(currentQuestion.id, answer.id)}
                        disabled={isQuestionLocked}
                        className={cn(
                          "w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center gap-4 group",
                          optionStyle
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center border-2 shrink-0 transition-all",
                          isQuestionLocked 
                            ? (answer.is_correct ? "bg-green-500 border-green-500 text-white" : isSelected ? "bg-red-500 border-red-500 text-white" : "bg-gray-100 border-gray-200 text-transparent")
                            : (isSelected ? (isSurvey ? "bg-[#FF9D00] border-[#FF9D00] text-white" : "bg-guesty-nature border-guesty-nature text-white") : "bg-white border-gray-200 text-transparent group-hover:border-guesty-nature/30")
                        )}>
                          {isQuestionLocked && isSelected && !answer.is_correct ? (
                            <XSquare className="w-5 h-5 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-lg font-bold transition-colors",
                            isQuestionLocked
                              ? (answer.is_correct ? "text-green-950" : isSelected ? "text-red-950" : "text-gray-400")
                              : (isSelected ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900")
                          )}>
                            {answer.content}
                          </p>
                          {answer.media_url && (
                             <div className="mt-3 w-48 h-32 rounded-xl overflow-hidden border border-gray-200">
                               <img src={answer.media_url} className="w-full h-full object-cover" alt="Option" />
                             </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Lock in Answer Action and Feedback Box */}
              {currentQuestion.type !== "open_ended" && (
                <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                  {!isQuestionLocked ? (
                    <button
                      onClick={() => setLockedQuestions(prev => ({ ...prev, [currentQuestion.id]: true }))}
                      disabled={!hasSelectedValue}
                      className={cn(
                        "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2",
                        hasSelectedValue 
                          ? "bg-guesty-nature text-white hover:bg-opacity-90 cursor-pointer shadow-guesty-nature/10"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100"
                      )}
                    >
                      Lock in Answer to View Feedback
                    </button>
                  ) : (() => {
                    const fb = getQuestionFeedback(currentQuestion);
                    if (!fb) return null;
                    return (
                      <div className={cn(
                        "p-6 rounded-[24px] border transition-all animate-in fade-in slide-in-from-bottom-2 duration-300",
                        currentQuestion.type === "likert_scale"
                          ? "bg-guesty-ice/30 border-guesty-nature/20 text-guesty-black"
                          : fb.isCorrect 
                            ? "bg-green-50 border-green-200 text-green-900" 
                            : "bg-red-50 border-red-200 text-red-900"
                      )}>
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                            currentQuestion.type === "likert_scale"
                              ? "bg-guesty-nature/10 text-guesty-nature"
                              : fb.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                          )}>
                            {currentQuestion.type === "likert_scale" ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : fb.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <XSquare className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-sm uppercase tracking-wider">
                              {currentQuestion.type === "likert_scale" ? "Response Saved" : (fb.isCorrect ? "Correct!" : "Incorrect")}
                            </p>
                            <p className="text-sm font-medium text-gray-700 mt-1.5 leading-relaxed">
                              {fb.mainFeedback}
                            </p>
                            {fb.optionFeedback.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-150 space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Feedbacks</p>
                                {fb.optionFeedback.map((ofb, idx) => (
                                  <p key={idx} className="text-xs font-semibold text-gray-600">
                                    • {ofb}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="h-24 border-t border-gray-100 px-8 flex items-center justify-between bg-white">
        <button 
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-6 py-3 text-sm font-black text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="flex items-center gap-4">
          {(() => {
            const isQuestionLocked = lockedQuestions[currentQuestion.id] === true;
            const isNavigable = currentQuestion.type === "open_ended" || isQuestionLocked;

            if (currentQuestionIndex < shuffledQuestions.length - 1) {
              return (
                <button 
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={!isNavigable}
                  className={cn(
                    "flex items-center gap-2 px-10 py-4 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl",
                    !isNavigable 
                      ? "bg-gray-100 text-gray-400 border border-gray-100 cursor-not-allowed shadow-none"
                      : isSurvey ? "bg-[#FF9D00] shadow-[#FF9D00]/10 hover:opacity-90" : "bg-gray-900 hover:bg-black shadow-black/10"
                  )}
                >
                  Next Question
                  <ChevronRight className="w-5 h-5" />
                </button>
              );
            } else {
              return (
                <button 
                  onClick={handleSubmit}
                  disabled={!isNavigable}
                  className={cn(
                    "flex items-center gap-3 px-12 py-4 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl",
                    !isNavigable
                      ? "bg-gray-100 text-gray-400 border border-gray-100 cursor-not-allowed shadow-none"
                      : isSurvey ? "bg-[#FF9D00] shadow-[#FF9D00]/20 hover:opacity-90" : "bg-guesty-nature hover:bg-black shadow-guesty-nature/20"
                  )}
                >
                  <Send className="w-5 h-5" />
                  {isSurvey ? "Submit Feedback" : "Finish Assessment"}
                </button>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
};
