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

interface AssessmentAnalyticsProps {
  assessment: Assessment;
  attempts: AssessmentAttempt[];
  groups: Group[];
  courses: Course[];
  onClose: () => void;
}

export const AssessmentAnalytics: React.FC<AssessmentAnalyticsProps> = ({
  assessment,
  attempts,
  groups,
  courses,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredAttempts = useMemo(() => {
    return attempts.filter(attempt => {
      if (attempt.assessment_id !== assessment.id) return false;
      
      const matchesSearch = attempt.user_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = selectedGroupId === "all" || attempt.group_ids.includes(selectedGroupId);
      const matchesCourse = selectedCourseId === "all" || attempt.course_id === selectedCourseId;
      const matchesStatus = selectedStatus === "all" || 
        (selectedStatus === "passed" ? attempt.passed : !attempt.passed);

      return matchesSearch && matchesGroup && matchesCourse && matchesStatus;
    });
  }, [attempts, assessment.id, searchQuery, selectedGroupId, selectedCourseId, selectedStatus]);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden border border-gray-100 flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-guesty-ice/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl text-guesty-nature shadow-sm border border-guesty-nature/10">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Quiz Analytics</h2>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{assessment.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-gray-900 shadow-sm hover:shadow-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters & Stats Bar */}
        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-400 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Total Attempts</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-400 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Avg. Score</span>
              </div>
              <p className="text-3xl font-black text-guesty-nature">{stats.avgScore}%</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-400 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Pass Rate</span>
              </div>
              <p className="text-3xl font-black text-guesty-nature">{stats.passRate}%</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Passing Grade</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{assessment.passing_score}%</p>
            </div>
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
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {filteredAttempts.length === 0 ? (
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
                      className="hover:bg-gray-50/50 transition-all group"
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
                            {attempt.percentage}%
                          </p>
                          <p className="text-[9px] font-bold text-gray-400">{attempt.score}/{attempt.max_score} pts</p>
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
          <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-100 transition-all shadow-sm">
            <ExternalLink className="w-4 h-4 text-guesty-nature" />
            Export to CSV
          </button>
        </div>
      </motion.div>
    </div>
  );
};
