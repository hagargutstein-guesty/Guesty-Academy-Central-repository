import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  Users, BookOpen, GraduationCap, TrendingUp, AlertCircle, CheckCircle2, 
  Clock, Download, Filter, Search, ChevronRight, LayoutDashboard, 
  Target, Award, FileText, BarChart3, PieChart as PieChartIcon, Activity,
  Calendar, MoreVertical, Star, ThumbsUp, ThumbsDown, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Course, User, Group, AssessmentAttempt } from '../types';

interface ReportsAndAnalyticsProps {
  courses: Course[];
  users: User[];
  groups: Group[];
  attempts: AssessmentAttempt[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const ReportsAndAnalytics: React.FC<ReportsAndAnalyticsProps> = ({
  courses,
  users,
  groups,
  attempts
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'curricula' | 'manager'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);

  // --- MOCK LOGIC & DATA AGGREGATION ---
  
  const userStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'Active').length;
    const certified = 45; // Mocked
    const avgScore = 82; // Mocked
    return { total, active, certified, avgScore };
  }, [users]);

  const coursePerformanceData = useMemo(() => {
    return courses.slice(0, 6).map(c => ({
      name: c.title.substring(0, 15) + '...',
      completions: Math.floor(Math.random() * 100),
      enrollments: 100,
      dropOff: Math.floor(Math.random() * 30),
      nps: (Math.random() * 2 + 8).toFixed(1)
    }));
  }, [courses]);

  const certificationData = [
    { name: 'Active', value: 75, color: '#14645C' },
    { name: 'Expired', value: 15, color: '#E95D56' },
    { name: 'Due Soon', value: 10, color: '#F2A02C' }
  ];

  const engagementData = [
    { name: 'Mandatory', value: 65 },
    { name: 'Elective', value: 35 }
  ];

  const teamSkillGapData = [
    { subject: 'Security', A: 120, B: 110, fullMark: 150 },
    { subject: 'Privacy', A: 98, B: 130, fullMark: 150 },
    { subject: 'Leadership', A: 86, B: 130, fullMark: 150 },
    { subject: 'Soft Skills', A: 99, B: 100, fullMark: 150 },
    { subject: 'Technical', A: 85, B: 90, fullMark: 150 },
    { subject: 'Compliance', A: 65, B: 85, fullMark: 150 },
  ];

  const managers = useMemo(() => users.filter(u => u.isManager), [users]);

  // --- SUB-COMPONENTS ---

  const MetricCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-[24px] border border-guesty-beige shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl", color ? `bg-${color}/10 text-${color}` : "bg-guesty-ice/50 text-guesty-nature")}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={cn("text-xs font-bold px-2 py-1 rounded-full", trend > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-guesty-forest/60 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-guesty-black mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-guesty-cream/30 p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-guesty-night tracking-tight">Reporting & Analytics</h1>
          <p className="text-guesty-forest/60 font-medium mt-1">Deep insights into learning effectiveness, performance, and management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-guesty-beige rounded-[12px] font-bold text-guesty-forest hover:shadow-md transition-all">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-guesty-nature text-white rounded-[12px] font-bold shadow-lg shadow-guesty-nature/20 hover:scale-105 transition-all">
            <Download className="w-4 h-4" />
            Export Audit Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-guesty-beige/30 rounded-[16px] border border-guesty-beige max-w-2xl">
        <button
          onClick={() => setActiveTab('users')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-sm font-black transition-all",
            activeTab === 'users' ? "bg-white shadow-sm text-guesty-nature" : "text-guesty-forest/50 hover:text-guesty-forest"
          )}
        >
          <Users className="w-4 h-4" /> User Analytics
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-sm font-black transition-all",
            activeTab === 'content' ? "bg-white shadow-sm text-guesty-nature" : "text-guesty-forest/50 hover:text-guesty-forest"
          )}
        >
          <BookOpen className="w-4 h-4" /> Content Performance
        </button>
        <button
          onClick={() => setActiveTab('curricula')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-sm font-black transition-all",
            activeTab === 'curricula' ? "bg-white shadow-sm text-guesty-nature" : "text-guesty-forest/50 hover:text-guesty-forest"
          )}
        >
          <GraduationCap className="w-4 h-4" /> Learning Plans
        </button>
        <button
          onClick={() => setActiveTab('manager')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-sm font-black transition-all",
            activeTab === 'manager' ? "bg-white shadow-sm text-guesty-nature" : "text-guesty-forest/50 hover:text-guesty-forest"
          )}
        >
          <LayoutDashboard className="w-4 h-4" /> My Team
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'users' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Enrollments" value="1,284" icon={TrendingUp} trend={12} />
            <MetricCard title="Avg. Time (m)" value="42.5" icon={Clock} />
            <MetricCard title="Avg. Score" value="84%" icon={Target} color="nature" />
            <MetricCard title="Certifications" value="215" icon={Award} color="ocean" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-guesty-black">Individual Progress Tracking</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="pl-9 pr-4 py-2 bg-guesty-cream/50 border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-nature outline-none"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[10px] font-black text-guesty-forest/50 uppercase tracking-widest border-b border-guesty-beige">
                      <th className="p-4">Learner</th>
                      <th className="p-4">Progress</th>
                      <th className="p-4">Avg. Score</th>
                      <th className="p-4">Cert Status</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-guesty-beige">
                    {users.slice(0, 5).map(user => (
                      <tr key={user.id} className="hover:bg-guesty-cream/30 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-guesty-ice/50 flex items-center justify-center text-xs font-black text-guesty-nature">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-guesty-black">{user.name}</p>
                              <p className="text-[10px] text-guesty-forest/60">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-guesty-beige rounded-full overflow-hidden">
                              <div className="h-full bg-guesty-nature" style={{ width: '75%' }}></div>
                            </div>
                            <span className="text-xs font-black text-guesty-forest">75%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-black text-guesty-nature">92%</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-guesty-nature/10 text-guesty-nature rounded-lg text-[10px] font-black">
                            <CheckCircle2 className="w-3 h-3" /> ACTIVE
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4 text-guesty-forest" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
              <h3 className="text-xl font-black text-guesty-black mb-8">Certification Distribution</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={certificationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {certificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-4">
                {certificationData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-bold text-guesty-forest">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-guesty-black">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
              <h3 className="text-xl font-black text-guesty-black mb-8">Top Course Completion Rates</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coursePerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EBECE6" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: '900' }} />
                    <Tooltip cursor={{ fill: '#F5F5F0' }} />
                    <Bar dataKey="completions" fill="#14645C" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
              <h3 className="text-xl font-black text-guesty-black mb-1">Learner Satisfaction (NPS)</h3>
              <p className="text-sm text-guesty-forest/60 mb-8">Average score across all course surveys.</p>
              <div className="flex flex-col items-center justify-center h-[250px]">
                <div className="text-7xl font-black text-guesty-nature">8.4</div>
                <div className="flex gap-1 mt-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className={cn("w-6 h-6", i <= 4 ? "fill-guesty-nature text-guesty-nature" : "fill-guesty-beige text-guesty-beige")} />)}
                </div>
                <p className="mt-4 text-sm font-black uppercase tracking-widest text-guesty-forest/40">Highly Satisfied</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-guesty-nature/5 border border-guesty-nature/10 rounded-2xl flex items-center gap-3">
                  <ThumbsUp className="w-5 h-5 text-guesty-nature" />
                  <div>
                    <p className="text-xs font-black text-guesty-nature uppercase">Promoters</p>
                    <p className="text-lg font-black text-guesty-black">72%</p>
                  </div>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-xs font-black text-red-500 uppercase">Detractors</p>
                    <p className="text-lg font-black text-guesty-black">8%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-guesty-black">Item Analysis (Quiz Integrity)</h3>
                <p className="text-sm text-guesty-forest/60 mt-1">Identifying poorly phrased or confusing questions based on low correct-response rates.</p>
              </div>
              <button className="text-xs font-black text-guesty-nature hover:underline uppercase tracking-widest">View Full Report</button>
            </div>
            <div className="space-y-4">
              {[
                { q: "What is the primary function of the API?", rate: 24, course: "Intro to Dev", difficulty: "High" },
                { q: "How do you handle a P1 incident?", rate: 31, course: "Support 101", difficulty: "Medium" },
                { q: "Select all that apply: Security protocols", rate: 38, course: "Cybersecurity Basics", difficulty: "Medium" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-guesty-cream/30 border border-guesty-beige rounded-[24px] hover:border-guesty-nature/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-guesty-black">{item.q}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-guesty-forest/50 uppercase">{item.course}</span>
                        <span className="w-1 h-1 bg-guesty-beige rounded-full"></span>
                        <span className="text-[10px] font-black text-guesty-forest/50 uppercase">Difficulty: {item.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-red-500">{item.rate}%</p>
                    <p className="text-[10px] font-black text-guesty-forest/40 uppercase">Correct Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'curricula' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
              <h3 className="text-xl font-black text-guesty-black mb-8">Catalog Utilization</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-guesty-forest/60 mt-4 italic font-medium">Engagement with elective vs mandatory content.</p>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
              <h3 className="text-xl font-black text-guesty-black mb-8">Catalog Popularity</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={coursePerformanceData}>
                    <defs>
                      <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14645C" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#14645C" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: '900' }} />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="completions" stroke="#14645C" fillOpacity={1} fill="url(#colorCompletions)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
           </div>

           <div className="bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
            <h3 className="text-xl font-black text-guesty-black mb-8">Multi-Course Curricula Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Senior Leadership Track", users: 12, completed: 8, avgProgress: 68 },
                { name: "Technical Onboarding", users: 45, completed: 32, avgProgress: 85 },
                { name: "Safety & Compliance v2", users: 180, completed: 156, avgProgress: 94 },
                { name: "Global Sales Mastery", users: 34, completed: 12, avgProgress: 42 },
              ].map((cur, i) => (
                <div key={i} className="p-6 bg-guesty-cream/30 border border-guesty-beige rounded-[24px]">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black text-guesty-black">{cur.name}</h4>
                    <span className="text-[10px] font-black text-guesty-nature bg-guesty-nature/10 px-2 py-1 rounded-full uppercase">{cur.completed}/{cur.users} COMPLETED</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black text-guesty-forest/60 uppercase">
                      <span>Curriculum Progress</span>
                      <span>{cur.avgProgress}%</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden border border-guesty-beige">
                      <div className="h-full bg-guesty-nature" style={{ width: `${cur.avgProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
           </div>
        </div>
      )}

      {activeTab === 'manager' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-black text-guesty-black tracking-tight">My Team Dashboard</h3>
                <p className="text-sm text-guesty-forest/60 font-medium">Real-time monitoring and reporting for your direct reports.</p>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  className="px-4 py-2 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm font-bold text-guesty-forest outline-none focus:border-guesty-nature"
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                >
                  <option value="">Select Manager...</option>
                  {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <button className="p-3 bg-guesty-nature text-white rounded-[12px] hover:scale-105 transition-all shadow-lg shadow-guesty-nature/20">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-sm font-black text-guesty-forest/40 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" /> Critical Focus Areas
                </h4>
                <div className="space-y-4">
                   {[
                    { user: "Emma Watson", issue: "Compliance Overdue", since: "12 Days", status: "Critical" },
                    { user: "Daniel Craig", issue: "Skill Gap: Advanced Security", since: "Assessment Failed", status: "Warning" },
                    { user: "Rupert Grint", issue: "No Activity", since: "7 Days", status: "Low" }
                   ].map((c, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-white border border-guesty-beige rounded-[20px] shadow-sm">
                       <div className="flex items-center gap-3">
                         <div className={cn(
                           "w-1.5 h-10 rounded-full",
                           c.status === 'Critical' ? "bg-red-500" : c.status === 'Warning' ? "bg-guesty-sun" : "bg-guesty-beige"
                         )}></div>
                         <div>
                           <p className="text-sm font-black text-guesty-black">{c.user}</p>
                           <p className="text-xs text-guesty-forest/60">{c.issue}</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="text-xs font-black text-guesty-forest/40 uppercase px-2 py-0.5 bg-guesty-cream rounded-md inline-block mb-1">{c.since}</p>
                         <button className="block text-[10px] font-black text-guesty-nature hover:underline uppercase tracking-widest">Take Action</button>
                       </div>
                     </div>
                   ))}
                </div>
              </div>

              <div>
                 <h4 className="text-sm font-black text-guesty-forest/40 uppercase tracking-widest flex items-center gap-2 mb-6">
                  <Activity className="w-4 h-4 text-guesty-ocean" /> Team Competency Radar
                </h4>
                <div className="h-[300px] bg-guesty-ice/20 border border-guesty-beige rounded-[32px] p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamSkillGapData}>
                      <PolarGrid stroke="#EBECE6" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#4D5E5B', fontSize: 10, fontWeight: 900 }} />
                      <PolarRadiusAxis hide />
                      <Radar name="Target" dataKey="B" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                      <Radar name="Current" dataKey="A" stroke="#14645C" fill="#14645C" fillOpacity={0.4} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
           </div>

           <div className="bg-white rounded-[32px] border border-guesty-beige shadow-sm p-8">
              <h3 className="text-xl font-black text-guesty-black mb-8">Team Specific Audit</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[10px] font-black text-guesty-forest/50 uppercase tracking-widest border-b border-guesty-beige">
                      <th className="p-4">Direct Report</th>
                      <th className="p-4">Completed Courses</th>
                      <th className="p-4">Pending Tasks</th>
                      <th className="p-4">Last Assessment</th>
                      <th className="p-4">Performance Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-guesty-beige">
                    {users.slice(0, 4).map(report => (
                      <tr key={report.id} className="hover:bg-guesty-cream/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-guesty-ocean/10 flex items-center justify-center text-xs font-black text-guesty-ocean">
                              {report.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-bold text-guesty-black">{report.name}</span>
                          </div>
                        </td>
                        <td className="p-4 font-black">12</td>
                        <td className="p-4 font-black text-guesty-sun">3</td>
                        <td className="p-4">Yesterday</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                             <TrendingUp className="w-4 h-4 text-guesty-nature" />
                             <span className="font-black text-guesty-nature">94%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      )}

      {/* System Usage Stats (Footer-ish) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-guesty-night text-white rounded-[32px] p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-xs font-black text-white/40 uppercase tracking-widest">Peak Usage Time</p>
              <p className="text-2xl font-black">2:00 PM - 4:00 PM</p>
              <p className="text-xs text-guesty-nature font-bold">+15% vs Last Week</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black text-white/40 uppercase tracking-widest">Active Sessions</p>
              <p className="text-2xl font-black">342</p>
              <div className="h-1.5 bg-white/10 rounded-full w-32">
                <div className="h-full bg-guesty-nature w-3/4 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black text-white/40 uppercase tracking-widest">Device Breakdown</p>
              <div className="flex flex-col gap-2 text-xs font-bold pt-1">
                <span className="flex items-center gap-2"><LayoutDashboard className="w-3 h-3 text-guesty-nature" /> 68% Desktop</span>
                <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-guesty-ocean" /> 32% Mobile</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-guesty-beige rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-guesty-nature/10 rounded-xl text-guesty-nature">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-guesty-black tracking-tight">ROI Advisor</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-guesty-cream/50 rounded-2xl border border-guesty-beige group hover:border-guesty-nature transition-all">
              <p className="text-xs font-black text-guesty-nature uppercase mb-1">Efficiency Gain</p>
              <p className="text-sm font-bold text-guesty-black">Self-paced onboarding has reduced time-to-productivity by <span className="text-guesty-nature">14%</span> this quarter.</p>
            </div>
            <div className="p-4 bg-guesty-cream/50 rounded-2xl border border-guesty-beige group hover:border-guesty-nature transition-all">
              <p className="text-xs font-black text-guesty-nature uppercase mb-1">Risk Mitigation</p>
              <p className="text-sm font-bold text-guesty-black">Compliance completion rate is at <span className="text-guesty-nature">98%</span>, avoiding potential regulatory penalties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
