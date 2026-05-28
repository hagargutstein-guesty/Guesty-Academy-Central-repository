import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  ChevronRight, 
  Search, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle,
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
  RefreshCw,
  Calendar,
  Filter,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assessment, AssessmentAttempt, Question, QuestionGrade, FileItem, Course } from '../types';
import { cn } from '../lib/utils';

interface GradingInboxProps {
  assessments: FileItem[];
  attempts: AssessmentAttempt[];
  courses: Course[];
  onUpdateAttempt: (attempt: AssessmentAttempt) => void;
  onReleaseGrades: (assessmentId: string) => void;
  preSelectedAssessmentId?: string | null;
  onBackToOverview?: () => void;
}

type DrillDownLevel = 'overview' | 'workspace';
type WorkspaceViewType = 'by-question' | 'by-learner';

export const GradingInbox: React.FC<GradingInboxProps> = ({ 
  assessments, 
  attempts, 
  courses,
  onUpdateAttempt,
  onReleaseGrades,
  preSelectedAssessmentId = null,
  onBackToOverview
}) => {
  const [level, setLevel] = useState<DrillDownLevel>(preSelectedAssessmentId ? 'workspace' : 'overview');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(preSelectedAssessmentId);
  
  // Toggles inside workspace
  const [workspaceView, setWorkspaceView] = useState<WorkspaceViewType>('by-question');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [activeLearnerId, setActiveLearnerId] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(''); // Assessment/exam name search
  const [learnerSearchQuery, setLearnerSearchQuery] = useState(''); // Learner name search
  const [courseFilter, setCourseFilter] = useState<string>('All'); // Course filter
  const [startDateFilter, setStartDateFilter] = useState(''); // Start date range filter
  const [endDateFilter, setEndDateFilter] = useState(''); // End date range filter

  const [savingStatus, setSavingStatus] = useState<Record<string, 'idle' | 'saving' | 'saved'>>({});

  // Form states for active editing
  const [editedScores, setEditedScores] = useState<Record<string, number>>({});
  const [editedFeedbacks, setEditedFeedbacks] = useState<Record<string, string>>({});
  const [publishNotification, setPublishNotification] = useState<string | null>(null);

  // Helper: Find Associated Course for an Assessment
  const getAssociatedCourse = (assessmentId: string) => {
    return courses.find(c => c.modules?.some(m => m.id === assessmentId));
  };

  // Helper: Calculate points earned dynamically
  const getQuestionPointsEarned = (q: Question, attempt: AssessmentAttempt) => {
    if (q.type === 'open_ended') {
      return attempt.manual_grades?.[q.id]?.score ?? 0;
    }
    
    const userResponse = attempt.responses?.[q.id];
    if (userResponse === undefined) return 0;

    if (q.type === 'single_choice' || q.type === 'likert_scale') {
      const selectedId = userResponse as string;
      const correctAnswer = q.answers.find(a => a.is_correct);
      return selectedId === correctAnswer?.id ? q.points : 0;
    }

    if (q.type === 'multiple_choice') {
      const selectedIds = (userResponse as string[]) || [];
      const correctAnswers = q.answers.filter(a => a.is_correct);
      const correctAnswerIds = correctAnswers.map(a => a.id);
      
      const allCorrectSelected = correctAnswerIds.every(id => selectedIds.includes(id));
      const noIncorrectSelected = selectedIds.every(id => correctAnswerIds.includes(id));

      if (allCorrectSelected && noIncorrectSelected) {
        return q.points;
      }
      
      const isPartial = q.scoring_type === 'partial';
      if (isPartial) {
        const correctSelected = selectedIds.filter(id => correctAnswerIds.includes(id)).length;
        const incorrectSelected = selectedIds.length - correctSelected;
        const netCorrect = Math.max(0, correctSelected - incorrectSelected);
        return correctAnswerIds.length > 0 ? (netCorrect / correctAnswerIds.length) * q.points : 0;
      }
    }
    return 0;
  };

  // Filter and prepare Assessments
  const filteredAssessments = useMemo(() => {
    return assessments
      .filter(a => a.type === 'Assessment' && a.assessmentData)
      .map(a => {
        const assessmentId = a.id;
        const linkedCourse = getAssociatedCourse(assessmentId);
        
        // Filter submissions for stats and date range checks
        const assessmentAttempts = attempts.filter(att => {
          if (att.assessment_id !== assessmentId) return false;
          if (att.status === 'In Progress') return false;
          
          // Learner name filter
          if (learnerSearchQuery) {
            if (!att.user_name.toLowerCase().includes(learnerSearchQuery.toLowerCase())) {
              return false;
            }
          }

          // Date filters
          if (startDateFilter) {
            const date = new Date(att.completed_at || att.started_at);
            const start = new Date(startDateFilter);
            if (date < start) return false;
          }
          if (endDateFilter) {
            const date = new Date(att.completed_at || att.started_at);
            const end = new Date(endDateFilter);
            // End of selected day
            end.setHours(23, 59, 59, 999);
            if (date > end) return false;
          }

          return true;
        });

        const totalSubmissions = assessmentAttempts.length;
        const openEndedQuestions = a.assessmentData?.questions.filter(q => q.type === 'open_ended') || [];
        
        // Count graded
        const gradedCount = assessmentAttempts.filter(att => {
          return openEndedQuestions.every(q => att.manual_grades?.[q.id] !== undefined);
        }).length;

        const pendingCount = totalSubmissions - gradedCount;
        
        return {
          ...a,
          linkedCourse,
          totalSubmissions,
          gradedCount,
          pendingCount,
          progress: totalSubmissions > 0 ? (gradedCount / totalSubmissions) * 100 : 0,
          assessmentAttempts
        };
      })
      .filter(a => {
        // Filter by Assessment Search Query
        if (searchQuery && !a.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // Filter by Course
        if (courseFilter !== 'All') {
          if (a.linkedCourse?.id !== courseFilter) {
            return false;
          }
        }

        // Only show assessments that have submissions matching the user searches
        if (learnerSearchQuery || startDateFilter || endDateFilter) {
          return a.totalSubmissions > 0;
        }

        return true;
      });
  }, [assessments, attempts, courses, searchQuery, learnerSearchQuery, courseFilter, startDateFilter, endDateFilter]);

  const selectedAssessmentObj = useMemo(() => {
    return assessments.find(a => a.id === selectedAssessmentId);
  }, [assessments, selectedAssessmentId]);

  const selectedAssessment = useMemo(() => {
    return selectedAssessmentObj?.assessmentData;
  }, [selectedAssessmentObj]);

  const isSurvey = selectedAssessment?.subType === 'Survey';

  const selectedLinkedInCourse = useMemo(() => {
    return selectedAssessmentId ? getAssociatedCourse(selectedAssessmentId) : null;
  }, [selectedAssessmentId]);

  // Questions inside selected Assessment
  const assessmentQuestions = useMemo(() => {
    return selectedAssessment?.questions || [];
  }, [selectedAssessment]);

  // Learners with submissions inside selected assessment
  const assessmentSubmissions = useMemo(() => {
    if (!selectedAssessmentId) return [];
    return attempts.filter(att => 
      att.assessment_id === selectedAssessmentId && 
      att.status !== 'In Progress'
    ).map(att => {
      // Calculate total points earned & grade description
      const openEndedQuestions = selectedAssessment?.questions.filter(q => q.type === 'open_ended') || [];
      const gradedCount = openEndedQuestions.filter(q => att.manual_grades?.[q.id] !== undefined).length;
      const isGraded = gradedCount === openEndedQuestions.length;

      // Dyn score
      let calculatedPointsEarned = 0;
      let calculatedMaxPoints = 0;
      selectedAssessment?.questions.forEach(q => {
        calculatedPointsEarned += getQuestionPointsEarned(q, att);
        calculatedMaxPoints += q.points;
      });

      const percentage = calculatedMaxPoints > 0 ? Math.round((calculatedPointsEarned / calculatedMaxPoints) * 100) : 0;
      const isPassed = percentage >= (selectedAssessment?.passing_score || 0);

      return {
        ...att,
        isGraded,
        gradedCount,
        totalToGrade: openEndedQuestions.length,
        pointsEarned: calculatedPointsEarned,
        totalPointsPossible: calculatedMaxPoints,
        percentage,
        isPassed
      };
    });
  }, [selectedAssessmentId, selectedAssessment, attempts]);

  // Active Selected Question
  const activeQuestion = useMemo(() => {
    return assessmentQuestions.find(q => q.id === activeQuestionId) || assessmentQuestions[0];
  }, [assessmentQuestions, activeQuestionId]);

  // Active Selected Learner Submission
  const activeLearnerSubmission = useMemo(() => {
    return assessmentSubmissions.find(s => s.user_id === activeLearnerId) || assessmentSubmissions[0];
  }, [assessmentSubmissions, activeLearnerId]);

  // Question-specific stats: Average Score calculated across all learners
  const activeQuestionAverageScore = useMemo(() => {
    if (!activeQuestion || activeQuestion.type !== 'open_ended') return null;
    
    const scores = assessmentSubmissions
      .map(s => s.manual_grades?.[activeQuestion.id]?.score)
      .filter((v): v is number => v !== undefined);

    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, s) => sum + s, 0);
    return Math.round((total / scores.length) * 10) / 10;
  }, [activeQuestion, assessmentSubmissions]);

  // General Average Score percentage calculated across all submissions for this question
  const activeQuestionAverageScorePercent = useMemo(() => {
    if (!activeQuestion) return 0;
    if (assessmentSubmissions.length === 0) return 0;

    const totalEarned = assessmentSubmissions.reduce((sum, sub) => {
      return sum + getQuestionPointsEarned(activeQuestion, sub);
    }, 0);

    const maxPointsTotal = assessmentSubmissions.length * activeQuestion.points;
    if (maxPointsTotal === 0) return 0;

    return Math.round((totalEarned / maxPointsTotal) * 100);
  }, [activeQuestion, assessmentSubmissions, getQuestionPointsEarned]);

  // Initialize form controls when active selection changes
  React.useEffect(() => {
    if (level === 'workspace' && selectedAssessment) {
      if (workspaceView === 'by-question' && activeQuestion) {
        // Pre-fill score & feedback entries for all learners on this question
        const newScores: Record<string, number> = {};
        const newFeedbacks: Record<string, string> = {};
        
        assessmentSubmissions.forEach(sub => {
          const key = `${sub.user_id}_${activeQuestion.id}`;
          newScores[key] = sub.manual_grades?.[activeQuestion.id]?.score ?? 0;
          newFeedbacks[key] = sub.manual_grades?.[activeQuestion.id]?.feedback ?? '';
        });

        setEditedScores(prev => ({ ...prev, ...newScores }));
        setEditedFeedbacks(prev => ({ ...prev, ...newFeedbacks }));
      } else if (workspaceView === 'by-learner' && activeLearnerSubmission) {
        // Pre-fill score & feedback entries for all open-ended questions for this learner
        const newScores: Record<string, number> = {};
        const newFeedbacks: Record<string, string> = {};

        assessmentQuestions.forEach(q => {
          if (q.type === 'open_ended') {
            const key = `${activeLearnerSubmission.user_id}_${q.id}`;
            newScores[key] = activeLearnerSubmission.manual_grades?.[q.id]?.score ?? 0;
            newFeedbacks[key] = activeLearnerSubmission.manual_grades?.[q.id]?.feedback ?? '';
          }
        });

        setEditedScores(prev => ({ ...prev, ...newScores }));
        setEditedFeedbacks(prev => ({ ...prev, ...newFeedbacks }));
      }
    }
  }, [level, selectedAssessment, workspaceView, activeQuestionId, activeLearnerId, assessmentSubmissions, assessmentQuestions]);

  // --- Actions ---
  const handleSelectAssessment = (id: string) => {
    setSelectedAssessmentId(id);
    setLevel('workspace');
    
    // Auto-select first question and learner
    const assessmentDetails = assessments.find(a => a.id === id)?.assessmentData;
    if (assessmentDetails) {
      if (assessmentDetails.questions.length > 0) {
        setActiveQuestionId(assessmentDetails.questions[0].id);
      }
    }
    const assocSubmissions = attempts.filter(att => att.assessment_id === id && att.status !== 'In Progress');
    if (assocSubmissions.length > 0) {
      setActiveLearnerId(assocSubmissions[0].user_id);
    }
  };

  const handleSaveScoreAndFeedback = async (userId: string, qId: string) => {
    const attempt = attempts.find(att => att.user_id === userId && att.assessment_id === selectedAssessmentId);
    const question = assessmentQuestions.find(q => q.id === qId);
    
    if (!attempt || !question) return;

    const key = `${userId}_${qId}`;
    setSavingStatus(prev => ({ ...prev, [key]: 'saving' }));

    const score = editedScores[key] ?? 0;
    const feedback = editedFeedbacks[key] ?? '';

    // Mock API Timeout
    await new Promise(resolve => setTimeout(resolve, 600));

    const updatedManualGrades = {
      ...(attempt.manual_grades || {}),
      [qId]: {
        score,
        max_score: question.points,
        feedback
      }
    };

    // Calculate total scores dynamically using types
    const dummyAttempt = { ...attempt, manual_grades: updatedManualGrades };
    let dynPointsEarned = 0;
    let dynMaxPoints = 0;
    assessmentQuestions.forEach(q => {
      dynPointsEarned += getQuestionPointsEarned(q, dummyAttempt);
      dynMaxPoints += q.points;
    });

    const percentage = dynMaxPoints > 0 ? Math.round((dynPointsEarned / dynMaxPoints) * 100) : 0;
    const isPassed = percentage >= (selectedAssessment?.passing_score || 0);

    const updatedAttempt: AssessmentAttempt = {
      ...attempt,
      manual_grades: updatedManualGrades,
      score: dynPointsEarned,
      percentage,
      passed: isPassed,
      status: attempt.status === 'Graded' ? 'Graded' : 'Submitted'
    };

    onUpdateAttempt(updatedAttempt);

    setSavingStatus(prev => ({ ...prev, [key]: 'saved' }));
    setTimeout(() => {
      setSavingStatus(prev => ({ ...prev, [key]: 'idle' }));
    }, 2000);
  };

  const handlePublishFinalGrade = async (userId: string) => {
    const attempt = attempts.find(att => att.user_id === userId && att.assessment_id === selectedAssessmentId);
    if (!attempt) return;

    // Merge any state edits first to ensure latest is written
    const updatedManualGrades = { ...(attempt.manual_grades || {}) };
    
    assessmentQuestions.forEach(q => {
      if (q.type === 'open_ended') {
        const key = `${userId}_${q.id}`;
        const score = editedScores[key] !== undefined ? editedScores[key] : (attempt.manual_grades?.[q.id]?.score ?? 0);
        const feedback = editedFeedbacks[key] !== undefined ? editedFeedbacks[key] : (attempt.manual_grades?.[q.id]?.feedback ?? '');
        updatedManualGrades[q.id] = {
          score,
          max_score: q.points,
          feedback
        };
      }
    });

    const tempAttempt = { ...attempt, manual_grades: updatedManualGrades };
    let dynPointsEarned = 0;
    let dynMaxPoints = 0;
    assessmentQuestions.forEach(q => {
      dynPointsEarned += getQuestionPointsEarned(q, tempAttempt);
      dynMaxPoints += q.points;
    });

    const percentage = dynMaxPoints > 0 ? Math.round((dynPointsEarned / dynMaxPoints) * 100) : 0;
    const isPassed = percentage >= (selectedAssessment?.passing_score || 0);

    const updatedAttempt: AssessmentAttempt = {
      ...attempt,
      manual_grades: updatedManualGrades,
      score: dynPointsEarned,
      percentage,
      passed: isPassed,
      status: 'Graded'
    };

    onUpdateAttempt(updatedAttempt);
    setPublishNotification(`Successfully synchronized and published final grades for ${attempt.user_name || 'Learner'}!`);
    
    // Clear notification after 4 seconds
    setTimeout(() => {
      setPublishNotification(null);
    }, 4000);
  };

  const handleBulkPublishAssessment = async (assessmentId: string) => {
    const assessItem = assessments.find(a => a.id === assessmentId);
    if (!assessItem || !assessItem.assessmentData) return;

    const questions = assessItem.assessmentData.questions || [];
    const assessAttempts = attempts.filter(att => att.assessment_id === assessmentId && att.status !== 'In Progress');

    if (assessAttempts.length === 0) {
      setPublishNotification('No submissions found to publish for this assessment.');
      setTimeout(() => setPublishNotification(null), 3000);
      return;
    }

    assessAttempts.forEach(attempt => {
      const userId = attempt.user_id;
      const updatedManualGrades = { ...(attempt.manual_grades || {}) };

      questions.forEach(q => {
        if (q.type === 'open_ended') {
          const key = `${userId}_${q.id}`;
          const score = editedScores[key] !== undefined ? editedScores[key] : (attempt.manual_grades?.[q.id]?.score ?? 0);
          const feedback = editedFeedbacks[key] !== undefined ? editedFeedbacks[key] : (attempt.manual_grades?.[q.id]?.feedback ?? '');
          updatedManualGrades[q.id] = {
            score,
            max_score: q.points,
            feedback
          };
        }
      });

      const tempAttempt = { ...attempt, manual_grades: updatedManualGrades };
      let dynPointsEarned = 0;
      let dynMaxPoints = 0;
      questions.forEach(q => {
        dynPointsEarned += getQuestionPointsEarned(q, tempAttempt);
        dynMaxPoints += q.points;
      });

      const percentage = dynMaxPoints > 0 ? Math.round((dynPointsEarned / dynMaxPoints) * 100) : 0;
      const isPassed = percentage >= (assessItem.assessmentData?.passing_score || 0);

      const updatedAttempt: AssessmentAttempt = {
        ...attempt,
        manual_grades: updatedManualGrades,
        score: dynPointsEarned,
        percentage,
        passed: isPassed,
        status: 'Graded'
      };

      onUpdateAttempt(updatedAttempt);
    });

    setPublishNotification(`Successfully bulk-published and synced grades & feedbacks for ${assessAttempts.length} students!`);
    
    // Clear notification after 4 seconds
    setTimeout(() => {
      setPublishNotification(null);
    }, 4000);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setLearnerSearchQuery('');
    setCourseFilter('All');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  return (
    <div className="h-full flex flex-col p-8 bg-guesty-cream/10 md:p-10 select-none overflow-y-auto custom-scrollbar">
      
      {/* ---------------- LEVEL 1 : ASSESSMENT OVERVIEW & FILTERS ---------------- */}
      {level === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Dashboard Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-150 pb-6">
            <div>
              <h2 className="text-3xl font-serif italic text-guesty-black tracking-tight flex items-center gap-3">
                <GraduationCap className="w-9 h-9 text-guesty-nature" />
                Grading Inbox
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                Evaluate open-ended questions, review learner answers, and provide qualitative feedback.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm self-start">
              <div className="w-2.5 h-2.5 rounded-full bg-guesty-coral animate-pulse" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                {attempts.filter(att => att.status === 'Submitted').length} SUBMISSIONS FOR EVALUATION
              </span>
            </div>
          </div>

          {publishNotification && (
            <div className="p-4 bg-guesty-nature/10 border border-guesty-nature/20 text-guesty-nature shadow-sm rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 animate-bounce">
              <CheckCircle2 className="w-4.5 h-4.5 text-guesty-nature" />
              <span>{publishNotification}</span>
            </div>
          )}

          {/* Search, Date range, and Course Metadata Filters Section */}
          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 text-guesty-black font-bold text-sm">
              <Filter className="w-4 h-4 text-guesty-nature" />
              <span>Search & Filter Settings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Exam/Assessment name search input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Search Exam Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="E.g., Final Assessment"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-guesty-nature transition-all"
                  />
                </div>
              </div>

              {/* Learner Name Search */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Search Learner Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="E.g., Adi Cohen"
                    value={learnerSearchQuery}
                    onChange={(e) => setLearnerSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-guesty-nature transition-all"
                  />
                </div>
              </div>

              {/* Course filter select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Filter by Course</label>
                <select 
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-250 text-xs font-bold text-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:bg-white focus:border-guesty-nature"
                >
                  <option value="All">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              {/* Date range selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Submitted After</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input 
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-guesty-nature transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Submitted Before</label>
                <div className="relative font-bold">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input 
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-guesty-nature transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Clear Filters Badge */}
            {(searchQuery || learnerSearchQuery || courseFilter !== 'All' || startDateFilter || endDateFilter) && (
              <div className="flex justify-end pt-2">
                <button 
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Assessment List Group - First Hierarchical grouping */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Assessments & Exams Group</h3>
            
            {filteredAssessments.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                <h4 className="text-lg font-bold text-gray-900">No Assessments Matches Your Filter</h4>
                <p className="text-sm text-gray-500 max-w-md mt-1">Please try modifying your courses, date range or text query parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredAssessments.map(item => {
                  const data = item.assessmentData;
                  if (!data) return null;
                  const openEndedQuestions = data.questions.filter(q => q.type === 'open_ended');

                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectAssessment(item.id)}
                      className="group p-6 bg-white border border-gray-100 hover:border-guesty-nature/30 rounded-[32px] cursor-pointer hover:shadow-xl shadow-sm transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-guesty-cream/40 rounded-[22px] flex items-center justify-center text-guesty-nature shrink-0 group-hover:bg-guesty-ice/60 transition-colors">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-guesty-ice text-guesty-nature rounded-md">
                              {data.subType || "Exam"}
                            </span>
                            {item.linkedCourse && (
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
                                Course: {item.linkedCourse.title}
                              </span>
                            )}
                            {openEndedQuestions.length > 0 && item.pendingCount > 0 && (
                              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md animate-pulse">
                                {item.pendingCount} open-ended submissions awaiting evaluation
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl font-serif italic text-guesty-black group-hover:text-guesty-nature transition-colors">
                            {item.title}
                          </h4>
                          {item.pendingCount > 0 && (
                            <div className="pt-2 select-none">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBulkPublishAssessment(item.id);
                                }}
                                className="px-5 py-2.5 bg-guesty-nature text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-opacity-95 shadow-md active:scale-95 transition-all flex items-center gap-2"
                                title="Publish all pending evaluations, drafted scores, and feedbacks for this entire exam to students"
                              >
                                <Send className="w-3.5 h-3.5" />
                                Publish All Pending Feedback & Grades
                              </button>
                            </div>
                          )}
                          {item.pendingCount === 0 && item.totalSubmissions > 0 && (
                            <div className="pt-2 select-none flex items-center gap-1.5 text-guesty-nature font-black text-[10px] uppercase tracking-wider">
                              <CheckCircle2 className="w-4 h-4 text-guesty-nature" />
                              All Scores & Feedback Published
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status and Progress counters */}
                      <div className="flex items-center gap-8 self-end lg:self-auto w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50">
                        <div className="flex items-center gap-8 text-right">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Reviews</p>
                            <p className="text-sm font-black text-gray-900 mt-0.5">{item.totalSubmissions} submissions</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Evaluated</p>
                            <p className="text-sm font-black text-guesty-nature mt-0.5">{item.gradedCount} / {item.totalSubmissions} graded</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-32 hidden md:block text-left">
                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                              <span>Progress</span>
                              <span className="text-guesty-nature">{Math.round(item.progress)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border">
                              <div className="h-full bg-guesty-nature" style={{ width: `${item.progress}%` }} />
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:border-guesty-nature group-hover:text-guesty-nature transition-all">
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ---------------- LEVEL 2 : WORKSPACE VIEW ---------------- */}
      {level === 'workspace' && selectedAssessment && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Breadcrumb Navigation & Close button */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (onBackToOverview) {
                    onBackToOverview();
                  } else {
                    setLevel('overview');
                  }
                }}
                className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span>EXAM EVALUATION</span>
                  <span className="text-gray-200">•</span>
                  <span className="text-guesty-nature">{selectedLinkedInCourse?.title || "Standalone Assessment"}</span>
                </p>
                <h3 className="text-2xl font-serif italic text-guesty-black tracking-tight mt-0.5">
                  {selectedAssessment.title}
                </h3>
              </div>
            </div>

            {/* View Switching Tab controls & Bulk Publish */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button 
                  onClick={() => setWorkspaceView('by-question')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                    workspaceView === 'by-question' 
                      ? "bg-white text-guesty-nature shadow-md shadow-guesty-nature/5" 
                      : "text-gray-400 hover:text-gray-700"
                  )}
                >
                  <List className="w-4 h-4" />
                  By Question View
                </button>
                <button 
                  onClick={() => setWorkspaceView('by-learner')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                    workspaceView === 'by-learner' 
                      ? "bg-white text-guesty-nature shadow-md shadow-guesty-nature/5" 
                      : "text-gray-400 hover:text-gray-700"
                  )}
                >
                  <Users className="w-4 h-4" />
                  By Learner View
                </button>
              </div>

              <button
                onClick={() => handleBulkPublishAssessment(selectedAssessment.id)}
                className="px-6 py-3 bg-guesty-nature hover:bg-opacity-95 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
                title="Publish all pending scores and qualitative drafted feedback for this assessment to all students at once"
              >
                <Send className="w-4 h-4 text-white animate-pulse" />
                Publish All Pending & Grades
              </button>
            </div>
          </div>

          {/* ------------------- A. BY-QUESTION WORKSPACE ------------------- */}
          {workspaceView === 'by-question' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Question Selection Sidebar List */}
              <div className="lg:col-span-4 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Questions List</h4>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {assessmentQuestions.map((q, idx) => {
                    const isSelected = q.id === activeQuestion.id;
                    const isGraded = assessmentSubmissions.every(s => q.type !== 'open_ended' || s.manual_grades?.[q.id] !== undefined);

                    return (
                      <button 
                        key={q.id}
                        onClick={() => {
                          setActiveQuestionId(q.id);
                        }}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 text-left transition-all flex gap-3.5 items-start",
                          isSelected 
                            ? "border-guesty-nature bg-guesty-ice/20" 
                            : "border-gray-50 hover:bg-gray-50"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs",
                          isSelected ? "bg-guesty-nature text-white" : "bg-gray-100 text-gray-500"
                        )}>
                          Q{idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate leading-snug">{q.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                              {q.type.replace('_', ' ')}{!isSurvey && ` • ${q.points} pts`}
                            </span>
                            {q.type === 'open_ended' && (
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                isGraded ? "bg-guesty-nature" : "bg-guesty-coral animate-pulse"
                              )} />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail view of selected question displaying responses dynamically */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Active Question Meta & stats */}
                <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm space-y-6">
                  {publishNotification && (
                    <div className="p-4 bg-guesty-nature/10 border border-guesty-nature/20 text-guesty-nature rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 animate-bounce">
                      <CheckCircle2 className="w-4 h-4 text-guesty-nature" />
                      {publishNotification}
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-guesty-ice text-[10px] font-black uppercase tracking-widest text-guesty-nature rounded">
                      {activeQuestion.type.replace('_', ' ')}
                    </span>
                    {!isSurvey && (
                      <>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100 px-2.5 py-1 rounded">
                          Max Points: {activeQuestion.points}
                        </span>
                        <span className="text-[10px] font-black text-guesty-nature uppercase tracking-widest bg-guesty-nature/10 border border-guesty-nature/20 px-2.5 py-1 rounded">
                          Average Score: {activeQuestionAverageScorePercent}%
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {activeQuestion.content}
                  </h3>

                  {activeQuestion.media_url && (
                    <div className="rounded-2xl overflow-hidden border max-w-md">
                      <img src={activeQuestion.media_url} className="w-full h-auto" alt="Question Media" />
                    </div>
                  )}

                  {/* Quantitative average score calculation display */}
                  {activeQuestion.type === 'open_ended' && !isSurvey && (
                    <div className="pt-5 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-guesty-ice/15 p-5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-guesty-nature/10 text-guesty-nature flex items-center justify-center">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Average Points Awarded</p>
                          <p className="text-lg font-black text-gray-900">
                            {activeQuestionAverageScore !== null ? `${activeQuestionAverageScore} / ${activeQuestion.points} pts` : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-500 md:text-right">
                        Calculated across all live evaluated learner attempts.
                      </div>
                    </div>
                  )}
                </div>

                {/* Grid listing learners' answers simultaneously */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Learners Responses Simultaneous Stream</h4>
                  
                  {assessmentSubmissions.length === 0 ? (
                    <div className="p-12 bg-white rounded-3xl border border-gray-50 text-center text-gray-400 font-bold">
                      No matching submissions found.
                    </div>
                  ) : (
                    assessmentSubmissions.map(sub => {
                      const userResponse = sub.responses?.[activeQuestion.id];
                      const key = `${sub.user_id}_${activeQuestion.id}`;
                      
                      const scoreValue = editedScores[key] !== undefined ? editedScores[key] : (sub.manual_grades?.[activeQuestion.id]?.score ?? 0);
                      const feedbackValue = editedFeedbacks[key] !== undefined ? editedFeedbacks[key] : (sub.manual_grades?.[activeQuestion.id]?.feedback ?? '');
                      
                      const statusState = savingStatus[key] || 'idle';

                      // Is Correct check
                      const scoreEarned = getQuestionPointsEarned(activeQuestion, sub);
                      const isFullyCorrect = scoreEarned === activeQuestion.points;

                      return (
                        <div key={sub.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                          
                          {/* Student identity header */}
                          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-bold border border-gray-200">
                                <User className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-md font-bold text-gray-900">{sub.user_name}</h5>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  Submitted {new Date(sub.completed_at || sub.started_at).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Status badge */}
                            <div>
                              {isSurvey ? (
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full">
                                  Response Received
                                </span>
                              ) : activeQuestion.type === 'open_ended' ? (
                                sub.manual_grades?.[activeQuestion.id] !== undefined ? (
                                  <span className="px-3 py-1 bg-guesty-nature/10 text-guesty-nature text-[9px] font-black uppercase tracking-widest rounded-full">
                                    Graded
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse">
                                    Needs Evaluation
                                  </span>
                                )
                              ) : (
                                <span className={cn(
                                  "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full",
                                  isFullyCorrect ? "bg-guesty-nature/10 text-guesty-nature" : "bg-red-50 text-red-500"
                                )}>
                                  {isFullyCorrect ? "Correct" : "Incorrect"}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Response content */}
                          <div className="space-y-4">
                            
                            {/* MCQ, SCQ or Likert answer preview */}
                            {activeQuestion.type !== 'open_ended' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {activeQuestion.answers.map(ans => {
                                  const isSelected = Array.isArray(userResponse) 
                                    ? userResponse.includes(ans.id) 
                                    : userResponse === ans.id;
                                  
                                  return (
                                    <div 
                                      key={ans.id}
                                      className={cn(
                                        "p-4 rounded-2xl border flex items-center justify-between",
                                        isSurvey
                                          ? (isSelected ? "border-guesty-nature bg-guesty-nature/5 text-guesty-black" : "border-gray-150 text-gray-750 opacity-80")
                                          : isSelected 
                                            ? (ans.is_correct ? "border-guesty-nature bg-guesty-nature/5 text-guesty-black" : "border-red-300 bg-red-50 text-red-950")
                                            : (ans.is_correct ? "border-dashed border-guesty-nature/35 bg-guesty-nature/[0.02]" : "border-gray-100 opacity-60")
                                      )}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <div className={cn(
                                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                                          isSurvey
                                            ? (isSelected ? "bg-guesty-nature border-guesty-nature text-white" : "border-gray-200")
                                            : isSelected 
                                              ? (ans.is_correct ? "bg-guesty-nature border-guesty-nature text-white" : "bg-red-500 border-red-500 text-white")
                                              : "border-gray-200"
                                        )}>
                                          {isSelected && (isSurvey ? <CheckCircle2 className="w-3.5 h-3.5" /> : ans.is_correct ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />)}
                                        </div>
                                        <span className="text-xs font-bold">{ans.content}</span>
                                      </div>
                                      {ans.is_correct && !isSurvey && (
                                        <span className="text-[8px] font-black uppercase text-guesty-nature/50 tracking-wider">Correct Answer</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Open-Ended response textual & file showcase */}
                            {activeQuestion.type === 'open_ended' && (
                              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <p className="text-xs font-bold text-gray-800 leading-relaxed whitespace-pre-wrap italic">
                                  "{(typeof userResponse === 'object' && userResponse !== null && !Array.isArray(userResponse)) ? (userResponse as any).text : (userResponse || 'No responses loaded.')}"
                                </p>

                                {/* User uploaded images supporting their answer */}
                                {typeof userResponse === 'object' && userResponse !== null && !Array.isArray(userResponse) && (userResponse as any).files && (userResponse as any).files.length > 0 && (
                                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Supporting Attachments / Uploaded Images</p>
                                    <div className="flex flex-wrap gap-3">
                                      {(userResponse as any).files.map((fileUrl: any, index: number) => (
                                        <div key={index} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-black">
                                          <img 
                                            src={fileUrl} 
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                            alt="Learner attachment"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                          </div>

                          {/* Open-Ended Grading Controls */}
                          {activeQuestion.type === 'open_ended' && (
                            <div className="pt-4 border-t border-gray-50 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                              
                              {/* Points Score input field */}
                              {!isSurvey && (
                                <div className="md:col-span-3 flex flex-col gap-1.55 select-none">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Manual Scoring Input</label>
                                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-250 hover:border-guesty-nature transition-all">
                                    <span className="text-gray-400 font-bold text-xs">[</span>
                                    <input 
                                      type="number"
                                      min={0}
                                      max={activeQuestion.points}
                                      step={0.5}
                                      placeholder="0"
                                      value={scoreValue || ''}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setEditedScores(prev => ({ ...prev, [key]: val }));
                                      }}
                                      className="w-10 bg-transparent text-sm font-black text-center text-guesty-nature focus:outline-none"
                                    />
                                    <span className="text-gray-400 font-bold text-xs">]</span>
                                    <span className="text-xs font-bold text-gray-500">/ {activeQuestion.points} Points</span>
                                  </div>
                                </div>
                              )}
 
                              {/* Qualitative feed text area */}
                              <div className={cn(
                                isSurvey ? "md:col-span-8" : "md:col-span-5",
                                "flex flex-col gap-1.5"
                              )}>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                  {isSurvey ? "Qualitative Response Note / Feedback Comment" : "Qualitative feedback comment"}
                                </label>
                                <textarea 
                                  placeholder={isSurvey ? "Add qualitative notes or comments on this response..." : "Provide qualitative guidance..."}
                                  rows={1}
                                  value={feedbackValue}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditedFeedbacks(prev => ({ ...prev, [key]: val }));
                                  }}
                                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:bg-white focus:border-guesty-nature transition-all outline-none resize-none"
                                />
                              </div>

                              {/* Save Trigger inline */}
                              <div className="md:col-span-4 self-stretch flex items-end">
                                <div className="flex w-full gap-2">
                                  <button 
                                    onClick={() => handleSaveScoreAndFeedback(sub.user_id, activeQuestion.id)}
                                    disabled={statusState === 'saving'}
                                    className="flex-1 bg-gray-900 hover:bg-black text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    title="Save Draft (Intermediate Workspace State)"
                                  >
                                    {statusState === 'saving' ? (
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-guesty-nature" />
                                    ) : statusState === 'saved' ? (
                                      <>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-guesty-nature" />
                                        Saved!
                                      </>
                                    ) : (
                                      <>
                                        <Save className="w-3.5 h-3.5 text-guesty-nature" />
                                        Save Draft
                                      </>
                                    )}
                                  </button>
                                  <button 
                                    onClick={() => handlePublishFinalGrade(sub.user_id)}
                                    className="flex-1 bg-guesty-nature hover:bg-opacity-90 text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-center shrink-0"
                                    title="Save and publish finalized grade to student"
                                  >
                                    <Send className="w-3.5 h-3.5 text-white" />
                                    Publish
                                  </button>
                                </div>
                              </div>

                            </div>
                          )}

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ------------------- B. BY-LEARNER WORKSPACE ------------------- */}
          {workspaceView === 'by-learner' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Learner list Selection sidebar */}
              <div className="lg:col-span-4 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Submitted Learners</h4>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {assessmentSubmissions.map(sub => {
                    const isSelected = sub.user_id === activeLearnerSubmission.user_id;
                    
                    return (
                      <button 
                        key={sub.id}
                        onClick={() => {
                          setActiveLearnerId(sub.user_id);
                        }}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 text-left transition-all flex gap-3.5 items-center",
                          isSelected 
                            ? "border-guesty-nature bg-guesty-ice/20" 
                            : "border-gray-50 hover:bg-gray-50"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border font-bold text-gray-500",
                          isSelected ? "bg-guesty-nature text-white border-guesty-nature" : "bg-gray-100"
                        )}>
                          {sub.user_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-gray-900 truncate leading-snug">{sub.user_name}</p>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            {isSurvey ? (
                              <>
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                                  Response Received
                                </span>
                                {sub.totalToGrade > 0 && (
                                  <span className="text-[9px] font-medium text-gray-400 truncate">
                                    Reviewed: {sub.gradedCount}/{sub.totalToGrade}
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                <span className="text-[9px] font-black uppercase tracking-widest text-guesty-nature">
                                  Grade: {sub.percentage}%
                                </span>
                                <span className="text-[9px] font-medium text-gray-400 truncate">
                                  Graded: {sub.gradedCount}/{sub.totalToGrade}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail view showing all questions responses simultaneously for chosen learner */}
              <div className="lg:col-span-8 space-y-6">
                             {/* Active Learner header & Total/Final Grade overview */}
                <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-guesty-cream/50 border flex items-center justify-center text-guesty-nature font-black text-2xl shrink-0">
                      {activeLearnerSubmission.user_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 leading-tight">{activeLearnerSubmission.user_name}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Submitted on {new Date(activeLearnerSubmission.completed_at || activeLearnerSubmission.started_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Prominent Total / Final Grade details */}
                  {isSurvey ? (
                    <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-blue-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">Feedback State</p>
                        <p className="text-md font-black text-blue-900 mt-0.5">Response Logged</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Exam Grade</p>
                        <p className="text-lg font-black text-gray-900">
                          {activeLearnerSubmission.pointsEarned} / {activeLearnerSubmission.totalPointsPossible} Points
                        </p>
                      </div>
                      <div className="h-10 w-px bg-gray-200" />
                      <div className="flex flex-col items-center">
                        <p className={cn(
                          "text-3xl font-serif italic",
                          activeLearnerSubmission.isPassed ? "text-guesty-nature" : "text-guesty-coral"
                        )}>
                          {activeLearnerSubmission.percentage}%
                        </p>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest mt-0.5",
                          activeLearnerSubmission.isPassed ? "text-guesty-nature" : "text-guesty-coral"
                        )}>
                          {activeLearnerSubmission.isPassed ? "PASSED" : "FAILED / NEEDS REVIEW"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Publication / Downstream Sync status card */}
                {publishNotification && (
                  <div className="p-4 bg-guesty-nature/10 border border-guesty-nature/20 text-guesty-nature rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-guesty-nature" />
                    {publishNotification}
                  </div>
                )}

                <div className="p-6 bg-guesty-ice/15 border-2 border-guesty-nature/25 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                      activeLearnerSubmission.status === 'Graded' ? "bg-guesty-nature text-white" : "bg-orange-500/10 text-orange-600 animate-pulse"
                    )}>
                      {activeLearnerSubmission.status === 'Graded' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
                        {isSurvey ? "Feedback Publication Action" : "Grade Publication Action"}
                        {activeLearnerSubmission.status === 'Graded' && (
                          <span className="px-2 py-0.5 bg-guesty-nature text-white text-[8px] font-black uppercase tracking-widest rounded animate-pulse">
                            Published & Synced
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {activeLearnerSubmission.status === 'Graded' 
                          ? (isSurvey ? "This student's individual feedback comments are synchronized." : "This student's grades and individual feed comments are synchronized to their Course module.")
                          : (isSurvey ? "This feedback is currently a local draft and is NOT visible to the student. Click to publish instantly." : "This grade is currently a local draft and is NOT visible to the student. Click to publish instantly.")
                        }
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePublishFinalGrade(activeLearnerSubmission.user_id)}
                    className="px-6 py-3 bg-guesty-nature hover:bg-opacity-95 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2.5 shrink-0"
                  >
                    <Send className="w-4 h-4 text-white" />
                    {isSurvey ? "Save & Publish Feedback" : "Save & Publish Final Grade"}
                  </button>
                </div>

                {/* List of all answers (Single selection, MCQ and Open Ended) within selected assessment */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Detailed Assessments Answer Form</h4>
                  
                  {assessmentQuestions.map((question, index) => {
                    const userResponse = activeLearnerSubmission.responses?.[question.id];
                    const key = `${activeLearnerSubmission.user_id}_${question.id}`;
                    
                    const scoreValue = editedScores[key] !== undefined ? editedScores[key] : (activeLearnerSubmission.manual_grades?.[question.id]?.score ?? 0);
                    const feedbackValue = editedFeedbacks[key] !== undefined ? editedFeedbacks[key] : (activeLearnerSubmission.manual_grades?.[question.id]?.feedback ?? '');
                    
                    const statusState = savingStatus[key] || 'idle';

                    const pointsEarnedLocally = getQuestionPointsEarned(question, activeLearnerSubmission);
                    const isCorrect = pointsEarnedLocally === question.points;

                    return (
                      <div key={question.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden space-y-6">
                        
                        {/* Question ordering title */}
                        <div className="flex justify-between items-start gap-3 border-b border-gray-50 pb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center font-black text-xs shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <h5 className="text-md font-bold text-gray-900 leading-snug">{question.content}</h5>
                              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mt-1">
                                {question.type.replace('_', ' ')}{!isSurvey && ` • ${question.points} Points possible`}
                              </p>
                            </div>
                          </div>

                          <div>
                            {isSurvey ? (
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded">
                                Submitted
                              </span>
                            ) : question.type === 'open_ended' ? (
                              activeLearnerSubmission.manual_grades?.[question.id] !== undefined ? (
                                <span className="px-2.5 py-1 bg-guesty-nature/10 text-guesty-nature text-[8px] font-black uppercase tracking-widest rounded">
                                  Graded
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-orange-150 text-orange-600 text-[8px] font-black uppercase tracking-widest rounded animate-pulse">
                                  Ungraded
                                </span>
                              )
                            ) : (
                              <span className={cn(
                                "px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded",
                                isCorrect ? "bg-guesty-nature/10 text-guesty-nature" : "bg-red-50 text-red-500"
                              )}>
                                {isCorrect ? "Correct" : "Incorrect"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Answers visual markup */}
                        <div className="space-y-4">
                          {question.type !== "open_ended" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {question.answers.map(ans => {
                                const isSelected = Array.isArray(userResponse) 
                                  ? userResponse.includes(ans.id) 
                                  : userResponse === ans.id;

                                return (
                                  <div 
                                    key={ans.id}
                                    className={cn(
                                      "p-4 rounded-2xl border flex items-center justify-between",
                                      isSurvey
                                        ? (isSelected ? "border-guesty-nature bg-guesty-nature/5 text-guesty-black" : "border-gray-150 text-gray-755 opacity-80")
                                        : isSelected
                                          ? (ans.is_correct ? "border-guesty-nature bg-guesty-nature/5" : "border-red-350 bg-red-50")
                                          : (ans.is_correct ? "border-dashed border-guesty-nature/40 bg-guesty-nature/[0.01]" : "border-gray-50 opacity-60")
                                    )}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <div className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                                        isSurvey
                                          ? (isSelected ? "bg-guesty-nature border-guesty-nature text-white" : "border-gray-205")
                                          : isSelected 
                                            ? (ans.is_correct ? "bg-guesty-nature border-guesty-nature text-white" : "bg-red-500 border-red-500 text-white")
                                            : "border-gray-200"
                                      )}>
                                        {isSelected && (isSurvey ? <CheckCircle2 className="w-3 h-3" /> : ans.is_correct ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />)}
                                      </div>
                                      <span className="text-xs font-bold text-gray-900">{ans.content}</span>
                                    </div>
                                    {ans.is_correct && !isSurvey && (
                                      <span className="text-[8px] font-black text-guesty-nature/50 uppercase tracking-widest">Correct Solution</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Open-ended answer response details */}
                          {question.type === "open_ended" && (
                            <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl space-y-4">
                              <p className="text-xs font-bold leading-relaxed text-gray-800 whitespace-pre-wrap italic">
                                "{(typeof userResponse === 'object' && userResponse !== null && !Array.isArray(userResponse)) ? (userResponse as any).text : (userResponse || 'No response details provided.')}"
                              </p>

                              {/* Files uploaded supporting their answer */}
                              {typeof userResponse === 'object' && userResponse !== null && !Array.isArray(userResponse) && (userResponse as any).files && (userResponse as any).files.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                                  <p className="text-[10px] font-black uppercase text-gray-400">Attached Student Image Supporting Proof</p>
                                  <div className="flex flex-wrap gap-2.5">
                                    {(userResponse as any).files.map((fileUrl: any, index: number) => (
                                      <div key={index} className="relative w-20 h-20 border rounded-lg overflow-hidden bg-black">
                                        <img src={fileUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="Verification" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Evaluations points and feedbacks */}
                        {question.type === "open_ended" && (
                          <div className="pt-4 border-t border-gray-50 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                            
                            {/* Score Points Numerical input */}
                            {!isSurvey && (
                              <div className="md:col-span-3 flex flex-col gap-1.5 select-none">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Manual Scoring Input</label>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-250 hover:border-guesty-nature transition-all">
                                  <span className="text-gray-400 font-bold text-xs">[</span>
                                  <input 
                                    type="number"
                                    min={0}
                                    max={question.points}
                                    step={0.5}
                                    placeholder="0"
                                    value={scoreValue || ''}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      setEditedScores(prev => ({ ...prev, [key]: val }));
                                    }}
                                    className="w-10 bg-transparent text-sm font-black text-center text-guesty-nature focus:outline-none"
                                  />
                                  <span className="text-gray-400 font-bold text-xs">]</span>
                                  <span className="text-xs font-bold text-gray-500">/ {question.points} Points</span>
                                </div>
                              </div>
                            )}

                            {/* Qualitative feedback input */}
                            <div className={cn(
                              isSurvey ? "md:col-span-9" : "md:col-span-6",
                              "flex flex-col gap-1.5"
                            )}>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                {isSurvey ? "Qualitative Response Note / Comment" : "Qualitative Guidance Comment"}
                              </label>
                              <textarea 
                                placeholder={isSurvey ? "Add comments or notes for this response..." : "Add comments for this student..."}
                                rows={1}
                                value={feedbackValue}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditedFeedbacks(prev => ({ ...prev, [key]: val }));
                                }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:bg-white focus:border-guesty-nature transition-all outline-none resize-none"
                              />
                            </div>

                            {/* Save action button */}
                            <div className="md:col-span-3">
                              <button 
                                onClick={() => handleSaveScoreAndFeedback(activeLearnerSubmission.user_id, question.id)}
                                disabled={statusState === 'saving'}
                                className="w-full bg-gray-900 hover:bg-black text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                {statusState === 'saving' ? (
                                  <RefreshCw className="w-4 h-4 animate-spin text-guesty-nature" />
                                ) : statusState === 'saved' ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-guesty-nature" />
                                    Saved!
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4 text-guesty-nature" />
                                    {isSurvey ? "Save Note" : "Save Evaluation"}
                                  </>
                                )}
                              </button>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
