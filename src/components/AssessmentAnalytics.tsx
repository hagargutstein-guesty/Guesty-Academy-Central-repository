import React, { useState, useMemo } from "react";
import { 
  Users, 
  BookOpen, 
  Filter, 
  Search, 
  X, 
  BarChart3, 
  ChevronRight,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ExternalLink,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Assessment, AssessmentAttempt, Group, Course } from "../types";
import { cn } from "../lib/utils";
import { AssessmentAttemptReview } from "./AssessmentAttemptReview";

interface AssessmentAnalyticsProps {
  assessment: Assessment;
  attempts: AssessmentAttempt[];
  groups: Group[];
  courses: Course[];
  onClose: () => void;
  onSaveAssessmentAttempt?: (attempt: AssessmentAttempt) => void;
}

export const AssessmentAnalytics: React.FC<AssessmentAnalyticsProps> = ({
  assessment,
  attempts,
  groups,
  courses,
  onClose,
  onSaveAssessmentAttempt
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const isSurvey = assessment.subType === 'Survey';

  const filteredAttempts = useMemo(() => {
    return attempts.filter(attempt => {
      if (attempt.assessment_id !== assessment.id) return false;
      
      const matchesSearch = attempt.user_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = selectedGroupId === "all" || attempt.group_ids.includes(selectedGroupId);
      const matchesCourse = selectedCourseId === "all" || attempt.course_id === selectedCourseId;
      const matchesStatus = selectedStatus === "all" || 
        (selectedStatus === "passed" ? attempt.passed : !attempt.passed);

      return matchesSearch && matchesGroup && matchesCourse && (isSurvey ? true : matchesStatus);
    });
  }, [attempts, assessment.id, searchQuery, selectedGroupId, selectedCourseId, selectedStatus, isSurvey]);

  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (filteredAttempts.length === 0) return { avgScore: 0, passRate: 0, total: 0 };
    const passed = filteredAttempts.filter(a => a.passed).length;
    const totalScore = filteredAttempts.reduce((sum, a) => sum + a.percentage, 0);
    return {
      avgScore: Math.round(totalScore / filteredAttempts.length),
      passRate: Math.round((passed / filteredAttempts.length) * 100),
      total: filteredAttempts.length
    };
  }, [filteredAttempts]);

  const selectedAttempt = attempts.find(a => a.id === selectedAttemptId);

  // Associated Courses
  const connectedCourses = useMemo(() => {
    return courses.filter(c => c.modules?.some(m => m.id === assessment.id));
  }, [courses, assessment.id]);

  const connectedCourseNames = useMemo(() => {
    return connectedCourses.map(c => c.title).join(", ") || "Direct Mode (No Mapped Courses)";
  }, [connectedCourses]);

  const totalTargetEnrollment = useMemo(() => {
    return connectedCourses.length * 15 || 15;
  }, [connectedCourses]);

  const surveyResponseRate = useMemo(() => {
    if (totalTargetEnrollment === 0) return 0;
    return Math.min(100, Math.round((filteredAttempts.length / totalTargetEnrollment) * 100));
  }, [filteredAttempts.length, totalTargetEnrollment]);

  // Course Mapping & Comparison Breakdown
  const courseAverages = useMemo(() => {
    const activeCourses = courses.filter(c => c.modules?.some(m => m.id === assessment.id));
    return activeCourses.map(course => {
      // Find attempts associated to this course and this assessment
      const courseAttempts = attempts.filter(att => 
        att.assessment_id === assessment.id && 
        att.course_id === course.id && 
        att.status !== 'In Progress'
      );
      if (courseAttempts.length === 0) {
        return { id: course.id, title: course.title, avgScore: null, count: 0 };
      }
      const sum = courseAttempts.reduce((s, a) => s + (a.percentage || 0), 0);
      return {
        id: course.id,
        title: course.title,
        avgScore: Math.round(sum / courseAttempts.length),
        count: courseAttempts.length
      };
    });
  }, [assessment.id, attempts, courses]);

  // Extreme Item Success & Error analysis
  const questionPerformances = useMemo(() => {
    const completedAttempts = attempts.filter(att => att.assessment_id === assessment.id && att.status !== 'In Progress');
    if (completedAttempts.length === 0 || !assessment.questions || assessment.questions.length === 0) return [];
    
    return assessment.questions.map((question) => {
      let correctCount = 0;
      let totalResponses = 0;
      
      completedAttempts.forEach(attempt => {
        const response = attempt.responses[question.id];
        if (response === undefined) return;
        totalResponses++;
        
        const manualGradeResult = attempt.manual_grades?.[question.id];
        if (question.type === 'open_ended') {
          if (manualGradeResult) {
            const earns = manualGradeResult.score;
            const max = question.points || 1;
            if (earns / max >= 0.7) { 
              correctCount++;
            }
          }
        } else if (question.type === 'single_choice' || question.type === 'likert_scale') {
          const correctAnsId = question.answers.find(a => a.is_correct)?.id;
          if (correctAnsId && response === correctAnsId) {
            correctCount++;
          }
        } else if (question.type === 'multiple_choice') {
          const selectedIds = (response as string[]) || [];
          const correctIds = question.answers.filter(a => a.is_correct).map(a => a.id);
          const isAllCorrect = selectedIds.length === correctIds.length && selectedIds.every(id => correctIds.includes(id));
          if (isAllCorrect) {
            correctCount++;
          }
        }
      });
      
      const successRate = totalResponses > 0 ? Math.round((correctCount / totalResponses) * 100) : 100;
      return {
        questionId: question.id,
        content: question.content,
        type: question.type,
        successRate,
        errorRate: 100 - successRate,
        totalResponses
      };
    });
  }, [assessment.questions, attempts, assessment.id]);

  const hardestQuestions = useMemo(() => {
    if (questionPerformances.length === 0) return [];
    return [...questionPerformances].sort((a, b) => a.successRate - b.successRate).slice(0, 2);
  }, [questionPerformances]);

  const easiestQuestions = useMemo(() => {
    if (questionPerformances.length === 0) return [];
    const activeQ = questionPerformances.filter(q => q.totalResponses > 0);
    const source = activeQ.length > 0 ? activeQ : questionPerformances;
    return [...source].sort((a, b) => b.successRate - a.successRate).slice(0, 2);
  }, [questionPerformances]);

  // Survey item tendencies analysis (Most Common Trends)
  const surveyItemAnalysis = useMemo(() => {
    if (!isSurvey || !assessment.questions || assessment.questions.length === 0) return [];
    
    return assessment.questions.map((question) => {
      const questionResponses = attempts
        .filter(att => att.assessment_id === assessment.id && att.status !== 'In Progress')
        .map(att => att.responses[question.id]);
      
      const totalResponses = questionResponses.filter(r => r !== undefined).length;
      
      if (question.type === 'open_ended') {
        const activeTextResponses = questionResponses.filter(r => !!r);
        return {
          questionId: question.id,
          content: question.content,
          type: question.type,
          totalResponses,
          trendSummary: totalResponses > 0 ? `${activeTextResponses.length} qualitative submissions` : "No responses",
          details: totalResponses > 0 ? `Latest text answer: "${activeTextResponses[activeTextResponses.length - 1] || ''}"` : "Awaiting student submissions"
        };
      }
      
      let topAnswerContent = "N/A";
      let topCount = 0;
      let topPercentage = 0;
      
      question.answers.forEach(ans => {
        const selectedCount = questionResponses.filter(r => {
          if (Array.isArray(r)) return r.includes(ans.id);
          return r === ans.id;
        }).length;
        if (selectedCount > topCount) {
          topCount = selectedCount;
          topAnswerContent = ans.content;
        }
      });
      
      if (totalResponses > 0) {
        topPercentage = Math.round((topCount / totalResponses) * 100);
      }
      
      return {
        questionId: question.id,
        content: question.content,
        type: question.type,
        totalResponses,
        trendSummary: topCount > 0 ? `Majority (${topPercentage}%) answered "${topAnswerContent}"` : "No options selected",
        details: topCount > 0 ? `Option "${topAnswerContent}" selected ${topCount} times` : "No answer distribution"
      };
    });
  }, [assessment, attempts, isSurvey]);

  const handleExportData = () => {
    try {
      let csvContent = "";
      
      // Entity Metadata Block
      csvContent += `METADATA REPORT\n`;
      csvContent += `Entity Name,"${assessment.title.replace(/"/g, '""')}"\n`;
      csvContent += `Entity Type,"${isSurvey ? 'Survey (Non-graded)' : 'Assessment (Graded)'}"\n`;
      csvContent += `Associated Courses,"${connectedCourseNames.replace(/"/g, '""')}"\n`;
      csvContent += `Total Submissions,${stats.total}\n`;
      if (isSurvey) {
        csvContent += `Completion Rate,${surveyResponseRate}%\n`;
      } else {
        csvContent += `General Average Score,${stats.avgScore}%\n`;
        csvContent += `Passing Score Filter,${assessment.passing_score}%\n`;
      }
      csvContent += `\n`;

      // Item Level Analysis Section
      csvContent += `ITEM LEVEL ANALYSIS METRICS\n`;
      if (isSurvey) {
        csvContent += `Question ID,Question text,Question Type,Total Responses,Most Common Trend/Answer Summary,Details\n`;
        surveyItemAnalysis.forEach(item => {
          csvContent += `"${item.questionId}","${item.content.replace(/"/g, '""')}","${item.type}","${item.totalResponses}","${item.trendSummary.replace(/"/g, '""')}","${item.details.replace(/"/g, '""')}"\n`;
        });
      } else {
        csvContent += `Question ID,Question text,Question Type,Total Responses,Success Rate (%),Error Rate (%)\n`;
        questionPerformances.forEach(item => {
          csvContent += `"${item.questionId}","${item.content.replace(/"/g, '""')}","${item.type}","${item.totalResponses}","${item.successRate}%","${item.errorRate}%"\n`;
        });
      }
      csvContent += `\n`;

      // Student Response Data Metrics Section
      csvContent += `STUDENT SUBMISSION METRICS\n`;
      if (isSurvey) {
        csvContent += `Student Name,User ID,Course Context,Completion Date\n`;
        filteredAttempts.forEach(attempt => {
          const course = courses.find(c => c.id === attempt.course_id);
          const courseTitle = course ? course.title : "Direct Attempt";
          csvContent += `"${attempt.user_name}","${attempt.user_id}","${courseTitle.replace(/"/g, '""')}","${new Date(attempt.completed_at).toLocaleDateString()}"\n`;
        });
      } else {
        csvContent += `Student Name,User ID,Course Context,Draft Score (%),Passed Status,Completion Date\n`;
        filteredAttempts.forEach(attempt => {
          const course = courses.find(c => c.id === attempt.course_id);
          const courseTitle = course ? course.title : "Direct Attempt";
          csvContent += `"${attempt.user_name}","${attempt.user_id}","${courseTitle.replace(/"/g, '""')}",${attempt.percentage}%,${attempt.passed ? 'PASSED' : 'FAILED'},"${new Date(attempt.completed_at).toLocaleDateString()}"\n`;
        });
      }

      // Download URI handler
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      const sanitizedTitle = (assessment.title || "Export").toLowerCase().replace(/[^a-z0-9]/g, "_");
      link.setAttribute("download", `${sanitizedTitle}_analytics_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-black/60 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="bg-white shadow-2xl w-full h-full overflow-hidden flex flex-col"
      >
        <AnimatePresence>
          {selectedAttempt && (
            <AssessmentAttemptReview 
              attempt={selectedAttempt}
              assessment={assessment}
              onClose={() => setSelectedAttemptId(null)}
              onUpdateScore={(updatedAttempt) => {
                // In a real app, this would call a backend
                // For now, we'll just update parent state via props if we had a callback
                // Since attempts is a prop, we assume it's refreshed from elsewhere
                setSelectedAttemptId(null);
                if (onSaveAssessmentAttempt) onSaveAssessmentAttempt(updatedAttempt);
              }}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-guesty-ice/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl text-guesty-nature shadow-sm border border-guesty-nature/10">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {isSurvey ? "Survey Responses" : "Quiz Analytics"}
              </h2>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{assessment.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-5 py-3 bg-guesty-nature hover:bg-opacity-95 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-white" />
              Export Data Report
            </button>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-gray-900 shadow-sm hover:shadow-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filters & Stats Bar */}
        <div className="p-8 bg-gray-50/50 border-b border-b-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-gray-400 mb-2">
                  <Users className="w-4 h-4 text-guesty-nature" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isSurvey ? "Total Submissions" : "Total Attempts"}
                  </span>
                </div>
                <p className="text-3xl font-black text-gray-900">{stats.total}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] font-bold text-gray-450 uppercase tracking-wide space-y-0.5">
                <div className="truncate"><span className="text-gray-400 font-semibold">Parent:</span> {assessment.title}</div>
                <div className="truncate"><span className="text-gray-400 font-semibold">Courses:</span> {connectedCourseNames}</div>
              </div>
            </div>

            {isSurvey ? (
              <>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Response Rate</span>
                    </div>
                    <p className="text-3xl font-black text-blue-600">{surveyResponseRate}%</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] font-bold text-gray-450 uppercase tracking-wide space-y-0.5">
                    <div className="truncate"><span className="text-gray-400 font-semibold">Parent:</span> {assessment.title}</div>
                    <div className="truncate"><span className="text-gray-400 font-semibold">Courses:</span> {connectedCourseNames}</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Mapped Enrollments</span>
                    </div>
                    <p className="text-3xl font-black text-purple-600">{totalTargetEnrollment} Students</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] font-bold text-gray-450 uppercase tracking-wide space-y-0.5">
                    <div className="truncate"><span className="text-gray-400 font-semibold">Parent:</span> {assessment.title}</div>
                    <div className="truncate"><span className="text-gray-400 font-semibold">Courses:</span> {connectedCourseNames}</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Active Deployments</span>
                    </div>
                    <p className="text-3xl font-black text-orange-600">{connectedCourses.length} Courses</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] font-bold text-gray-450 uppercase tracking-wide space-y-0.5">
                    <div className="truncate"><span className="text-gray-400 font-semibold">Parent:</span> {assessment.title}</div>
                    <div className="truncate"><span className="text-gray-400 font-semibold">Courses:</span> {connectedCourseNames}</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <FileText className="w-4 h-4 text-guesty-nature" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Avg. Score</span>
                    </div>
                    <p className="text-3xl font-black text-guesty-nature">{stats.avgScore}/100</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] font-bold text-gray-450 uppercase tracking-wide space-y-0.5">
                    <div className="truncate"><span className="text-gray-400 font-semibold">Parent:</span> {assessment.title}</div>
                    <div className="truncate"><span className="text-gray-400 font-semibold">Courses:</span> {connectedCourseNames}</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-guesty-nature" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Pass Rate</span>
                    </div>
                    <p className="text-3xl font-black text-guesty-nature">{stats.passRate}%</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] font-bold text-gray-450 uppercase tracking-wide space-y-0.5">
                    <div className="truncate"><span className="text-gray-400 font-semibold">Parent:</span> {assessment.title}</div>
                    <div className="truncate"><span className="text-gray-400 font-semibold">Courses:</span> {connectedCourseNames}</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Passing Grade</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{assessment.passing_score}/100</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] font-bold text-gray-450 uppercase tracking-wide space-y-0.5">
                    <div className="truncate"><span className="text-gray-400 font-semibold">Parent:</span> {assessment.title}</div>
                    <div className="truncate"><span className="text-gray-400 font-semibold">Courses:</span> {connectedCourseNames}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-4">
            <div className="flex-1 min-w-[300px] relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-guesty-nature" />
              <input 
                type="text"
                placeholder="Search learners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-guesty-nature/5 focus:border-guesty-nature transition-all font-bold text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl">
                <Users className="w-4 h-4 text-gray-400" />
                <select 
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest cursor-pointer"
                >
                  <option value="all">All Groups</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <select 
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest cursor-pointer"
                >
                  <option value="all">All Courses</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              {!isSurvey && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Area or Survey Summary */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Data Insights & Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 bg-guesty-cream/10 p-6 rounded-[32px] border border-gray-150">
            {/* General Average & Course-Specific Averages Column */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Core General Metrics</span>
                  <h3 className="text-lg font-serif italic text-gray-900 mt-1">
                    {isSurvey ? "Participation & Completion" : "General Assessment Averages"}
                  </h3>
                </div>

                {/* General Ring/Progress */}
                <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    {/* Decorative circle */}
                    <div className="absolute inset-0 rounded-full border-4 border-gray-150" />
                    <div className="absolute inset-0 rounded-full border-4 border-guesty-nature border-t-transparent animate-[spin_5s_linear_infinite]" />
                    <p className="text-sm font-black text-gray-900">
                      {isSurvey ? `${surveyResponseRate}%` : `${stats.avgScore}/100`}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-800 uppercase">
                      {isSurvey ? "Overall Completion Rate" : "Overall Mean Score"}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {isSurvey 
                        ? "Percentage of targeted course learners who submitted responses." 
                        : "Calculated across all participating learner submissions."}
                    </p>
                  </div>
                </div>

                {/* Course-Specific list */}
                <div className="space-y-4">
                  <span className="text-[9px] font-black text-gray-450 uppercase tracking-wider block">
                    {isSurvey ? "Course Enrollment Capture" : "Course Comparison Breakdown"}
                  </span>
                  {courseAverages.length === 0 ? (
                    <p className="text-xs text-gray-405 italic">This item is not yet actively mapped to courses.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {courseAverages.map(course => {
                        const scoreRatio = isSurvey 
                          ? Math.min(100, Math.round((course.count / 15) * 100))
                          : (course.avgScore ?? 0);
                        return (
                          <div key={course.id} className="space-y-1">
                            <div className="flex justify-between items-center text-xs text-gray-700">
                              <span className="font-bold truncate max-w-[180px]" title={course.title}>{course.title}</span>
                              <span className="font-black text-guesty-nature">
                                {isSurvey 
                                  ? `${scoreRatio}% Rate` 
                                  : (course.avgScore !== null ? `${course.avgScore}/100` : 'No attempts')}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-105 rounded-full overflow-hidden">
                              <div 
                                className="bg-guesty-nature h-full rounded-full transition-all duration-500"
                                style={{ width: `${scoreRatio}%` }}
                              />
                            </div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{course.count} active submissions logged</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Universal Contextual Metadata Footer for General Metrics */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-[9px] text-gray-400 font-bold uppercase tracking-wide space-y-0.5">
                <div className="truncate"><span className="text-gray-300 font-semibold font-black">Parent Template:</span> {assessment.title}</div>
                <div className="truncate"><span className="text-gray-300 font-semibold font-black">Courses Connected:</span> {connectedCourseNames}</div>
              </div>
            </div>

            {/* Column 2: Hardest Questions (Quiz) OR Selection Trends (Survey) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block font-black">
                    {isSurvey ? "Survey Tendency" : "Performance Alert"}
                  </span>
                  <span className="px-2 py-0.5 bg-red-55/40 text-red-650 border border-red-100 text-[8px] font-black uppercase rounded">
                    {isSurvey ? "Top Selections" : "Hardest Questions"}
                  </span>
                </div>
                <h3 className="text-lg font-serif italic text-gray-900 mt-1">
                  {isSurvey ? "Most Common Trends" : "Extreme Error Rate Analysis"}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {isSurvey 
                    ? "Dominant answers chosen by learners. Helpful for analyzing core qualitative consensus." 
                    : "Highest error rate index. We suggest reviewing or updating explanations for these subjects."}
                </p>
                
                <div className="mt-5 space-y-4">
                  {isSurvey ? (
                    surveyItemAnalysis.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-6">No surveys found</p>
                    ) : (
                      surveyItemAnalysis.slice(0, 2).map((item) => (
                        <div key={item.questionId} className="p-3.5 bg-guesty-ice/20 border border-guesty-nature/10 rounded-xl space-y-1.5">
                          <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">
                            {item.content}
                          </p>
                          <p className="text-xs font-black text-guesty-nature">
                            {item.trendSummary}
                          </p>
                          {/* Universal Contextual Metadata */}
                          <div className="pt-2 border-t border-gray-100 text-[8px] text-gray-400 font-bold uppercase tracking-wider space-y-0.5">
                            <div className="truncate"><span className="text-gray-300 font-medium">Question Text:</span> "{item.content}"</div>
                            <div className="truncate"><span className="text-gray-300 font-medium">Parent Survey:</span> {assessment.title}</div>
                            <div className="truncate"><span className="text-gray-300 font-medium">Courses mapped:</span> {connectedCourseNames}</div>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    hardestQuestions.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-6">Insufficient data for analysis</p>
                    ) : (
                      hardestQuestions.map((q) => (
                        <div key={q.questionId} className="p-3.5 bg-red-50/40 border border-red-100/60 rounded-xl space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">
                              {q.content}
                            </p>
                            <span className="text-xs font-black text-red-650 shrink-0 bg-white px-1.5 py-0.5 rounded border border-red-200">
                              {q.errorRate}% Fail
                            </span>
                          </div>
                          <div className="w-full bg-red-105 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-red-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${q.errorRate}%` }}
                            />
                          </div>
                          {/* Universal Contextual Metadata */}
                          <div className="pt-2 border-t border-gray-100 text-[8px] text-gray-400 font-bold uppercase tracking-wider space-y-0.5">
                            <div className="truncate"><span className="text-gray-300 font-medium">Question Text:</span> "{q.content}"</div>
                            <div className="truncate"><span className="text-gray-300 font-medium">Parent quiz:</span> {assessment.title}</div>
                            <div className="truncate"><span className="text-gray-300 font-medium">Courses mapped:</span> {connectedCourseNames}</div>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Column 3: Easiest Questions (Quiz) OR Qualitative Feedbacks (Survey) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest block font-black">
                    {isSurvey ? "Qualitative Data" : "Concept Strengths"}
                  </span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[8px] font-black uppercase rounded">
                    {isSurvey ? "Qualitative Focus" : "Easiest Questions"}
                  </span>
                </div>
                <h3 className="text-lg font-serif italic text-gray-900 mt-1">
                  {isSurvey ? "Survey Quality Notes Trend" : "Extreme High-Success Analysis"}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {isSurvey 
                    ? "Detailed text notes summary. Highlighting submissions received relative to overall mapping." 
                    : "Excellent overall understanding. Retain these concepts or build more advanced variations."}
                </p>
                
                <div className="mt-5 space-y-4">
                  {isSurvey ? (
                    surveyItemAnalysis.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-6">No trends calculated</p>
                    ) : (
                      surveyItemAnalysis.slice(-2).map((item) => (
                        <div key={item.questionId} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1.5">
                          <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">
                            {item.content}
                          </p>
                          <p className="text-[11px] text-gray-550 italic">
                            {item.details}
                          </p>
                          {/* Universal Contextual Metadata */}
                          <div className="pt-2 border-t border-gray-150 text-[8px] text-gray-400 font-bold uppercase tracking-wider space-y-0.5">
                            <div className="truncate"><span className="text-gray-300 font-medium">Question Text:</span> "{item.content}"</div>
                            <div className="truncate"><span className="text-gray-300 font-medium">Parent Survey:</span> {assessment.title}</div>
                            <div className="truncate"><span className="text-gray-300 font-medium">Courses mapped:</span> {connectedCourseNames}</div>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    easiestQuestions.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-6">Insufficient data for analysis</p>
                    ) : (
                      easiestQuestions.map((q) => (
                        <div key={q.questionId} className="p-3.5 bg-green-50/40 border border-green-100/60 rounded-xl space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">
                              {q.content}
                            </p>
                            <span className="text-xs font-black text-green-705 shrink-0 bg-white px-1.5 py-0.5 rounded border border-green-200">
                              {q.successRate}% Pass
                            </span>
                          </div>
                          <div className="w-full bg-green-150/20 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-guesty-nature h-full rounded-full transition-all duration-300"
                              style={{ width: `${q.successRate}%` }}
                            />
                          </div>
                          {/* Universal Contextual Metadata */}
                          <div className="pt-2 border-t border-gray-100 text-[8px] text-gray-400 font-bold uppercase tracking-wider space-y-0.5">
                            <div className="truncate"><span className="text-gray-300 font-medium">Question Text:</span> "{q.content}"</div>
                            <div className="truncate"><span className="text-gray-300 font-medium">Parent quiz:</span> {assessment.title}</div>
                            <div className="truncate"><span className="text-gray-300 font-medium">Courses mapped:</span> {connectedCourseNames}</div>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {assessment.subType === 'Survey' ? (
            <div className="max-w-4xl mx-auto space-y-12 py-8">
              {assessment.questions.map((question, qIdx) => {
                const questionResponses = filteredAttempts.map(att => att.responses[question.id]);
                
                return (
                  <div key={question.id} className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-black text-gray-400 shrink-0">
                        {qIdx + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{question.content}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{question.type.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="ml-12">
                      {question.type === 'open_ended' ? (
                        <div className="space-y-3">
                          {questionResponses.filter(r => !!r).map((r, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-600 italic">
                              "{typeof r === 'string' ? r : (r as any)?.text}"
                            </div>
                          ))}
                          {questionResponses.filter(r => !!r).length === 0 && (
                            <p className="text-sm text-gray-400 italic">No responses yet.</p>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {question.answers.map(answer => {
                            const selectedCount = questionResponses.filter(r => {
                              if (Array.isArray(r)) return r.includes(answer.id);
                              return r === answer.id;
                            }).length;
                            const percentage = questionResponses.length > 0 ? (selectedCount / questionResponses.length) * 100 : 0;
                            
                            return (
                              <div key={answer.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-bold text-gray-700">{answer.content}</span>
                                  <span className="text-xs font-black text-gray-400 uppercase">{selectedCount} votes ({Math.round(percentage)}%)</span>
                                </div>
                                <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    className="h-full bg-guesty-ocean"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : filteredAttempts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <FileText className="w-16 h-16 mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">No matching results found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="text-left px-4 py-4">Learner</th>
                  <th className="text-left px-4 py-4">Course Context</th>
                  <th className="text-left px-4 py-4">Groups</th>
                   <th className="text-center px-4 py-4">Score</th>
                  <th className="text-center px-4 py-4">Status</th>
                  <th className="text-right px-4 py-4">Completed On</th>
                  <th className="text-right px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAttempts.sort((a,b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()).map((attempt) => {
                  const course = courses.find(c => c.id === attempt.course_id);
                  return (
                    <motion.tr 
                      key={attempt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50/50 transition-all group cursor-pointer"
                      onClick={() => setSelectedAttemptId(attempt.id)}
                    >
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-guesty-ice/50 rounded-xl flex items-center justify-center text-guesty-nature font-black">
                            {attempt.user_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-tight">{attempt.user_name}</p>
                            <p className="text-[10px] font-bold text-gray-400">ID: {attempt.user_id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-6">
                        {course ? (
                          <div className="flex items-center gap-2">
                             <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                             <span className="text-xs font-bold text-gray-600">{course.title}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 italic">Direct Attempt</span>
                        )}
                      </td>
                      <td className="px-4 py-6">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {attempt.group_ids.map(gid => {
                            const group = groups.find(g => g.id === gid);
                            return (
                              <span key={gid} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-black uppercase tracking-tighter">
                                {group?.name || gid}
                              </span>
                            );
                          })}
                          {attempt.group_ids.length === 0 && <span className="text-[9px] font-bold text-gray-300 italic">No Groups</span>}
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <div className="inline-block text-center">
                          <p className={cn(
                            "text-lg font-black",
                            attempt.passed ? "text-guesty-nature" : "text-red-500"
                          )}>
                            {attempt.score}/{attempt.max_score}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400">Total Points</p>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          attempt.passed ? "bg-guesty-nature/10 text-guesty-nature" : "bg-red-50 text-red-500"
                        )}>
                          {attempt.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {attempt.passed ? "Passed" : "Failed"}
                        </div>
                      </td>
                      <td className="px-4 py-6 text-right">
                        <div className="flex flex-col items-end">
                           <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                             <Calendar className="w-3 h-3 text-gray-400" />
                             {new Date(attempt.completed_at).toLocaleDateString()}
                           </div>
                           <div className="text-[10px] font-medium text-gray-400 mt-0.5">
                             {new Date(attempt.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </div>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAttemptId(attempt.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all text-guesty-nature font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                        >
                          Check & Score
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Info className="w-4 h-4" />
            Attempts are archived automatically after 24 months
          </div>
          <button 
            onClick={handleExportData}
            className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-150 hover:text-guesty-nature cursor-pointer transition-all shadow-sm"
          >
            <ExternalLink className="w-4 h-4 text-guesty-nature" />
            Export Data Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};
