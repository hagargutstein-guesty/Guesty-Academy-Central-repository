import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Edit3, 
  BarChart3, 
  Inbox, 
  ArrowLeft, 
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileItem, Assessment, AssessmentAttempt, Group, Course } from '../types';
import { cn } from '../lib/utils';
import { AssessmentBuilder } from './AssessmentBuilder';
import { AssessmentAnalytics } from './AssessmentAnalytics';
import { GradingInbox } from './GradingInbox';

interface AssessmentsTabProps {
  repository: FileItem[];
  setRepository: React.Dispatch<React.SetStateAction<FileItem[]>>;
  attempts: AssessmentAttempt[];
  onUpdateAttempt: (attempt: AssessmentAttempt) => void;
  courses: Course[];
  groups: Group[];
}

export const AssessmentsTab: React.FC<AssessmentsTabProps> = ({
  repository,
  setRepository,
  attempts,
  onUpdateAttempt,
  courses,
  groups
}) => {
  // Navigation level
  const [drillDownId, setDrillDownId] = useState<string | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<'edit' | 'analytics' | 'grading'>('grading');

  // Search and Filter States for Dashboard
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [showOnlyBacklog, setShowOnlyBacklog] = useState(false);
  const [entityTypeFilter, setEntityTypeFilter] = useState<'all' | 'Quiz' | 'Survey'>('all');
  
  // Local notification state
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Extract all files of type 'Assessment'
  const assessments = useMemo(() => {
    return repository.filter(item => item.type === 'Assessment' && item.assessmentData);
  }, [repository]);

  // Find selected assessment
  const selectedAssessmentFile = useMemo(() => {
    return assessments.find(item => item.id === drillDownId) || null;
  }, [assessments, drillDownId]);

  const selectedAssessmentData = useMemo(() => {
    return selectedAssessmentFile?.assessmentData || null;
  }, [selectedAssessmentFile]);

  // Compute stats across all assessments
  const dashboardStats = useMemo(() => {
    const totalExams = assessments.length;
    const completedAttempts = attempts.filter(att => att.status !== 'In Progress');
    const totalSubmissions = completedAttempts.length;
    const gradedCount = completedAttempts.filter(att => att.status === 'Graded').length;
    
    // Compute total open-ended attempts awaiting evaluation
    let pendingManualCount = 0;
    assessments.forEach(item => {
      const qData = item.assessmentData;
      if (!qData) return;
      const hasOpenEnded = qData.questions?.some(q => q.type === 'open_ended');
      if (hasOpenEnded) {
        const assessAttempts = attempts.filter(att => att.assessment_id === item.id && att.status !== 'In Progress');
        const notGradedCount = assessAttempts.filter(att => att.status !== 'Graded').length;
        pendingManualCount += notGradedCount;
      }
    });

    const publishedPercentage = totalSubmissions > 0 ? Math.round((gradedCount / totalSubmissions) * 100) : 100;

    return {
      totalExams,
      totalSubmissions,
      pendingManualCount,
      publishedPercentage
    };
  }, [assessments, attempts]);

  // Filtered assessments list
  const filteredAssessments = useMemo(() => {
    return assessments.filter(item => {
      // Search matches exam/assessment name, associated courses, or participating learners
      const activeCoursesForSearch = courses.filter(c => c.modules?.some(m => m.id === item.id));
      const term = searchQuery.toLowerCase();
      const matchesTitle = (item.title || item.name || '').toLowerCase().includes(term);
      const matchesCourseName = activeCoursesForSearch.some(c => (c.title || '').toLowerCase().includes(term));
      const matchesLearnerName = attempts
        .filter(att => att.assessment_id === item.id)
        .some(att => (att.user_name || '').toLowerCase().includes(term));

      const matchesSearch = searchQuery === '' || matchesTitle || matchesCourseName || matchesLearnerName;

      // Helper to see if any connected course matches filter
      let matchesCourse = true;
      const associatedCourse = courses.find(c => c.modules?.some(m => m.id === item.id));
      if (courseFilter !== 'All') {
        matchesCourse = associatedCourse?.id === courseFilter;
      }

      // Filter by backlog if option active
      let matchesBacklog = true;
      if (showOnlyBacklog) {
        const data = item.assessmentData!;
        const totalAttempts = attempts.filter(att => att.assessment_id === item.id && att.status !== 'In Progress');
        const gradedAttempts = totalAttempts.filter(att => att.status === 'Graded');
        const hasOpenEnded = data.questions?.some(q => q.type === 'open_ended');
        const openEndedAwaiting = hasOpenEnded ? totalAttempts.length - gradedAttempts.length : 0;
        matchesBacklog = openEndedAwaiting > 0;
      }

      // Filter by evaluation submission date-range if there are attempts
      let matchesDate = true;
      if (startDateFilter || endDateFilter) {
        const assessAttempts = attempts.filter(att => att.assessment_id === item.id);
        if (assessAttempts.length === 0) {
          matchesDate = false;
        } else {
          matchesDate = assessAttempts.some(att => {
            const completedTime = att.completed_at ? new Date(att.completed_at) : null;
            if (!completedTime) return false;
            if (startDateFilter && completedTime < new Date(startDateFilter)) return false;
            if (endDateFilter && completedTime > new Date(endDateFilter)) return false;
            return true;
          });
        }
      }

      // Filter by type (Quiz vs Survey)
      let matchesEntityType = true;
      if (entityTypeFilter !== 'all') {
        matchesEntityType = item.assessmentData?.subType === entityTypeFilter;
      }

      return matchesSearch && matchesCourse && matchesDate && matchesBacklog && matchesEntityType;
    });
  }, [assessments, courses, attempts, searchQuery, courseFilter, startDateFilter, endDateFilter, showOnlyBacklog, entityTypeFilter]);

  // Save changes from builder inside Tab Workspace
  const handleSaveFromBuilder = async (updatedAssessment: Assessment) => {
    setRepository(prev => prev.map(a => a.id === updatedAssessment.id ? {
      ...a,
      title: updatedAssessment.title,
      assessmentData: updatedAssessment,
      version: `v${(parseInt(a.version?.replace('v', '') || '1') + 1)}`
    } : a));

    setBannerMessage(`"${updatedAssessment.title}" updated successfully!`);
    setTimeout(() => setBannerMessage(null), 4000);
  };

  // Create assessment directly in Tab
  const handleCreateNew = (type: 'Quiz' | 'Survey') => {
    const newAssessment: Assessment = {
      id: 'assess-' + Date.now(),
      tenant_id: 'default-tenant',
      title: `Untitled ${type} - ${new Date().toLocaleDateString()}`,
      subType: type,
      description: 'New interactive evaluation asset',
      passing_score: type === 'Quiz' ? 80 : 0,
      settings: {
        timeLimit: 30,
        shuffleQuestions: false,
        shuffleAnswers: false,
        maxAttempts: 3,
        scoringType: 'binary'
      },
      questions: []
    };

    const newAsset: FileItem = {
      id: newAssessment.id,
      title: newAssessment.title,
      type: 'Assessment',
      folderId: 'internal-root',
      createdAt: new Date().toLocaleDateString(),
      version: 'v1',
      status: 'Active',
      usedIn: 0,
      views: 0,
      completionRate: '0%',
      author: 'Instructor',
      assessmentData: newAssessment
    };

    setRepository(prev => [newAsset, ...prev]);
    
    // Automatically open first in edit mode
    setDrillDownId(newAsset.id);
    setActiveWorkflow('edit');
    
    setBannerMessage(`Created ${type} draft! Added directly to your workspace.`);
    setTimeout(() => setBannerMessage(null), 4000);
  };

  // Global Bulk Release Feedback trigger
  const handleBulkPublishAssessment = (assessmentId: string) => {
    const assessItem = assessments.find(a => a.id === assessmentId);
    if (!assessItem || !assessItem.assessmentData) return;

    const questions = assessItem.assessmentData.questions || [];
    const assessAttempts = attempts.filter(att => att.assessment_id === assessmentId && att.status !== 'In Progress');

    if (assessAttempts.length === 0) {
      setBannerMessage('No completed submissions found to publish for this assessment.');
      setTimeout(() => setBannerMessage(null), 3000);
      return;
    }

    assessAttempts.forEach(attempt => {
      const updatedManualGrades = { ...(attempt.manual_grades || {}) };

      questions.forEach(q => {
        if (q.type === 'open_ended') {
          // Keep existing grades/feedbacks or default
          const currentProgress = attempt.manual_grades?.[q.id];
          updatedManualGrades[q.id] = {
            score: currentProgress?.score ?? 0,
            max_score: q.points,
            feedback: currentProgress?.feedback ?? ''
          };
        }
      });

      // Calculate new score with manual grades integrated
      const tempAttempt = { ...attempt, manual_grades: updatedManualGrades };
      let dynPointsEarned = 0;
      let dynMaxPoints = 0;
      questions.forEach(q => {
        if (q.type === 'open_ended') {
          dynPointsEarned += updatedManualGrades[q.id]?.score ?? 0;
        } else {
          const userResponse = attempt.responses?.[q.id];
          if (userResponse !== undefined) {
            if (q.type === 'single_choice' || q.type === 'likert_scale') {
              const correctAnswer = q.answers.find(a => a.is_correct);
              if (userResponse === correctAnswer?.id) dynPointsEarned += q.points;
            } else if (q.type === 'multiple_choice') {
              const selectedIds = (userResponse as string[]) || [];
              const correctIds = q.answers.filter(a => a.is_correct).map(a => a.id);
              if (selectedIds.length === correctIds.length && selectedIds.every(id => correctIds.includes(id))) {
                dynPointsEarned += q.points;
              }
            }
          }
        }
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

    setBannerMessage(`Published and synchronized exam results to the learner personal course pages for ${assessAttempts.length} students!`);
    setTimeout(() => setBannerMessage(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <AnimatePresence>
        {drillDownId === null ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* 1. Header with Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-guesty-nature" />
                  Assessments Hub
                </h1>
                <p className="text-gray-500 font-medium text-lg mt-2">
                  Unify evaluation design, student submissions, and qualitative-driven scoring.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCreateNew('Quiz')}
                  className="bg-guesty-nature text-white inline-flex items-center gap-2 font-black text-sm uppercase px-5 py-3.5 rounded-xl hover:bg-opacity-95 shadow-md active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5 text-white" />
                  + Create New Quiz
                </button>
                <button
                  onClick={() => handleCreateNew('Survey')}
                  className="bg-white text-guesty-nature border border-guesty-nature inline-flex items-center gap-2 font-black text-sm uppercase px-5 py-3.5 rounded-xl hover:bg-guesty-ice/60 active:scale-95 transition-all"
                >
                  <Inbox className="w-5 h-5 text-guesty-nature" />
                  + Create New Survey
                </button>
              </div>
            </div>

            {/* Banner Messages */}
            {bannerMessage && (
              <div className="p-4 bg-guesty-nature/10 border border-guesty-nature/20 text-guesty-nature shadow-sm rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-guesty-nature" />
                <span>{bannerMessage}</span>
              </div>
            )}

            {/* 2. Key Insights Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-gray-100 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Exams</span>
                  <div className="p-2 bg-guesty-cream rounded-xl text-guesty-nature">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-gray-950">{dashboardStats.totalExams}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Configured interactive assessments</p>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-100 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Completed Submissions</span>
                  <div className="p-2 bg-guesty-ice rounded-xl text-guesty-nature">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-gray-950">{dashboardStats.totalSubmissions}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Non-draft student submissions</p>
                </div>
              </div>

              <div 
                onClick={() => setShowOnlyBacklog(prev => !prev)}
                className={cn(
                  "p-6 border rounded-[24px] shadow-sm hover:shadow-md transition-all cursor-pointer select-none",
                  showOnlyBacklog 
                    ? "bg-red-50/70 border-red-200 ring-2 ring-red-500/20" 
                    : "bg-white border-gray-100 hover:border-red-300"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Grading Backlog</span>
                  <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    showOnlyBacklog ? "bg-red-200 text-red-800" : "bg-red-105 text-red-600"
                  )}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-red-650">{dashboardStats.pendingManualCount}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <p className="text-xs text-red-550 font-black uppercase">Open-ended answers awaiting rating</p>
                    {showOnlyBacklog && (
                      <span className="text-[8px] bg-red-600 text-white font-black uppercase tracking-wider px-1.5 py-0.5 rounded">Active Filter</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-100 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest font-black">Published Rate</span>
                  <div className="p-2 bg-green-100 rounded-xl text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-green-700">{dashboardStats.publishedPercentage}%</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Results published downstream</p>
                </div>
              </div>
            </div>

            {/* 3. Global Search & Filters Component */}
            <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-guesty-black font-black text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-guesty-nature" />
                  <span>Search and Filters Workspace</span>
                </div>

                {/* Type-Based Navigation Segment Control Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-150 max-w-md w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setEntityTypeFilter('all')}
                    className={cn(
                      "flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-center",
                      entityTypeFilter === 'all'
                        ? "bg-white text-gray-950 shadow-sm font-black"
                        : "text-gray-400 hover:text-gray-700"
                    )}
                  >
                    All ({assessments.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntityTypeFilter('Quiz')}
                    className={cn(
                      "flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-center border border-transparent",
                      entityTypeFilter === 'Quiz'
                        ? "bg-white text-guesty-nature shadow-sm border-guesty-nature/10"
                        : "text-gray-400 hover:text-gray-700"
                    )}
                  >
                    Assessments ({assessments.filter(a => a.assessmentData?.subType === 'Quiz').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntityTypeFilter('Survey')}
                    className={cn(
                      "flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-center border border-transparent",
                      entityTypeFilter === 'Survey'
                        ? "bg-white text-amber-600 shadow-sm border-amber-200/20"
                        : "text-gray-400 hover:text-[#FF9D00]"
                    )}
                  >
                    Surveys ({assessments.filter(a => a.assessmentData?.subType === 'Survey').length})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-450 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, learner, or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-5 hover:bg-gray-100/40 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-guesty-nature transition-all"
                  />
                </div>

                <div>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-5 hover:bg-gray-100/40 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-guesty-nature text-gray-700"
                  >
                    <option value="All">All Associated Courses</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-5 hover:bg-gray-100/40 border border-gray-200 rounded-xl text-[11px] focus:outline-none focus:text-guesty-nature"
                    title="Submission start range date"
                  />
                </div>

                <div>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-5 hover:bg-gray-100/40 border border-gray-200 rounded-xl text-[11px] focus:outline-none focus:text-guesty-nature"
                    title="Submission end range date"
                  />
                </div>
              </div>

              {/* Backlog filter notice */}
              {showOnlyBacklog && (
                <div className="bg-red-50 border border-red-100/70 p-4 rounded-2xl flex items-center justify-between text-xs text-red-950 gap-4 mt-2">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-red-600 animate-pulse shrink-0" />
                    <span>Filtered Status: Showing only assessments with pending open-ended answers</span>
                  </div>
                  <button 
                    onClick={() => setShowOnlyBacklog(false)}
                    className="bg-white hover:bg-red-100 border border-red-200 text-red-750 hover:text-red-900 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all shadow-sm shrink-0"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* 4. Assessment Cards Grid */}
            {filteredAssessments.length === 0 ? (
              <div className="p-16 text-center border overflow-hidden rounded-[32px] bg-white text-gray-500">
                <Inbox className="w-12 h-12 mx-auto text-gray-300 pb-2" />
                <h3 className="font-bold text-lg">No Assessments found</h3>
                <p className="text-xs text-gray-405 mt-2">Try adjusting your filters, searching differently, or create another quiz draft.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssessments.map(item => {
                  const data = item.assessmentData!;
                  
                  // Associated courses mapping (Requirement 3)
                  const mappedCourses = courses.filter(c => c.modules?.some(m => m.id === item.id));

                  // Evaluation calculations
                  const totalAttempts = attempts.filter(att => att.assessment_id === item.id && att.status !== 'In Progress');
                  const gradedAttempts = totalAttempts.filter(att => att.status === 'Graded');
                  const isFullyGraded = totalAttempts.length > 0 && gradedAttempts.length === totalAttempts.length;

                  // Manual open-ended backlog check
                  const hasOpenEnded = data.questions?.some(q => q.type === 'open_ended');
                  const openEndedAwaiting = hasOpenEnded 
                    ? totalAttempts.length - gradedAttempts.length 
                    : 0;

                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => {
                        setDrillDownId(item.id);
                        setActiveWorkflow('grading'); // Default view is evaluation
                      }}
                      className="group bg-white border border-gray-100 hover:border-guesty-nature rounded-[28px] p-6 shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer relative flex flex-col justify-between whitespace-normal text-left overflow-hidden min-h-[300px]"
                    >
                      <div>
                        {/* Upper row badge type */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className={cn(
                            "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full",
                            data.subType === 'Survey' 
                              ? "bg-amber-100 text-amber-700 border border-amber-200" 
                              : "bg-guesty-ice text-guesty-nature border border-guesty-nature/10"
                          )}>
                            {data.subType || 'Quiz'}
                          </span>
                          
                          {mappedCourses.length > 0 ? (
                            <span 
                              className="text-[10px] font-bold text-gray-405 truncate max-w-[180px] flex items-center gap-1.5 hover:text-guesty-nature"
                              title={mappedCourses.map(c => c.title).join(", ")}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Active in: {mappedCourses.map(c => c.title).join(", ")}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 italic">
                              Unmapped
                            </span>
                          )}
                        </div>

                        {/* Title & metadata */}
                        <h3 className="text-xl font-serif italic text-gray-900 group-hover:text-guesty-nature transition-colors truncate">
                          {data.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-2 font-medium">
                          {data.description || "Interactive evaluation for Course roster."}
                        </p>

                        {/* Current grading workload */}
                        <div className="mt-5 space-y-2.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                          <div className="flex items-center justify-between text-xs font-bold text-gray-650">
                            <span>Evaluated roster progress:</span>
                            <span className="font-black text-gray-950">
                              {gradedAttempts.length}/{totalAttempts.length} graded
                            </span>
                          </div>
                          
                          {totalAttempts.length > 0 && (
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-guesty-nature h-full transition-all duration-300"
                                style={{ width: `${(gradedAttempts.length / totalAttempts.length) * 100}%` }}
                              />
                            </div>
                          )}

                          {openEndedAwaiting > 0 && (
                            <div className="text-[10px] text-red-650 font-black uppercase tracking-wider flex items-center gap-1.5 pt-1">
                              <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                              <span>{openEndedAwaiting} open-ended submissions awaiting evaluation</span>
                            </div>
                          )}
                          
                          {openEndedAwaiting === 0 && totalAttempts.length > 0 && (
                            <div className="text-[10px] text-green-700 font-black uppercase tracking-wider flex items-center gap-1.5 pt-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-guesty-nature" />
                              <span>All evaluations published</span>
                            </div>
                          )}

                          {totalAttempts.length === 0 && (
                            <div className="text-[10px] text-gray-400 font-medium italic tracking-wider py-0.5 text-center">
                              No submissions yet
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer card controls */}
                      <div className="border-t border-gray-50 pt-4 mt-6 flex items-center justify-between select-none">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-guesty-nature transition-all flex items-center gap-1">
                          Open Workspaces <ChevronRight className="w-3.5 h-3.5" />
                        </span>

                        {openEndedAwaiting > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBulkPublishAssessment(item.id);
                            }}
                            className="bg-guesty-nature hover:bg-opacity-95 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                            title="Publish all drafted score feedback changes for this exam instantly to students"
                          >
                            <Send className="w-3 h-3" />
                            Bulk Sync
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Detailed Drill-Down Top Navigation */}
            <div className="bg-white p-6 border border-gray-100 rounded-[32px] shadow-sm flex flex-col justify-between gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setDrillDownId(null)}
                    className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-xl transition-all shadow-sm shrink-0"
                    title="Back to Assessments Main Grid"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Assessment Drill-Down Flow
                      </span>
                      <span className="px-2 py-0.5 bg-guesty-ice text-guesty-nature border border-guesty-nature/10 text-[8px] font-black uppercase tracking-widest rounded animate-pulse">
                        {selectedAssessmentData?.subType || 'Quiz'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif italic text-gray-900 truncate mt-1">
                      {selectedAssessmentData?.title || 'Unknown Assessment'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto select-none">
                  {attempts.filter(att => att.assessment_id === drillDownId && att.status !== 'In Progress').length > 0 && (
                    <button
                      onClick={() => handleBulkPublishAssessment(drillDownId!)}
                      className="px-5 py-3 bg-guesty-nature hover:bg-opacity-95 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                      title="Sync and release evaluations to courses instantly"
                    >
                      <Send className="w-4 h-4" />
                      Publish All Pending Feedback & Grades
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-nav toggle workflow rows */}
              <div className="flex flex-wrap items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 select-none max-w-max">
                <button
                  onClick={() => setActiveWorkflow('grading')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                    activeWorkflow === 'grading' 
                      ? "bg-white text-guesty-nature shadow-sm" 
                      : "text-gray-400 hover:text-gray-700"
                  )}
                >
                  <Inbox className="w-4 h-4" />
                  Grading Workspace
                </button>

                <button
                  onClick={() => setActiveWorkflow('edit')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                    activeWorkflow === 'edit' 
                      ? "bg-white text-guesty-nature shadow-sm" 
                      : "text-gray-400 hover:text-gray-700"
                  )}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit & Structure Mode
                </button>

                <button
                  onClick={() => setActiveWorkflow('analytics')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                    activeWorkflow === 'analytics' 
                      ? "bg-white text-guesty-nature shadow-sm" 
                      : "text-gray-400 hover:text-gray-700"
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  Data Insights
                </button>
              </div>
            </div>

            {/* Render workspace matching selection */}
            <div className="space-y-6">
              {activeWorkflow === 'edit' && selectedAssessmentData && (
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                  <AssessmentBuilder
                    initialData={selectedAssessmentData}
                    onSave={handleSaveFromBuilder}
                    onCancel={() => setDrillDownId(null)}
                  />
                </div>
              )}

              {activeWorkflow === 'analytics' && selectedAssessmentData && (
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                  <AssessmentAnalytics
                    assessment={selectedAssessmentData}
                    attempts={attempts}
                    groups={groups}
                    courses={courses}
                    onClose={() => setDrillDownId(null)}
                    onSaveAssessmentAttempt={onUpdateAttempt}
                  />
                </div>
              )}

              {activeWorkflow === 'grading' && selectedAssessmentFile && (
                <div className="h-full bg-guesty-cream/5 rounded-[32px] overflow-hidden border border-gray-100/50 bg-white">
                  <GradingInbox
                    assessments={[selectedAssessmentFile]}
                    attempts={attempts}
                    courses={courses}
                    onUpdateAttempt={onUpdateAttempt}
                    onReleaseGrades={handleBulkPublishAssessment}
                    preSelectedAssessmentId={selectedAssessmentFile.id}
                    onBackToOverview={() => setDrillDownId(null)}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
