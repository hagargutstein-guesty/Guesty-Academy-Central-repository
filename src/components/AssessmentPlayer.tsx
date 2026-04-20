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
  ExternalLink
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

  // Shuffle questions if setting is enabled
  const shuffledQuestions = useMemo(() => {
    if (!assessment.settings.shuffleQuestions) return assessment.questions;
    return [...assessment.questions].sort(() => Math.random() - 0.5);
  }, [assessment]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

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
    if (isFinished) return;

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
    if (isFinished) return;
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
      user_id: userId,
      user_name: userName,
      group_ids: userGroupIds,
      score: result.score,
      max_score: result.maxScore,
      percentage: result.percentage,
      passed: result.isPassed,
      started_at: startTime,
      completed_at: new Date().toISOString(),
      responses
    };
    
    onAttemptComplete?.(attempt);
  };

  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  if (isFinished && gradingResult) {
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
          <div className="w-10 h-10 bg-guesty-ice/30 rounded-xl flex items-center justify-center text-guesty-nature border border-guesty-nature/10">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight">{assessment.title}</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
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
          className="h-full bg-guesty-nature"
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
                  <span className="px-3 py-1 bg-guesty-ice text-guesty-nature rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {currentQuestion.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    {currentQuestion.points} Points Possible
                  </span>
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
                    className="w-full min-h-[200px] p-8 text-lg font-bold text-gray-800 bg-gray-50 border border-gray-100 rounded-[32px] focus:bg-white focus:border-guesty-nature focus:ring-8 focus:ring-guesty-nature/5 transition-all outline-none resize-none"
                  />
                ) : (
                  shuffledAnswers.map((answer) => {
                    const isSelected = Array.isArray(responses[currentQuestion.id]) 
                      ? (responses[currentQuestion.id] as string[]).includes(answer.id)
                      : responses[currentQuestion.id] === answer.id;

                    return (
                      <button
                        key={answer.id}
                        onClick={() => handleSelect(currentQuestion.id, answer.id)}
                        className={cn(
                          "w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center gap-4 group",
                          isSelected 
                            ? "bg-guesty-ice/30 border-guesty-nature shadow-lg shadow-guesty-nature/10 scale-[1.02]" 
                            : "bg-white border-gray-100 hover:border-gray-200"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center border-2 shrink-0 transition-all",
                          isSelected 
                            ? "bg-guesty-nature border-guesty-nature text-white" 
                            : "bg-white border-gray-200 text-transparent group-hover:border-guesty-nature/30"
                        )}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-lg font-bold transition-colors",
                            isSelected ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
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
          {currentQuestionIndex < shuffledQuestions.length - 1 ? (
            <button 
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10"
            >
              Next Question
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="flex items-center gap-3 px-12 py-4 bg-guesty-nature text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-guesty-nature/20"
            >
              <Send className="w-5 h-5" />
              Finish Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
