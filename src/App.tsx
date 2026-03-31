import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, Award, Search, Bell, 
  PlayCircle, CheckCircle, Lock, Clock, ChevronRight, LayoutDashboard, 
  Compass, Home, Users, BarChart3, Settings, Plus, Edit2, Archive,
  FileVideo, FileText, HelpCircle, RefreshCw, Layers, Info, X, Check, Database,
  ArrowRight, ArrowLeft, Globe, FileArchive, UploadCloud, Package,
  Play, Pause, SkipForward, SkipBack, MonitorPlay, ListChecks, Video, ArchiveRestore, History, ChevronDown, ExternalLink, ChevronLeft,
  Shield, UserCheck, UserCog, Filter, Download, MoreVertical, Activity, GitMerge, Eye, Trash2, Mail, Key, ShieldAlert, LockKeyhole, UserPlus, ListTree, Link, Briefcase,
  Zap, CheckCircle2, Building, MapPin, Pin, Sparkles, AlertTriangle, Folder, FolderOpen
} from 'lucide-react';

// --- MOCK DATA ---
const learningPath = [
  { id: 1, title: 'Company Onboarding', status: 'completed', type: 'E-Learning', duration: '2h', score: '100%' },
  { id: 2, title: 'Data Security Basics', status: 'completed', type: 'E-Learning', duration: '1h', score: '85%' },
  { id: 3, title: 'Advanced Data Models', status: 'active', type: 'ILT / Live', duration: 'Next Session: Tomorrow', progress: 45 },
  { id: 4, title: 'Managing Data Teams', status: 'locked', type: 'E-Learning', duration: '3h' },
];

const catalog = [
  { id: 101, title: 'Leadership Foundations', category: 'Soft Skills', type: 'E-Learning', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400&h=250' },
  { id: 102, title: 'Q3 Product Update', category: 'Product', type: 'Webinar', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400&h=250' },
  { id: 103, title: 'Compliance 2026', category: 'Mandatory', type: 'Micro-learning', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=400&h=250' },
  { id: 104, title: 'Advanced Python Labs', category: 'Technical', type: 'Hands-on Lab', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400&h=250' },
];

const adminStats = [
  { label: 'Total Active Users', value: '12,450', trend: '+12%' },
  { label: 'Courses Published', value: '84', trend: '+3' },
  { label: 'Avg. Completion Rate', value: '78%', trend: '+5%' },
];

import { AssetUploader, UniversalPreviewer, EditAssetModal, FolderCascader } from './components/AssetManager';

const initialCourses = [
  { 
    id: 'c1', title: 'Company Onboarding 2026', audience: 'Internal (Data)', status: 'Under Maintenance', lastUpdated: 'Just now', enrolledGroups: ['New Hires Q1', 'Data Team'], enrolledSites: ['Guesty Internal'], 
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400&h=250',
    description: 'A comprehensive onboarding program for new hires joining the Data Team.',
    learningObjectives: ['Understand company culture', 'Learn data security basics', 'Setup development environment'],
    instructors: ['Jane Doe', 'John Smith'],
    duration: '4h', language: 'English', category: 'Mandatory', tags: ['Onboarding', 'Culture'], format: 'E-learning', difficulty: 'Beginner', isPinned: true, visibility: ['New Hires Q1', 'Data Team'],
    visibilityRule: 'Restricted',
    publicVisibility: false,
    accessRules: [
      { id: 'ar1', targetType: 'Group', targetName: 'Data Team', accessType: 'Auto-Enroll', status: 'Active' },
      { id: 'ar2', targetType: 'Group', targetName: 'Contractors', accessType: 'View Only', status: 'Expired' }
    ],
    enrollmentRule: 'Self-Enroll',
    progress: 75,
    enrollmentType: 'Auto',
    enrollmentRequested: false,
    modules: [
      { id: 'm1', title: 'Welcome to Guesty', type: 'Video', version: 'v1.0' },
      { id: 'a1', title: 'Data Security Basics', type: 'SCORM', version: 'v1.0' },
      { id: 'a3', title: 'Company Handbook 2026', type: 'PDF', version: 'v1.0' },
      { id: 'm2', title: 'Advanced Data Models', type: 'Video', version: 'v1.0' },
      { id: 'm3', title: 'IT Setup Checklist', type: 'Checklist', version: 'v1.0' },
      { id: 'm4', title: 'Live Q&A Session', type: 'ILT', version: 'v1.0' },
    ]
  },
  { 
    id: 'c2', title: 'Advanced Data Models', audience: 'Internal (Data)', status: 'Published', lastUpdated: '2 days ago', enrolledGroups: ['Data Team'], enrolledSites: ['Guesty Internal'], 
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400&h=250',
    description: 'Deep dive into advanced data modeling techniques and best practices.',
    learningObjectives: ['Master dimensional modeling', 'Optimize query performance', 'Design scalable data warehouses'],
    instructors: ['Alice Johnson'],
    duration: '6h', language: 'English', category: 'Technical', tags: ['Data', 'Engineering'], format: 'SCORM', difficulty: 'Advanced', isPinned: false, visibility: ['Data Team', 'Engineering'],
    visibilityRule: 'Restricted',
    publicVisibility: true,
    accessRules: [
      { id: 'ar3', targetType: 'Group', targetName: 'Engineering', accessType: 'Open', status: 'Active' },
      { id: 'ar4', targetType: 'Role', targetName: 'Data Analyst', accessType: 'Manual Request', status: 'Active' }
    ],
    enrollmentRule: 'View Only',
    progress: 0,
    enrollmentType: 'Manual',
    enrollmentRequested: false,
    modules: [
      { id: 'm5', title: 'Dimensional Modeling Deep Dive', type: 'SCORM', version: 'v1.0' },
      { id: 'a2', title: 'Python Fundamentals', type: 'SCORM', version: 'v2.1' },
      { id: 'm6', title: 'Query Optimization Techniques', type: 'Video', version: 'v1.0' },
      { id: 'm7', title: 'Data Warehouse Design Patterns', type: 'SCORM', version: 'v1.0' },
    ] 
  },
  { 
    id: 'c3', title: 'Partner Onboarding V2', audience: 'External (Partners)', status: 'Under Maintenance', lastUpdated: '4 hours ago', enrolledGroups: ['All Partners'], enrolledSites: ['Guesty External'], 
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400&h=250',
    description: 'Onboarding for new partners joining the Guesty ecosystem.',
    learningObjectives: ['Understand partner portal', 'Learn API basics', 'Support procedures'],
    instructors: ['Partner Success Team'],
    duration: '2h', language: 'English', category: 'Soft Skills', tags: ['Partners', 'Onboarding'], format: 'Video', difficulty: 'Intermediate', isPinned: false, visibility: ['All Partners'],
    visibilityRule: 'Public',
    enrollmentRule: 'Self-Enroll',
    progress: 0,
    enrollmentType: 'Auto',
    enrollmentRequested: false,
    modules: [
      { id: 'm8', title: 'Introduction to the Partner Portal', type: 'Video', version: 'v1.0' },
      { id: 'm9', title: 'API Integration Basics', type: 'Video', version: 'v1.0' },
      { id: 'm10', title: 'Support and Escalation Procedures', type: 'Checklist', version: 'v1.0' },
    ] 
  },
  { 
    id: 'c4', title: 'Compliance 2026', audience: 'Internal (All)', status: 'Published', lastUpdated: '1 week ago', enrolledGroups: ['All Employees'], enrolledSites: ['Guesty Internal'], 
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=400&h=250',
    description: 'Annual compliance training for all employees.',
    learningObjectives: ['Review code of conduct', 'Understand data privacy policies', 'Workplace safety'],
    instructors: ['HR Department'],
    duration: '1h', language: 'English', category: 'Compliance', tags: ['Mandatory', 'HR'], format: 'Assessment', difficulty: 'Beginner', isPinned: true, visibility: ['All Employees'],
    visibilityRule: 'Public',
    enrollmentRule: 'Self-Enroll',
    progress: 100,
    enrollmentType: 'Auto',
    enrollmentRequested: false,
    modules: [
      { id: 'm11', title: 'Code of Conduct Review', type: 'SCORM', version: 'v1.0' },
      { id: 'a1', title: 'Data Security Basics', type: 'Video', version: 'v2.0' },
      { id: 'a3', title: 'Company Handbook 2026', type: 'PDF', version: 'v1.0' },
      { id: 'm12', title: 'Data Privacy and GDPR', type: 'Video', version: 'v1.0' },
      { id: 'm13', title: 'Workplace Safety Guidelines', type: 'SCORM', version: 'v1.0' },
      { id: 'm14', title: 'Final Assessment', type: 'Assessment', version: 'v1.0' },
    ] 
  },
  { 
    id: 'c5', title: 'Leadership Foundations', audience: 'Internal (Management)', status: 'Published', lastUpdated: '2 weeks ago', enrolledGroups: ['Leadership Track'], enrolledSites: ['Guesty Internal'], 
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400&h=250',
    description: 'Essential leadership skills for new and aspiring managers.',
    learningObjectives: ['Effective communication', 'Conflict resolution', 'Team building'],
    instructors: ['Sarah Smith'],
    duration: '8h', language: 'English', category: 'Soft Skills', tags: ['Leadership', 'Management'], format: 'E-learning', difficulty: 'Intermediate', isPinned: false, visibility: ['All Employees'],
    visibilityRule: 'Restricted',
    enrollmentRule: 'View Only',
    progress: 0,
    enrollmentType: 'Manual',
    enrollmentRequested: false,
    modules: [
      { id: 'm15', title: 'Communication Strategies', type: 'Video', version: 'v1.0' },
      { id: 'a3', title: 'Company Handbook 2026', type: 'PDF', version: 'v1.0' },
      { id: 'm16', title: 'Handling Difficult Conversations', type: 'SCORM', version: 'v1.0' },
    ] 
  },
];

export interface Folder {
  id: string;
  tenant_id: string;
  parent_id: string | null;
  name: string;
  slug: string;
}

const initialFolders: Folder[] = [
  { id: 'f1', tenant_id: 't1', parent_id: null, name: 'CEd', slug: 'ced' },
  { id: 'f2', tenant_id: 't1', parent_id: null, name: 'Deprecated', slug: 'deprecated' },
  { id: 'f3', tenant_id: 't1', parent_id: null, name: 'External', slug: 'external' },
  { id: 'f4', tenant_id: 't1', parent_id: null, name: 'Internal', slug: 'internal' },
  { id: 'f5', tenant_id: 't1', parent_id: null, name: 'Testing', slug: 'testing' },
];

const initialRepository = [
  { id: 'a1', title: 'Data Security Basics', type: 'Video', version: 'v2.0', usedIn: 2, views: 1250, completionRate: '92%', status: 'Active', history: ['v2.0 (Mar 2026)', 'v1.0 (Oct 2025)'], uploadedBy: 'Admin User', uploadedAt: '2026-03-20', fileName: 'data_security_v2.mp4', tags: ['Security', 'Compliance'], folderId: 'f4_1' },
  { id: 'a2', title: 'Python Fundamentals', type: 'SCORM', version: 'v2.1', usedIn: 1, views: 840, completionRate: '78%', status: 'Active', history: ['v2.1 (Jan 2026)', 'v2.0 (Dec 2025)'], uploadedBy: 'John Doe', uploadedAt: '2026-01-15', fileName: 'python_fundamentals.zip', tags: ['Engineering', 'Python'], folderId: 'f4_2' },
  { id: 'a3', title: 'Company Handbook 2026', type: 'PDF', version: 'v1.0', usedIn: 3, views: 3200, completionRate: '100%', status: 'Active', history: ['v1.0 (Jan 2026)'], uploadedBy: 'HR Team', uploadedAt: '2026-01-05', fileName: 'handbook_2026.pdf', tags: ['HR', 'Onboarding'], folderId: 'f4_3' },
  { id: 'a4', title: 'Old Compliance 2024', type: 'SCORM', version: 'v1.0', usedIn: 0, views: 4500, completionRate: '99%', status: 'Archived', history: ['v1.0 (Jan 2024)'], uploadedBy: 'Admin User', uploadedAt: '2024-01-10', fileName: 'compliance_2024.zip', tags: ['Compliance', 'Archived'], folderId: 'f2' },
];

interface RuleCondition {
  id: string;
  attribute: string;
  operator: string;
  value: string;
}

const initialUsers = [
  { id: 'u1', name: 'Adi Cohen', email: 'adi.c@guesty.com', role: 'Admin', jobTitle: 'System Administrator', domain: 'Internal', site: 'Tel Aviv', department: 'Engineering', isManager: true, startDate: '2020-01-15', employmentType: 'Full-time', createdAt: '2020-01-15', groups: ['New Hires Q1', 'Data Team'], status: 'Active', lastLogin: '2 mins ago' },
  { id: 'u2', name: 'John Doe', email: 'john.d@partner.com', role: 'Learner', jobTitle: 'Partner Agent', domain: 'External', site: 'North America', department: 'Agency Partners', isManager: false, startDate: '2022-05-10', employmentType: 'Partner', createdAt: '2022-05-10', groups: ['All Partners'], status: 'Active', lastLogin: '1 day ago' },
  { id: 'u3', name: 'Sarah Smith', email: 'sarah.s@guesty.com', role: 'Manager', jobTitle: 'Sales Director', domain: 'Internal', site: 'New York', department: 'Sales', isManager: true, startDate: '2019-11-01', employmentType: 'Full-time', createdAt: '2019-11-01', groups: ['Leadership Track'], status: 'Inactive', lastLogin: '2 weeks ago' },
  { id: 'u4', name: 'Mike Johnson', email: 'mike.j@guesty.com', role: 'Instructor', jobTitle: 'CS Enablement Lead', domain: 'Internal', site: 'London', department: 'Customer Success', isManager: false, startDate: '2021-03-20', employmentType: 'Full-time', createdAt: '2021-03-20', groups: [], status: 'Active', lastLogin: '5 hours ago' },
  { id: 'u5', name: 'Emma Wilson', email: 'emma.w@guesty.com', role: 'Power User', jobTitle: 'Marketing Manager', powerProfileIds: ['prof1', 'prof2'], domain: 'Internal', site: 'Sydney', department: 'Marketing', isManager: true, startDate: '2023-08-15', employmentType: 'Contractor', createdAt: '2023-08-15', groups: ['Sales Mastery 2026'], status: 'Active', lastLogin: '1 hour ago' },
];

const initialGroups = [
  { id: 'g1', name: 'New Hires Q1', description: 'Onboarding group for Q1 2026', tags: ['Onboarding', 'Q1'], activeRules: 2 },
  { id: 'g2', name: 'Data Team', description: 'Data Engineering and Analytics', tags: ['Engineering', 'Data'], activeRules: 1 },
  { id: 'g3', name: 'Leadership Track', description: 'High-potential management candidates', tags: ['Management', 'Leadership'], activeRules: 3 },
  { id: 'g4', name: 'All Partners', description: 'External agency partners', tags: ['Partners', 'External'], activeRules: 0 },
  { id: 'g5', name: 'Sales Mastery 2026', description: 'Advanced sales training cohort', tags: ['Sales', 'Training'], activeRules: 1 },
  { id: 'g6', name: 'CS Enablement', description: 'Customer Success training', tags: ['CS', 'Enablement'], activeRules: 2 },
  { id: 'g7', name: 'Marketing All', description: 'Global marketing team', tags: ['Marketing', 'Global'], activeRules: 0 },
];

const initialAutomations = [
  { id: 'a1', groupId: 'g1', name: 'Onboarding Sync', triggerType: 'Time-Based', triggerCondition: '0 Days after Enrollment Date', actionType: 'Auto-Enrollment', actionTarget: 'Company Onboarding', status: 'Active', affectedUsers: 142 },
  { id: 'a2', groupId: 'g1', name: 'Security Basics Delay', triggerType: 'Time-Based', triggerCondition: '7 Days after Start Date', actionType: 'Auto-Enrollment', actionTarget: 'Data Security Basics', status: 'Active', affectedUsers: 89 },
  { id: 'a3', groupId: 'g2', name: 'Data Team Welcome', triggerType: 'Time-Based', triggerCondition: '0 Days after Enrollment Date', actionType: 'Send Notification', actionTarget: 'Welcome to Data Team Email', status: 'Active', affectedUsers: 45 },
  { id: 'a4', groupId: 'g3', name: 'Leadership Completion', triggerType: 'Course Completion', triggerCondition: 'Leadership 101', actionType: 'Group Transition', actionTarget: 'Move to Advanced Leadership', status: 'Paused', affectedUsers: 0 },
  { id: 'a5', groupId: 'g1', name: 'Graduate to Data Team', triggerType: 'Time-Based', triggerCondition: '30 Days after Start Date', actionType: 'Group Transition', actionTarget: 'Move to Group Data Team', status: 'Active', affectedUsers: 12 },
];

const availableGroups = [
  { name: 'New Hires Q1', tags: ['Onboarding', 'Q1'] },
  { name: 'Data Team', tags: ['Engineering', 'Data'] },
  { name: 'Leadership Track', tags: ['Management', 'Leadership'] },
  { name: 'All Partners', tags: ['Partners', 'External'] },
  { name: 'Sales Mastery 2026', tags: ['Sales', 'Training'] },
  { name: 'CS Enablement', tags: ['CS', 'Enablement'] },
  { name: 'Marketing All', tags: ['Marketing', 'Global'] },
];

const initialPowerUserProfiles = [
  {
    id: 'prof1',
    name: 'Content Creator',
    description: 'Can manage courses and content repository.',
    permissions: [
      { id: 'p1', category: 'Course Management', name: 'Create & Edit Courses', description: 'Can create new courses and edit existing ones within their domain.', enabled: true },
      { id: 'p2', category: 'Course Management', name: 'Publish Courses', description: 'Can publish courses to the live catalog.', enabled: false },
      { id: 'p3', category: 'Course Management', name: 'Manage Content Repository', description: 'Can upload and manage SCORM, Video, and PDF assets.', enabled: true },
      { id: 'p4', category: 'User Management', name: 'Add/Edit Users', description: 'Can create or edit users within their assigned site/department.', enabled: false },
      { id: 'p5', category: 'User Management', name: 'Deactivate Users', description: 'Can archive or deactivate users.', enabled: false },
      { id: 'p6', category: 'Reporting', name: 'View Analytics', description: 'Can view dashboards and reports for their site/department.', enabled: false },
      { id: 'p7', category: 'Reporting', name: 'Export Data', description: 'Can export reports to CSV/Excel.', enabled: false },
      { id: 'p8', category: 'System Settings', name: 'Manage Integrations', description: 'Can configure HRIS, SSO, and other integrations.', enabled: false },
    ]
  },
  {
    id: 'prof2',
    name: 'Regional Admin',
    description: 'Can manage users and view reports for their region.',
    permissions: [
      { id: 'p1', category: 'Course Management', name: 'Create & Edit Courses', description: 'Can create new courses and edit existing ones within their domain.', enabled: false },
      { id: 'p2', category: 'Course Management', name: 'Publish Courses', description: 'Can publish courses to the live catalog.', enabled: false },
      { id: 'p3', category: 'Course Management', name: 'Manage Content Repository', description: 'Can upload and manage SCORM, Video, and PDF assets.', enabled: false },
      { id: 'p4', category: 'User Management', name: 'Add/Edit Users', description: 'Can create or edit users within their assigned site/department.', enabled: true },
      { id: 'p5', category: 'User Management', name: 'Deactivate Users', description: 'Can archive or deactivate users.', enabled: true },
      { id: 'p6', category: 'Reporting', name: 'View Analytics', description: 'Can view dashboards and reports for their site/department.', enabled: true },
      { id: 'p7', category: 'Reporting', name: 'Export Data', description: 'Can export reports to CSV/Excel.', enabled: true },
      { id: 'p8', category: 'System Settings', name: 'Manage Integrations', description: 'Can configure HRIS, SSO, and other integrations.', enabled: false },
    ]
  }
];

const initialAuditLogs = [
  { id: 'l1', admin: 'Mor Damul Vardi', action: 'Bulk Deactivate', target: '3 Users', timestamp: '2026-03-10 09:15 UTC' },
  { id: 'l2', admin: 'System (HRIS)', action: 'Group Reassignment', target: 'Adi Cohen -> Engineering Lead', timestamp: '2026-03-10 08:00 UTC' },
  { id: 'l3', admin: 'Mor Damul Vardi', action: 'Impersonation Session', target: 'John Doe', timestamp: '2026-03-09 14:30 UTC' },
];

const getIconForType = (type: string) => {
  switch (type) {
    case 'Video': return <FileVideo className="w-5 h-5" />;
    case 'SCORM': return <Package className="w-5 h-5" />;
    case 'PDF': return <FileText className="w-5 h-5" />;
    case 'Assessment': return <HelpCircle className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
};

export const getOperatorsForAttribute = (attribute: string) => {
  if (['Start Date', 'Enrollment Date'].includes(attribute)) {
    return ['Before', 'After', 'Exactly on', 'Within the last X', 'Is empty'];
  }
  if (['Department', 'Site', 'Job Title', 'Employment Type'].includes(attribute)) {
    return ['Is', 'Is not', 'Is one of', 'Is empty'];
  }
  if (['Email Domain', 'Username'].includes(attribute)) {
    return ['Starts with', 'Ends with', 'Contains', 'Equals', 'Does not contain'];
  }
  return ['Equals', 'Contains', 'Starts with', 'Ends with', 'Is not'];
};

export const evaluateRule = (rule: RuleCondition, user: any) => {
  let userValue = '';
  switch (rule.attribute) {
    case 'Email Domain': userValue = user.email.split('@')[1] || ''; break;
    case 'Job Title': userValue = user.jobTitle || ''; break;
    case 'Department': userValue = user.department || ''; break;
    case 'Site': userValue = user.site || ''; break;
    case 'Employment Type': userValue = user.employmentType || ''; break;
    case 'Start Date': userValue = user.startDate || ''; break;
    case 'Enrollment Date': userValue = user.enrollmentDate || ''; break;
    default: return false; // External apps not implemented in preview yet
  }

  const ruleValue = rule.value.toLowerCase();
  const uValue = userValue.toLowerCase();

  switch (rule.operator) {
    case 'Equals': 
    case 'Is':
      return uValue === ruleValue;
    case 'Is not':
    case 'Is Not':
      return uValue !== ruleValue;
    case 'Contains': return uValue.includes(ruleValue);
    case 'Does not contain': return !uValue.includes(ruleValue);
    case 'Starts with':
    case 'Starts With':
      return uValue.startsWith(ruleValue);
    case 'Ends with':
    case 'Ends With':
      return uValue.endsWith(ruleValue);
    case 'Is empty':
      return uValue === '';
    case 'Is one of':
      try {
        const arr = JSON.parse(rule.value);
        if (Array.isArray(arr)) {
          return arr.some(v => v.toLowerCase() === uValue);
        }
      } catch (e) {
        return rule.value.split(',').map(v => v.trim().toLowerCase()).includes(uValue);
      }
      return false;
    case 'Before': return uValue !== '' && uValue < ruleValue;
    case 'After': return uValue !== '' && uValue > ruleValue;
    case 'Exactly on': return uValue === ruleValue;
    case 'Within the last X':
      if (!uValue) return false;
      const [numStr, unitStr] = rule.value.split(' ');
      const num = parseInt(numStr) || 0;
      const userDate = new Date(userValue);
      const now = new Date();
      const diffTime = now.getTime() - userDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      if (diffDays < 0) return false; // future date
      if (unitStr === 'Days') return diffDays <= num;
      if (unitStr === 'Weeks') return diffDays <= num * 7;
      if (unitStr === 'Months') return diffDays <= num * 30;
      if (unitStr === 'Years') return diffDays <= num * 365;
      return false;
    default: return false;
  }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    localStorage.setItem('guesty_auth', 'true');
    return true;
  });
  const [loginStep, setLoginStep] = useState<'audience-selection' | 'employee-login' | 'partner-login' | 'mfa' | 'forgot-password'>('audience-selection');
  const [previousLoginStep, setPreviousLoginStep] = useState<'employee-login' | 'partner-login'>('employee-login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSource, setLoginSource] = useState<'manual' | 'sso' | null>(() => localStorage.getItem('guesty_login_source') as 'manual' | 'sso' | null);
  
  const [environment, setEnvironment] = useState<'internal' | 'external' | 'admin'>(() => {
    localStorage.setItem('guesty_env', 'admin');
    return 'admin';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Helper to init state from localStorage or fallback
  const getInitialState = (key: string, fallback: any) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }
    return fallback;
  };

  // State for the Reusability / Versioning Demo
  const [courses, setCourses] = useState<any[]>(() => getInitialState('guesty_courses', initialCourses));
  const [activeCourseId, setActiveCourseId] = useState('c1');
  const [courseBuilderTab, setCourseBuilderTab] = useState<'content' | 'enrollment' | 'access'>('content');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('All Categories');
  const [catalogFormat, setCatalogFormat] = useState('All Formats');
  const [catalogDifficulty, setCatalogDifficulty] = useState('All Levels');
  const [selectedCatalogCourse, setSelectedCatalogCourse] = useState<any>(null);
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [courseWizardStep, setCourseWizardStep] = useState(1);
  const [newCourseData, setNewCourseData] = useState({
    title: '',
    description: '',
    type: 'E-learning',
    language: 'English',
    isSequential: false,
    saveAsTemplate: false,
    availability: 'Always',
    visibility: 'All Users',
    learningPlans: [] as string[],
    status: 'Under Maintenance'
  });
  
  const [folders, setFolders] = useState<Folder[]>(() => getInitialState('guesty_folders', initialFolders));
  const [repository, setRepository] = useState<any[]>(() => getInitialState('guesty_repository', initialRepository));
  const [selectedRepositoryFolderId, setSelectedRepositoryFolderId] = useState<string | null>(null);
  const [repositorySearchQuery, setRepositorySearchQuery] = useState('');
  const [repositoryFilterType, setRepositoryFilterType] = useState('All');
  const [repositoryFilterVersion, setRepositoryFilterVersion] = useState('All');
  const [repositoryFilterStatus, setRepositoryFilterStatus] = useState('All');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showLinkedCoursesModal, setShowLinkedCoursesModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [assetToArchive, setAssetToArchive] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<any>(null);
  const [selectedLinkedAsset, setSelectedLinkedAsset] = useState<any>(null);
  const [versionPushStrategy, setVersionPushStrategy] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<any>(null);
  const [showEditAssetModal, setShowEditAssetModal] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<any>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [assetToMove, setAssetToMove] = useState<any>(null);
  const [selectedMoveFolderId, setSelectedMoveFolderId] = useState<string | null>(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [createFolderParentId, setCreateFolderParentId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetType, setNewAssetType] = useState('SCORM');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');

  // SCORM Upload State
  const [showScormModal, setShowScormModal] = useState(false);
  const [scormFile, setScormFile] = useState<File | null>(null);
  const [isParsingScorm, setIsParsingScorm] = useState(false);
  const [parsedScormData, setParsedScormData] = useState<any>(null);

  // SCORM Player State
  const [isPlaying, setIsPlaying] = useState(false);

  // Groups State
  const [groups, setGroups] = useState<any[]>(() => getInitialState('guesty_groups', initialGroups));
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupTab, setGroupTab] = useState<'members' | 'courses' | 'automations'>('members');
  const [groupsSearchQuery, setGroupsSearchQuery] = useState('');
  const [groupMemberSearchQuery, setGroupMemberSearchQuery] = useState('');
  const [automations, setAutomations] = useState<any[]>(() => getInitialState('guesty_automations', initialAutomations));
  const [automationSearchQuery, setAutomationSearchQuery] = useState('');
  const [showNewAutomationModal, setShowNewAutomationModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupTags, setNewGroupTags] = useState('');
  const [newGroupType, setNewGroupType] = useState('Manual');
  const [newGroupDynamicLogic, setNewGroupDynamicLogic] = useState<'AND' | 'OR'>('AND');
  const [newGroupDynamicRules, setNewGroupDynamicRules] = useState<RuleCondition[]>([
    { id: '1', attribute: 'Email Domain', operator: 'Ends With', value: '@guesty.com' }
  ]);
  const [newGroupEmploymentType, setNewGroupEmploymentType] = useState('All');
  const [newGroupVisibility, setNewGroupVisibility] = useState('All Admins');
  const [newGroupApplyDefaultRules, setNewGroupApplyDefaultRules] = useState(false);
  const [newGroupApplyToExisting, setNewGroupApplyToExisting] = useState(false);
  const [newGroupExceptions, setNewGroupExceptions] = useState<string[]>([]);
  const [newGroupExceptionSearch, setNewGroupExceptionSearch] = useState('');
  const [newGroupTab, setNewGroupTab] = useState<'rules' | 'exceptions'>('rules');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [newAutomationName, setNewAutomationName] = useState('');
  const [newAutomationTriggerType, setNewAutomationTriggerType] = useState('Time-Based');
  const [newAutomationTriggerCondition, setNewAutomationTriggerCondition] = useState('');
  const [newAutomationActionType, setNewAutomationActionType] = useState('Auto-Enrollment');
  const [newAutomationActionTarget, setNewAutomationActionTarget] = useState('');
  
  // Live Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTab, setPreviewTab] = useState<'included' | 'excluded'>('included');
  const [previewSearchQuery, setPreviewSearchQuery] = useState('');
  const [selectedPreviewUser, setSelectedPreviewUser] = useState<string | null>(null);

  // Structured Automation Logic State
  const [timeBasedValue, setTimeBasedValue] = useState('30');
  const [timeBasedUnit, setTimeBasedUnit] = useState('Days');
  const [timeBasedRelation, setTimeBasedRelation] = useState('After');
  const [timeBasedReference, setTimeBasedReference] = useState('Enrollment Date');
  const [inactivityValue, setInactivityValue] = useState('30');
  const [inactivityUnit, setInactivityUnit] = useState('Days');
  const [courseCompletionCourseId, setCourseCompletionCourseId] = useState('');
  const [courseCompletionConditionType, setCourseCompletionConditionType] = useState('Completed');
  const [courseCompletionConditionValue, setCourseCompletionConditionValue] = useState('');
  const [groupMembershipTargetGroupId, setGroupMembershipTargetGroupId] = useState('');
  const [actionTargetCourseId, setActionTargetCourseId] = useState('');
  const [actionTargetGroupId, setActionTargetGroupId] = useState('');
  const [runOnExistingMembers, setRunOnExistingMembers] = useState(false);

  // Navigation State
  const [previousModule, setPreviousModule] = useState<{ tab: string, id: string | null } | null>(null);

  // User Management State
  const [users, setUsers] = useState<any[]>(() => getInitialState('guesty_users', initialUsers));
  const [powerUserProfiles, setPowerUserProfiles] = useState<any[]>(() => getInitialState('guesty_pu_profiles', initialPowerUserProfiles));
  const [auditLogs, setAuditLogs] = useState<any[]>(() => getInitialState('guesty_audit_logs', initialAuditLogs));
  const [activeProfileId, setActiveProfileId] = useState<string>('prof1');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userTab, setUserTab] = useState<'directory' | 'power_users' | 'automation' | 'audit'>('directory');
  const [impersonatingUser, setImpersonatingUser] = useState<any>(() => getInitialState('guesty_impersonating', null));
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showGroupAssignmentModal, setShowGroupAssignmentModal] = useState(false);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [tempGroupSelection, setTempGroupSelection] = useState<string[]>([]);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  
  // Access Rule Modal State
  const [showAccessRuleModal, setShowAccessRuleModal] = useState(false);
  const [accessRuleSearchQuery, setAccessRuleSearchQuery] = useState('');
  const [accessRuleType, setAccessRuleType] = useState<'Group' | 'Role' | 'Individual'>('Group');
  const [showConflictResolutionModal, setShowConflictResolutionModal] = useState(false);

  // Permissions Dashboard State
  const [permissionsViewToggle, setPermissionsViewToggle] = useState<'Course-to-Group' | 'Group-to-Course'>('Course-to-Group');
  const [permissionsSearchQuery, setPermissionsSearchQuery] = useState('');
  const [permissionsSelectedCourses, setPermissionsSelectedCourses] = useState<string[]>([]);
  const [showPermissionsBulkAssignModal, setShowPermissionsBulkAssignModal] = useState(false);
  const [permissionsBulkGroup, setPermissionsBulkGroup] = useState('');
  const [permissionsBulkAccessType, setPermissionsBulkAccessType] = useState('Auto-Enroll');

  // Bulk Assign State
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [bulkAssignSelectedUsers, setBulkAssignSelectedUsers] = useState<string[]>([]);
  const [bulkAssignSearchQuery, setBulkAssignSearchQuery] = useState('');
  const [showBulkAssignConfirmation, setShowBulkAssignConfirmation] = useState(false);

  // User Progress Modal State
  const [showUserProgressModal, setShowUserProgressModal] = useState(false);
  const [progressUserId, setProgressUserId] = useState<string | null>(null);

  useEffect(() => {
    if (actionUserId && showGroupAssignmentModal) {
      const user = users.find(u => u.id === actionUserId);
      setTempGroupSelection(user?.groups || []);
      setGroupSearchQuery('');
    }
  }, [actionUserId, showGroupAssignmentModal, users]);
  const [showAssignUsersModal, setShowAssignUsersModal] = useState(false);
  const [assignUsersSelection, setAssignUsersSelection] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // User Filtering State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserFilters, setShowUserFilters] = useState(false);
  const [userFilterRole, setUserFilterRole] = useState('All');
  const [userFilterDomain, setUserFilterDomain] = useState('All');
  const [userFilterStatus, setUserFilterStatus] = useState('All');

  // Form State for Create/Edit User
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserJobTitle, setNewUserJobTitle] = useState('');
  const [newUserRole, setNewUserRole] = useState('Learner');
  const [newUserPowerProfileIds, setNewUserPowerProfileIds] = useState<string[]>([]);
  const [newUserDomain, setNewUserDomain] = useState('All');
  const [newUserSite, setNewUserSite] = useState('North America');
  const [newUserDepartment, setNewUserDepartment] = useState('Engineering');
  const [newUserManager, setNewUserManager] = useState('');
  const [newUserIsManager, setNewUserIsManager] = useState(false);
  const [newUserStartDate, setNewUserStartDate] = useState('');
  const [newUserEmploymentType, setNewUserEmploymentType] = useState('Full-time');
  const [newUserSendEmail, setNewUserSendEmail] = useState(true);

  // Form State for Merge Users
  const [mergePrimaryUser, setMergePrimaryUser] = useState('');
  const [mergeSecondaryUser, setMergeSecondaryUser] = useState('');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('guesty_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('guesty_env', environment);
  }, [environment]);

  useEffect(() => {
    if (loginSource) {
      localStorage.setItem('guesty_login_source', loginSource);
    } else {
      localStorage.removeItem('guesty_login_source');
    }
  }, [loginSource]);

  useEffect(() => {
    if (impersonatingUser) {
      localStorage.setItem('guesty_impersonating', JSON.stringify(impersonatingUser));
    } else {
      localStorage.removeItem('guesty_impersonating');
    }
  }, [impersonatingUser]);

  useEffect(() => {
    localStorage.setItem('guesty_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('guesty_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('guesty_repository', JSON.stringify(repository));
  }, [repository]);

  useEffect(() => {
    localStorage.setItem('guesty_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('guesty_automations', JSON.stringify(automations));
  }, [automations]);

  useEffect(() => {
    localStorage.setItem('guesty_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  // Theme configuration based on Guesty Brand Guidelines
  const theme = environment === 'internal' 
    ? {
        name: 'Guesty Internal',
        navBg: 'bg-guesty-forest',
        navText: 'text-guesty-ice/70',
        navActive: 'text-white bg-guesty-nature',
        primary: 'bg-guesty-lemon',
        primaryHover: 'hover:bg-[#d5e8b0]',
        textPrimary: 'text-guesty-forest',
        accent: 'border-guesty-lemon',
        userRole: 'Employee (Data Scientist)',
        bannerBg: 'bg-guesty-forest',
        bannerShape1: 'bg-guesty-nature',
        bannerShape2: 'bg-guesty-teal',
        pathActiveBg: 'bg-guesty-lemon',
        pathActiveText: 'text-guesty-forest',
        pathCompletedBg: 'bg-guesty-nature',
        pathCompletedText: 'text-white'
      }
    : environment === 'external' 
    ? {
        name: 'Guesty Partners',
        navBg: 'bg-guesty-night',
        navText: 'text-guesty-powder/70',
        navActive: 'text-white bg-guesty-ocean',
        primary: 'bg-guesty-coral',
        primaryHover: 'hover:bg-[#e5756c]',
        textPrimary: 'text-guesty-night',
        accent: 'border-guesty-coral',
        userRole: 'External Partner',
        bannerBg: 'bg-guesty-night',
        bannerShape1: 'bg-guesty-ocean',
        bannerShape2: 'bg-guesty-powder',
        pathActiveBg: 'bg-guesty-coral',
        pathActiveText: 'text-guesty-night',
        pathCompletedBg: 'bg-guesty-ocean',
        pathCompletedText: 'text-white'
      }
    : {
        name: 'Guesty Admin',
        navBg: 'bg-guesty-black',
        navText: 'text-guesty-beige/70',
        navActive: 'text-white bg-guesty-forest',
        primary: 'bg-guesty-teal',
        primaryHover: 'hover:bg-[#7ab0b0]',
        textPrimary: 'text-guesty-black',
        accent: 'border-guesty-teal',
        userRole: 'Super Admin',
        bannerBg: 'bg-guesty-black',
        bannerShape1: 'bg-guesty-forest',
        bannerShape2: 'bg-guesty-night',
        pathActiveBg: 'bg-guesty-teal',
        pathActiveText: 'text-guesty-black',
        pathCompletedBg: 'bg-guesty-forest',
        pathCompletedText: 'text-white'
      };

  const learnerNav = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'catalog', icon: <Compass className="w-5 h-5" />, label: 'Course Catalog' },
    { id: 'certifications', icon: <Award className="w-5 h-5" />, label: 'Certifications' },
    { id: 'sessions', icon: <Calendar className="w-5 h-5" />, label: 'Live Sessions' },
  ];

  const adminNav = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'System Overview' },
    { id: 'permissions', icon: <Shield className="w-5 h-5" />, label: 'Permissions Dashboard' },
    { id: 'users', icon: <Users className="w-5 h-5" />, label: 'User Management' },
    { id: 'groups', icon: <ListTree className="w-5 h-5" />, label: 'Groups' },
    { id: 'courses', icon: <BookOpen className="w-5 h-5" />, label: 'Course Production' },
    { id: 'repository', icon: <Database className="w-5 h-5" />, label: 'Central Repository' },
    { id: 'reports', icon: <BarChart3 className="w-5 h-5" />, label: 'Reports & Data' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Platform Settings' },
  ];

  const currentNav = environment === 'admin' ? adminNav : learnerNav;

  const filteredUsers = users.filter(user => {
    const matchesSearch = userSearchQuery === '' || 
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearchQuery.toLowerCase());
    
    const matchesRole = userFilterRole === 'All' || user.role === userFilterRole;
    const matchesDomain = userFilterDomain === 'All' || user.domain === userFilterDomain;
    const matchesStatus = userFilterStatus === 'All' || user.status === userFilterStatus;
    
    return matchesSearch && matchesRole && matchesDomain && matchesStatus;
  });

  const filteredRepository = repository.filter(item => {
    const matchesFolder = !selectedRepositoryFolderId || item.folderId === selectedRepositoryFolderId;
    const matchesSearch = repositorySearchQuery === '' || 
      item.title.toLowerCase().includes(repositorySearchQuery.toLowerCase()) ||
      (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(repositorySearchQuery.toLowerCase())));
    
    const matchesType = repositoryFilterType === 'All' || item.type === repositoryFilterType;
    const matchesVersion = repositoryFilterVersion === 'All' || item.version === repositoryFilterVersion;
    const matchesStatus = repositoryFilterStatus === 'All' || item.status === repositoryFilterStatus;
    
    return matchesFolder && matchesSearch && matchesType && matchesVersion && matchesStatus;
  });

  const getFolderPath = (folderId: string | null): string => {
    if (!folderId) return 'Uncategorized';
    const path: string[] = [];
    let currentId: string | null = folderId;
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder.name);
        currentId = folder.parent_id;
      } else {
        break;
      }
    }
    return path.join(' / ');
  };

  const getFolderBreadcrumbs = (folderId: string | null): Folder[] => {
    if (!folderId) return [];
    const path: Folder[] = [];
    let currentId: string | null = folderId;
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parent_id;
      } else {
        break;
      }
    }
    return path;
  };

  const FolderTree = ({ parentId, level, selectedId, onSelect, showCreateButton = false }: { parentId: string | null, level: number, selectedId: string | null, onSelect: (id: string | null) => void, showCreateButton?: boolean }) => {
    const children = folders.filter(f => f.parent_id === parentId);
    if (children.length === 0) return null;

    return (
      <div className={`space-y-1 ${level > 0 ? 'ml-4 border-l border-guesty-beige/50 pl-2 mt-1' : ''}`}>
        {children.map(folder => {
          const isSelected = selectedId === folder.id;
          const hasChildren = folders.some(f => f.parent_id === folder.id);
          return (
            <div key={folder.id}>
              <div className={`group flex items-center justify-between px-3 py-2 rounded-[8px] text-sm transition-colors ${
                  isSelected 
                    ? 'bg-guesty-ocean/10 text-guesty-ocean font-bold' 
                    : 'text-guesty-forest/70 hover:bg-guesty-cream/50 hover:text-guesty-black'
                }`}>
                <button
                  onClick={() => onSelect(folder.id)}
                  className="flex items-center gap-2 flex-1 text-left truncate"
                >
                  <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-guesty-ocean' : 'text-guesty-forest/40'}`} />
                  <span className="truncate">{folder.name}</span>
                </button>
                {showCreateButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreateFolderParentId(folder.id);
                      setNewFolderName('');
                      setShowCreateFolderModal(true);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:text-guesty-ocean hover:bg-guesty-ocean/20 rounded-md transition-all shrink-0"
                    title="Create Subfolder"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
              <FolderTree parentId={folder.id} level={level + 1} selectedId={selectedId} onSelect={onSelect} showCreateButton={showCreateButton} />
            </div>
          );
        })}
      </div>
    );
  };

  const handleArchiveGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    if (window.confirm(`Are you sure you want to archive the group "${group.name}"? This action cannot be undone.`)) {
      setGroups(groups.filter(g => g.id !== groupId));
      
      const logEntry = {
        id: `log${Date.now()}`,
        action: 'Archived Group',
        target: group.name,
        user: 'Admin User',
        timestamp: new Date().toISOString(),
        details: 'Group permanently archived.'
      };
      setAuditLogs([logEntry, ...auditLogs]);
      setOpenDropdownId(null);
    }
  };

  const handleRunAutomations = (groupId: string) => {
    const groupAutomations = automations.filter(a => a.groupId === groupId && a.status === 'Active');
    const group = groups.find(g => g.id === groupId);
    
    if (groupAutomations.length === 0) {
      alert('No active automations found for this group.');
      return;
    }

    // Simulate running automations and generating specific logs
    const newLogs: any[] = [];
    
    groupAutomations.forEach(automation => {
      let actionType = 'Automated Action';
      if (automation.actionType === 'Group Transition') {
        actionType = 'Automated group reassignment';
      } else if (automation.actionType === 'Auto-Enrollment') {
        actionType = 'Automated Enrollment';
      }

      newLogs.push({
        id: `log${Date.now()}-${Math.random()}`,
        action: actionType,
        target: automation.actionTarget,
        user: 'System (Automation)',
        timestamp: new Date().toISOString(),
        details: `Triggered by: ${automation.name} (${automation.triggerCondition})`
      });
    });

    const manualRunLog = {
      id: `log${Date.now()}`,
      action: 'Manual Automation Run',
      target: `${group?.name} (${groupAutomations.length} rules)`,
      user: 'Admin User',
      timestamp: new Date().toISOString(),
      details: `Triggered ${groupAutomations.length} active automations for group.`
    };
    
    setAuditLogs([...newLogs, manualRunLog, ...auditLogs]);
    setOpenDropdownId(null);
    alert(`Successfully triggered ${groupAutomations.length} automations for ${group?.name}. Check logs for details.`);
  };

  const handleDuplicateAutomation = (automationId: string) => {
    const automationToDuplicate = automations.find(a => a.id === automationId);
    if (!automationToDuplicate) return;

    const newAutomation = {
      ...automationToDuplicate,
      id: `auto${Date.now()}`,
      name: `${automationToDuplicate.name} (Copy)`,
      status: 'Paused', // Duplicates should start paused
      affectedUsers: 0
    };

    setAutomations([...automations, newAutomation]);
    
    const logEntry = {
      id: `log${Date.now()}`,
      action: 'Duplicated Automation',
      target: newAutomation.name,
      user: 'Admin User',
      timestamp: new Date().toISOString(),
      details: `Duplicated from ${automationToDuplicate.name}`
    };
    setAuditLogs([logEntry, ...auditLogs]);
    setOpenDropdownId(null);
  };

  const handleViewAutomationLogs = (automationName: string) => {
    // Switch to the main User Management view if we are in Groups
    if (activeTab === 'groups') {
      setActiveTab('users');
    }
    setUserTab('audit');
    // We would ideally set a search query for the audit logs here, 
    // but we don't have a state for audit log search yet.
    // We could add one, or just let the user see the general logs.
    setOpenDropdownId(null);
  };

  const handleCreateGroup = (openAutomationModal: boolean = false) => {
    if (!newGroupName) return;

    const newGroup = {
      id: `g${Date.now()}`,
      name: newGroupName,
      description: newGroupDescription,
      tags: newGroupTags.split(',').map(t => t.trim()).filter(Boolean),
      type: newGroupType,
      dynamicLogic: newGroupType === 'Dynamic' ? newGroupDynamicLogic : undefined,
      dynamicRules: newGroupType === 'Dynamic' ? newGroupDynamicRules : undefined,
      applyToExisting: newGroupApplyToExisting,
      exceptions: newGroupExceptions,
      employmentType: newGroupEmploymentType,
      visibility: newGroupVisibility,
      activeRules: newGroupApplyDefaultRules ? 1 : 0
    };

    setGroups([...groups, newGroup]);

    const newLogs = [];
    newLogs.push({
      id: `log${Date.now()}`,
      action: 'Created Group',
      target: newGroupName,
      user: 'Admin User',
      timestamp: new Date().toISOString(),
      details: `Type: ${newGroupType}`
    });

    if (newGroupType === 'Dynamic' && newGroupApplyToExisting) {
      const enrollmentDate = new Date().toISOString();
      const updatedUsers = users.map(user => {
        if (newGroupExceptions.includes(user.id)) return user;
        
        const matchesRules = newGroupDynamicLogic === 'AND' 
          ? newGroupDynamicRules.every(rule => evaluateRule(rule, user))
          : newGroupDynamicRules.some(rule => evaluateRule(rule, user));
          
        if (matchesRules) {
          return {
            ...user,
            groups: [...(user.groups || []), newGroupName],
            enrollmentDate: enrollmentDate // Set the enrollment date for existing users
          };
        }
        return user;
      });
      setUsers(updatedUsers);
      
      newLogs.push({
        id: `log${Date.now()}_enroll`,
        action: 'Retroactive Enrollment',
        target: newGroupName,
        user: 'System',
        timestamp: enrollmentDate,
        details: `Enrolled existing users matching dynamic rules.`
      });
    }

    if (newGroupExceptions.length > 0) {
      newGroupExceptions.forEach((userId, idx) => {
        const user = users.find(u => u.id === userId);
        if (user) {
          newLogs.push({
            id: `log${Date.now()}_ex_${idx}`,
            action: 'Manual Exclusion',
            target: user.name,
            user: 'Admin User',
            timestamp: new Date().toISOString(),
            details: `Admin Admin User manually excluded ${user.name} from Group ${newGroupName} during rule creation.`
          });
        }
      });
    }

    setAuditLogs([...newLogs, ...auditLogs]);

    if (newGroupApplyDefaultRules) {
      const defaultAutomation = {
        id: `auto${Date.now()}_default`,
        groupId: newGroup.id,
        name: 'Default Auto-Enrollment',
        triggerType: 'Time-Based',
        triggerCondition: '0 Days After Enrollment Date',
        actionType: 'Auto-Enrollment',
        actionTarget: 'Enroll in Company Onboarding',
        status: 'Active',
        affectedUsers: 0
      };
      setAutomations([...automations, defaultAutomation]);
    }

    setShowCreateGroupModal(false);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupTags('');
    setNewGroupType('Manual');
    setNewGroupDynamicLogic('AND');
    setNewGroupDynamicRules([
      { id: '1', attribute: 'Email Domain', operator: 'Ends With', value: '@guesty.com' }
    ]);
    setNewGroupApplyToExisting(false);
    setNewGroupExceptions([]);
    setNewGroupExceptionSearch('');
    setNewGroupTab('rules');
    setNewGroupEmploymentType('All');
    setNewGroupVisibility('All Admins');
    setNewGroupApplyDefaultRules(false);

    if (openAutomationModal) {
      setSelectedGroupId(newGroup.id);
      setShowNewAutomationModal(true);
    }
  };

  const handleCreateAutomation = () => {
    let finalTriggerCondition = newAutomationTriggerCondition;
    let finalActionTarget = newAutomationActionTarget;

    if (newAutomationTriggerType === 'Time-Based') {
      finalTriggerCondition = `${timeBasedValue} ${timeBasedUnit} ${timeBasedRelation} ${timeBasedReference}`;
    } else if (newAutomationTriggerType === 'Course Completion') {
      const course = courses.find(c => c.id === courseCompletionCourseId);
      const courseName = course ? course.title : 'Unknown Course';
      finalTriggerCondition = `User Completes ${courseName}`;
    } else if (newAutomationTriggerType === 'Inactivity') {
      finalTriggerCondition = `User is Inactive for ${inactivityValue} ${inactivityUnit}`;
    } else if (newAutomationTriggerType === 'User Joins Group') {
      finalTriggerCondition = `0 Days After Enrollment Date`;
    }

    if (newAutomationActionType === 'Auto-Enrollment') {
      const course = courses.find(c => c.id === actionTargetCourseId);
      finalActionTarget = course ? `Enroll in ${course.title}` : 'Unknown Course';
    } else if (newAutomationActionType === 'Group Transition') {
      const group = groups.find(g => g.id === actionTargetGroupId);
      finalActionTarget = group ? `Move to Group ${group.name}` : 'Unknown Group';
    } else if (newAutomationActionType === 'Send Notification') {
      finalActionTarget = `Send Email Template: ${newAutomationActionTarget}`;
    } else if (newAutomationActionType === 'Deactivate/Archive') {
      finalActionTarget = `Deactivate/Archive User`;
    }

    if (!newAutomationName || !finalTriggerCondition || !finalActionTarget) return;
    
    // Conflict resolution check for Time-Based Group Transitions
    if (newAutomationTriggerType === 'Time-Based' && newAutomationActionType === 'Group Transition') {
      const conflictingTransition = automations.find(a => 
        a.groupId === selectedGroupId && 
        a.triggerType === 'Time-Based' && 
        a.actionType === 'Group Transition' &&
        a.triggerCondition === finalTriggerCondition &&
        a.status === 'Active'
      );

      if (conflictingTransition) {
        if (!window.confirm(`Conflict Detected: An active automation ("${conflictingTransition.name}") already moves users at "${finalTriggerCondition}". Users cannot be transitioned to multiple groups simultaneously. Are you sure you want to proceed?`)) {
          return;
        }
      }
    } else {
      // Basic conflict resolution check for other types
      const existingAutomation = automations.find(a => 
        a.groupId === selectedGroupId && 
        a.triggerType === newAutomationTriggerType && 
        a.actionType === newAutomationActionType &&
        a.status === 'Active'
      );

      if (existingAutomation) {
        if (!window.confirm(`An active automation ("${existingAutomation.name}") already exists for this group with the same trigger and action type. Are you sure you want to create another one? This might cause overlapping actions.`)) {
          return;
        }
      }
    }

    let initialAffectedUsers = 0;
    if (runOnExistingMembers) {
      const group = groups.find(g => g.id === selectedGroupId);
      if (group) {
        initialAffectedUsers = users.filter(u => u.groups?.includes(group.name)).length;
      }
    }

    const newAutomation = {
      id: `auto${Date.now()}`,
      groupId: selectedGroupId,
      name: newAutomationName,
      triggerType: newAutomationTriggerType,
      triggerCondition: finalTriggerCondition,
      actionType: newAutomationActionType,
      actionTarget: finalActionTarget,
      status: 'Active',
      affectedUsers: initialAffectedUsers
    };
    
    setAutomations([...automations, newAutomation]);
    
    // Log the creation
    let logDetails = `Trigger: ${newAutomationTriggerType}, Action: ${newAutomationActionType}${runOnExistingMembers ? ' (Applied to existing members)' : ''}`;
    if (newAutomationActionType === 'Group Transition') {
      const sourceGroup = groups.find(g => g.id === selectedGroupId);
      const targetName = finalActionTarget.replace('Move to Group ', '').replace('Move to ', '');
      logDetails = `Journey Created: User in ${sourceGroup?.name || 'Unknown'} -> ${finalTriggerCondition} -> Moves to ${targetName}`;
    }

    const logEntry = {
      id: `log${Date.now()}`,
      action: 'Created Automation',
      target: newAutomationName,
      user: 'Admin User',
      timestamp: new Date().toISOString(),
      details: logDetails
    };
    setAuditLogs([logEntry, ...auditLogs]);
    
    setShowNewAutomationModal(false);
    setNewAutomationName('');
    setNewAutomationTriggerType('Time-Based');
    setNewAutomationTriggerCondition('');
    setNewAutomationActionType('Auto-Enrollment');
    setNewAutomationActionTarget('');
    setTimeBasedValue('30');
    setTimeBasedUnit('Days');
    setTimeBasedRelation('After');
    setTimeBasedReference('Enrollment Date');
    setInactivityValue('30');
    setInactivityUnit('Days');
    setCourseCompletionCourseId('');
    setCourseCompletionConditionValue('');
    setActionTargetCourseId('');
    setActionTargetGroupId('');
    setRunOnExistingMembers(false);
  };

  const handleLogin = (env: 'internal' | 'external' | 'admin', source: 'manual' | 'sso') => {
    setIsLoading(true);
    setLoginSource(source);
    // Simulate API call and bypass MFA check
    setTimeout(() => {
      setIsLoading(false);
      // Temporarily bypass MFA and assign environment
      if (loginEmail.toLowerCase().includes('mor.damul') || loginEmail.toLowerCase().includes('admin')) {
        setEnvironment('admin');
      } else {
        setEnvironment(env);
      }
      setIsAuthenticated(true);
    }, 1500);
  };

  const handleMfaSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (loginEmail.toLowerCase().includes('mor.damul') || loginEmail.toLowerCase().includes('admin')) {
        setEnvironment('admin');
      } else {
        setEnvironment('internal');
      }
      setIsAuthenticated(true);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-guesty-cream flex font-sans text-guesty-black">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-guesty-forest relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 p-16 text-white max-w-xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-guesty-lemon rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-guesty-forest" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Guesty Academy</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">Empowering your growth journey.</h1>
            <p className="text-xl text-guesty-ice/80">Access world-class training, resources, and certifications designed for Guesty employees and partners.</p>
          </div>
        </div>

        {/* Right Side - Login Flow */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Step 1: Audience Selection */}
            {loginStep === 'audience-selection' && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-guesty-black tracking-tight">Welcome back</h2>
                  <p className="text-guesty-forest/60">Please select your login type to continue.</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setLoginStep('employee-login')}
                    className="w-full p-6 bg-white border-2 border-guesty-beige rounded-[16px] hover:border-guesty-ocean hover:shadow-md transition-all text-left group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-guesty-ocean/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-12 h-12 bg-guesty-ocean/10 rounded-full flex items-center justify-center text-guesty-ocean group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-guesty-black">Guesty Employee</h3>
                        <p className="text-sm text-guesty-forest/60">Login with your internal credentials</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-guesty-beige ml-auto group-hover:text-guesty-ocean transition-colors" />
                    </div>
                  </button>

                  <button 
                    onClick={() => setLoginStep('partner-login')}
                    className="w-full p-6 bg-white border-2 border-guesty-beige rounded-[16px] hover:border-guesty-nature hover:shadow-md transition-all text-left group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-guesty-nature/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-12 h-12 bg-guesty-nature/10 rounded-full flex items-center justify-center text-guesty-nature group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-guesty-black">Customer / Partner</h3>
                        <p className="text-sm text-guesty-forest/60">Access external training resources</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-guesty-beige ml-auto group-hover:text-guesty-nature transition-colors" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2a: Employee Login (Manual + SSO) */}
            {loginStep === 'employee-login' && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                <button onClick={() => setLoginStep('audience-selection')} className="flex items-center gap-2 text-sm font-bold text-guesty-forest/60 hover:text-guesty-black transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-guesty-black tracking-tight">Employee Login</h2>
                  <p className="text-guesty-forest/60">Sign in with your internal credentials.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin('internal', 'manual'); }} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Email / Username</label>
                    <input 
                      type="text" 
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all" 
                      placeholder="name@guesty.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Password</label>
                      <button type="button" onClick={() => { setPreviousLoginStep('employee-login'); setLoginStep('forgot-password'); }} className="text-xs font-bold text-guesty-ocean hover:underline">Forgot Password?</button>
                    </div>
                    <input 
                      type="password" 
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all" 
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoading || !loginEmail || !loginPassword}
                    className="w-full py-4 bg-guesty-ocean text-white rounded-[12px] font-bold hover:bg-guesty-ocean/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Sign In'}
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-guesty-beige"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-guesty-cream text-guesty-forest/50 font-bold">OR</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    disabled={true}
                    className="w-full py-4 px-6 bg-[#00297A]/50 text-white/50 rounded-[12px] font-bold flex items-center justify-center gap-3 cursor-not-allowed relative overflow-hidden"
                  >
                    <Shield className="w-5 h-5" />
                    Sign in with Okta
                    <span className="absolute top-0 right-0 bg-guesty-coral text-white text-[10px] font-bold px-2 py-1 rounded-bl-[8px]">Coming Soon</span>
                  </button>
                </div>
                
                <div className="p-4 bg-guesty-ice/50 rounded-[12px] border border-guesty-ocean/20 flex items-start gap-3">
                  <Info className="w-5 h-5 text-guesty-ocean shrink-0 mt-0.5" />
                  <p className="text-xs text-guesty-forest/70">
                    Access is restricted to authorized Guesty domains. IT policies require MFA for all internal access.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2b: Partner Login */}
            {loginStep === 'partner-login' && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                <button onClick={() => setLoginStep('audience-selection')} className="flex items-center gap-2 text-sm font-bold text-guesty-forest/60 hover:text-guesty-black transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-guesty-black tracking-tight">Partner Login</h2>
                  <p className="text-guesty-forest/60">Sign in to access your customized learning portal.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin('external', 'manual'); }} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-nature focus:ring-1 focus:ring-guesty-nature outline-none transition-all" 
                      placeholder="name@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Password</label>
                      <button type="button" onClick={() => { setPreviousLoginStep('partner-login'); setLoginStep('forgot-password'); }} className="text-xs font-bold text-guesty-nature hover:underline">Forgot Password?</button>
                    </div>
                    <input 
                      type="password" 
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-nature focus:ring-1 focus:ring-guesty-nature outline-none transition-all" 
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoading || !loginEmail || !loginPassword}
                    className="w-full py-4 bg-guesty-nature text-white rounded-[12px] font-bold hover:bg-guesty-nature/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Sign In'}
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-guesty-beige"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-guesty-cream text-guesty-forest/50 font-bold">OR</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleLogin('external', 'sso')}
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-white border border-guesty-beige rounded-[12px] font-bold text-guesty-black hover:bg-guesty-cream flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>
              </div>
            )}

            {/* Step 3: MFA */}
            {loginStep === 'mfa' && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                <button onClick={() => setLoginStep('employee-login')} className="flex items-center gap-2 text-sm font-bold text-guesty-forest/60 hover:text-guesty-black transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to Login
                </button>
                
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-guesty-ocean/10 rounded-full flex items-center justify-center text-guesty-ocean mb-4">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-guesty-black tracking-tight">Two-Factor Authentication</h2>
                  <p className="text-guesty-forest/60">Please enter the 6-digit code from your authenticator app.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleMfaSubmit(); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Authentication Code</label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      value={mfaCode}
                      onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-4 bg-white border border-guesty-beige rounded-[12px] text-2xl tracking-[0.5em] text-center font-mono focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all" 
                      placeholder="000000"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoading || mfaCode.length !== 6}
                    className="w-full py-4 bg-guesty-ocean text-white rounded-[12px] font-bold hover:bg-guesty-ocean/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
                  </button>
                </form>
              </div>
            )}

            {/* Step 4: Forgot Password */}
            {loginStep === 'forgot-password' && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                <button onClick={() => setLoginStep(previousLoginStep)} className="flex items-center gap-2 text-sm font-bold text-guesty-forest/60 hover:text-guesty-black transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to Login
                </button>
                
                <div className="space-y-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${previousLoginStep === 'employee-login' ? 'bg-guesty-ocean/10 text-guesty-ocean' : 'bg-guesty-nature/10 text-guesty-nature'}`}>
                    <Key className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-guesty-black tracking-tight">Reset Password</h2>
                  <p className="text-guesty-forest/60">Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    alert(`Password reset link sent to ${loginEmail}`);
                    setLoginStep(previousLoginStep);
                  }, 1000);
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className={`w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm outline-none transition-all ${previousLoginStep === 'employee-login' ? 'focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean' : 'focus:border-guesty-nature focus:ring-1 focus:ring-guesty-nature'}`} 
                      placeholder="name@company.com"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoading || !loginEmail}
                    className={`w-full py-4 text-white rounded-[12px] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${previousLoginStep === 'employee-login' ? 'bg-guesty-ocean hover:bg-guesty-ocean/90' : 'bg-guesty-nature hover:bg-guesty-nature/90'}`}
                  >
                    {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-guesty-cream flex flex-col md:flex-row font-sans text-guesty-black">
      
      {/* IMPERSONATION BANNER */}
      {impersonatingUser && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-guesty-coral text-white z-[100] flex items-center justify-center gap-4 font-bold shadow-md animate-in slide-in-from-top-4 px-6">
          <Eye className="w-5 h-5 shrink-0" />
          <span className="truncate">You are currently viewing the system as {impersonatingUser.name}. Any actions taken will be recorded as this user.</span>
          <button 
            onClick={() => {
              setImpersonatingUser(null);
              setEnvironment('admin');
              setActiveTab('users');
            }}
            className="ml-auto shrink-0 px-4 py-2 bg-white text-guesty-coral rounded-[8px] hover:bg-guesty-cream transition-colors text-sm font-bold shadow-sm"
          >
            Return to Admin Account
          </button>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`w-full md:w-64 flex-shrink-0 flex flex-col transition-colors duration-500 ${theme.navBg} z-20 ${impersonatingUser ? 'mt-14' : ''}`}>
        <div className="p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-white font-bold ${theme.primary} ${theme.textPrimary}`}>
              <Home className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              Guesty
            </span>
          </div>
          
          {/* Domain Switcher */}
          <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded-[8px] cursor-pointer hover:bg-white/20 transition-colors">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-white/70" />
              <span className="text-sm font-bold text-white truncate max-w-[120px]">{theme.name}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-white/70" />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {currentNav.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] font-medium transition-colors ${activeTab === item.id ? theme.navActive : `${theme.navText} hover:bg-white/10`}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          {/* Environment Switcher */}
          <div className="bg-white/5 rounded-[16px] p-5 border border-white/10">
            <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${theme.navText}`}>Environment</p>
            <div className="flex flex-col gap-1 bg-black/20 rounded-[8px] p-1">
              <div className="flex gap-1">
                <button 
                  onClick={() => { setEnvironment('internal'); setActiveTab('dashboard'); }}
                  className={`flex-1 text-xs py-2 rounded-[6px] font-bold transition-all ${environment === 'internal' ? 'bg-white text-guesty-black shadow-sm' : theme.navText}`}
                >
                  Internal
                </button>
                <button 
                  onClick={() => { setEnvironment('external'); setActiveTab('dashboard'); }}
                  className={`flex-1 text-xs py-2 rounded-[6px] font-bold transition-all ${environment === 'external' ? 'bg-white text-guesty-black shadow-sm' : theme.navText}`}
                >
                  External
                </button>
              </div>
              <button 
                onClick={() => { setEnvironment('admin'); setActiveTab('dashboard'); }}
                className={`w-full text-xs py-2 rounded-[6px] font-bold transition-all mt-1 ${environment === 'admin' ? 'bg-white text-guesty-black shadow-sm' : theme.navText}`}
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 flex flex-col h-screen overflow-hidden bg-guesty-cream relative z-10 ${impersonatingUser ? 'mt-14' : ''}`}>
        
        {/* TOP HEADER */}
        <header className="h-20 bg-guesty-cream border-b border-guesty-beige flex items-center justify-between px-10 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96 hidden md:block">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-guesty-forest/50" />
              <input 
                type="text" 
                placeholder="Search courses, materials, or tags..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <button className="relative text-guesty-forest hover:text-guesty-nature transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-guesty-coral rounded-full border-2 border-guesty-cream"></span>
            </button>
            <div className="h-10 w-px bg-guesty-beige"></div>
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => { if(environment !== 'admin') setActiveTab('profile'); }}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-guesty-black">{impersonatingUser ? impersonatingUser.name : 'Mor Damul Vardi'}</p>
                <div className="flex items-center justify-end gap-2">
                  <div className="flex flex-col items-end">
                    <p className="text-xs font-bold text-guesty-black">{impersonatingUser ? impersonatingUser.department : 'Operations'}</p>
                    <p className="text-[10px] text-guesty-forest/70">{impersonatingUser ? impersonatingUser.site : 'Tel Aviv'}</p>
                  </div>
                  {loginSource && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-guesty-beige/50 text-guesty-forest rounded-[4px] uppercase tracking-wider">
                      {loginSource}
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center font-display font-bold text-lg shadow-sm ${theme.primary} ${theme.textPrimary}`}>
                {impersonatingUser ? impersonatingUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'MD'}
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-10">
          
          {/* --- LEARNER DASHBOARD --- */}
          {environment !== 'admin' && activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Welcome Banner - Guesty Style */}
              <div className={`rounded-[36px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden transition-colors duration-500 ${theme.bannerBg} text-white shadow-lg`}>
                {/* Architectural Shapes Background */}
                <div className="absolute right-0 top-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className={`absolute -right-12 -top-12 w-80 h-80 rounded-full opacity-90 transition-colors duration-500 ${theme.bannerShape1}`}></div>
                  <div className={`absolute right-48 -bottom-24 w-64 h-80 rounded-t-[120px] opacity-90 transition-colors duration-500 ${theme.bannerShape2}`}></div>
                </div>
                
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-4xl md:text-5xl font-medium mb-5 tracking-tight">
                    Welcome back, <span className="font-serif italic font-normal text-guesty-ice">{impersonatingUser ? impersonatingUser.name.split(' ')[0] : 'Mor'}</span>.
                  </h2>
                  <p className="text-lg opacity-90 mb-8 font-light leading-relaxed">
                    You're making great progress. Continue your journey to master your property management skills.
                  </p>
                  <button onClick={() => setActiveTab('course-player')} className={`${theme.primary} ${theme.textPrimary} ${theme.primaryHover} px-8 py-4 rounded-[12px] font-bold transition-colors flex items-center gap-2 shadow-sm`}>
                    <PlayCircle className="w-5 h-5" /> Resume Learning
                  </button>
                </div>

                {/* Glass effect stat card */}
                <div className="relative z-10 glass-panel-dark rounded-[24px] p-8 flex items-center gap-8 min-w-[320px] shadow-xl">
                  <div>
                    <div className="font-display text-7xl font-bold tracking-tighter mb-1">45<span className="text-4xl">%</span></div>
                    <div className="text-xs font-bold opacity-80 uppercase tracking-widest">Course Progress</div>
                  </div>
                  <div className="h-20 w-px bg-white/20"></div>
                  <div>
                    <div className="text-xs font-bold opacity-80 mb-2 uppercase tracking-widest">Current Module</div>
                    <div className="font-serif italic text-2xl">Advanced Data</div>
                  </div>
                </div>
              </div>

              {/* Learning Journey Visualization */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-guesty-black flex items-center gap-3">
                    <Compass className={`w-7 h-7 ${theme.textPrimary}`} /> 
                    Your Learning Journey
                  </h3>
                  <span className="text-sm font-bold text-guesty-forest bg-guesty-ice/50 px-4 py-1.5 rounded-[8px]">Data Science Track</span>
                </div>
                
                <div className="bg-white rounded-[36px] border border-guesty-beige shadow-sm p-10">
                  <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[31px] top-10 bottom-10 w-1 bg-guesty-beige rounded-full z-0"></div>
                    <div className={`absolute left-[31px] top-10 h-[50%] w-1 rounded-full z-0 transition-colors duration-500 ${theme.pathActiveBg}`}></div>

                    <div className="space-y-10 relative z-10">
                      {learningPath.map((step, index) => (
                        <div key={step.id} className="flex gap-8 group">
                          {/* Status Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {step.status === 'completed' && (
                              <div className={`w-16 h-16 rounded-[16px] flex items-center justify-center shadow-sm transition-colors duration-500 ${theme.pathCompletedBg} ${theme.pathCompletedText}`}>
                                <CheckCircle className="w-7 h-7" />
                              </div>
                            )}
                            {step.status === 'active' && (
                              <div className={`w-16 h-16 rounded-[16px] flex items-center justify-center shadow-md ring-4 ring-white transition-colors duration-500 ${theme.pathActiveBg} ${theme.pathActiveText}`}>
                                <PlayCircle className="w-7 h-7" />
                              </div>
                            )}
                            {step.status === 'locked' && (
                              <div className="w-16 h-16 rounded-[16px] flex items-center justify-center bg-guesty-beige/50 text-guesty-forest/30 shadow-sm">
                                <Lock className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          {/* Content Card */}
                          <div className={`flex-1 rounded-[24px] border p-6 transition-all duration-300 ${
                            step.status === 'active' ? `border-guesty-forest/20 bg-white shadow-md scale-[1.02]` : 
                            step.status === 'completed' ? 'border-guesty-beige bg-guesty-cream/50 hover:bg-guesty-cream' : 
                            'border-guesty-beige/50 bg-guesty-cream/30 opacity-75'
                          }`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-xs font-bold uppercase tracking-widest ${
                                    step.status === 'completed' ? 'text-guesty-nature' :
                                    step.status === 'active' ? theme.textPrimary :
                                    'text-guesty-forest/40'
                                  }`}>
                                    {step.status === 'completed' ? 'Completed' : step.status === 'active' ? 'In Progress' : 'Locked'}
                                  </span>
                                  <span className="text-xs font-bold text-guesty-forest/60 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> {step.duration}
                                  </span>
                                  <span className="text-xs font-bold text-guesty-forest/60 bg-guesty-beige px-2.5 py-1 rounded-[6px]">
                                    {step.type}
                                  </span>
                                </div>
                                <h4 className={`text-xl font-bold ${step.status === 'locked' ? 'text-guesty-forest/50' : 'text-guesty-black'}`}>
                                  {step.title}
                                </h4>
                              </div>

                              {step.status === 'active' && (
                                <div className="w-full md:w-56">
                                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest">
                                    <span className={theme.textPrimary}>Progress</span>
                                    <span className="text-guesty-black font-display">{step.progress}%</span>
                                  </div>
                                  <div className="h-2.5 w-full bg-guesty-beige rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-colors duration-500 ${theme.pathActiveBg}`} style={{ width: `${step.progress}%` }}></div>
                                  </div>
                                </div>
                              )}

                              {step.status === 'completed' && (
                                <div className="flex items-center gap-2 text-sm font-bold text-guesty-black bg-white px-4 py-2 rounded-[12px] border border-guesty-beige shadow-sm">
                                  Score: <span className="text-guesty-nature font-display text-lg">{step.score}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* --- ADMIN DASHBOARD --- */}
          {environment === 'admin' && activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-guesty-black tracking-tight">System Overview</h2>
                  <p className="text-guesty-forest/70 mt-2 text-lg">Manage academies, users, and course production.</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white border border-guesty-beige text-guesty-black font-bold px-5 py-3 rounded-[12px] shadow-sm hover:bg-guesty-beige/50 transition-colors flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" /> View Full Report
                  </button>
                </div>
              </div>

              {/* Admin Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {adminStats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-[24px] p-8 border border-guesty-beige shadow-sm flex flex-col justify-between">
                    <div className="text-sm font-bold text-guesty-forest/60 uppercase tracking-widest mb-4">{stat.label}</div>
                    <div className="flex items-end justify-between">
                      <div className="font-display text-5xl font-bold text-guesty-black">{stat.value}</div>
                      <div className="text-guesty-nature font-bold bg-guesty-ice/30 px-3 py-1 rounded-[8px] mb-1">{stat.trend}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Production Table */}
              <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden">
                <div className="p-8 border-b border-guesty-beige flex items-center justify-between">
                  <h3 className="text-xl font-bold text-guesty-black">Recent Courses</h3>
                  <button onClick={() => setActiveTab('courses')} className="text-sm font-bold text-guesty-forest hover:underline">View All in Production</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-guesty-cream/50 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">
                        <th className="p-5 pl-8 font-bold">Course Title</th>
                        <th className="p-5 font-bold">Target Audience</th>
                        <th className="p-5 font-bold">Status</th>
                        <th className="p-5 font-bold">Last Updated</th>
                        <th className="p-5 pr-8 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-guesty-beige">
                      {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-guesty-cream/30 transition-colors">
                          <td className="p-5 pl-8 font-bold text-guesty-black">{course.title}</td>
                          <td className="p-5 text-sm text-guesty-forest/80">{course.audience}</td>
                          <td className="p-5">
                            <span className={`text-xs font-bold px-3 py-1 rounded-[6px] uppercase tracking-wider ${
                              course.status === 'Published' ? 'bg-guesty-ice/50 text-guesty-nature' :
                              course.status === 'Under Maintenance' ? 'bg-guesty-beige text-guesty-forest/70' :
                              'bg-guesty-peach/30 text-guesty-merlot'
                            }`}>
                              {course.status}
                            </span>
                          </td>
                          <td className="p-5 text-sm text-guesty-forest/60">{course.lastUpdated}</td>
                          <td className="p-5 pr-8 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setActiveCourseId(course.id); setActiveTab('courses'); }} className="p-2 text-guesty-forest/60 hover:text-guesty-black hover:bg-guesty-beige rounded-[8px] transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
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

          {/* --- ADMIN USER MANAGEMENT --- */}
          {environment === 'admin' && activeTab === 'users' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-guesty-black tracking-tight">User Management</h2>
                  <p className="text-guesty-forest/70 mt-2 text-lg">Manage roles, hierarchies, and automated enrollments across domains.</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white border border-guesty-beige text-guesty-black font-bold px-5 py-3 rounded-[12px] shadow-sm hover:bg-guesty-beige/50 transition-colors flex items-center gap-2">
                    <Download className="w-5 h-5" /> Export CSV
                  </button>
                  <button onClick={() => {
                    setIsBulkEdit(false);
                    setEditingUserId(null);
                    setNewUserFirstName('');
                    setNewUserLastName('');
                    setNewUserEmail('');
                    setNewUserJobTitle('');
                    setNewUserRole('Learner');
                    setNewUserPowerProfileIds([]);
                    setNewUserDomain('All');
                    setNewUserSite('North America');
                    setNewUserDepartment('Engineering');
                    setNewUserManager('');
                    setNewUserIsManager(false);
                    setNewUserStartDate('');
                    setNewUserEmploymentType('Full-time');
                    setNewUserSendEmail(true);
                    setShowCreateUserModal(true);
                  }} className={`${theme.primary} ${theme.textPrimary} ${theme.primaryHover} font-bold px-5 py-3 rounded-[12px] shadow-sm transition-colors flex items-center gap-2`}>
                    <Plus className="w-5 h-5" /> Add User
                  </button>
                </div>
              </div>

              {/* Sub-navigation */}
              <div className="flex gap-2 border-b border-guesty-beige">
                <button 
                  onClick={() => setUserTab('directory')}
                  className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${userTab === 'directory' ? 'border-guesty-forest text-guesty-black' : 'border-transparent text-guesty-forest/50 hover:text-guesty-forest'}`}
                >
                  User Directory
                </button>
                <button 
                  onClick={() => setUserTab('power_users')}
                  className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${userTab === 'power_users' ? 'border-guesty-forest text-guesty-black' : 'border-transparent text-guesty-forest/50 hover:text-guesty-forest'}`}
                >
                  Power User Permissions
                </button>
                <button 
                  onClick={() => setUserTab('automation')}
                  className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${userTab === 'automation' ? 'border-guesty-forest text-guesty-black' : 'border-transparent text-guesty-forest/50 hover:text-guesty-forest'}`}
                >
                  Automation Rules (HRIS)
                </button>
                <button 
                  onClick={() => setUserTab('audit')}
                  className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${userTab === 'audit' ? 'border-guesty-forest text-guesty-black' : 'border-transparent text-guesty-forest/50 hover:text-guesty-forest'}`}
                >
                  Audit Logs (SOC2)
                </button>
              </div>

              {userTab === 'directory' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Toolbar & Bulk Actions */}
                  <div className="flex items-center justify-between bg-white p-4 rounded-[16px] border border-guesty-beige shadow-sm">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-80">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-guesty-forest/50" />
                        <input 
                          type="text" 
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          placeholder="Search users by name, email, or role..." 
                          className="w-full pl-12 pr-4 py-2.5 bg-guesty-cream/50 border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => setShowUserFilters(!showUserFilters)}
                        className={`flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-[8px] transition-colors ${showUserFilters ? 'bg-guesty-forest text-white' : 'text-guesty-forest/70 hover:text-guesty-black hover:bg-guesty-cream'}`}
                      >
                        <Filter className="w-4 h-4" /> Filters
                      </button>
                    </div>

                    {/* Filters Panel */}
                    {showUserFilters && (
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-guesty-beige animate-in slide-in-from-top-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-guesty-forest/60 uppercase tracking-widest block mb-1">Role</label>
                          <select 
                            value={userFilterRole} 
                            onChange={(e) => setUserFilterRole(e.target.value)}
                            className="w-full px-3 py-2 bg-guesty-cream/50 border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none"
                          >
                            <option value="All">All Roles</option>
                            <option value="Learner">Learner</option>
                            <option value="Manager">Manager</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Power User">Power User</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-guesty-forest/60 uppercase tracking-widest block mb-1">Domain</label>
                          <select 
                            value={userFilterDomain} 
                            onChange={(e) => setUserFilterDomain(e.target.value)}
                            className="w-full px-3 py-2 bg-guesty-cream/50 border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none"
                          >
                            <option value="All">All Domains</option>
                            <option value="Internal">Internal</option>
                            <option value="External">External</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-guesty-forest/60 uppercase tracking-widest block mb-1">Status</label>
                          <select 
                            value={userFilterStatus} 
                            onChange={(e) => setUserFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 bg-guesty-cream/50 border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none"
                          >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>
                        <div className="flex items-end pb-0.5">
                          <button 
                            onClick={() => {
                              setUserFilterRole('All');
                              setUserFilterDomain('All');
                              setUserFilterStatus('All');
                              setUserSearchQuery('');
                            }}
                            className="text-xs font-bold text-guesty-forest/60 hover:text-guesty-black underline px-2 py-2"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bulk Actions Toolbar (Visible when users selected) */}
                    {selectedUsers.length > 0 && (
                      <div className="flex items-center gap-3 animate-in slide-in-from-right-4">
                        <span className="text-sm font-bold text-guesty-ocean mr-2">{selectedUsers.length} Selected</span>
                        <button 
                          onClick={() => {
                            setIsBulkEdit(true);
                            setEditingUserId(null);
                            setNewUserRole('');
                            setNewUserPowerProfileIds([]);
                            setNewUserDomain('');
                            setNewUserSite('');
                            setNewUserDepartment('');
                            setNewUserManager('');
                            setShowCreateUserModal(true);
                          }}
                          className="flex items-center gap-2 text-sm font-bold text-guesty-forest bg-guesty-beige px-4 py-2 rounded-[8px] hover:bg-guesty-beige/80 transition-colors"
                        >
                          <UserCog className="w-4 h-4" /> Edit Users
                        </button>
                        <button 
                          onClick={() => {
                            setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'Archived' } : u));
                            setSelectedUsers([]);
                          }}
                          className="flex items-center gap-2 text-sm font-bold text-guesty-merlot bg-guesty-blush px-4 py-2 rounded-[8px] hover:bg-guesty-blush/80 transition-colors"
                        >
                          <Archive className="w-4 h-4" /> Archive
                        </button>
                        <button onClick={() => setShowMergeModal(true)} className="flex items-center gap-2 text-sm font-bold text-guesty-forest bg-guesty-beige px-4 py-2 rounded-[8px] hover:bg-guesty-beige/80 transition-colors">
                          <GitMerge className="w-4 h-4" /> Merge
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Table */}
                  <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-guesty-cream/50 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">
                            <th className="p-5 pl-8 w-12">
                              <input 
                                type="checkbox" 
                                className="rounded border-guesty-beige text-guesty-forest focus:ring-guesty-forest"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers(filteredUsers.map(u => u.id));
                                  } else {
                                    setSelectedUsers([]);
                                  }
                                }}
                                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                              />
                            </th>
                            <th className="p-5 font-bold">User</th>
                            <th className="p-5 font-bold">Role & Domain</th>
                            <th className="p-5 font-bold">Site & Department</th>
                            <th className="p-5 font-bold">Status</th>
                            <th className="p-5 pr-8 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-guesty-beige">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-guesty-forest/60">
                                No users found matching your filters.
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((user) => (
                              <tr key={user.id} className={`hover:bg-guesty-cream/30 transition-colors ${selectedUsers.includes(user.id) ? 'bg-guesty-ice/10' : ''}`}>
                              <td className="p-5 pl-8">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-guesty-beige text-guesty-forest focus:ring-guesty-forest"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedUsers([...selectedUsers, user.id]);
                                    } else {
                                      setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                    }
                                  }}
                                />
                              </td>
                              <td className="p-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-guesty-forest text-white flex items-center justify-center font-bold text-sm">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <button 
                                      onClick={() => {
                                        setIsBulkEdit(false);
                                        setEditingUserId(user.id);
                                        const nameParts = user.name.split(' ');
                                        setNewUserFirstName(nameParts[0] || '');
                                        setNewUserLastName(nameParts.slice(1).join(' ') || '');
                                        setNewUserEmail(user.email);
                                        setNewUserJobTitle(user.jobTitle || '');
                                        setNewUserRole(user.role);
                                        setNewUserPowerProfileIds(user.powerProfileIds || []);
                                        setNewUserDomain(user.domain);
                                        setNewUserSite(user.site);
                                        setNewUserDepartment(user.department);
                                        setNewUserManager(user.managerId || '');
                                        setNewUserIsManager(user.isManager || false);
                                        setNewUserStartDate(user.startDate || '');
                                        setNewUserEmploymentType(user.employmentType || 'Full-time');
                                        setNewUserSendEmail(false);
                                        setShowCreateUserModal(true);
                                      }}
                                      className="font-bold text-guesty-black hover:text-guesty-ocean hover:underline text-left"
                                    >
                                      {user.name}
                                    </button>
                                    <div className="text-xs text-guesty-forest/60">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-5">
                                <div className="flex flex-col gap-1.5 items-start">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider ${
                                    user.role === 'Admin' ? 'bg-guesty-merlot text-white' :
                                    user.role === 'Power User' ? 'bg-guesty-ocean text-white' :
                                    user.role === 'Instructor' ? 'bg-guesty-nature text-white' :
                                    'bg-guesty-beige text-guesty-forest'
                                  }`}>
                                    {user.role}
                                  </span>
                                  <span className="text-xs text-guesty-forest/60 flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> {user.domain}
                                  </span>
                                </div>
                              </td>
                              <td className="p-5">
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-bold text-guesty-black">{user.department}</span>
                                  <span className="text-xs text-guesty-forest/60">{user.site}</span>
                                </div>
                              </td>
                              <td className="p-5">
                                <div className="flex flex-col gap-1">
                                  <span className={`text-xs font-bold flex items-center gap-1.5 ${user.status === 'Active' ? 'text-guesty-nature' : 'text-guesty-forest/40'}`}>
                                    <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-guesty-nature' : 'bg-guesty-forest/30'}`}></span>
                                    {user.status}
                                  </span>
                                  <span className="text-[10px] text-guesty-forest/50">Last login: {user.lastLogin}</span>
                                </div>
                              </td>
                              <td className="p-5 pr-8 text-right relative">
                                <div className="flex justify-end gap-2 items-center">
                                  <button 
                                    onClick={() => {
                                      setIsBulkEdit(false);
                                      setEditingUserId(user.id);
                                      const nameParts = user.name.split(' ');
                                      setNewUserFirstName(nameParts[0] || '');
                                      setNewUserLastName(nameParts.slice(1).join(' ') || '');
                                      setNewUserEmail(user.email);
                                      setNewUserJobTitle(user.jobTitle || '');
                                      setNewUserRole(user.role);
                                      setNewUserPowerProfileIds(user.powerProfileIds || []);
                                      setNewUserDomain(user.domain);
                                      setNewUserSite(user.site);
                                      setNewUserDepartment(user.department);
                                      setNewUserManager(user.managerId || '');
                                      setNewUserIsManager(user.isManager || false);
                                      setNewUserStartDate(user.startDate || '');
                                      setNewUserEmploymentType(user.employmentType || 'Full-time');
                                      setNewUserSendEmail(false);
                                      setShowCreateUserModal(true);
                                    }}
                                    className="p-2 text-guesty-forest/60 hover:text-guesty-black hover:bg-guesty-beige rounded-[8px] transition-colors" 
                                    title="Edit User"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  
                                  <div className="relative">
                                    <button 
                                      onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                                      className={`p-2 rounded-[8px] transition-colors ${openDropdownId === user.id ? 'bg-guesty-beige text-guesty-black' : 'text-guesty-forest/60 hover:text-guesty-black hover:bg-guesty-beige'}`}
                                      title="Actions"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    {openDropdownId === user.id && (
                                      <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-[12px] shadow-lg border border-guesty-beige py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-200">
                                        <button 
                                          onClick={() => {
                                            setActionUserId(user.id);
                                            setShowResetPasswordModal(true);
                                            setOpenDropdownId(null);
                                          }}
                                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                        >
                                          <Key className="w-4 h-4" /> Reset Password
                                        </button>
                                        <button 
                                          onClick={() => {
                                            alert(`Invitation resent to ${user.email}`);
                                            setOpenDropdownId(null);
                                          }}
                                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                        >
                                          <Mail className="w-4 h-4" /> Resend Invitation
                                        </button>
                                        <button 
                                          onClick={() => {
                                            setActionUserId(user.id);
                                            setShowGroupAssignmentModal(true);
                                            setOpenDropdownId(null);
                                          }}
                                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                        >
                                          <Users className="w-4 h-4" /> Quick Group Assignment
                                        </button>
                                        <button 
                                          onClick={() => {
                                            setProgressUserId(user.id);
                                            setShowUserProgressModal(true);
                                            setOpenDropdownId(null);
                                          }}
                                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                        >
                                          <Activity className="w-4 h-4" /> View Learning Progress
                                        </button>
                                        <div className="h-px bg-guesty-beige my-1"></div>
                                        <button 
                                          onClick={() => {
                                            setImpersonatingUser(user);
                                            setOpenDropdownId(null);
                                            setEnvironment(user.domain === 'Internal' ? 'internal' : 'external');
                                            setActiveTab('dashboard');
                                          }}
                                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                        >
                                          <Eye className="w-4 h-4" /> Impersonate User
                                        </button>
                                        
                                        {user.status !== 'Archived' ? (
                                          <button 
                                            onClick={() => {
                                              setUsers(users.map(u => u.id === user.id ? { ...u, status: 'Archived' } : u));
                                              setOpenDropdownId(null);
                                            }}
                                            className="w-full px-4 py-2 text-sm font-bold text-guesty-merlot hover:bg-guesty-blush flex items-center gap-2 transition-colors"
                                          >
                                            <Archive className="w-4 h-4" /> Archive User
                                          </button>
                                        ) : (
                                          <button 
                                            onClick={() => {
                                              setUsers(users.map(u => u.id === user.id ? { ...u, status: 'Active' } : u));
                                              setOpenDropdownId(null);
                                            }}
                                            className="w-full px-4 py-2 text-sm font-bold text-guesty-nature hover:bg-guesty-ice/50 flex items-center gap-2 transition-colors"
                                          >
                                            <ArchiveRestore className="w-4 h-4" /> Restore User
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {userTab === 'power_users' && (
                <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden animate-in fade-in duration-300">
                  <div className="p-6 border-b border-guesty-beige bg-guesty-cream/30 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-guesty-black">Power User Profiles</h3>
                      <p className="text-sm text-guesty-forest/60 mt-1">Create and manage permission profiles to assign to Power Users.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          const newProfile = {
                            id: `prof${Date.now()}`,
                            name: 'New Profile',
                            description: 'Custom power user profile',
                            permissions: powerUserProfiles[0].permissions.map((p: any) => ({ ...p, enabled: false }))
                          };
                          setPowerUserProfiles([...powerUserProfiles, newProfile]);
                          setActiveProfileId(newProfile.id);
                        }}
                        className="bg-white border border-guesty-beige text-guesty-forest font-bold px-4 py-2 rounded-[8px] text-sm flex items-center gap-2 hover:bg-guesty-cream transition-colors"
                      >
                        <Plus className="w-4 h-4" /> New Profile
                      </button>
                      <button 
                        onClick={() => {
                          alert('Profiles saved successfully!');
                        }}
                        className="bg-guesty-forest text-white font-bold px-4 py-2 rounded-[8px] text-sm flex items-center gap-2 hover:bg-guesty-forest/90 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex h-[600px]">
                    {/* Profiles Sidebar */}
                    <div className="w-64 border-r border-guesty-beige bg-guesty-cream/20 overflow-y-auto">
                      {powerUserProfiles.map(profile => (
                        <button
                          key={profile.id}
                          onClick={() => setActiveProfileId(profile.id)}
                          className={`w-full text-left px-6 py-4 border-b border-guesty-beige transition-colors ${activeProfileId === profile.id ? 'bg-white border-l-4 border-l-guesty-forest' : 'hover:bg-guesty-cream/50 border-l-4 border-l-transparent'}`}
                        >
                          <div className="font-bold text-sm text-guesty-black">{profile.name}</div>
                          <div className="text-xs text-guesty-forest/60 mt-1 truncate">{profile.description}</div>
                        </button>
                      ))}
                    </div>

                    {/* Permissions Editor */}
                    <div className="flex-1 overflow-y-auto flex flex-col">
                      {powerUserProfiles.filter(p => p.id === activeProfileId).map(activeProfile => (
                        <div key={activeProfile.id} className="flex-1 flex flex-col">
                          <div className="p-6 border-b border-guesty-beige bg-white flex justify-between items-start">
                            <div className="flex-1">
                              <input 
                                type="text" 
                                value={activeProfile.name}
                                onChange={(e) => {
                                  setPowerUserProfiles(powerUserProfiles.map(p => 
                                    p.id === activeProfile.id ? { ...p, name: e.target.value } : p
                                  ));
                                }}
                                className="text-2xl font-bold text-guesty-black bg-transparent border-none focus:ring-0 p-0 w-full outline-none mb-2"
                              />
                              <input 
                                type="text" 
                                value={activeProfile.description}
                                onChange={(e) => {
                                  setPowerUserProfiles(powerUserProfiles.map(p => 
                                    p.id === activeProfile.id ? { ...p, description: e.target.value } : p
                                  ));
                                }}
                                className="text-sm text-guesty-forest/60 bg-transparent border-none focus:ring-0 p-0 w-full outline-none"
                              />
                            </div>
                            <button 
                              onClick={() => {
                                if (powerUserProfiles.length <= 1) {
                                  alert("You cannot delete the last profile.");
                                  return;
                                }
                                const updatedProfiles = powerUserProfiles.filter(p => p.id !== activeProfile.id);
                                setPowerUserProfiles(updatedProfiles);
                                setActiveProfileId(updatedProfiles[0].id);
                                setUsers(users.map(u => ({
                                  ...u,
                                  powerProfileIds: u.powerProfileIds?.filter((id: string) => id !== activeProfile.id)
                                })));
                              }}
                              className="text-guesty-merlot hover:bg-guesty-blush p-2 rounded-[8px] transition-colors"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="p-0 flex-1">
                            {['Course Management', 'User Management', 'Reporting', 'System Settings'].map(category => {
                              const categoryPerms = activeProfile.permissions.filter((p: any) => p.category === category);
                              if (categoryPerms.length === 0) return null;
                              
                              return (
                                <div key={category} className="border-b border-guesty-beige last:border-b-0">
                                  <div className="px-6 py-4 bg-guesty-cream/50 border-b border-guesty-beige">
                                    <h4 className="font-bold text-guesty-forest uppercase tracking-widest text-xs">{category}</h4>
                                  </div>
                                  <div className="divide-y divide-guesty-beige">
                                    {categoryPerms.map((perm: any) => (
                                      <div key={perm.id} className="px-6 py-5 flex items-start justify-between hover:bg-guesty-cream/20 transition-colors">
                                        <div className="pr-8">
                                          <h5 className="font-bold text-guesty-black text-sm">{perm.name}</h5>
                                          <p className="text-sm text-guesty-forest/60 mt-1">{perm.description}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                                          <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={perm.enabled}
                                            onChange={(e) => {
                                              setPowerUserProfiles(powerUserProfiles.map(p => {
                                                if (p.id === activeProfile.id) {
                                                  return {
                                                    ...p,
                                                    permissions: p.permissions.map((pPerm: any) => 
                                                      pPerm.id === perm.id ? { ...pPerm, enabled: e.target.checked } : pPerm
                                                    )
                                                  };
                                                }
                                                return p;
                                              }));
                                            }}
                                          />
                                          <div className="w-11 h-6 bg-guesty-beige peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-guesty-nature"></div>
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Assigned Users Section */}
                          <div className="p-6 border-t border-guesty-beige bg-guesty-cream/20">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-bold text-guesty-black flex items-center gap-2">
                                <Users className="w-5 h-5 text-guesty-ocean" /> Assigned Users
                              </h4>
                              <button 
                                onClick={() => {
                                  setAssignUsersSelection(users.filter(u => u.powerProfileIds?.includes(activeProfile.id)).map(u => u.id));
                                  setShowAssignUsersModal(true);
                                }}
                                className="text-xs font-bold bg-white border border-guesty-beige text-guesty-forest px-3 py-1.5 rounded-[8px] hover:bg-guesty-cream transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Plus className="w-4 h-4" /> Assign Users
                              </button>
                            </div>
                            <div className="space-y-2">
                              {users.filter(u => u.powerProfileIds?.includes(activeProfile.id)).map(u => (
                                <div key={u.id} className="flex items-center justify-between bg-white p-3 rounded-[12px] border border-guesty-beige shadow-sm hover:border-guesty-forest/30 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-guesty-ocean/10 text-guesty-ocean flex items-center justify-center font-bold text-xs">
                                      {u.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-guesty-black flex items-center gap-2">
                                        {u.name}
                                        {u.status === 'Archived' && (
                                          <span className="text-[10px] bg-guesty-beige text-guesty-forest/60 px-2 py-0.5 rounded-[4px] uppercase tracking-wider">Archived</span>
                                        )}
                                      </div>
                                      <div className="text-xs text-guesty-forest/60">{u.email}</div>
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <button 
                                      onClick={() => setOpenDropdownId(openDropdownId === `pu-${u.id}` ? null : `pu-${u.id}`)}
                                      className={`p-2 rounded-[8px] transition-colors ${openDropdownId === `pu-${u.id}` ? 'bg-guesty-beige text-guesty-black' : 'text-guesty-forest/60 hover:text-guesty-black hover:bg-guesty-beige'}`}
                                      title="Actions"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    {openDropdownId === `pu-${u.id}` && (
                                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-[12px] shadow-lg border border-guesty-beige py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-200">
                                        <button 
                                          onClick={() => {
                                            setImpersonatingUser(u);
                                            setOpenDropdownId(null);
                                            setEnvironment(u.domain === 'Internal' ? 'internal' : 'external');
                                            setActiveTab('dashboard');
                                          }}
                                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                        >
                                          <Eye className="w-4 h-4" /> Impersonate User
                                        </button>
                                        
                                        {u.status !== 'Archived' ? (
                                          <button 
                                            onClick={() => {
                                              setUsers(users.map(user => user.id === u.id ? { ...user, status: 'Archived' } : user));
                                              setOpenDropdownId(null);
                                            }}
                                            className="w-full px-4 py-2 text-sm font-bold text-guesty-merlot hover:bg-guesty-blush flex items-center gap-2 transition-colors"
                                          >
                                            <Archive className="w-4 h-4" /> Archive User
                                          </button>
                                        ) : (
                                          <button 
                                            onClick={() => {
                                              setUsers(users.map(user => user.id === u.id ? { ...user, status: 'Active' } : user));
                                              setOpenDropdownId(null);
                                            }}
                                            className="w-full px-4 py-2 text-sm font-bold text-guesty-nature hover:bg-guesty-ice/50 flex items-center gap-2 transition-colors"
                                          >
                                            <ArchiveRestore className="w-4 h-4" /> Restore User
                                          </button>
                                        )}

                                        <div className="h-px bg-guesty-beige my-1"></div>

                                        <button 
                                          onClick={() => {
                                            setUsers(users.map(user => user.id === u.id ? { ...user, powerProfileIds: user.powerProfileIds?.filter(id => id !== activeProfile.id) } : user));
                                            setOpenDropdownId(null);
                                          }}
                                          className="w-full px-4 py-2 text-sm font-bold text-guesty-merlot hover:bg-guesty-blush flex items-center gap-2 transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" /> Remove from Profile
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {users.filter(u => u.powerProfileIds?.includes(activeProfile.id)).length === 0 && (
                                <div className="text-sm text-guesty-forest/60 bg-white p-4 rounded-[12px] border border-guesty-beige text-center">
                                  No users are currently assigned to this profile.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {userTab === 'automation' && (
                <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm p-8 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-guesty-black">HRIS Sync Rules</h3>
                      <p className="text-sm text-guesty-forest/60 mt-1">Automated group reassignment based on HiBob attributes.</p>
                    </div>
                    <button className="bg-guesty-forest text-white font-bold px-4 py-2 rounded-[8px] text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Rule
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 border border-guesty-beige rounded-[12px] bg-guesty-cream/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-guesty-ocean/10 text-guesty-ocean flex items-center justify-center">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-guesty-beige px-2 py-0.5 rounded-[4px]">IF</span>
                            <span className="text-sm font-bold text-guesty-black">Department == 'Sales'</span>
                            <span className="text-xs font-bold bg-guesty-beige px-2 py-0.5 rounded-[4px]">THEN</span>
                            <span className="text-sm font-bold text-guesty-black">Assign to Group 'Sales Onboarding'</span>
                          </div>
                          <p className="text-xs text-guesty-forest/60 mt-1">Triggered on user creation or department change.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-guesty-nature flex items-center gap-1"><Check className="w-3 h-3" /> Active</span>
                        <button className="text-guesty-forest/50 hover:text-guesty-black"><Edit2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    
                    <div className="p-5 border border-guesty-beige rounded-[12px] bg-guesty-cream/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-guesty-nature/10 text-guesty-nature flex items-center justify-center">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-guesty-beige px-2 py-0.5 rounded-[4px]">IF</span>
                            <span className="text-sm font-bold text-guesty-black">Start Date &gt; 30 Days Ago</span>
                            <span className="text-xs font-bold bg-guesty-beige px-2 py-0.5 rounded-[4px]">THEN</span>
                            <span className="text-sm font-bold text-guesty-black">Enroll in 'Compliance Training'</span>
                          </div>
                          <p className="text-xs text-guesty-forest/60 mt-1">Tenure-based enrollment automation.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-guesty-nature flex items-center gap-1"><Check className="w-3 h-3" /> Active</span>
                        <button className="text-guesty-forest/50 hover:text-guesty-black"><Edit2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userTab === 'audit' && (
                <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden animate-in fade-in duration-300">
                  <div className="p-6 border-b border-guesty-beige bg-guesty-cream/30 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-guesty-black">Audit Logs</h3>
                      <p className="text-sm text-guesty-forest/60 mt-1">SOC2 & ISO27001 compliant tracking of all administrative actions.</p>
                    </div>
                    <button className="text-sm font-bold text-guesty-forest flex items-center gap-2 hover:text-guesty-black transition-colors">
                      <Download className="w-4 h-4" /> Export Logs
                    </button>
                  </div>
                  <div className="divide-y divide-guesty-beige">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-5 flex items-center justify-between hover:bg-guesty-cream/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-guesty-beige flex items-center justify-center text-guesty-forest/60">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-guesty-black">{log.action}</p>
                            <p className="text-xs text-guesty-forest/60 mt-0.5">Admin: <span className="font-bold">{log.admin}</span> • Target: {log.target}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-guesty-forest/50">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- ADMIN GROUPS MODULE --- */}
          {environment === 'admin' && activeTab === 'groups' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-guesty-black tracking-tight">Groups</h2>
                  <p className="text-guesty-forest/70 mt-2 text-lg">Manage bulk enrollments, reporting segments, and learning automations.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowCreateGroupModal(true)}
                    className="bg-guesty-ocean text-white font-bold px-5 py-3 rounded-[12px] shadow-sm hover:bg-guesty-ocean/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Create Group
                  </button>
                </div>
              </div>

              {!selectedGroupId ? (
                /* MAIN GROUPS DASHBOARD */
                <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/30">
                    <div className="relative w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                      <input 
                        type="text" 
                        placeholder="Search groups by name or tag..." 
                        value={groupsSearchQuery}
                        onChange={(e) => setGroupsSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-guesty-forest hover:bg-guesty-beige/50 rounded-[8px] transition-colors border border-guesty-beige">
                      <Filter className="w-4 h-4" /> Filters
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-guesty-ice/50 text-guesty-forest/70 text-xs uppercase tracking-wider border-b border-guesty-beige">
                          <th className="p-4 font-bold">Group Name & Description</th>
                          <th className="p-4 font-bold">Tags</th>
                          <th className="p-4 font-bold">Type</th>
                          <th className="p-4 font-bold">Members</th>
                          <th className="p-4 font-bold">Automations</th>
                          <th className="p-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-guesty-beige">
                        {groups.filter(g => g.name.toLowerCase().includes(groupsSearchQuery.toLowerCase()) || (g.tags && g.tags.some((t: string) => t.toLowerCase().includes(groupsSearchQuery.toLowerCase())))).map((group) => {
                          const memberCount = users.filter(u => u.groups?.includes(group.name)).length;
                          return (
                            <tr key={group.id} className="hover:bg-guesty-cream/30 transition-colors group cursor-pointer" onClick={() => setSelectedGroupId(group.id)}>
                              <td className="p-4">
                                <p className="font-bold text-guesty-black text-sm">{group.name}</p>
                                <p className="text-xs text-guesty-forest/60 mt-0.5">{group.description}</p>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1.5">
                                  {group.tags?.slice(0, 2).map((tag: string, i: number) => (
                                    <span key={i} className="text-xs font-bold px-2 py-1 bg-guesty-cream text-guesty-forest rounded-[6px]">
                                      {tag}
                                    </span>
                                  ))}
                                  {group.tags?.length > 2 && (
                                    <span className="text-xs font-bold px-2 py-1 bg-guesty-cream text-guesty-forest rounded-[6px]">
                                      +{group.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${group.type === 'Dynamic' ? 'bg-guesty-ocean/10 text-guesty-ocean' : 'bg-guesty-beige/50 text-guesty-forest/60'}`}>
                                  {group.type === 'Dynamic' ? <Zap className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                  {group.type || 'Manual'}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-guesty-ice text-guesty-ocean text-xs font-bold">
                                  <Users className="w-3.5 h-3.5" /> {memberCount}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${group.activeRules > 0 ? 'bg-guesty-nature/10 text-guesty-nature' : 'bg-guesty-beige/50 text-guesty-forest/60'}`}>
                                  <Activity className="w-3.5 h-3.5" /> {group.activeRules} Active
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="relative inline-block text-left" onClick={e => e.stopPropagation()}>
                                  <button 
                                    onClick={() => setOpenDropdownId(openDropdownId === group.id ? null : group.id)}
                                    className="p-2 text-guesty-forest/50 hover:text-guesty-ocean hover:bg-guesty-ice rounded-[8px] transition-colors"
                                  >
                                    <MoreVertical className="w-5 h-5" />
                                  </button>
                                  
                                  {openDropdownId === group.id && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-[12px] shadow-lg border border-guesty-beige py-2 z-50">
                                      <button 
                                        onClick={() => { setSelectedGroupId(group.id); setOpenDropdownId(null); }}
                                        className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                      >
                                        <Eye className="w-4 h-4" /> View Members
                                      </button>
                                      <button 
                                        onClick={() => setOpenDropdownId(null)}
                                        className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                      >
                                        <Edit2 className="w-4 h-4" /> Edit Group
                                      </button>
                                      <button 
                                        onClick={() => handleRunAutomations(group.id)}
                                        className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                      >
                                        <PlayCircle className="w-4 h-4" /> Run Automation Now
                                      </button>
                                      <div className="h-px bg-guesty-beige my-2"></div>
                                      <button 
                                        onClick={() => handleArchiveGroup(group.id)}
                                        className="w-full px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                      >
                                        <Archive className="w-4 h-4" /> Archive Group
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* GROUP-SPECIFIC WORKSPACE */
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button 
                    onClick={() => setSelectedGroupId(null)}
                    className="flex items-center gap-2 text-sm font-bold text-guesty-forest hover:text-guesty-black transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Groups
                  </button>
                  
                  {groups.filter(g => g.id === selectedGroupId).map(group => (
                    <div key={group.id} className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden">
                      <div className="p-8 border-b border-guesty-beige">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-3xl font-bold text-guesty-black">{group.name}</h3>
                            <p className="text-guesty-forest/70 mt-2">{group.description}</p>
                            <div className="flex items-center gap-4 mt-4">
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 ${group.type === 'Dynamic' ? 'bg-guesty-ocean/10 text-guesty-ocean' : 'bg-guesty-beige/50 text-guesty-forest/60'}`}>
                                {group.type === 'Dynamic' ? <Zap className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                {group.type || 'Manual'}
                              </span>
                              {group.tags?.map((tag: string, i: number) => (
                                <span key={i} className="text-xs font-bold px-3 py-1.5 bg-guesty-cream text-guesty-forest rounded-[8px] flex items-center gap-1.5">
                                  {tag}
                                </span>
                              ))}
                              {group.employmentType && group.employmentType !== 'All' && (
                                <span className="text-xs font-bold px-3 py-1.5 bg-guesty-ice/50 text-guesty-ocean rounded-[8px] flex items-center gap-1.5">
                                  <Briefcase className="w-3.5 h-3.5" /> {group.employmentType}
                                </span>
                              )}
                              {group.visibility && (
                                <span className="text-xs font-bold px-3 py-1.5 bg-guesty-ice/50 text-guesty-ocean rounded-[8px] flex items-center gap-1.5">
                                  <Eye className="w-3.5 h-3.5" /> {group.visibility}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button className="px-4 py-2 border border-guesty-beige rounded-[8px] text-sm font-bold text-guesty-forest hover:bg-guesty-cream transition-colors flex items-center gap-2">
                              <Edit2 className="w-4 h-4" /> Edit Details
                            </button>
                            <button className="px-4 py-2 bg-guesty-ocean text-white rounded-[8px] text-sm font-bold hover:bg-guesty-ocean/90 transition-colors flex items-center gap-2">
                              <PlayCircle className="w-4 h-4" /> Run Automations
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-b border-guesty-beige px-8">
                        <div className="flex gap-8">
                          {[
                            { id: 'members', label: 'Members', icon: <Users className="w-4 h-4" /> },
                            { id: 'courses', label: 'Course Relationships', icon: <BookOpen className="w-4 h-4" /> },
                            { id: 'automations', label: 'Automations', icon: <GitMerge className="w-4 h-4" /> }
                          ].map(tab => (
                            <button
                              key={tab.id}
                              onClick={() => setGroupTab(tab.id as any)}
                              className={`py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${groupTab === tab.id ? 'border-guesty-ocean text-guesty-ocean' : 'border-transparent text-guesty-forest hover:text-guesty-black'}`}
                            >
                              {tab.icon} {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-8">
                        {groupTab === 'members' && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-bold text-guesty-black">Group Members</h4>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => {
                                    setBulkAssignSelectedUsers([]);
                                    setBulkAssignSearchQuery('');
                                    setShowBulkAssignModal(true);
                                  }}
                                  className="text-sm font-bold text-guesty-ocean hover:underline flex items-center gap-1"
                                >
                                  <Users className="w-4 h-4" /> Bulk Assign
                                </button>
                                <div className="relative w-72">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                                  <input 
                                    type="text" 
                                    placeholder="Search to add users..." 
                                    value={groupMemberSearchQuery}
                                    onChange={(e) => setGroupMemberSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-guesty-ice/50 border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                                  />
                                  {groupMemberSearchQuery.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-guesty-beige rounded-[12px] shadow-lg overflow-hidden z-20 max-h-60 overflow-y-auto">
                                      {users.filter(u => !u.groups?.includes(group.name) && (u.name.toLowerCase().includes(groupMemberSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(groupMemberSearchQuery.toLowerCase()))).map(user => (
                                        <button
                                          key={user.id}
                                          onClick={() => {
                                            // Simulate background processing for adding a user
                                            setUsers(users.map(u => u.id === user.id ? { ...u, groups: [...(u.groups || []), group.name] } : u));
                                            setGroupMemberSearchQuery('');
                                          }}
                                          className="w-full text-left px-4 py-3 hover:bg-guesty-cream/50 border-b border-guesty-beige last:border-b-0 flex items-center gap-3 transition-colors"
                                        >
                                          <div className="w-8 h-8 rounded-full bg-guesty-ocean/10 text-guesty-ocean flex items-center justify-center font-bold text-xs shrink-0">
                                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                                          </div>
                                          <div className="flex-1">
                                            <p className="font-bold text-guesty-black text-sm">{user.name}</p>
                                            <p className="text-xs text-guesty-forest/60">{user.email}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-bold text-guesty-black text-xs">{user.domain || 'N/A'}</p>
                                            <p className="text-xs text-guesty-forest/60">{user.site || 'N/A'}</p>
                                          </div>
                                        </button>
                                      ))}
                                      {users.filter(u => !u.groups?.includes(group.name) && (u.name.toLowerCase().includes(groupMemberSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(groupMemberSearchQuery.toLowerCase()))).length === 0 && (
                                        <div className="p-4 text-center text-sm text-guesty-forest/50">
                                          No matching users found.
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="border border-guesty-beige rounded-[12px] overflow-hidden">
                              <table className="w-full text-left text-sm">
                                <thead className="bg-guesty-cream/50 text-guesty-forest/70 uppercase tracking-wider text-xs border-b border-guesty-beige">
                                  <tr>
                                    <th className="p-4 font-bold">User</th>
                                    <th className="p-4 font-bold">Role</th>
                                    <th className="p-4 font-bold text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-guesty-beige">
                                  {users.filter(u => u.groups?.includes(group.name)).map(user => (
                                    <tr key={user.id} className="hover:bg-guesty-cream/30">
                                      <td className="p-4">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-guesty-ocean/10 text-guesty-ocean flex items-center justify-center font-bold text-xs">
                                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                                          </div>
                                          <div>
                                            <p className="font-bold text-guesty-black">{user.name}</p>
                                            <p className="text-xs text-guesty-forest/60">{user.email}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-4 text-guesty-forest">{user.jobTitle}</td>
                                      <td className="p-4 text-right">
                                        <button 
                                          onClick={() => {
                                            setUsers(users.map(u => u.id === user.id ? { ...u, groups: u.groups.filter((g: string) => g !== group.name) } : u));
                                          }}
                                          className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-[6px] transition-colors"
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {users.filter(u => u.groups?.includes(group.name)).length === 0 && (
                                    <tr>
                                      <td colSpan={3} className="p-8 text-center text-guesty-forest/50">
                                        No members in this group yet.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        
                        {groupTab === 'courses' && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-bold text-guesty-black">Course Relationships</h4>
                              <button className="text-sm font-bold text-guesty-ocean hover:text-guesty-ocean/80 flex items-center gap-1">
                                <Link className="w-4 h-4" /> Link Course
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {courses.slice(0, 2).map(course => (
                                <div key={course.id} className="border border-guesty-beige rounded-[12px] p-4 flex gap-4 items-center">
                                  <div className="w-16 h-16 rounded-[8px] bg-guesty-ice flex items-center justify-center text-guesty-ocean">
                                    <BookOpen className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1">
                                    <button 
                                      onClick={() => {
                                        setPreviousModule({ tab: 'groups', id: group.id });
                                        setActiveCourseId(course.id);
                                        setCourseBuilderTab('enrollment');
                                        setActiveTab('courses');
                                      }}
                                      className="font-bold text-guesty-ocean text-sm hover:underline text-left"
                                    >
                                      {course.title}
                                    </button>
                                    <p className="text-xs text-guesty-forest/60 mt-1">Auto-assigned to {group.name}</p>
                                  </div>
                                  <button className="p-2 text-guesty-forest/40 hover:text-red-600 transition-colors">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {groupTab === 'automations' && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-bold text-guesty-black">Automations</h4>
                              <div className="flex items-center gap-4">
                                <div className="relative w-64">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                                  <input 
                                    type="text" 
                                    placeholder="Search automations..." 
                                    value={automationSearchQuery}
                                    onChange={(e) => setAutomationSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-guesty-ice/50 border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                                  />
                                </div>
                                <button 
                                  onClick={() => setShowNewAutomationModal(true)}
                                  className="text-sm font-bold text-white bg-guesty-ocean hover:bg-guesty-ocean/90 px-4 py-2 rounded-[8px] flex items-center gap-2 transition-colors"
                                >
                                  <Plus className="w-4 h-4" /> New Automation
                                </button>
                              </div>
                            </div>
                            
                            {/* Journey Map Visualization */}
                            <div className="bg-guesty-ice/30 border border-guesty-beige rounded-[12px] p-6 mb-6">
                              <h5 className="text-sm font-bold text-guesty-black mb-4 flex items-center gap-2">
                                <GitMerge className="w-4 h-4 text-guesty-ocean" /> Automation Journey Map
                              </h5>
                              <div className="flex items-center justify-center gap-4 overflow-x-auto py-4">
                                {/* Incoming */}
                                <div className="flex flex-col gap-2">
                                  {automations.filter(a => a.actionType === 'Group Transition' && (a.actionTarget === `Move to Group ${group.name}` || a.actionTarget === `Move to ${group.name}`)).map(a => {
                                    const sourceGroup = groups.find(g => g.id === a.groupId);
                                    return (
                                      <div key={a.id} className="bg-white border border-guesty-beige rounded-[8px] p-3 shadow-sm text-center min-w-[150px]">
                                        <p className="text-xs font-bold text-guesty-black">{sourceGroup?.name || 'Unknown Group'}</p>
                                        <p className="text-[10px] text-guesty-forest/60 mt-1">{a.triggerCondition}</p>
                                      </div>
                                    );
                                  })}
                                  {automations.filter(a => a.actionType === 'Group Transition' && (a.actionTarget === `Move to Group ${group.name}` || a.actionTarget === `Move to ${group.name}`)).length === 0 && (
                                    <div className="text-xs text-guesty-forest/40 italic text-center px-4">No incoming automations</div>
                                  )}
                                </div>

                                {/* Arrow */}
                                <div className="flex flex-col items-center text-guesty-ocean">
                                  <ArrowRight className="w-6 h-6" />
                                </div>

                                {/* Current Group */}
                                <div className="bg-guesty-ocean text-white rounded-[12px] p-4 shadow-md text-center min-w-[200px] border-2 border-guesty-ocean/20 relative">
                                  <p className="font-bold">{group.name}</p>
                                  <p className="text-xs text-white/80 mt-1 mb-3">Current Group</p>
                                  
                                  {/* Internal Actions */}
                                  <div className="bg-white/10 rounded-[8px] p-2 text-left space-y-1.5">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/90 mb-1 border-b border-white/20 pb-1">Internal Actions</p>
                                    {automations.filter(a => a.groupId === group.id && a.actionType !== 'Group Transition').map(a => (
                                      <div key={a.id} className="text-[10px] leading-tight">
                                        <span className="font-bold text-guesty-cream">{a.triggerCondition}:</span><br/>
                                        <span className="text-white/90">{a.actionTarget}</span>
                                      </div>
                                    ))}
                                    {automations.filter(a => a.groupId === group.id && a.actionType !== 'Group Transition').length === 0 && (
                                      <p className="text-[10px] text-white/60 italic">No internal automations</p>
                                    )}
                                  </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex flex-col items-center text-guesty-ocean">
                                  <ArrowRight className="w-6 h-6" />
                                </div>

                                {/* Outgoing */}
                                <div className="flex flex-col gap-2">
                                  {automations.filter(a => a.groupId === group.id && a.actionType === 'Group Transition').map(a => {
                                    const targetName = a.actionTarget.replace('Move to Group ', '').replace('Move to ', '');
                                    return (
                                      <div key={a.id} className="bg-white border border-guesty-beige rounded-[8px] p-3 shadow-sm text-center min-w-[150px]">
                                        <p className="text-xs font-bold text-guesty-black">{targetName}</p>
                                        <p className="text-[10px] text-guesty-forest/60 mt-1">{a.triggerCondition}</p>
                                      </div>
                                    );
                                  })}
                                  {automations.filter(a => a.groupId === group.id && a.actionType === 'Group Transition').length === 0 && (
                                    <div className="text-xs text-guesty-forest/40 italic text-center px-4">No outgoing automations</div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="border border-guesty-beige rounded-[12px] overflow-hidden">
                              <table className="w-full text-left text-sm">
                                <thead className="bg-guesty-cream/50 text-guesty-forest/70 uppercase tracking-wider text-xs border-b border-guesty-beige">
                                  <tr>
                                    <th className="p-4 font-bold">Automation Name</th>
                                    <th className="p-4 font-bold">Trigger</th>
                                    <th className="p-4 font-bold">Action</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold">Affected Users</th>
                                    <th className="p-4 font-bold text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-guesty-beige">
                                  {automations.filter(a => a.groupId === group.id && a.name.toLowerCase().includes(automationSearchQuery.toLowerCase())).map(automation => (
                                    <tr key={automation.id} className="hover:bg-guesty-cream/30">
                                      <td className="p-4 font-bold text-guesty-black">{automation.name}</td>
                                      <td className="p-4">
                                        <p className="font-bold text-guesty-black text-xs">{automation.triggerType}</p>
                                        <p className="text-[10px] text-guesty-forest/60 mt-0.5">{automation.triggerCondition}</p>
                                      </td>
                                      <td className="p-4">
                                        <p className="font-bold text-guesty-black text-xs">{automation.actionType}</p>
                                        {automation.actionType === 'Auto-Enrollment' ? (
                                          <button 
                                            onClick={() => {
                                              const targetCourse = courses.find(c => c.title === automation.actionTarget);
                                              if (targetCourse) {
                                                setPreviousModule({ tab: 'groups', id: group.id });
                                                setActiveCourseId(targetCourse.id);
                                                setActiveTab('courses');
                                              }
                                            }}
                                            className="text-[10px] text-guesty-ocean hover:underline mt-0.5 text-left font-bold"
                                          >
                                            {automation.actionTarget}
                                          </button>
                                        ) : (
                                          <p className="text-[10px] text-guesty-forest/60 mt-0.5">{automation.actionTarget}</p>
                                        )}
                                      </td>
                                      <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${automation.status === 'Active' ? 'bg-guesty-nature/10 text-guesty-nature' : 'bg-guesty-beige/50 text-guesty-forest/60'}`}>
                                          {automation.status}
                                        </span>
                                      </td>
                                      <td className="p-4 text-guesty-forest font-bold">{automation.affectedUsers}</td>
                                      <td className="p-4 text-right">
                                        <div className="relative inline-block text-left" onClick={e => e.stopPropagation()}>
                                          <button 
                                            onClick={() => setOpenDropdownId(openDropdownId === automation.id ? null : automation.id)}
                                            className="p-2 text-guesty-forest/50 hover:text-guesty-ocean hover:bg-guesty-ice rounded-[8px] transition-colors"
                                          >
                                            <MoreVertical className="w-4 h-4" />
                                          </button>
                                          
                                          {openDropdownId === automation.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-[12px] shadow-lg border border-guesty-beige py-2 z-50">
                                              <button 
                                                onClick={() => setOpenDropdownId(null)}
                                                className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                              >
                                                <Edit2 className="w-4 h-4" /> Edit
                                              </button>
                                              <button 
                                                onClick={() => {
                                                  setAutomations(automations.map(a => a.id === automation.id ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a));
                                                  setOpenDropdownId(null);
                                                }}
                                                className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                              >
                                                {automation.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {automation.status === 'Active' ? 'Pause' : 'Activate'}
                                              </button>
                                              <button 
                                                onClick={() => handleDuplicateAutomation(automation.id)}
                                                className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                              >
                                                <Layers className="w-4 h-4" /> Duplicate
                                              </button>
                                              <button 
                                                onClick={() => handleViewAutomationLogs(automation.name)}
                                                className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                              >
                                                <History className="w-4 h-4" /> View Logs
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                  {automations.filter(a => a.groupId === group.id && a.name.toLowerCase().includes(automationSearchQuery.toLowerCase())).length === 0 && (
                                    <tr>
                                      <td colSpan={6} className="p-8 text-center text-guesty-forest/50">
                                        No automations found.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- ADMIN CENTRAL REPOSITORY --- */}
          {environment === 'admin' && activeTab === 'repository' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-guesty-black tracking-tight">Central Repository</h2>
                  <p className="text-guesty-forest/70 mt-2 text-lg">Manage standalone training materials, versions, and data tracking.</p>
                </div>
                <button onClick={() => setShowUploadModal(true)} className={`${theme.primary} ${theme.textPrimary} ${theme.primaryHover} font-bold px-5 py-3 rounded-[12px] shadow-sm transition-colors flex items-center gap-2`}>
                  <Plus className="w-5 h-5" /> Upload Material
                </button>
              </div>

              <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-64 shrink-0 space-y-4">
                  <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-guesty-black">Folders</h3>
                      <button 
                        onClick={() => {
                          setCreateFolderParentId(null);
                          setNewFolderName('');
                          setShowCreateFolderModal(true);
                        }}
                        className="p-1 text-guesty-forest/40 hover:text-guesty-ocean hover:bg-guesty-ocean/10 rounded-md transition-colors"
                        title="Create Root Folder"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <button 
                        onClick={() => setSelectedRepositoryFolderId(null)}
                        className={`w-full text-left px-3 py-2 rounded-[8px] text-sm font-bold flex items-center gap-2 transition-colors ${!selectedRepositoryFolderId ? 'bg-guesty-ocean/10 text-guesty-ocean' : 'text-guesty-forest/70 hover:bg-guesty-cream/50 hover:text-guesty-black'}`}
                      >
                        <Folder className={`w-4 h-4 ${!selectedRepositoryFolderId ? 'text-guesty-ocean' : 'text-guesty-forest/40'}`} /> All Materials
                      </button>
                      <FolderTree parentId={null} level={0} selectedId={selectedRepositoryFolderId} onSelect={setSelectedRepositoryFolderId} showCreateButton={true} />
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                  {/* Breadcrumb Header */}
                  <div className="bg-white rounded-[16px] border border-guesty-beige shadow-sm px-6 py-4 flex items-center gap-2 text-sm font-bold text-guesty-forest/70">
                    <button onClick={() => setSelectedRepositoryFolderId(null)} className="hover:text-guesty-black transition-colors">Central Repository</button>
                    {selectedRepositoryFolderId && getFolderBreadcrumbs(selectedRepositoryFolderId).map((crumb) => (
                      <React.Fragment key={crumb.id}>
                        <ChevronRight className="w-4 h-4" />
                        <button onClick={() => setSelectedRepositoryFolderId(crumb.id)} className="hover:text-guesty-black transition-colors">{crumb.name}</button>
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mb-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-guesty-forest/40" />
                      <input 
                        type="text" 
                        placeholder="Search training materials by name..." 
                        value={repositorySearchQuery}
                        onChange={(e) => setRepositorySearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-[12px] border border-guesty-beige focus:outline-none focus:border-guesty-teal focus:ring-1 focus:ring-guesty-teal transition-all bg-white"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                        <select 
                          value={repositoryFilterType}
                          onChange={(e) => setRepositoryFilterType(e.target.value)}
                          className="pl-9 pr-8 py-3 rounded-[12px] border border-guesty-beige focus:outline-none focus:border-guesty-teal appearance-none bg-white font-bold text-sm text-guesty-forest"
                        >
                          <option value="All">All Types</option>
                          <option value="Video">Video</option>
                          <option value="SCORM">SCORM</option>
                          <option value="PDF">PDF</option>
                          <option value="Assessment">Assessment</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                        <select 
                          value={repositoryFilterVersion}
                          onChange={(e) => setRepositoryFilterVersion(e.target.value)}
                          className="pl-9 pr-8 py-3 rounded-[12px] border border-guesty-beige focus:outline-none focus:border-guesty-teal appearance-none bg-white font-bold text-sm text-guesty-forest"
                        >
                          <option value="All">All Versions</option>
                          {Array.from(new Set(repository.map(item => item.version))).map(version => (
                            <option key={version as string} value={version as string}>{version as string}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                        <select 
                          value={repositoryFilterStatus}
                          onChange={(e) => setRepositoryFilterStatus(e.target.value)}
                          className="pl-9 pr-8 py-3 rounded-[12px] border border-guesty-beige focus:outline-none focus:border-guesty-teal appearance-none bg-white font-bold text-sm text-guesty-forest"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Archived">Archived</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-guesty-cream/50 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">
                        <th className="p-5 pl-8 font-bold">Material Name</th>
                        <th className="p-5 font-bold">Type</th>
                        <th className="p-5 font-bold">Data Tracking</th>
                        <th className="p-5 font-bold">Linked Courses</th>
                        <th className="p-5 font-bold">Version History</th>
                        <th className="p-5 font-bold">Status</th>
                        <th className="p-5 pr-8 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-guesty-beige">
                      {filteredRepository.map((item) => (
                        <tr key={item.id} className={`hover:bg-guesty-cream/30 transition-colors ${item.status === 'Archived' ? 'opacity-60' : ''}`}>
                          <td className="p-5 pl-8">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-3">
                                <div className="text-guesty-forest/40">{getIconForType(item.type)}</div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-guesty-black">{item.title}</span>
                                  <span className="text-xs text-guesty-forest/60 flex items-center gap-1 mt-0.5">
                                    <Folder className="w-3 h-3" />
                                    {getFolderPath(item.folderId)}
                                  </span>
                                </div>
                              </div>
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1 ml-8">
                                  {item.tags.map((tag: string, idx: number) => (
                                    <span key={idx} className="text-[10px] font-bold bg-guesty-cream text-guesty-forest/70 px-1.5 py-0.5 rounded-[4px]">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-5 text-sm font-bold text-guesty-forest/60">{item.type}</td>
                          <td className="p-5">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-guesty-black">{item.views} Views</span>
                              <span className="text-xs text-guesty-forest/60">{item.completionRate} Avg. Completion</span>
                            </div>
                          </td>
                          <td className="p-5">
                            <button 
                              onClick={() => { setSelectedLinkedAsset(item); setShowLinkedCoursesModal(true); }}
                              className="text-sm font-bold text-guesty-ocean hover:text-guesty-ocean/80 underline decoration-guesty-ocean/30 underline-offset-4 transition-colors"
                            >
                              {courses.filter(c => c.modules?.some((m: any) => m.id === item.id)).length}
                            </button>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold bg-guesty-cloud text-guesty-ocean px-2 py-1 rounded-[4px]">{item.version}</span>
                              <button 
                                onClick={() => { setSelectedAsset(item); setShowUpdateModal(true); }}
                                className="text-guesty-forest/40 hover:text-guesty-forest transition-colors" 
                                title="Upload New Version"
                              >
                                <History className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="p-5">
                            <button 
                              onClick={() => {
                                if (item.status === 'Active') {
                                  setAssetToArchive(item);
                                  setShowArchiveModal(true);
                                } else {
                                  setRepository(repository.map(r => r.id === item.id ? { ...r, status: 'Active' } : r));
                                }
                              }}
                              className={`text-xs font-bold px-3 py-1 rounded-[6px] uppercase tracking-wider transition-colors cursor-pointer hover:opacity-80 ${item.status === 'Active' ? 'bg-guesty-ice/50 text-guesty-nature' : 'bg-guesty-beige text-guesty-forest/60'}`}
                            >
                              {item.status}
                            </button>
                          </td>
                          <td className="p-5 pr-8 text-right">
                            <div className="flex justify-end gap-2 relative">
                              <button 
                                onClick={() => setPreviewAsset(item)}
                                className="p-2 text-guesty-forest/60 hover:text-guesty-black hover:bg-guesty-beige rounded-[8px] transition-colors" 
                                title="Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setAssetToEdit(item);
                                  setShowEditAssetModal(true);
                                }}
                                className="p-2 text-guesty-forest/60 hover:text-guesty-black hover:bg-guesty-beige rounded-[8px] transition-colors" 
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setAssetToDelete(item);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 text-guesty-forest/60 hover:text-guesty-merlot hover:bg-guesty-blush rounded-[8px] transition-colors" 
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="relative">
                                <button 
                                  onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                                  className={`p-2 rounded-[8px] transition-colors ${openDropdownId === item.id ? 'bg-guesty-beige text-guesty-black' : 'text-guesty-forest/60 hover:text-guesty-black hover:bg-guesty-beige'}`}
                                  title="Actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {openDropdownId === item.id && (
                                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-[12px] shadow-lg border border-guesty-beige py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-200">
                                    <button 
                                      onClick={() => {
                                        setAssetToMove(item);
                                        setSelectedMoveFolderId(item.folderId || null);
                                        setShowMoveModal(true);
                                        setOpenDropdownId(null);
                                      }}
                                      className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                                    >
                                      <FolderOpen className="w-4 h-4" /> Move To
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADMIN COURSE PRODUCTION (REUSABILITY DEMO) --- */}
      {environment === 'admin' && activeTab === 'courses' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {previousModule && previousModule.tab === 'groups' && (
                <button 
                  onClick={() => {
                    setActiveTab('groups');
                    if (previousModule.id) {
                      setSelectedGroupId(previousModule.id);
                      setGroupTab('courses');
                    }
                    setPreviousModule(null);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-guesty-ocean hover:underline mb-[-1rem]"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Group
                </button>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-guesty-black tracking-tight">Course Production</h2>
                  <p className="text-guesty-forest/70 mt-2 text-lg">Build courses and manage your central asset repository.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowScormModal(true)} className="bg-white border border-guesty-beige text-guesty-black font-bold px-5 py-3 rounded-[12px] shadow-sm hover:bg-guesty-beige/50 transition-colors flex items-center gap-2">
                    <FileArchive className="w-5 h-5" /> Upload SCORM
                  </button>
                  <button onClick={() => setShowUploadModal(true)} className="bg-white border border-guesty-beige text-guesty-black font-bold px-5 py-3 rounded-[12px] shadow-sm hover:bg-guesty-beige/50 transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Upload New Asset
                  </button>
                  <button onClick={() => setShowCourseWizard(true)} className={`${theme.primary} ${theme.textPrimary} ${theme.primaryHover} font-bold px-5 py-3 rounded-[12px] shadow-sm transition-colors flex items-center gap-2`}>
                    <Plus className="w-5 h-5" /> Create Course
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Course Builder */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-8 border-b border-guesty-beige bg-guesty-cream/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-3 py-1 rounded-[6px] uppercase tracking-wider ${
                            activeCourse.status === 'Published' ? 'bg-guesty-ice/50 text-guesty-nature' :
                            activeCourse.status === 'Under Maintenance' ? 'bg-guesty-beige text-guesty-forest/70' :
                            'bg-guesty-peach/30 text-guesty-merlot'
                          }`}>{activeCourse.status}</span>
                          <span className="text-xs font-bold text-guesty-forest/60">{activeCourse.audience}</span>
                        </div>
                        <button 
                          onClick={() => setCourses(courses.map(c => c.id === activeCourseId ? { ...c, status: c.status === 'Published' ? 'Under Maintenance' : 'Published' } : c))}
                          className={`text-xs font-bold px-4 py-2 rounded-[8px] transition-colors ${
                            activeCourse.status === 'Published' 
                              ? 'bg-white border border-guesty-beige text-guesty-forest hover:bg-guesty-beige/50' 
                              : 'bg-guesty-nature text-white hover:bg-[#11554f] shadow-sm'
                          }`}
                        >
                          {activeCourse.status === 'Published' ? 'Unpublish Course' : 'Publish Course'}
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold text-guesty-black">{activeCourse.title}</h3>
                      
                      {/* Tabs */}
                      <div className="flex gap-6 mt-6 border-b border-guesty-beige/50">
                        <button 
                          onClick={() => setCourseBuilderTab('content')} 
                          className={`pb-3 text-sm font-bold transition-colors relative ${courseBuilderTab === 'content' ? 'text-guesty-nature' : 'text-guesty-forest/50 hover:text-guesty-forest'}`}
                        >
                          Content Modules
                          {courseBuilderTab === 'content' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-guesty-nature rounded-t-full"></div>}
                        </button>
                        <button 
                          onClick={() => setCourseBuilderTab('enrollment')} 
                          className={`pb-3 text-sm font-bold transition-colors relative ${courseBuilderTab === 'enrollment' ? 'text-guesty-nature' : 'text-guesty-forest/50 hover:text-guesty-forest'}`}
                        >
                          Settings & Enrollment
                          {courseBuilderTab === 'enrollment' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-guesty-nature rounded-t-full"></div>}
                        </button>
                        <button 
                          onClick={() => setCourseBuilderTab('access')} 
                          className={`pb-3 text-sm font-bold transition-colors relative ${courseBuilderTab === 'access' ? 'text-guesty-nature' : 'text-guesty-forest/50 hover:text-guesty-forest'}`}
                        >
                          Access Control
                          {courseBuilderTab === 'access' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-guesty-nature rounded-t-full"></div>}
                        </button>
                      </div>
                    </div>
                    
                    {courseBuilderTab === 'content' && (
                      <div className="p-8 flex-1 bg-guesty-cream/10">
                        <h4 className="text-sm font-bold text-guesty-forest/60 uppercase tracking-widest mb-4">Course Modules</h4>
                        <div className="space-y-3">
                          {activeCourse.modules.map((mod, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-[16px] border border-guesty-beige shadow-sm group hover:border-guesty-forest/30 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="text-guesty-forest/40 cursor-grab">
                                  <Layers className="w-5 h-5" />
                                </div>
                                <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center bg-guesty-cream text-guesty-forest`}>
                                  {getIconForType(mod.type)}
                                </div>
                                <div>
                                  <h5 className="font-bold text-guesty-black">{mod.title}</h5>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-bold text-guesty-forest/60">{mod.type}</span>
                                    <span className="w-1 h-1 rounded-full bg-guesty-beige"></span>
                                    <span className="text-xs font-bold text-guesty-ocean bg-guesty-cloud px-2 py-0.5 rounded-[4px]">{mod.version}</span>
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  setCourses(courses.map(c => c.id === activeCourseId ? { ...c, modules: c.modules.filter(m => m.id !== mod.id) } : c));
                                }}
                                className="text-guesty-forest/40 hover:text-guesty-merlot transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                          
                          <div className="w-full py-6 border-2 border-dashed border-guesty-beige rounded-[16px] text-center bg-white/50">
                            <p className="text-sm font-bold text-guesty-black mb-1">Need more content?</p>
                            <p className="text-xs text-guesty-forest/60 mb-4">Link existing assets from the Central Repository on the right.</p>
                            <div className="inline-flex items-center gap-2 text-guesty-nature font-bold text-sm bg-guesty-ice/30 px-4 py-2 rounded-[8px]">
                              <ArrowRight className="w-4 h-4" /> Browse Repository
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {courseBuilderTab === 'enrollment' && (
                      <div className="p-8 flex-1 bg-guesty-cream/10 space-y-8 overflow-y-auto">
                        {/* Course Details */}
                        <div>
                          <h4 className="text-sm font-bold text-guesty-forest/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4"/> Course Details
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-bold text-guesty-black mb-1">Course Title</label>
                              <input 
                                type="text" 
                                value={activeCourse.title}
                                onChange={(e) => setCourses(courses.map(c => c.id === activeCourseId ? { ...c, title: e.target.value } : c))}
                                className="w-full px-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-guesty-black mb-1">Thumbnail URL</label>
                              <input 
                                type="text" 
                                value={activeCourse.thumbnail || ''}
                                onChange={(e) => setCourses(courses.map(c => c.id === activeCourseId ? { ...c, thumbnail: e.target.value } : c))}
                                className="w-full px-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                              />
                              {activeCourse.thumbnail && (
                                <div className="mt-2 h-32 w-48 rounded-[8px] overflow-hidden border border-guesty-beige">
                                  <img src={activeCourse.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-guesty-black mb-1">Enrollment Type</label>
                              <select 
                                value={activeCourse.enrollmentType || 'Auto'}
                                onChange={(e) => setCourses(courses.map(c => c.id === activeCourseId ? { ...c, enrollmentType: e.target.value } : c))}
                                className="w-full px-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                              >
                                <option value="Auto">Auto (Start Course)</option>
                                <option value="Manual">Manual (Request Enrollment)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Sites */}
                        <div>
                          <h4 className="text-sm font-bold text-guesty-forest/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Globe className="w-4 h-4"/> Assigned Sites
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {activeCourse.enrolledSites?.map((site: string) => (
                              <span key={site} className="bg-white border border-guesty-beige px-4 py-2 rounded-[8px] text-sm font-bold text-guesty-black flex items-center gap-2 shadow-sm">
                                {site} 
                                <button className="text-guesty-forest/40 hover:text-guesty-merlot transition-colors"><X className="w-3 h-3"/></button>
                              </span>
                            ))}
                            <button className="bg-guesty-cream border border-dashed border-guesty-forest/30 px-4 py-2 rounded-[8px] text-sm font-bold text-guesty-forest/60 hover:bg-guesty-beige transition-colors flex items-center gap-2">
                              <Plus className="w-4 h-4"/> Add Site
                            </button>
                          </div>
                        </div>

                        {/* Groups */}
                        <div>
                          <h4 className="text-sm font-bold text-guesty-forest/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4"/> Enrolled Groups
                          </h4>
                          <div className="space-y-2">
                            {activeCourse.enrolledGroups?.map(group => (
                              <div key={group} className="bg-white border border-guesty-beige p-4 rounded-[12px] flex items-center justify-between shadow-sm group hover:border-guesty-forest/30 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-guesty-ice/50 text-guesty-ocean flex items-center justify-center">
                                    <Users className="w-4 h-4"/>
                                  </div>
                                  <span className="font-bold text-guesty-black">{group}</span>
                                </div>
                                <button className="text-guesty-forest/40 hover:text-guesty-merlot transition-colors">
                                  <X className="w-4 h-4"/>
                                </button>
                              </div>
                            ))}
                            <button className="w-full py-4 border-2 border-dashed border-guesty-beige rounded-[12px] text-guesty-forest/60 font-bold hover:bg-guesty-cream hover:border-guesty-forest/30 transition-all flex items-center justify-center gap-2 mt-2">
                              <Plus className="w-5 h-5" /> Assign New Group or User
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {courseBuilderTab === 'access' && (
                      <div className="p-8 flex-1 bg-guesty-cream/10 space-y-8 overflow-y-auto">
                        {/* Global Visibility Toggle */}
                        <div className="flex items-center justify-between bg-white p-6 rounded-[16px] border border-guesty-beige shadow-sm">
                          <div>
                            <h4 className="font-bold text-guesty-black flex items-center gap-2"><Eye className="w-5 h-5 text-guesty-ocean" /> Catalog Visibility</h4>
                            <p className="text-sm text-guesty-forest/70 mt-1">Determine if this course appears in the public catalog for all users.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={activeCourse.publicVisibility || false}
                              onChange={(e) => setCourses(courses.map(c => c.id === activeCourseId ? { ...c, publicVisibility: e.target.checked } : c))}
                            />
                            <div className="w-11 h-6 bg-guesty-beige peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-guesty-ocean"></div>
                            <span className="ml-3 text-sm font-bold text-guesty-black">{activeCourse.publicVisibility ? 'Show in Public Catalog' : 'Private/Hidden'}</span>
                          </label>
                        </div>

                        {/* Conflict Alerts */}
                        <div className="bg-guesty-peach/20 border border-guesty-peach/50 rounded-[16px] p-6 flex gap-4">
                          <ShieldAlert className="w-6 h-6 text-guesty-merlot flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-guesty-merlot mb-1">Permission Conflicts Detected</h4>
                            <p className="text-sm text-guesty-merlot/80 mb-3">1 user belongs to multiple groups with conflicting access rules.</p>
                            <div className="bg-white/50 rounded-[8px] p-3 text-sm border border-guesty-peach/30">
                              <span className="font-bold">Alex Chen</span> belongs to <span className="font-bold">Data Team</span> (Auto-Enroll) and <span className="font-bold">Contractors</span> (Hidden).
                              <button onClick={() => setShowConflictResolutionModal(true)} className="ml-4 text-guesty-merlot font-bold hover:underline">Resolve Conflict</button>
                            </div>
                          </div>
                        </div>

                        {/* Access Rules Table */}
                        <div className="bg-white rounded-[16px] border border-guesty-beige shadow-sm overflow-hidden">
                          <div className="p-6 border-b border-guesty-beige flex justify-between items-center bg-guesty-cream/30">
                            <div>
                              <h4 className="font-bold text-guesty-black flex items-center gap-2"><Shield className="w-5 h-5 text-guesty-ocean" /> Access Rules</h4>
                              <p className="text-sm text-guesty-forest/70 mt-1">Manage granular access permissions for groups, roles, and individuals.</p>
                            </div>
                            <button 
                              onClick={() => setShowAccessRuleModal(true)}
                              className="bg-guesty-ocean text-white px-4 py-2 rounded-[8px] font-bold text-sm flex items-center gap-2 hover:bg-guesty-ocean/90 transition-colors shadow-sm"
                            >
                              <Plus className="w-4 h-4" /> Assign Access Rule
                            </button>
                          </div>
                          <table className="w-full text-left">
                            <thead className="bg-guesty-cream/50 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest border-b border-guesty-beige">
                              <tr>
                                <th className="p-4 pl-6">Who has access</th>
                                <th className="p-4">Access Type</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-guesty-beige">
                              {activeCourse.accessRules?.map((rule: any) => (
                                <tr key={rule.id} className="hover:bg-guesty-cream/20 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="font-bold text-guesty-black">{rule.targetName}</div>
                                    <div className="text-xs text-guesty-forest/60 uppercase tracking-wider mt-0.5">{rule.targetType}</div>
                                  </td>
                                  <td className="p-4">
                                    <select 
                                      value={rule.accessType}
                                      onChange={(e) => {
                                        const updatedRules = activeCourse.accessRules.map((r: any) => r.id === rule.id ? { ...r, accessType: e.target.value } : r);
                                        setCourses(courses.map(c => c.id === activeCourseId ? { ...c, accessRules: updatedRules } : c));
                                      }}
                                      className="border border-guesty-beige rounded-[6px] text-sm px-3 py-1.5 bg-white focus:border-guesty-ocean outline-none font-medium text-guesty-black"
                                    >
                                      <option value="Open">Open</option>
                                      <option value="Auto-Enroll">Auto-Enroll</option>
                                      <option value="Manual Request">Manual Request</option>
                                      <option value="View Only">View Only</option>
                                    </select>
                                  </td>
                                  <td className="p-4">
                                    <select
                                      value={rule.status}
                                      onChange={(e) => {
                                        const updatedRules = activeCourse.accessRules.map((r: any) => r.id === rule.id ? { ...r, status: e.target.value } : r);
                                        setCourses(courses.map(c => c.id === activeCourseId ? { ...c, accessRules: updatedRules } : c));
                                      }}
                                      className={`px-2.5 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer ${rule.status === 'Active' ? 'bg-guesty-ice/50 text-guesty-nature' : 'bg-guesty-peach/30 text-guesty-merlot'}`}
                                    >
                                      <option value="Active" className="bg-white text-guesty-black">Active</option>
                                      <option value="Expired" className="bg-white text-guesty-black">Expired</option>
                                    </select>
                                  </td>
                                  <td className="p-4 pr-6 text-right">
                                    <button 
                                      onClick={() => {
                                        const updatedRules = activeCourse.accessRules.filter((r: any) => r.id !== rule.id);
                                        setCourses(courses.map(c => c.id === activeCourseId ? { ...c, accessRules: updatedRules } : c));
                                      }}
                                      className="text-guesty-forest/40 hover:text-guesty-merlot transition-colors p-2 rounded-full hover:bg-guesty-peach/10"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {(!activeCourse.accessRules || activeCourse.accessRules.length === 0) && (
                                <tr>
                                  <td colSpan={4} className="p-8 text-center text-guesty-forest/60 text-sm">
                                    No access rules defined. Click "Assign Group to Course" to add one.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Central Repository */}
                <div className="space-y-6">
                  <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden h-full flex flex-col">
                    <div className="p-6 border-b border-guesty-beige">
                      <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                        <Database className="w-5 h-5 text-guesty-nature" /> Central Repository
                      </h3>
                      <div className="relative mt-4">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-guesty-forest/50" />
                        <input 
                          type="text" 
                          placeholder="Search assets..." 
                          value={assetSearchQuery}
                          onChange={(e) => setAssetSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-guesty-cream border-transparent rounded-[8px] text-sm focus:bg-white focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 overflow-y-auto space-y-2">
                      {repository.filter(asset => asset.title.toLowerCase().includes(assetSearchQuery.toLowerCase())).map((asset) => (
                        <div key={asset.id} className="p-4 rounded-[12px] border border-guesty-beige hover:border-guesty-nature/50 hover:bg-guesty-ice/10 transition-colors group">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="text-guesty-forest/70">{getIconForType(asset.type)}</div>
                              <h5 className="font-bold text-guesty-black text-sm leading-tight">{asset.title}</h5>
                            </div>
                            <button 
                              onClick={() => setPreviewAsset(asset)}
                              className="text-guesty-forest/40 hover:text-guesty-black transition-colors"
                              title="Preview Asset"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-guesty-forest/60 uppercase tracking-wider bg-guesty-cream px-2 py-1 rounded-[4px]">{asset.type}</span>
                              <span className="text-[10px] font-bold text-guesty-ocean bg-guesty-cloud px-2 py-1 rounded-[4px]">{asset.version}</span>
                            </div>
                            <span className="text-[10px] font-bold text-guesty-forest/50">Used in {courses.filter(c => c.modules?.some((m: any) => m.id === asset.id)).length} courses</span>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-guesty-beige/50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setCourses(courses.map(c => c.id === activeCourseId ? { ...c, modules: [...c.modules, asset] } : c));
                              }}
                              className="flex-1 bg-guesty-cream hover:bg-guesty-beige text-guesty-black text-xs font-bold py-2 rounded-[6px] transition-colors"
                            >
                              Add to Course
                            </button>
                            <button 
                              onClick={() => { setSelectedAsset(asset); setShowUpdateModal(true); }}
                              className="flex-1 bg-guesty-forest text-white hover:bg-guesty-nature text-xs font-bold py-2 rounded-[6px] transition-colors flex items-center justify-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Update
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* --- ADMIN PERMISSIONS DASHBOARD --- */}
          {environment === 'admin' && activeTab === 'permissions' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-display font-bold text-guesty-black">Permissions Dashboard</h2>
                  <p className="text-guesty-forest/70 mt-2 text-lg">Manage access rules across all courses and groups.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-guesty-cream/50 p-1 rounded-[12px] border border-guesty-beige">
                    <button
                      onClick={() => setPermissionsViewToggle('Course-to-Group')}
                      className={`px-4 py-2 text-sm font-bold rounded-[8px] transition-all ${permissionsViewToggle === 'Course-to-Group' ? 'bg-white shadow-sm text-guesty-ocean' : 'text-guesty-forest/60 hover:text-guesty-black'}`}
                    >
                      Course-to-Group
                    </button>
                    <button
                      onClick={() => setPermissionsViewToggle('Group-to-Course')}
                      className={`px-4 py-2 text-sm font-bold rounded-[8px] transition-all ${permissionsViewToggle === 'Group-to-Course' ? 'bg-white shadow-sm text-guesty-ocean' : 'text-guesty-forest/60 hover:text-guesty-black'}`}
                    >
                      Group-to-Course
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      if (permissionsSelectedCourses.length > 0) {
                        setShowPermissionsBulkAssignModal(true);
                      }
                    }}
                    disabled={permissionsSelectedCourses.length === 0}
                    className={`px-5 py-2.5 rounded-[12px] font-bold shadow-sm transition-colors flex items-center gap-2 ${permissionsSelectedCourses.length > 0 ? 'bg-guesty-ocean text-white hover:bg-guesty-ocean/90' : 'bg-guesty-beige text-guesty-forest/40 cursor-not-allowed'}`}
                  >
                    <Users className="w-5 h-5" /> Bulk Assign Group
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-guesty-beige flex flex-col md:flex-row md:items-center justify-between gap-4 bg-guesty-cream/30">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-guesty-forest/40" />
                    <input 
                      type="text" 
                      placeholder="Search by Course Title or Group Name..." 
                      value={permissionsSearchQuery}
                      onChange={e => setPermissionsSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-guesty-cream/50 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest border-b border-guesty-beige">
                      <tr>
                        {permissionsViewToggle === 'Course-to-Group' && (
                          <th className="p-5 pl-6 w-12">
                            <input 
                              type="checkbox" 
                              className="rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                              checked={permissionsSelectedCourses.length === courses.length && courses.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPermissionsSelectedCourses(courses.map(c => c.id));
                                } else {
                                  setPermissionsSelectedCourses([]);
                                }
                              }}
                            />
                          </th>
                        )}
                        <th className="p-5 font-bold">{permissionsViewToggle === 'Course-to-Group' ? 'Course Name' : 'Group Name'}</th>
                        <th className="p-5 font-bold">{permissionsViewToggle === 'Course-to-Group' ? 'Assigned To' : 'Courses'}</th>
                        <th className="p-5 font-bold">Status</th>
                        <th className="p-5 font-bold">Access Type</th>
                        <th className="p-5 pr-6 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-guesty-beige">
                      {permissionsViewToggle === 'Course-to-Group' ? (
                        courses.filter(c => 
                          c.title.toLowerCase().includes(permissionsSearchQuery.toLowerCase()) || 
                          (c.accessRules && c.accessRules.some((r: any) => r.targetName.toLowerCase().includes(permissionsSearchQuery.toLowerCase())))
                        ).map(course => (
                          <React.Fragment key={course.id}>
                            {(!course.accessRules || course.accessRules.length === 0) ? (
                              <tr className="hover:bg-guesty-cream/20 transition-colors">
                                <td className="p-5 pl-6">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                                    checked={permissionsSelectedCourses.includes(course.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setPermissionsSelectedCourses([...permissionsSelectedCourses, course.id]);
                                      } else {
                                        setPermissionsSelectedCourses(permissionsSelectedCourses.filter(id => id !== course.id));
                                      }
                                    }}
                                  />
                                </td>
                                <td className="p-5">
                                  <button onClick={() => { setActiveCourseId(course.id); setCourseBuilderTab('access'); setActiveTab('courses'); }} className="font-bold text-guesty-black hover:text-guesty-ocean hover:underline text-left">
                                    {course.title}
                                  </button>
                                </td>
                                <td className="p-5 text-guesty-forest/50 text-sm italic">No groups assigned</td>
                                <td className="p-5">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${course.publicVisibility ? 'bg-guesty-ice/50 text-guesty-ocean' : 'bg-guesty-beige text-guesty-forest/60'}`}>
                                    {course.publicVisibility ? 'Public' : 'Hidden'}
                                  </span>
                                </td>
                                <td className="p-5">-</td>
                                <td className="p-5 pr-6 text-right">
                                  <button onClick={() => { setActiveCourseId(course.id); setCourseBuilderTab('access'); setActiveTab('courses'); }} className="text-guesty-ocean font-bold text-sm hover:underline">Edit Rules</button>
                                </td>
                              </tr>
                            ) : (
                              course.accessRules.map((rule: any, index: number) => {
                                const isConflict = false; // Add conflict logic here if needed
                                return (
                                  <tr key={rule.id} className="hover:bg-guesty-cream/20 transition-colors">
                                    {index === 0 && (
                                      <td className="p-5 pl-6" rowSpan={course.accessRules.length}>
                                        <input 
                                          type="checkbox" 
                                          className="rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                                          checked={permissionsSelectedCourses.includes(course.id)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setPermissionsSelectedCourses([...permissionsSelectedCourses, course.id]);
                                            } else {
                                              setPermissionsSelectedCourses(permissionsSelectedCourses.filter(id => id !== course.id));
                                            }
                                          }}
                                        />
                                      </td>
                                    )}
                                    {index === 0 && (
                                      <td className="p-5" rowSpan={course.accessRules.length}>
                                        <button onClick={() => { setActiveCourseId(course.id); setCourseBuilderTab('access'); setActiveTab('courses'); }} className="font-bold text-guesty-black hover:text-guesty-ocean hover:underline text-left">
                                          {course.title}
                                        </button>
                                      </td>
                                    )}
                                    <td className="p-5">
                                      <div className="font-bold text-guesty-black">{rule.targetName}</div>
                                      <div className="text-xs text-guesty-forest/60 uppercase tracking-wider mt-0.5">{rule.targetType}</div>
                                    </td>
                                    <td className="p-5">
                                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${rule.status === 'Active' ? 'bg-guesty-ice/50 text-guesty-nature' : rule.status === 'Expired' ? 'bg-guesty-beige text-guesty-forest/60' : 'bg-guesty-peach/30 text-guesty-merlot'}`}>
                                        {rule.status}
                                      </span>
                                    </td>
                                    <td className="p-5">
                                      <select 
                                        value={rule.accessType}
                                        onChange={(e) => {
                                          const updatedRules = course.accessRules.map((r: any) => r.id === rule.id ? { ...r, accessType: e.target.value } : r);
                                          setCourses(courses.map(c => c.id === course.id ? { ...c, accessRules: updatedRules } : c));
                                        }}
                                        className="border border-guesty-beige rounded-[6px] text-sm px-3 py-1.5 bg-white focus:border-guesty-ocean outline-none font-medium text-guesty-black"
                                      >
                                        <option value="Open">Open</option>
                                        <option value="Auto-Enroll">Auto-Enroll</option>
                                        <option value="Manual Request">Manual Request</option>
                                        <option value="View Only">View Only</option>
                                      </select>
                                    </td>
                                    <td className="p-5 pr-6 text-right">
                                      <button 
                                        onClick={() => {
                                          const updatedRules = course.accessRules.filter((r: any) => r.id !== rule.id);
                                          setCourses(courses.map(c => c.id === course.id ? { ...c, accessRules: updatedRules } : c));
                                        }}
                                        className="text-guesty-merlot font-bold text-sm hover:underline"
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        availableGroups.filter(g => 
                          g.name.toLowerCase().includes(permissionsSearchQuery.toLowerCase()) || 
                          courses.some(c => c.accessRules && c.accessRules.some((r: any) => r.targetName === g.name && c.title.toLowerCase().includes(permissionsSearchQuery.toLowerCase())))
                        ).map(group => {
                          const groupCourses = courses.filter(c => c.accessRules && c.accessRules.some((r: any) => r.targetName === group.name));
                          return (
                            <React.Fragment key={group.name}>
                              {groupCourses.length === 0 ? (
                                <tr className="hover:bg-guesty-cream/20 transition-colors">
                                  <td className="p-5 pl-6">
                                    <div className="font-bold text-guesty-black">{group.name}</div>
                                    <div className="text-xs text-guesty-forest/60 mt-0.5">Site: Global</div>
                                  </td>
                                  <td className="p-5 text-guesty-forest/50 text-sm italic">No courses assigned</td>
                                  <td className="p-5">-</td>
                                  <td className="p-5">-</td>
                                  <td className="p-5 pr-6 text-right">-</td>
                                </tr>
                              ) : (
                                groupCourses.map((course, index) => {
                                  const rule = course.accessRules.find((r: any) => r.targetName === group.name);
                                  return (
                                    <tr key={`${group.name}-${course.id}`} className="hover:bg-guesty-cream/20 transition-colors">
                                      {index === 0 && (
                                        <td className="p-5 pl-6" rowSpan={groupCourses.length}>
                                          <div className="font-bold text-guesty-black">{group.name}</div>
                                          <div className="text-xs text-guesty-forest/60 mt-0.5">Site: Global</div>
                                        </td>
                                      )}
                                      <td className="p-5">
                                        <button onClick={() => { setActiveCourseId(course.id); setCourseBuilderTab('access'); setActiveTab('courses'); }} className="font-bold text-guesty-black hover:text-guesty-ocean hover:underline text-left">
                                          {course.title}
                                        </button>
                                      </td>
                                      <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${rule.status === 'Active' ? 'bg-guesty-ice/50 text-guesty-nature' : rule.status === 'Expired' ? 'bg-guesty-beige text-guesty-forest/60' : 'bg-guesty-peach/30 text-guesty-merlot'}`}>
                                          {rule.status}
                                        </span>
                                      </td>
                                      <td className="p-5">
                                        <select 
                                          value={rule.accessType}
                                          onChange={(e) => {
                                            const updatedRules = course.accessRules.map((r: any) => r.id === rule.id ? { ...r, accessType: e.target.value } : r);
                                            setCourses(courses.map(c => c.id === course.id ? { ...c, accessRules: updatedRules } : c));
                                          }}
                                          className="border border-guesty-beige rounded-[6px] text-sm px-3 py-1.5 bg-white focus:border-guesty-ocean outline-none font-medium text-guesty-black"
                                        >
                                          <option value="Open">Open</option>
                                          <option value="Auto-Enroll">Auto-Enroll</option>
                                          <option value="Manual Request">Manual Request</option>
                                          <option value="View Only">View Only</option>
                                        </select>
                                      </td>
                                      <td className="p-5 pr-6 text-right">
                                        <button 
                                          onClick={() => {
                                            const updatedRules = course.accessRules.filter((r: any) => r.id !== rule.id);
                                            setCourses(courses.map(c => c.id === course.id ? { ...c, accessRules: updatedRules } : c));
                                          }}
                                          className="text-guesty-merlot font-bold text-sm hover:underline"
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- COURSE CATALOG --- */}
          {environment !== 'admin' && activeTab === 'catalog' && (
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {selectedCatalogCourse ? (
                <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden">
                  <div className="h-64 relative">
                    <img src={selectedCatalogCourse.thumbnail} alt={selectedCatalogCourse.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <button onClick={() => setSelectedCatalogCourse(null)} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-6 left-8 right-8 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-guesty-ocean px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{selectedCatalogCourse.category}</span>
                        <span className="flex items-center gap-1 text-sm"><BookOpen className="w-4 h-4" /> {selectedCatalogCourse.format}</span>
                        <span className="flex items-center gap-1 text-sm"><Clock className="w-4 h-4" /> {selectedCatalogCourse.duration}</span>
                        <span className="flex items-center gap-1 text-sm"><Globe className="w-4 h-4" /> {selectedCatalogCourse.language}</span>
                      </div>
                      <h2 className="text-4xl font-bold">{selectedCatalogCourse.title}</h2>
                    </div>
                  </div>
                  <div className="p-8 grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-guesty-black mb-3">Overview</h3>
                        <p className="text-guesty-forest/80 leading-relaxed">{selectedCatalogCourse.description}</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-guesty-black mb-3">Learning Objectives</h3>
                        <ul className="space-y-2">
                          {selectedCatalogCourse.learningObjectives?.map((obj: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-guesty-forest/80">
                              <CheckCircle2 className="w-5 h-5 text-guesty-ocean shrink-0" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-guesty-black mb-3">Course Content Map</h3>
                        <div className="space-y-3">
                          {selectedCatalogCourse.modules?.map((mod: any, idx: number) => (
                            <div key={mod.id} className="flex items-center justify-between p-4 bg-guesty-ice/30 rounded-[12px] border border-guesty-beige">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-guesty-ocean/10 text-guesty-ocean flex items-center justify-center font-bold text-sm">
                                  {idx + 1}
                                </div>
                                <div>
                                  <p className="font-bold text-guesty-black">{mod.title}</p>
                                  <p className="text-xs text-guesty-forest/60">{mod.type}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!selectedCatalogCourse.modules || selectedCatalogCourse.modules.length === 0) && (
                            <p className="text-guesty-forest/60 italic">Content modules are currently being updated.</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-guesty-ice/30 p-6 rounded-[16px] border border-guesty-beige">
                        <h3 className="font-bold text-guesty-black mb-4">Course Details</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-guesty-forest/60">Difficulty</span>
                            <span className="font-bold text-guesty-black">{selectedCatalogCourse.difficulty}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-guesty-forest/60">Instructors</span>
                            <span className="font-bold text-guesty-black">{selectedCatalogCourse.instructors?.join(', ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-guesty-forest/60">Tags</span>
                            <span className="font-bold text-guesty-black text-right">{selectedCatalogCourse.tags?.join(', ')}</span>
                          </div>
                        </div>
                        {selectedCatalogCourse.enrollmentType === 'Manual' && !selectedCatalogCourse.enrolledGroups?.some((g: string) => ['Data Team', 'All Employees'].includes(g)) ? (
                          <button 
                            onClick={() => {
                              if (!selectedCatalogCourse.enrollmentRequested) {
                                setCourses(courses.map(c => c.id === selectedCatalogCourse.id ? { ...c, enrollmentRequested: true } : c));
                                setSelectedCatalogCourse({ ...selectedCatalogCourse, enrollmentRequested: true });
                              }
                            }}
                            disabled={selectedCatalogCourse.enrollmentRequested}
                            className={`w-full mt-6 font-bold py-3 px-4 rounded-[12px] transition-colors flex items-center justify-center gap-2 ${selectedCatalogCourse.enrollmentRequested ? 'bg-guesty-beige text-guesty-forest/60 cursor-not-allowed' : 'bg-guesty-ocean text-white hover:bg-guesty-ocean/90'}`}
                          >
                            {selectedCatalogCourse.enrollmentRequested ? (
                              <>
                                <CheckCircle className="w-5 h-5" /> Request Sent
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-5 h-5" /> Request Enrollment
                              </>
                            )}
                          </button>
                        ) : (
                          <button 
                            onClick={() => setActiveTab('course-player')}
                            className="w-full mt-6 bg-guesty-ocean text-white font-bold py-3 px-4 rounded-[12px] hover:bg-guesty-ocean/90 transition-colors"
                          >
                            Start Course
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-4xl font-bold text-guesty-black tracking-tight">Course Catalog</h2>
                      <p className="text-guesty-forest/70 mt-2 text-lg">Discover new skills and enroll in available training.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-guesty-forest/50" />
                        <input 
                          type="text" 
                          placeholder="Search courses..." 
                          value={catalogSearchQuery}
                          onChange={(e) => setCatalogSearchQuery(e.target.value)}
                          className="pl-9 pr-4 py-3 bg-white border border-guesty-beige text-guesty-black text-sm font-bold rounded-[12px] focus:ring-guesty-forest focus:border-guesty-forest outline-none shadow-sm w-64"
                        />
                      </div>
                      <select 
                        value={catalogCategory}
                        onChange={(e) => setCatalogCategory(e.target.value)}
                        className="bg-white border border-guesty-beige text-guesty-black text-sm font-bold rounded-[12px] focus:ring-guesty-forest focus:border-guesty-forest block p-3 outline-none shadow-sm"
                      >
                        <option value="All Categories">All Categories</option>
                        <option value="Mandatory">Mandatory</option>
                        <option value="Technical">Technical</option>
                        <option value="Soft Skills">Soft Skills</option>
                        <option value="Compliance">Compliance</option>
                      </select>
                      <select 
                        value={catalogFormat}
                        onChange={(e) => setCatalogFormat(e.target.value)}
                        className="bg-white border border-guesty-beige text-guesty-black text-sm font-bold rounded-[12px] focus:ring-guesty-forest focus:border-guesty-forest block p-3 outline-none shadow-sm"
                      >
                        <option value="All Formats">All Formats</option>
                        <option value="E-learning">E-learning</option>
                        <option value="SCORM">SCORM</option>
                        <option value="Video">Video</option>
                        <option value="Assessment">Assessment</option>
                      </select>
                      <select 
                        value={catalogDifficulty}
                        onChange={(e) => setCatalogDifficulty(e.target.value)}
                        className="bg-white border border-guesty-beige text-guesty-black text-sm font-bold rounded-[12px] focus:ring-guesty-forest focus:border-guesty-forest block p-3 outline-none shadow-sm"
                      >
                        <option value="All Levels">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Recommended Section */}
                  {!catalogSearchQuery && catalogCategory === 'All Categories' && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-guesty-black mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-guesty-ocean" /> Recommended for you
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {courses.filter(c => {
                          if (c.status !== 'Published') return false;
                          
                          let isVisible = true;
                          if (c.visibilityRule === 'Hidden') {
                            isVisible = false;
                          } else if (c.visibilityRule === 'Restricted') {
                            isVisible = c.visibility && c.visibility.length > 0 && c.visibility.some((g: string) => ['Data Team', 'All Employees'].includes(g));
                          }
                          
                          return isVisible && (c.isPinned || isVisible);
                        }).slice(0, 4).map((course) => (
                          <div key={`rec-${course.id}`} className="bg-white rounded-[24px] border border-guesty-ocean/30 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col p-2 relative">
                            {course.isPinned && (
                              <div className="absolute top-4 right-4 z-10 bg-guesty-ocean text-white p-1.5 rounded-full shadow-md">
                                <Pin className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div className="h-48 overflow-hidden relative rounded-[16px]">
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-guesty-night/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button onClick={() => setSelectedCatalogCourse(course)} className="bg-white text-guesty-black font-bold py-3 px-6 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                                  <PlayCircle className="w-5 h-5" /> {course.progress && course.progress > 0 ? 'Continue' : 'Start Course'}
                                </button>
                              </div>
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-[8px] text-xs font-bold text-guesty-black shadow-sm uppercase tracking-widest">
                                {course.category}
                              </div>
                              {(environment as string) === 'admin' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab('courses'); 
                                    setActiveCourseId(course.id); 
                                    setCourseBuilderTab('access');
                                  }}
                                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-guesty-black shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                                  title="Edit Access & Permissions"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">
                                  <BookOpen className="w-4 h-4" /> {course.format}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-guesty-forest/60">
                                  <Clock className="w-3 h-3" /> {course.duration}
                                </div>
                              </div>
                              <h3 className="text-xl font-bold text-guesty-black leading-tight mb-2 group-hover:text-guesty-nature transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-sm text-guesty-forest/70 line-clamp-2 mb-4">{course.description}</p>
                              
                              <div className="mt-auto pt-4 flex items-center justify-between border-t border-guesty-beige/50 relative">
                                <span className="text-xs font-bold text-guesty-forest/50 bg-guesty-ice px-2 py-1 rounded-md">{course.difficulty}</span>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setSelectedCatalogCourse(course)} className={`text-sm font-bold ${course.progress && course.progress > 0 ? 'text-guesty-nature' : theme.textPrimary} hover:opacity-80 transition-opacity flex items-center gap-1.5`}>
                                    {course.progress && course.progress > 0 ? 'Continue Learning' : 'Start Course'} <ChevronRight className="w-4 h-4" />
                                  </button>
                                  <div className="relative">
                                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === `course-${course.id}` ? null : `course-${course.id}`); }} className="p-1.5 text-guesty-forest/60 hover:text-guesty-black rounded-full hover:bg-guesty-beige transition-colors">
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    {openDropdownId === `course-${course.id}` && (
                                      <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-[12px] shadow-lg border border-guesty-beige py-2 z-50">
                                        <button onClick={() => { setSelectedCatalogCourse(course); setOpenDropdownId(null); }} className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors">
                                          <Info className="w-4 h-4" /> View Details
                                        </button>
                                        {(environment as string) === 'admin' && (
                                          <button onClick={() => { 
                                            setActiveTab('courses'); 
                                            setActiveCourseId(course.id); 
                                            setCourseBuilderTab('access');
                                            setOpenDropdownId(null);
                                          }} className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors">
                                            <Edit2 className="w-4 h-4" /> Edit Access & Permissions
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {course.progress !== undefined && course.progress > 0 && (
                                <div className="mt-3">
                                  <div className="flex justify-between text-[10px] font-bold mb-1">
                                    <span className="text-guesty-nature">{course.progress}% Completed</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-guesty-beige rounded-full overflow-hidden">
                                    <div className="h-full bg-guesty-nature rounded-full" style={{ width: `${course.progress}%` }}></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {courses.filter(c => {
                      if (c.status !== 'Published') return false;
                      
                      // Visibility check: Learner belongs to 'Data Team' and 'All Employees'
                      let isVisible = true;
                      if (c.visibilityRule === 'Hidden') {
                        isVisible = false;
                      } else if (c.visibilityRule === 'Restricted') {
                        isVisible = c.visibility && c.visibility.length > 0 && c.visibility.some((g: string) => ['Data Team', 'All Employees'].includes(g));
                      }
                      
                      if (!isVisible) return false;
                      
                      if (catalogSearchQuery && !c.title.toLowerCase().includes(catalogSearchQuery.toLowerCase()) && !c.description?.toLowerCase().includes(catalogSearchQuery.toLowerCase())) return false;
                      if (catalogCategory !== 'All Categories' && c.category !== catalogCategory) return false;
                      if (catalogFormat !== 'All Formats' && c.format !== catalogFormat) return false;
                      if (catalogDifficulty !== 'All Levels' && c.difficulty !== catalogDifficulty) return false;
                      return true;
                    }).map((course) => (
                      <div key={course.id} className="bg-white rounded-[24px] border border-guesty-beige shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col p-2">
                        <div className="h-48 overflow-hidden relative rounded-[16px]">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-guesty-night/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button onClick={() => setSelectedCatalogCourse(course)} className="bg-white text-guesty-black font-bold py-3 px-6 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                              <PlayCircle className="w-5 h-5" /> {course.progress && course.progress > 0 ? 'Continue' : 'Start Course'}
                            </button>
                          </div>
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-[8px] text-xs font-bold text-guesty-black shadow-sm uppercase tracking-widest">
                            {course.category}
                          </div>
                          {(environment as string) === 'admin' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab('courses'); 
                                setActiveCourseId(course.id); 
                                setCourseBuilderTab('access');
                              }}
                              className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-guesty-black shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                              title="Edit Access & Permissions"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">
                              <BookOpen className="w-4 h-4" /> {course.format}
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-guesty-forest/60">
                              <Clock className="w-3 h-3" /> {course.duration}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-guesty-black leading-tight mb-2 group-hover:text-guesty-nature transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-guesty-forest/70 line-clamp-2 mb-4">{course.description}</p>
                          
                          <div className="mt-auto pt-4 flex items-center justify-between border-t border-guesty-beige/50 relative">
                            <span className="text-xs font-bold text-guesty-forest/50 bg-guesty-ice px-2 py-1 rounded-md">{course.difficulty}</span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSelectedCatalogCourse(course)} className={`text-sm font-bold ${course.progress && course.progress > 0 ? 'text-guesty-nature' : theme.textPrimary} hover:opacity-80 transition-opacity flex items-center gap-1.5`}>
                                {course.progress && course.progress > 0 ? 'Continue Learning' : 'Start Course'} <ChevronRight className="w-4 h-4" />
                              </button>
                              <div className="relative">
                                <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === `course-${course.id}` ? null : `course-${course.id}`); }} className="p-1.5 text-guesty-forest/60 hover:text-guesty-black rounded-full hover:bg-guesty-beige transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {openDropdownId === `course-${course.id}` && (
                                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-[12px] shadow-lg border border-guesty-beige py-2 z-50">
                                    <button onClick={() => { setSelectedCatalogCourse(course); setOpenDropdownId(null); }} className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors">
                                      <Info className="w-4 h-4" /> View Details
                                    </button>
                                    {(environment as string) === 'admin' && (
                                      <button onClick={() => { 
                                        setActiveTab('courses'); 
                                        setActiveCourseId(course.id); 
                                        setCourseBuilderTab('access');
                                        setOpenDropdownId(null);
                                      }} className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors">
                                        <Edit2 className="w-4 h-4" /> Edit Access & Permissions
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {course.progress !== undefined && course.progress > 0 && (
                            <div className="mt-3">
                              <div className="flex justify-between text-[10px] font-bold mb-1">
                                <span className="text-guesty-nature">{course.progress}% Completed</span>
                              </div>
                              <div className="w-full h-1.5 bg-guesty-beige rounded-full overflow-hidden">
                                <div className="h-full bg-guesty-nature rounded-full" style={{ width: `${course.progress}%` }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* --- LEARNER COURSE PLAYER --- */}
          {environment !== 'admin' && activeTab === 'course-player' && selectedCatalogCourse && (
            <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex gap-6 animate-in fade-in duration-500">
              {/* Sidebar: Sequential Learning Path */}
              <div className="w-1/3 bg-white rounded-[24px] border border-guesty-beige shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-guesty-beige bg-guesty-cream/30">
                  <button onClick={() => { setActiveTab('catalog'); setSelectedCatalogCourse(null); }} className="text-sm font-bold text-guesty-forest/60 hover:text-guesty-black flex items-center gap-2 mb-4 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to Catalog
                  </button>
                  <h2 className="text-2xl font-bold text-guesty-black leading-tight">{selectedCatalogCourse.title}</h2>
                  
                  {/* Progress Bar */}
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-guesty-nature">{selectedCatalogCourse.progress || 0}% Completed</span>
                    </div>
                    <div className="w-full h-2.5 bg-guesty-beige rounded-full overflow-hidden">
                      <div className="h-full bg-guesty-nature rounded-full" style={{ width: `${selectedCatalogCourse.progress || 0}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {selectedCatalogCourse.modules?.length > 0 ? selectedCatalogCourse.modules.map((modId: string | any, index: number) => {
                    const isObject = typeof modId === 'object';
                    const title = isObject ? modId.title : `Module ${index + 1}`;
                    const type = isObject ? modId.type : 'Video';
                    const isCompleted = index === 0 && (selectedCatalogCourse.progress || 0) > 0;
                    const isActive = index === 1 || (index === 0 && !(selectedCatalogCourse.progress || 0));
                    
                    return (
                      <div key={isObject ? modId.id : modId} className={`p-4 rounded-[16px] border ${isActive ? 'border-2 border-guesty-ocean bg-white shadow-sm relative overflow-hidden' : isCompleted ? 'border-guesty-nature/30 bg-guesty-ice/10 hover:bg-guesty-ice/30' : 'border-guesty-beige bg-white hover:border-guesty-forest/30'} flex gap-4 cursor-pointer transition-colors`}>
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-guesty-ocean"></div>}
                        <div className={`mt-1 ${isActive ? 'text-guesty-ocean' : isCompleted ? 'text-guesty-nature' : 'text-guesty-forest/30'}`}>
                          {isCompleted ? <CheckCircle className="w-5 h-5" /> : isActive ? <PlayCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className={`font-bold text-sm ${isActive || isCompleted ? 'text-guesty-black' : 'text-guesty-forest/70'}`}>{index + 1}. {title}</h4>
                            {type === 'SCORM' && <span className="text-[10px] font-bold bg-guesty-cloud text-guesty-ocean px-2 py-0.5 rounded-[4px] uppercase tracking-wider">SCORM</span>}
                          </div>
                          <p className="text-xs text-guesty-forest/60 mt-1 flex items-center gap-1">
                            {type === 'Video' ? <Video className="w-3 h-3"/> : <Package className="w-3 h-3"/>} {type}
                          </p>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center p-8 text-guesty-forest/50 text-sm">
                      No modules available for this course yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Main Viewport: SCORM / Content Player */}
              <div className="w-2/3 bg-guesty-night rounded-[24px] shadow-xl overflow-hidden flex flex-col relative">
                {/* Simulated SCORM Content Area */}
                <div className="flex-1 flex items-center justify-center bg-[#1a1a1a] relative">
                  <div className="text-center space-y-6 animate-in zoom-in-95 duration-700">
                    <div className="w-24 h-24 bg-guesty-ocean/20 rounded-full flex items-center justify-center mx-auto">
                      <Package className="w-12 h-12 text-guesty-ocean" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{selectedCatalogCourse.modules?.[0]?.title || 'Module'}</h3>
                      <p className="text-guesty-powder/60">Interactive Module</p>
                    </div>
                    <button className="bg-guesty-ocean hover:bg-[#2b8a9e] text-white font-bold px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-3 mx-auto" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />} {isPlaying ? 'Pause Module' : 'Start Module'}
                    </button>
                  </div>
                </div>

                {/* SCORM Player Controls */}
                <div className="h-20 bg-guesty-black border-t border-white/10 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="text-white/50 hover:text-white transition-colors" title="Skip Back"><SkipBack className="w-5 h-5" /></button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-white text-guesty-black flex items-center justify-center hover:scale-105 transition-transform"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                    </button>
                    <button className="text-white/50 hover:text-white transition-colors" title="Skip Forward"><SkipForward className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-xs font-bold text-white/50 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-guesty-coral animate-pulse"></span>
                      IN PROGRESS ({selectedCatalogCourse.progress || 0}%)
                    </div>
                    <button className="text-sm font-bold text-white/70 hover:text-white flex items-center gap-2 transition-colors">
                      <ListChecks className="w-4 h-4" /> TOC
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- LEARNER PROFILE VIEW --- */}
          {environment !== 'admin' && activeTab === 'profile' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
              <div className="bg-white rounded-[36px] p-10 border border-guesty-beige shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className={`absolute right-0 top-0 w-64 h-full opacity-10 ${theme.bannerBg}`}></div>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center font-display font-bold text-5xl shadow-md ${theme.primary} ${theme.textPrimary} z-10`}>
                  {impersonatingUser ? impersonatingUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'MD'}
                </div>
                <div className="z-10 flex-1">
                  <h2 className="text-4xl font-bold text-guesty-black">{impersonatingUser ? impersonatingUser.name : 'Mor Damul Vardi'}</h2>
                  <div className="flex flex-col mt-2">
                    <p className="text-lg font-bold text-guesty-black">{impersonatingUser ? impersonatingUser.department : 'Operations'}</p>
                    <p className="text-sm text-guesty-forest/70">{impersonatingUser ? impersonatingUser.site : 'Tel Aviv'}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <span className="text-xs font-bold bg-guesty-ice/50 text-guesty-ocean px-3 py-1.5 rounded-[8px] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> {impersonatingUser ? impersonatingUser.jobTitle : theme.userRole}
                    </span>
                    <span className="text-xs font-bold bg-guesty-cream text-guesty-forest px-3 py-1.5 rounded-[8px] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Compliant (Valid till 2027)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm p-8">
                  <h3 className="text-xl font-bold text-guesty-black mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-guesty-nature" /> Certifications
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-guesty-nature/30 bg-guesty-ice/10 rounded-[16px] flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-guesty-black">CS Level 1 Certified</h4>
                        <p className="text-xs text-guesty-forest/60 mt-1">Issued: Jan 15, 2026</p>
                      </div>
                      <div className="w-10 h-10 bg-guesty-nature text-white rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[24px] border border-guesty-beige shadow-sm p-8">
                  <h3 className="text-xl font-bold text-guesty-black mb-6 flex items-center gap-2">
                    <History className="w-6 h-6 text-guesty-ocean" /> Learning History
                  </h3>
                  <div className="space-y-4">
                    {learningPath.filter(p => p.status === 'completed').map(course => (
                      <div key={course.id} className="flex items-center justify-between border-b border-guesty-beige pb-4 last:border-0 last:pb-0">
                        <div>
                          <h4 className="font-bold text-guesty-black text-sm">{course.title}</h4>
                          <p className="text-xs text-guesty-forest/50 mt-1">{course.type}</p>
                        </div>
                        <span className="text-xs font-bold text-guesty-nature bg-guesty-ice/50 px-2 py-1 rounded-[6px]">Score: {course.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* UPDATE VERSION MODAL */}
      {/* UPLOAD NEW ASSET MODAL */}
      <AssetUploader 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        folders={folders}
        onUpload={(newAssetData) => {
          const newAsset = {
            id: `a${repository.length + 1}`,
            title: newAssetData.title,
            type: newAssetData.type,
            version: 'v1.0',
            usedIn: 0,
            url: newAssetData.url,
            folderId: newAssetData.folderId,
            uploadedBy: 'Current User',
            uploadedAt: new Date().toISOString().split('T')[0],
            fileName: newAssetData.file?.name || (newAssetData.type === 'HTML Link' ? newAssetData.url : 'Unknown'),
            tags: [],
            icon: newAssetData.type === 'Video' ? <FileVideo className="w-5 h-5" /> : 
                  newAssetData.type === 'PDF' ? <FileText className="w-5 h-5" /> : 
                  newAssetData.type === 'SCORM' || newAssetData.type === 'xAPI' ? <FileArchive className="w-5 h-5" /> :
                  newAssetData.type === 'HTML Link' ? <Link className="w-5 h-5" /> :
                  newAssetData.type === 'Slides' ? <Layers className="w-5 h-5" /> :
                  <HelpCircle className="w-5 h-5" />
          };
          setRepository([newAsset, ...repository]);
        }} 
      />

      {/* ASSET PREVIEWER */}
      <UniversalPreviewer 
        asset={previewAsset} 
        onClose={() => setPreviewAsset(null)} 
      />

      {/* EDIT ASSET MODAL */}
      <EditAssetModal
        isOpen={showEditAssetModal}
        onClose={() => {
          setShowEditAssetModal(false);
          setAssetToEdit(null);
        }}
        asset={assetToEdit}
        onSave={(updatedAsset) => {
          setRepository(repository.map(r => r.id === updatedAsset.id ? updatedAsset : r));
        }}
      />

      {/* Move Asset Modal */}
      {showMoveModal && assetToMove && (
        <div className="fixed inset-0 bg-guesty-forest/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/30">
              <h3 className="text-2xl font-bold text-guesty-black">Move Asset</h3>
              <button onClick={() => setShowMoveModal(false)} className="p-2 text-guesty-forest/40 hover:text-guesty-black hover:bg-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-guesty-cream/10">
              <p className="text-sm text-guesty-forest/60 mb-4">Select a new destination folder for <strong>{assetToMove.title}</strong>.</p>
              <div className="border border-guesty-beige rounded-[12px] overflow-hidden bg-white p-4 max-h-[400px] overflow-y-auto">
                <div className="space-y-1">
                  <button 
                    onClick={() => setSelectedMoveFolderId(null)}
                    className={`w-full text-left px-3 py-2 rounded-[8px] text-sm font-bold flex items-center gap-2 transition-colors ${!selectedMoveFolderId ? 'bg-guesty-ocean/10 text-guesty-ocean' : 'text-guesty-forest/70 hover:bg-guesty-cream/50 hover:text-guesty-black'}`}
                  >
                    <Folder className={`w-4 h-4 ${!selectedMoveFolderId ? 'text-guesty-ocean' : 'text-guesty-forest/40'}`} /> Uncategorized
                  </button>
                  <FolderTree parentId={null} level={0} selectedId={selectedMoveFolderId} onSelect={setSelectedMoveFolderId} />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button 
                onClick={() => setShowMoveModal(false)}
                className="px-6 py-3 text-sm font-bold text-guesty-forest hover:bg-white rounded-[12px] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setRepository(repository.map(r => r.id === assetToMove.id ? { ...r, folderId: selectedMoveFolderId } : r));
                  setShowMoveModal(false);
                }}
                disabled={selectedMoveFolderId === assetToMove.folderId}
                className={`px-6 py-3 text-sm font-bold rounded-[12px] transition-colors shadow-sm ${
                  selectedMoveFolderId === assetToMove.folderId
                    ? 'bg-guesty-beige text-guesty-forest/40 cursor-not-allowed'
                    : 'bg-guesty-nature text-white hover:bg-[#11554f]'
                }`}
              >
                Move Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 bg-guesty-forest/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/30">
              <h3 className="text-2xl font-bold text-guesty-black">Create Folder</h3>
              <button onClick={() => setShowCreateFolderModal(false)} className="p-2 text-guesty-forest/40 hover:text-guesty-black hover:bg-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-guesty-cream/10">
              <label className="block text-sm font-bold text-guesty-forest mb-2">Folder Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g., Onboarding Materials"
                className="w-full px-4 py-3 rounded-[12px] border border-guesty-beige focus:outline-none focus:border-guesty-teal focus:ring-1 focus:ring-guesty-teal transition-all bg-white"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newFolderName.trim()) {
                    const newFolder: Folder = {
                      id: `folder-${Date.now()}`,
                      tenant_id: 'tenant-1',
                      parent_id: createFolderParentId,
                      name: newFolderName.trim(),
                      slug: newFolderName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    };
                    setFolders([...folders, newFolder]);
                    setShowCreateFolderModal(false);
                  }
                }}
              />
            </div>
            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateFolderModal(false)}
                className="px-6 py-3 text-sm font-bold text-guesty-forest hover:bg-white rounded-[12px] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (newFolderName.trim()) {
                    const newFolder: Folder = {
                      id: `folder-${Date.now()}`,
                      tenant_id: 'tenant-1',
                      parent_id: createFolderParentId,
                      name: newFolderName.trim(),
                      slug: newFolderName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    };
                    setFolders([...folders, newFolder]);
                    setShowCreateFolderModal(false);
                  }
                }}
                disabled={!newFolderName.trim()}
                className={`px-6 py-3 text-sm font-bold rounded-[12px] transition-colors shadow-sm ${
                  !newFolderName.trim()
                    ? 'bg-guesty-beige text-guesty-forest/40 cursor-not-allowed'
                    : 'bg-guesty-nature text-white hover:bg-[#11554f]'
                }`}
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && assetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black">Delete Training Material</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-guesty-blush/30 rounded-[12px] border border-guesty-merlot/20">
                <AlertTriangle className="w-6 h-6 text-guesty-merlot flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-guesty-black mb-1">Are you sure you want to delete?</h4>
                  <p className="text-sm text-guesty-forest/80 leading-relaxed">
                    You are about to delete <span className="font-bold">"{assetToDelete.title}"</span>. 
                    If you proceed, the training material data will be saved in the reports and data section, but the training material will be removed from all linked courses and the repository.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Remove from repository
                  setRepository(repository.filter(r => r.id !== assetToDelete.id));
                  
                  // Remove from all linked courses
                  setCourses(courses.map(c => ({
                    ...c,
                    modules: c.modules?.filter((m: any) => m.id !== assetToDelete.id) || []
                  })));
                  
                  setShowDeleteModal(false);
                  setAssetToDelete(null);
                }}
                className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-merlot text-white hover:bg-guesty-merlot/90 transition-colors shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showArchiveModal && assetToArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black">Archive Training Material</h3>
              <button onClick={() => setShowArchiveModal(false)} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-guesty-blush/30 rounded-[12px] border border-guesty-merlot/20">
                <AlertTriangle className="w-6 h-6 text-guesty-merlot flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-guesty-black mb-1">Are you sure you want to archive?</h4>
                  <p className="text-sm text-guesty-forest/80 leading-relaxed">
                    You are about to archive <span className="font-bold">"{assetToArchive.title}"</span>. 
                    Once archived, it will be removed from all linked courses, but the data will remain in the data tracking of this specific training material.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button 
                onClick={() => setShowArchiveModal(false)} 
                className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Update repository status
                  setRepository(repository.map(r => r.id === assetToArchive.id ? { ...r, status: 'Archived' } : r));
                  
                  // Remove from all linked courses
                  setCourses(courses.map(c => ({
                    ...c,
                    modules: c.modules?.filter((m: any) => m.id !== assetToArchive.id) || []
                  })));
                  
                  setShowArchiveModal(false);
                  setAssetToArchive(null);
                }}
                className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-merlot text-white hover:bg-guesty-merlot/90 transition-colors shadow-sm"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {showLinkedCoursesModal && selectedLinkedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black">Linked Courses</h3>
              <button onClick={() => setShowLinkedCoursesModal(false)} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-guesty-ice/30 rounded-[12px] border border-guesty-teal/30">
                <Info className="w-6 h-6 text-guesty-nature flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-guesty-black mb-1">{selectedLinkedAsset.title}</h4>
                  <p className="text-sm text-guesty-forest/80 leading-relaxed">
                    This training material is currently used in <span className="font-bold">{courses.filter(c => c.modules?.some((m: any) => m.id === selectedLinkedAsset.id)).length} courses</span>.
                  </p>
                </div>
              </div>

              <div className="border border-guesty-beige rounded-[12px] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-guesty-cream/30 border-b border-guesty-beige">
                      <th className="p-4 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Course Name</th>
                      <th className="p-4 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Status</th>
                      <th className="p-4 text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Material Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.filter(c => c.modules?.some((m: any) => m.id === selectedLinkedAsset.id)).map(course => {
                      const moduleInCourse = course.modules.find((m: any) => m.id === selectedLinkedAsset.id);
                      return (
                        <tr key={course.id} className="border-b border-guesty-beige last:border-0 hover:bg-guesty-cream/10 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-guesty-black">{course.title}</span>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-[6px] uppercase tracking-wider ${course.status === 'Published' ? 'bg-guesty-ice/50 text-guesty-nature' : 'bg-guesty-beige text-guesty-forest/60'}`}>
                              {course.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-bold bg-guesty-cloud text-guesty-ocean px-2 py-1 rounded-[4px]">{moduleInCourse?.version || selectedLinkedAsset.version}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {courses.filter(c => c.modules?.some((m: any) => m.id === selectedLinkedAsset.id)).length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-guesty-forest/60">
                          No courses are currently using this material.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end">
              <button onClick={() => setShowLinkedCoursesModal(false)} className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-nature text-white hover:bg-[#11554f] transition-colors shadow-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black">Update Training Material</h3>
              <button onClick={() => setShowUpdateModal(false)} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-guesty-ice/30 rounded-[12px] border border-guesty-teal/30">
                <Info className="w-6 h-6 text-guesty-nature flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-guesty-black mb-1">Versioning & Reusability</h4>
                  <p className="text-sm text-guesty-forest/80 leading-relaxed">
                    You are uploading a new version for <span className="font-bold">"{selectedAsset.title}"</span>. 
                    This asset is currently used in <span className="font-bold">{courses.filter(c => c.modules?.some((m: any) => m.id === selectedAsset.id)).length} active courses</span>.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">Current Version</label>
                  <div className="px-4 py-3 bg-guesty-cream rounded-[8px] text-guesty-black font-bold border border-guesty-beige flex items-center justify-between">
                    <span>{selectedAsset.version}</span>
                    <span className="text-xs text-guesty-forest/50 font-normal">Published Oct 12, 2025</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">New Version</label>
                  <div className="px-4 py-3 bg-white rounded-[8px] text-guesty-ocean font-bold border-2 border-guesty-ocean border-dashed flex items-center justify-center gap-2 cursor-pointer hover:bg-guesty-cloud/30 transition-colors">
                    <Plus className="w-5 h-5" /> Select new file (v2.0)
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-guesty-beige">
                <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-3">Update Strategy</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                      <input 
                        type="radio" 
                        name="pushStrategy" 
                        checked={versionPushStrategy === 'all'} 
                        onChange={() => setVersionPushStrategy('all')}
                        className="appearance-none w-5 h-5 border-2 border-guesty-beige rounded-full checked:border-guesty-nature transition-colors" 
                      />
                      {versionPushStrategy === 'all' && <div className="w-2.5 h-2.5 bg-guesty-nature rounded-full absolute pointer-events-none" />}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-guesty-black group-hover:text-guesty-nature transition-colors">Push to all linked courses</span>
                      <span className="block text-xs text-guesty-forest/60 mt-1 leading-relaxed">
                        Instantly update this material in all courses where it is currently used.
                      </span>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                      <input 
                        type="radio" 
                        name="pushStrategy" 
                        checked={versionPushStrategy === 'completed'} 
                        onChange={() => setVersionPushStrategy('completed')}
                        className="appearance-none w-5 h-5 border-2 border-guesty-beige rounded-full checked:border-guesty-nature transition-colors" 
                      />
                      {versionPushStrategy === 'completed' && <div className="w-2.5 h-2.5 bg-guesty-nature rounded-full absolute pointer-events-none" />}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-guesty-black group-hover:text-guesty-nature transition-colors">Push only to completed courses</span>
                      <span className="block text-xs text-guesty-forest/60 mt-1 leading-relaxed">
                        Update this material only in courses where all enrolled learners have already completed it.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-guesty-beige">
                <label className="flex items-start gap-3 cursor-not-allowed opacity-90">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                    <input type="checkbox" checked disabled className="appearance-none w-5 h-5 border-2 border-guesty-nature rounded-[4px] bg-guesty-nature checked:bg-guesty-nature" />
                    <Check className="w-3 h-3 text-white absolute pointer-events-none" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-guesty-black">Preserve historical completion data</span>
                    <span className="block text-xs text-guesty-forest/60 mt-1 leading-relaxed">
                      Learners who already completed {selectedAsset.version} will retain their progress and assessment records. New learners will receive the updated version.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button onClick={() => setShowUpdateModal(false)} className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors">
                Cancel
              </button>
              <button onClick={() => {
                // Mock update action
                setCourses(courses.map(c => ({
                  ...c,
                  modules: c.modules.map(m => m.id === selectedAsset.id ? { ...m, version: 'v2.0' } : m)
                })));
                setRepository(repository.map(r => r.id === selectedAsset.id ? { ...r, version: 'v2.0', history: ['v2.0 (Mar 2026)', ...(r.history || [])] } : r));
                setShowUpdateModal(false);
              }} className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-nature text-white hover:bg-[#11554f] transition-colors shadow-sm">
                Publish Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COURSE WIZARD MODAL */}
      {showCourseWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-guesty-ocean" /> Course Production Wizard
              </h3>
              <button onClick={() => { setShowCourseWizard(false); setCourseWizardStep(1); }} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              {/* Stepper */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-guesty-beige -z-10"></div>
                {[1, 2, 3, 4].map(step => (
                  <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${courseWizardStep >= step ? 'bg-guesty-ocean text-white' : 'bg-guesty-cream border border-guesty-beige text-guesty-forest/50'}`}>
                    {courseWizardStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                ))}
              </div>

              {/* Step 1: Basic Info & Branding */}
              {courseWizardStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                    <h4 className="text-lg font-bold text-guesty-black mb-1">Basic Info & Branding</h4>
                    <p className="text-sm text-guesty-forest/60 mb-4">Define the core identity of your new course.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">Course Title</label>
                    <input 
                      type="text" 
                      value={newCourseData.title}
                      onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                      placeholder="e.g., Advanced Analytics 101"
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                      value={newCourseData.description}
                      onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                      placeholder="Brief description of the course..."
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all h-24 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">Course Type</label>
                      <select 
                        value={newCourseData.type}
                        onChange={(e) => setNewCourseData({...newCourseData, type: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                      >
                        <option value="E-learning">E-learning</option>
                        <option value="ILT">ILT (Instructor-Led)</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Micro-learning">Micro-learning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">Localization (Language)</label>
                      <select 
                        value={newCourseData.language}
                        onChange={(e) => setNewCourseData({...newCourseData, language: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Structure & Materials */}
              {courseWizardStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                    <h4 className="text-lg font-bold text-guesty-black mb-1">Structure & Materials</h4>
                    <p className="text-sm text-guesty-forest/60 mb-4">Define how learners will navigate the content.</p>
                  </div>
                  
                  <div className="p-4 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newCourseData.isSequential}
                        onChange={(e) => setNewCourseData({...newCourseData, isSequential: e.target.checked})}
                        className="mt-1 w-4 h-4 rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                      />
                      <div>
                        <div className="text-sm font-bold text-guesty-black">Sequential Learning Path</div>
                        <div className="text-xs text-guesty-forest/60">Force learners to complete modules in order.</div>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newCourseData.saveAsTemplate}
                        onChange={(e) => setNewCourseData({...newCourseData, saveAsTemplate: e.target.checked})}
                        className="mt-1 w-4 h-4 rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                      />
                      <div>
                        <div className="text-sm font-bold text-guesty-black">Save course structure template</div>
                        <div className="text-xs text-guesty-forest/60">Save this structure to streamline future course creation.</div>
                      </div>
                    </label>
                  </div>

                  <div className="border border-dashed border-guesty-beige rounded-[12px] p-8 text-center bg-guesty-cream/20">
                    <Layers className="w-8 h-8 text-guesty-forest/30 mx-auto mb-3" />
                    <p className="text-sm font-bold text-guesty-black">No materials added yet.</p>
                    <p className="text-xs text-guesty-forest/60 mb-4">You can add SCORM, Video, or HTML content later from the Central Repository.</p>
                  </div>
                </div>
              )}

              {/* Step 3: Enrollment Logic & Automation Rules */}
              {courseWizardStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                    <h4 className="text-lg font-bold text-guesty-black mb-1">Enrollment Logic & Automation Rules</h4>
                    <p className="text-sm text-guesty-forest/60 mb-4">Configure who can see this course and when.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">Time-Based Availability</label>
                      <select 
                        value={newCourseData.availability}
                        onChange={(e) => setNewCourseData({...newCourseData, availability: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                      >
                        <option value="Always">Always Available</option>
                        <option value="Specific Dates">Specific Dates</option>
                        <option value="After Enrollment">X Days After Enrollment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">Audience-Based Visibility</label>
                      <select 
                        value={newCourseData.visibility}
                        onChange={(e) => setNewCourseData({...newCourseData, visibility: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                      >
                        <option value="All Users">All Users</option>
                        <option value="Internal (Data)">Internal (Data)</option>
                        <option value="Internal (Sales)">Internal (Sales)</option>
                        <option value="External (Partners)">External (Partners)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">Connect to Learning Plans</label>
                    <div className="p-4 bg-white border border-guesty-beige rounded-[8px] space-y-2 max-h-40 overflow-y-auto">
                      {['Onboarding Bootcamp', 'Sales Mastery 2026', 'Compliance Annual', 'Leadership Track'].map(plan => (
                        <label key={plan} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={newCourseData.learningPlans.includes(plan)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewCourseData({...newCourseData, learningPlans: [...newCourseData.learningPlans, plan]});
                              } else {
                                setNewCourseData({...newCourseData, learningPlans: newCourseData.learningPlans.filter(p => p !== plan)});
                              }
                            }}
                            className="w-4 h-4 rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                          />
                          <span className="text-sm text-guesty-black">{plan}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Publishing Settings */}
              {courseWizardStep === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                    <h4 className="text-lg font-bold text-guesty-black mb-1">Publishing Settings</h4>
                    <p className="text-sm text-guesty-forest/60 mb-4">Set the production level status of your course.</p>
                  </div>

                  <div className="space-y-3">
                    <label className={`flex items-start gap-4 p-4 border rounded-[12px] cursor-pointer transition-colors ${newCourseData.status === 'Under Maintenance' ? 'border-guesty-ocean bg-guesty-ocean/5' : 'border-guesty-beige hover:bg-guesty-cream'}`}>
                      <input 
                        type="radio" 
                        name="courseStatus"
                        value="Under Maintenance"
                        checked={newCourseData.status === 'Under Maintenance'}
                        onChange={(e) => setNewCourseData({...newCourseData, status: e.target.value})}
                        className="mt-1 w-4 h-4 text-guesty-ocean focus:ring-guesty-ocean border-guesty-beige"
                      />
                      <div>
                        <div className="text-sm font-bold text-guesty-black">Under Maintenance (Draft)</div>
                        <div className="text-xs text-guesty-forest/60">Course is hidden from learners. Content creators can build and edit safely.</div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-4 p-4 border rounded-[12px] cursor-pointer transition-colors ${newCourseData.status === 'Published' ? 'border-guesty-nature bg-guesty-nature/5' : 'border-guesty-beige hover:bg-guesty-cream'}`}>
                      <input 
                        type="radio" 
                        name="courseStatus"
                        value="Published"
                        checked={newCourseData.status === 'Published'}
                        onChange={(e) => setNewCourseData({...newCourseData, status: e.target.value})}
                        className="mt-1 w-4 h-4 text-guesty-nature focus:ring-guesty-nature border-guesty-beige"
                      />
                      <div>
                        <div className="text-sm font-bold text-guesty-black">Published (Live)</div>
                        <div className="text-xs text-guesty-forest/60">Course is visible to the target audience based on visibility rules.</div>
                      </div>
                    </label>
                  </div>

                  <div className="bg-guesty-cream/50 p-4 rounded-[12px] border border-guesty-beige flex items-start gap-3">
                    <History className="w-5 h-5 text-guesty-ocean flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-guesty-black">Version History Enabled</div>
                      <div className="text-xs text-guesty-forest/60">All changes made after publishing will be tracked in the course's version history.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-between items-center">
              <button 
                onClick={() => {
                  if (courseWizardStep > 1) {
                    setCourseWizardStep(courseWizardStep - 1);
                  } else {
                    setShowCourseWizard(false);
                  }
                }} 
                className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors"
              >
                {courseWizardStep > 1 ? 'Back' : 'Cancel'}
              </button>
              
              <button 
                onClick={() => {
                  if (courseWizardStep < 4) {
                    setCourseWizardStep(courseWizardStep + 1);
                  } else {
                    if (!newCourseData.title) {
                      alert("Course Title is required.");
                      return;
                    }
                    const newCourse = {
                      id: `c${courses.length + 1}`,
                      title: newCourseData.title,
                      audience: newCourseData.visibility,
                      status: newCourseData.status,
                      lastUpdated: 'Just now',
                      enrolledGroups: [],
                      enrolledSites: [],
                      modules: [],
                      type: newCourseData.type,
                      language: newCourseData.language,
                      isSequential: newCourseData.isSequential,
                      learningPlans: newCourseData.learningPlans
                    };
                    setCourses([newCourse, ...courses]);
                    setActiveCourseId(newCourse.id);
                    setNewCourseData({
                      title: '', description: '', type: 'E-learning', language: 'English',
                      isSequential: false, saveAsTemplate: false, availability: 'Always',
                      visibility: 'All Users', learningPlans: [], status: 'Under Maintenance'
                    });
                    setCourseWizardStep(1);
                    setShowCourseWizard(false);
                    setActiveTab('courses');
                  }
                }}
                className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-ocean text-white hover:bg-[#2b8a9e] transition-colors shadow-sm flex items-center gap-2"
              >
                {courseWizardStep < 4 ? 'Next Step' : <><Check className="w-4 h-4" /> Finish & Create</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCORM UPLOAD MODAL */}
      {showScormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-guesty-nature" /> Upload SCORM/xAPI Package
              </h3>
              <button onClick={() => {
                setShowScormModal(false);
                setScormFile(null);
                setParsedScormData(null);
                setIsParsingScorm(false);
              }} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              {!scormFile && !parsedScormData && (
                <div className="border-2 border-dashed border-guesty-beige rounded-[16px] p-12 text-center hover:bg-guesty-cream/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".zip" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setScormFile(file);
                        setIsParsingScorm(true);
                        
                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const response = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });
                          
                          const data = await response.json();
                          
                          setIsParsingScorm(false);
                          
                          if (!response.ok) {
                            alert(data.error || "Failed to process package");
                            setScormFile(null);
                            return;
                          }

                          setParsedScormData({
                            title: data.title || file.name.replace('.zip', ''),
                            type: data.type,
                            entryPoint: data.entryPoint,
                            modules: [
                              { id: `sm1_${Date.now()}`, title: data.title || 'Course Module', type: data.type, version: 'v1.0', icon: <Package className="w-5 h-5" />, entryPoint: data.entryPoint }
                            ]
                          });
                        } catch (error) {
                          console.error("Upload error:", error);
                          alert("An error occurred during upload.");
                          setIsParsingScorm(false);
                          setScormFile(null);
                        }
                      }
                    }}
                  />
                  <div className="w-16 h-16 rounded-full bg-guesty-ice/50 text-guesty-ocean flex items-center justify-center mx-auto mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-guesty-black mb-1">Select SCORM/xAPI Package</h4>
                  <p className="text-guesty-forest/60 text-sm">Upload a .zip file containing your SCORM 1.2, 2004, or xAPI content.</p>
                </div>
              )}

              {isParsingScorm && (
                <div className="py-12 text-center space-y-4">
                  <RefreshCw className="w-10 h-10 text-guesty-nature animate-spin mx-auto" />
                  <h4 className="text-lg font-bold text-guesty-black">Parsing Package...</h4>
                  <p className="text-guesty-forest/60 text-sm">Extracting manifest and building course structure.</p>
                </div>
              )}

              {parsedScormData && !isParsingScorm && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-guesty-ice/20 border border-guesty-ocean/20 rounded-[12px] p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-guesty-ocean/10 text-guesty-ocean flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-guesty-black">Successfully Parsed Package</h4>
                      <p className="text-sm text-guesty-forest/70 mt-1">We found {parsedScormData.modules.length} modules in the package.</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-3">Extracted Structure</h5>
                    <div className="bg-white border border-guesty-beige rounded-[12px] overflow-hidden">
                      <div className="p-4 border-b border-guesty-beige bg-guesty-cream/30">
                        <h6 className="font-bold text-guesty-black">{parsedScormData.title}</h6>
                      </div>
                      <div className="divide-y divide-guesty-beige">
                        {parsedScormData.modules.map((mod: any, idx: number) => (
                          <div key={idx} className="p-4 flex items-center gap-3">
                            <div className="text-guesty-forest/40">{getIconForType(mod.type)}</div>
                            <div>
                              <p className="text-sm font-bold text-guesty-black">{mod.title}</p>
                              <p className="text-xs text-guesty-forest/60">{mod.type} {mod.entryPoint ? `• Entry: ${mod.entryPoint}` : ''}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button onClick={() => {
                setShowScormModal(false);
                setScormFile(null);
                setParsedScormData(null);
                setIsParsingScorm(false);
              }} className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors">
                Cancel
              </button>
              <button 
                disabled={!parsedScormData}
                onClick={() => {
                  if (!parsedScormData) return;
                  const newCourse = {
                    id: `c${courses.length + 1}`,
                    title: parsedScormData.title,
                    audience: 'Global',
                    status: 'Under Maintenance',
                    lastUpdated: 'Just now',
                    enrolledGroups: [],
                    enrolledSites: [],
                    modules: parsedScormData.modules
                  };
                  setCourses([newCourse, ...courses]);
                  setActiveCourseId(newCourse.id);
                  setShowScormModal(false);
                  setScormFile(null);
                  setParsedScormData(null);
                  setActiveTab('courses');
                }}
                className={`px-6 py-2.5 rounded-[8px] font-bold shadow-sm transition-colors ${
                  parsedScormData 
                    ? 'bg-guesty-nature text-white hover:bg-[#11554f]' 
                    : 'bg-guesty-beige text-guesty-forest/40 cursor-not-allowed'
                }`}
              >
                Import as Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-guesty-nature" /> {isBulkEdit ? `Edit ${selectedUsers.length} Users` : editingUserId ? 'Edit User' : 'Create New User'}
              </h3>
              <div className="flex items-center gap-4">
                {editingUserId && !isBulkEdit && (
                  <div className="relative">
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === 'modal-actions' ? null : 'modal-actions')}
                      className="p-2 hover:bg-guesty-beige rounded-full transition-colors text-guesty-forest"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openDropdownId === 'modal-actions' && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-[12px] shadow-lg border border-guesty-beige py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => {
                            setActionUserId(editingUserId);
                            setShowResetPasswordModal(true);
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                        >
                          <Key className="w-4 h-4" /> Reset Password
                        </button>
                        <button 
                          onClick={() => {
                            const user = users.find(u => u.id === editingUserId);
                            if (user) {
                              alert(`Invitation resent to ${user.email}`);
                            }
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                        >
                          <Mail className="w-4 h-4" /> Resend Invitation
                        </button>
                        <button 
                          onClick={() => {
                            setActionUserId(editingUserId);
                            setShowGroupAssignmentModal(true);
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                        >
                          <Users className="w-4 h-4" /> Quick Group Assignment
                        </button>
                        <button 
                          onClick={() => {
                            const user = users.find(u => u.id === editingUserId);
                            if (user) {
                              setProgressUserId(user.id);
                              setShowUserProgressModal(true);
                            }
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                        >
                          <Activity className="w-4 h-4" /> View Learning Progress
                        </button>
                        <div className="h-px bg-guesty-beige my-1"></div>
                        <button 
                          onClick={() => {
                            const user = users.find(u => u.id === editingUserId);
                            if (user) {
                              setImpersonatingUser(user);
                              setOpenDropdownId(null);
                              setShowCreateUserModal(false);
                              setEnvironment(user.domain === 'Internal' ? 'internal' : 'external');
                              setActiveTab('dashboard');
                            }
                          }}
                          className="w-full px-4 py-2 text-sm font-bold text-guesty-black hover:bg-guesty-cream flex items-center gap-2 transition-colors"
                        >
                          <Eye className="w-4 h-4" /> Impersonate User
                        </button>
                        
                        {users.find(u => u.id === editingUserId)?.status !== 'Archived' ? (
                          <button 
                            onClick={() => {
                              setUsers(users.map(u => u.id === editingUserId ? { ...u, status: 'Archived' } : u));
                              setOpenDropdownId(null);
                              setShowCreateUserModal(false);
                            }}
                            className="w-full px-4 py-2 text-sm font-bold text-guesty-merlot hover:bg-guesty-blush flex items-center gap-2 transition-colors"
                          >
                            <Archive className="w-4 h-4" /> Archive User
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setUsers(users.map(u => u.id === editingUserId ? { ...u, status: 'Active' } : u));
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-sm font-bold text-guesty-nature hover:bg-guesty-ice flex items-center gap-2 transition-colors"
                          >
                            <UserCheck className="w-4 h-4" /> Restore User
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <button onClick={() => setShowCreateUserModal(false)} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {!isBulkEdit && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">First Name</label>
                      <input type="text" value={newUserFirstName} onChange={e => setNewUserFirstName(e.target.value)} placeholder="Jane" className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Last Name</label>
                      <input type="text" value={newUserLastName} onChange={e => setNewUserLastName(e.target.value)} placeholder="Doe" className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Email Address</label>
                      <input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="jane.doe@guesty.com" className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Job Title</label>
                      <input type="text" value={newUserJobTitle} onChange={e => setNewUserJobTitle(e.target.value)} placeholder="e.g. Senior Developer" className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all" />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">System Role (RBAC)</label>
                  <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none">
                    {isBulkEdit && <option value="">-- No Change --</option>}
                    <option value="Learner">Learner</option>
                    <option value="Manager">Manager</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Power User">Power User</option>
                    <option value="Admin">Admin</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
                {newUserRole === 'Power User' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Power User Profiles</label>
                    <div className="flex flex-wrap gap-2">
                      {powerUserProfiles.map(profile => (
                        <label key={profile.id} className={`flex items-center gap-2 px-3 py-2 rounded-[8px] border cursor-pointer transition-colors ${newUserPowerProfileIds.includes(profile.id) ? 'bg-guesty-forest/5 border-guesty-forest text-guesty-forest' : 'bg-guesty-cream/50 border-guesty-beige text-guesty-black hover:bg-guesty-cream'}`}>
                          <input
                            type="checkbox"
                            checked={newUserPowerProfileIds.includes(profile.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewUserPowerProfileIds([...newUserPowerProfileIds, profile.id]);
                              } else {
                                setNewUserPowerProfileIds(newUserPowerProfileIds.filter(id => id !== profile.id));
                              }
                            }}
                            className="rounded border-guesty-beige text-guesty-forest focus:ring-guesty-forest"
                          />
                          <span className="text-sm font-bold">{profile.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Domain</label>
                    <select value={newUserDomain} onChange={e => setNewUserDomain(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none">
                      {isBulkEdit && <option value="">-- No Change --</option>}
                      <option value="All">All (Global)</option>
                      <option value="Internal">Internal (Employees)</option>
                      <option value="External">External (Partners/Customers)</option>
                    </select>
                  </div>
                )}
              </div>
              
              {newUserRole === 'Power User' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Domain</label>
                    <select value={newUserDomain} onChange={e => setNewUserDomain(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none">
                      {isBulkEdit && <option value="">-- No Change --</option>}
                      <option value="All">All (Global)</option>
                      <option value="Internal">Internal (Employees)</option>
                      <option value="External">External (Partners/Customers)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    {/* Empty placeholder to keep grid aligned if needed, or we can just let Domain span 1 col */}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Site</label>
                  <select value={newUserSite} onChange={e => setNewUserSite(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none">
                    {isBulkEdit && <option value="">-- No Change --</option>}
                    <option value="North America">North America</option>
                    <option value="Tel Aviv">Tel Aviv</option>
                    <option value="London">London</option>
                    <option value="Sydney">Sydney</option>
                    <option value="New York">New York</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Department</label>
                  <select value={newUserDepartment} onChange={e => setNewUserDepartment(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none">
                    {isBulkEdit && <option value="">-- No Change --</option>}
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Customer Success">Customer Success</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Agency Partners">Agency Partners</option>
                  </select>
                </div>
              </div>

              {!isBulkEdit && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Start Date (Employees Only)</label>
                    <input type="date" value={newUserStartDate} onChange={e => setNewUserStartDate(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Employment Type</label>
                    <select value={newUserEmploymentType} onChange={e => setNewUserEmploymentType(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none">
                      <option value="Full-time">Full-time</option>
                      <option value="Contractor">Contractor</option>
                      <option value="Partner">Partner</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Direct Manager</label>
                  <select value={newUserManager} onChange={e => setNewUserManager(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none">
                    {isBulkEdit ? <option value="">-- No Change --</option> : <option value="">No Manager Assigned</option>}
                    {users.filter(u => u.isManager || u.role === 'Manager' || u.role === 'Admin').map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 flex items-center pt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={newUserIsManager} onChange={e => setNewUserIsManager(e.target.checked)} className="w-5 h-5 rounded border-guesty-beige text-guesty-nature focus:ring-guesty-nature" />
                    <span className="text-sm font-bold text-guesty-black">Is Manager?</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Tags & Attributes</label>
                  <input type="text" placeholder="e.g. Q1-Hire, High-Potential" className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all" />
                </div>
                {editingUserId && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">User Creation Date</label>
                    <input type="text" value={users.find(u => u.id === editingUserId)?.createdAt || 'N/A'} disabled className="w-full px-4 py-3 bg-guesty-beige/30 border border-guesty-beige rounded-[12px] text-sm text-guesty-forest/60 cursor-not-allowed" />
                  </div>
                )}
              </div>

              {editingUserId && !isBulkEdit && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">MFA Status</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px]">
                      <ShieldAlert className="w-4 h-4 text-guesty-nature" />
                      <span className="text-sm font-bold text-guesty-black">Enabled (App Authenticator)</span>
                    </div>
                  </div>
                </div>
              )}

              {editingUserId && !isBulkEdit && (
                <div className="mt-8 pt-6 border-t border-guesty-beige">
                  <h4 className="text-sm font-bold text-guesty-black mb-4 uppercase tracking-wider">Permissions & Associations</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Associated Profiles & Inheritance</label>
                      <div className="bg-guesty-cream/50 border border-guesty-beige rounded-[12px] p-4 min-h-[100px] space-y-4">
                        {users.find(u => u.id === editingUserId)?.powerProfileIds?.length > 0 ? (
                          <div className="space-y-3">
                            {users.find(u => u.id === editingUserId)?.powerProfileIds?.map((pid: string) => {
                              const profile = powerUserProfiles.find(p => p.id === pid);
                              return (
                                <div key={pid} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-guesty-ocean" />
                                    <span className="text-sm font-bold text-guesty-black">{profile?.name || pid}</span>
                                  </div>
                                  <div className="pl-6 space-y-1">
                                    {profile?.permissions.filter(p => p.enabled).map(p => (
                                      <div key={p.id} className="flex items-center gap-2 text-xs text-guesty-forest/70">
                                        <ListTree className="w-3 h-3 text-guesty-beige" />
                                        <span>{p.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-sm text-guesty-forest/50 italic">No Power User Profiles assigned.</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Group Memberships</label>
                      <div className="bg-guesty-cream/50 border border-guesty-beige rounded-[12px] p-4 min-h-[100px]">
                        {users.find(u => u.id === editingUserId)?.groups?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {users.find(u => u.id === editingUserId)?.groups?.map((group: string) => (
                              <span key={group} className="text-xs font-bold px-3 py-1.5 bg-guesty-nature/10 text-guesty-nature rounded-[6px]">
                                {group}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-guesty-forest/50 italic">No Group Memberships.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {editingUserId && !isBulkEdit && (
                <div className="mt-8 pt-6 border-t border-guesty-beige">
                  <h4 className="text-sm font-bold text-guesty-black mb-4 uppercase tracking-wider flex items-center gap-2">
                    <History className="w-4 h-4" /> Audit Trail
                  </h4>
                  <div className="bg-guesty-cream/50 border border-guesty-beige rounded-[12px] p-4 space-y-3 max-h-[150px] overflow-y-auto">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-guesty-ocean"></div>
                      <div>
                        <p className="text-sm font-bold text-guesty-black">Password Reset Link Sent</p>
                        <p className="text-xs text-guesty-forest/60">by System Admin • Today, 10:45 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-guesty-nature"></div>
                      <div>
                        <p className="text-sm font-bold text-guesty-black">Added to Group: Sales Mastery 2026</p>
                        <p className="text-xs text-guesty-forest/60">by System Admin • Yesterday, 2:30 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-guesty-beige"></div>
                      <div>
                        <p className="text-sm font-bold text-guesty-black">User Created</p>
                        <p className="text-xs text-guesty-forest/60">by System Admin • {users.find(u => u.id === editingUserId)?.createdAt || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-guesty-ice/20 border border-guesty-ocean/20 rounded-[12px]">
                <input 
                  type="checkbox" 
                  id="sendEmail" 
                  checked={newUserSendEmail}
                  onChange={(e) => setNewUserSendEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                />
                <label htmlFor="sendEmail" className="text-sm font-bold text-guesty-black cursor-pointer">
                  Send welcome email with login instructions
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button onClick={() => setShowCreateUserModal(false)} className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (isBulkEdit) {
                    setUsers(users.map(u => selectedUsers.includes(u.id) ? {
                      ...u,
                      role: newUserRole || u.role,
                      domain: newUserDomain || u.domain,
                      site: newUserSite || u.site,
                      department: newUserDepartment || u.department,
                      managerId: newUserManager || u.managerId
                    } : u));
                    setSelectedUsers([]);
                  } else {
                    if (!newUserFirstName || !newUserLastName || !newUserEmail) return;
                    
                    if (editingUserId) {
                      setUsers(users.map(u => u.id === editingUserId ? {
                        ...u,
                        name: `${newUserFirstName} ${newUserLastName}`,
                        email: newUserEmail,
                        role: newUserRole,
                        powerProfileIds: newUserRole === 'Power User' ? newUserPowerProfileIds : undefined,
                        domain: newUserDomain,
                        site: newUserSite,
                        department: newUserDepartment,
                        jobTitle: newUserJobTitle,
                        managerId: newUserManager,
                        isManager: newUserIsManager,
                        startDate: newUserStartDate,
                        employmentType: newUserEmploymentType
                      } : u));
                    } else {
                      const newUser = {
                        id: `u${Date.now()}`,
                        name: `${newUserFirstName} ${newUserLastName}`,
                        email: newUserEmail,
                        role: newUserRole,
                        powerProfileIds: newUserRole === 'Power User' ? newUserPowerProfileIds : undefined,
                        domain: newUserDomain,
                        site: newUserSite,
                        department: newUserDepartment,
                        jobTitle: newUserJobTitle,
                        managerId: newUserManager,
                        isManager: newUserIsManager,
                        startDate: newUserStartDate,
                        employmentType: newUserEmploymentType,
                        createdAt: new Date().toISOString().split('T')[0],
                        groups: [],
                        status: 'Active',
                        lastLogin: 'Never'
                      };
                      setUsers([newUser, ...users]);
                    }
                  }
                  
                  setNewUserFirstName('');
                  setNewUserLastName('');
                  setNewUserEmail('');
                  setNewUserJobTitle('');
                  setShowCreateUserModal(false);
                  setEditingUserId(null);
                  setIsBulkEdit(false);
                }}
                className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-nature text-white shadow-sm hover:bg-[#11554f] transition-colors"
              >
                {isBulkEdit ? 'Apply to Selected' : editingUserId ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MERGE USERS MODAL */}
      {showMergeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <GitMerge className="w-6 h-6 text-guesty-ocean" /> Merge Users
              </h3>
              <button onClick={() => setShowMergeModal(false)} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-guesty-peach/20 border border-guesty-merlot/20 rounded-[12px] p-4 flex items-start gap-4">
                <Info className="w-5 h-5 text-guesty-merlot flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-guesty-merlot text-sm">Historical Data Retention</h4>
                  <p className="text-xs text-guesty-merlot/80 mt-1">Merging users will combine all historical learning records, certifications, and compliance tracking into the Primary User. The Secondary User will be archived. This action cannot be undone.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Primary User (Keep this profile)</label>
                  <select value={mergePrimaryUser} onChange={e => setMergePrimaryUser(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none">
                    <option value="">Select primary user...</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                  </select>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-guesty-forest/30 rotate-90" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-guesty-forest/60 uppercase tracking-widest">Secondary User (Merge into primary)</label>
                  <select value={mergeSecondaryUser} onChange={e => setMergeSecondaryUser(e.target.value)} className="w-full px-4 py-3 bg-guesty-cream/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all appearance-none">
                    <option value="">Select secondary user...</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button onClick={() => setShowMergeModal(false)} className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!mergePrimaryUser || !mergeSecondaryUser || mergePrimaryUser === mergeSecondaryUser) return;
                  // Remove the secondary user, keep the primary user
                  setUsers(users.filter(u => u.id !== mergeSecondaryUser));
                  setMergePrimaryUser('');
                  setMergeSecondaryUser('');
                  setShowMergeModal(false);
                }} 
                className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-ocean text-white shadow-sm hover:bg-[#2b8a9e] transition-colors flex items-center gap-2"
              >
                <GitMerge className="w-4 h-4" /> Confirm Merge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {showResetPasswordModal && actionUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <Key className="w-6 h-6 text-guesty-ocean" /> Reset Password
              </h3>
              <button onClick={() => { setShowResetPasswordModal(false); setActionUserId(null); }} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm text-guesty-forest/60">
                Choose how you want to reset the password for <span className="font-bold text-guesty-black">{users.find(u => u.id === actionUserId)?.name}</span>.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    alert(`Automated reset link sent to ${users.find(u => u.id === actionUserId)?.email}`);
                    setShowResetPasswordModal(false);
                    setActionUserId(null);
                  }}
                  className="w-full p-4 border border-guesty-beige rounded-[12px] hover:border-guesty-ocean hover:bg-guesty-ocean/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Mail className="w-5 h-5 text-guesty-ocean group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-guesty-black">Send Reset Link</span>
                  </div>
                  <p className="text-xs text-guesty-forest/60 pl-8">Sends an automated email with a secure link to reset their password.</p>
                </button>

                <button 
                  onClick={() => {
                    const tempPass = Math.random().toString(36).slice(-8);
                    alert(`Temporary password set to: ${tempPass}\n\nPlease communicate this securely to the user.`);
                    setShowResetPasswordModal(false);
                    setActionUserId(null);
                  }}
                  className="w-full p-4 border border-guesty-beige rounded-[12px] hover:border-guesty-merlot hover:bg-guesty-merlot/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <LockKeyhole className="w-5 h-5 text-guesty-merlot group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-guesty-black">Manually Set Temporary Password</span>
                  </div>
                  <p className="text-xs text-guesty-forest/60 pl-8">Generates a temporary password for immediate support. User will be forced to change it on next login.</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK GROUP ASSIGNMENT MODAL */}
      {showGroupAssignmentModal && actionUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <Users className="w-6 h-6 text-guesty-ocean" /> Quick Group Assignment
              </h3>
              <button onClick={() => { setShowGroupAssignmentModal(false); setActionUserId(null); }} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm text-guesty-forest/60">
                Manage group memberships for <span className="font-bold text-guesty-black">{users.find(u => u.id === actionUserId)?.name}</span>.
              </p>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                <input 
                  type="text" 
                  placeholder="Search groups, branches, tags..." 
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-guesty-ice/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                />
              </div>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                {availableGroups.filter(g => g.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) || (g.tags && g.tags.some((t: string) => t.toLowerCase().includes(groupSearchQuery.toLowerCase())))).map(group => {
                  const isMember = tempGroupSelection.includes(group.name);
                  
                  return (
                    <label key={group.name} className={`flex items-center justify-between p-3 border rounded-[12px] cursor-pointer transition-colors ${isMember ? 'border-guesty-ocean bg-guesty-ocean/5' : 'border-guesty-beige hover:bg-guesty-cream/50'}`}>
                      <div>
                        <span className="text-sm font-bold text-guesty-black">{group.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          {group.tags?.map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] font-bold text-guesty-forest/60 uppercase tracking-wider bg-guesty-cream px-1.5 py-0.5 rounded-[4px]">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isMember}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTempGroupSelection([...tempGroupSelection, group.name]);
                          } else {
                            setTempGroupSelection(tempGroupSelection.filter(g => g !== group.name));
                          }
                        }}
                        className="w-5 h-5 rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                      />
                    </label>
                  );
                })}
                {availableGroups.filter(g => g.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) || (g.tags && g.tags.some((t: string) => t.toLowerCase().includes(groupSearchQuery.toLowerCase())))).length === 0 && (
                  <div className="text-center py-8 text-guesty-forest/50 text-sm">
                    No groups found matching "{groupSearchQuery}"
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button 
                onClick={() => { setShowGroupAssignmentModal(false); setActionUserId(null); }} 
                className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige/50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const user = users.find(u => u.id === actionUserId);
                  if (user) {
                    setUsers(users.map(u => u.id === actionUserId ? { ...u, groups: tempGroupSelection } : u));
                    
                    const addedGroups = tempGroupSelection.filter(g => !user.groups?.includes(g));
                    const removedGroups = (user.groups || []).filter((g: string) => !tempGroupSelection.includes(g));
                    
                    const logsToAdd = [];
                    
                    if (addedGroups.length > 0 || removedGroups.length > 0) {
                      logsToAdd.push({
                        id: `l${Date.now()}`,
                        admin: 'Mor Damul Vardi',
                        action: 'Group Reassignment',
                        target: `${user.name} -> ${tempGroupSelection.length} groups`,
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
                      });
                    }

                    if (user.role === 'Power User' && (addedGroups.length > 0 || removedGroups.length > 0)) {
                      logsToAdd.push({
                        id: `l${Date.now() + 1}`,
                        admin: 'System',
                        action: 'Permissions Inheritance Update',
                        target: `${user.name} (Power User Profile Sync)`,
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
                      });
                    }
                    
                    if (logsToAdd.length > 0) {
                      setAuditLogs([...logsToAdd, ...auditLogs]);
                    }
                  }
                  setShowGroupAssignmentModal(false);
                  setActionUserId(null);
                }} 
                className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-ocean text-white hover:bg-guesty-ocean/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFLICT RESOLUTION MODAL */}
      {showConflictResolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-peach/10">
              <h3 className="text-xl font-bold text-guesty-merlot flex items-center gap-2">
                <ShieldAlert className="w-6 h-6" /> Resolve Permission Conflict
              </h3>
              <button onClick={() => setShowConflictResolutionModal(false)} className="text-guesty-merlot/50 hover:text-guesty-merlot transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-guesty-cream/30 rounded-[12px] border border-guesty-beige">
                <div className="w-12 h-12 rounded-full bg-guesty-ocean text-white flex items-center justify-center font-bold text-lg">AC</div>
                <div>
                  <h4 className="font-bold text-guesty-black">Alex Chen</h4>
                  <p className="text-sm text-guesty-forest/60">Data Analyst</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-guesty-black">Conflicting Rules:</p>
                
                <label className="flex items-start gap-4 p-4 border border-guesty-beige rounded-[12px] cursor-pointer hover:border-guesty-ocean/50 transition-colors">
                  <input type="radio" name="conflictResolution" className="mt-1" defaultChecked />
                  <div>
                    <span className="font-bold text-guesty-black block">Apply "Data Team" Rule</span>
                    <span className="text-sm text-guesty-forest/60">Grants Auto-Enroll access.</span>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 border border-guesty-beige rounded-[12px] cursor-pointer hover:border-guesty-ocean/50 transition-colors">
                  <input type="radio" name="conflictResolution" className="mt-1" />
                  <div>
                    <span className="font-bold text-guesty-black block">Apply "Contractors" Rule</span>
                    <span className="text-sm text-guesty-forest/60">Restricts access (Hidden).</span>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 border border-guesty-beige rounded-[12px] cursor-pointer hover:border-guesty-ocean/50 transition-colors">
                  <input type="radio" name="conflictResolution" className="mt-1" />
                  <div>
                    <span className="font-bold text-guesty-black block">Create Individual Exception</span>
                    <span className="text-sm text-guesty-forest/60">Override group rules and set a custom access level for Alex.</span>
                  </div>
                </label>
              </div>

            </div>
            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button 
                onClick={() => setShowConflictResolutionModal(false)} 
                className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige/50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowConflictResolutionModal(false)} 
                className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-merlot text-white hover:bg-guesty-merlot/90 transition-colors"
              >
                Apply Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCESS RULE MODAL */}
      {showAccessRuleModal && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <Shield className="w-6 h-6 text-guesty-ocean" /> Assign Access Rule
              </h3>
              <button onClick={() => { setShowAccessRuleModal(false); setAccessRuleSearchQuery(''); }} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm text-guesty-forest/60">
                Select a group, role, or department to grant access to <span className="font-bold text-guesty-black">{activeCourse.title}</span>.
              </p>
              
              {/* Type Selection */}
              <div className="flex bg-guesty-cream/50 p-1 rounded-[12px] border border-guesty-beige">
                {['Group', 'Role', 'Department'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAccessRuleType(type as any)}
                    className={`flex-1 py-2 text-sm font-bold rounded-[8px] transition-all ${accessRuleType === type ? 'bg-white shadow-sm text-guesty-ocean' : 'text-guesty-forest/60 hover:text-guesty-black'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                <input 
                  type="text" 
                  placeholder={`Search ${accessRuleType.toLowerCase()}s...`}
                  value={accessRuleSearchQuery}
                  onChange={e => setAccessRuleSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean outline-none transition-all"
                />
              </div>
              
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                {accessRuleType === 'Group' && availableGroups.filter(g => g.name.toLowerCase().includes(accessRuleSearchQuery.toLowerCase())).map(group => (
                  <label key={group.name} className="flex items-center justify-between p-3 border border-guesty-beige rounded-[12px] cursor-pointer hover:bg-guesty-cream/50 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-guesty-black">{group.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const newRule = { id: `ar${Date.now()}`, targetType: 'Group', targetName: group.name, accessType: 'Open', status: 'Active' };
                        setCourses(courses.map(c => c.id === activeCourseId ? { ...c, accessRules: [...(c.accessRules || []), newRule] } : c));
                        setShowAccessRuleModal(false);
                        setAccessRuleSearchQuery('');
                      }}
                      className="text-xs font-bold bg-guesty-ocean text-white px-3 py-1.5 rounded-[6px] hover:bg-guesty-ocean/90 transition-colors"
                    >
                      Assign
                    </button>
                  </label>
                ))}
                
                {accessRuleType === 'Role' && ['Admin', 'Manager', 'Employee', 'Contractor'].filter(r => r.toLowerCase().includes(accessRuleSearchQuery.toLowerCase())).map(role => (
                  <label key={role} className="flex items-center justify-between p-3 border border-guesty-beige rounded-[12px] cursor-pointer hover:bg-guesty-cream/50 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-guesty-black">{role}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const newRule = { id: `ar${Date.now()}`, targetType: 'Role', targetName: role, accessType: 'Open', status: 'Active' };
                        setCourses(courses.map(c => c.id === activeCourseId ? { ...c, accessRules: [...(c.accessRules || []), newRule] } : c));
                        setShowAccessRuleModal(false);
                        setAccessRuleSearchQuery('');
                      }}
                      className="text-xs font-bold bg-guesty-ocean text-white px-3 py-1.5 rounded-[6px] hover:bg-guesty-ocean/90 transition-colors"
                    >
                      Assign
                    </button>
                  </label>
                ))}

                {(accessRuleType as string) === 'Department' && ['Engineering', 'Sales', 'Marketing', 'Customer Success', 'HR'].filter(d => d.toLowerCase().includes(accessRuleSearchQuery.toLowerCase())).map(dept => (
                  <label key={dept} className="flex items-center justify-between p-3 border border-guesty-beige rounded-[12px] cursor-pointer hover:bg-guesty-cream/50 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-guesty-black">{dept}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const newRule = { id: `ar${Date.now()}`, targetType: 'Department', targetName: dept, accessType: 'Open', status: 'Active' };
                        setCourses(courses.map(c => c.id === activeCourseId ? { ...c, accessRules: [...(c.accessRules || []), newRule] } : c));
                        setShowAccessRuleModal(false);
                        setAccessRuleSearchQuery('');
                      }}
                      className="text-xs font-bold bg-guesty-ocean text-white px-3 py-1.5 rounded-[6px] hover:bg-guesty-ocean/90 transition-colors"
                    >
                      Assign
                    </button>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button 
                onClick={() => { setShowAccessRuleModal(false); setAccessRuleSearchQuery(''); }} 
                className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige/50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK ASSIGN MODAL */}
      {showBulkAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <Users className="w-6 h-6 text-guesty-ocean" /> Bulk Assign Users to Group
              </h3>
              <button onClick={() => { setShowBulkAssignModal(false); setShowBulkAssignConfirmation(false); }} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {!showBulkAssignConfirmation ? (
              <div className="p-8 space-y-6">
                <p className="text-sm text-guesty-forest/60">
                  Select users to assign to <span className="font-bold text-guesty-black">{groups.find(g => g.id === selectedGroupId)?.name}</span>.
                </p>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40" />
                  <input 
                    type="text" 
                    placeholder="Search by name, email, department, or site..." 
                    value={bulkAssignSearchQuery}
                    onChange={(e) => setBulkAssignSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-guesty-ice/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                  />
                </div>

                <div className="border border-guesty-beige rounded-[12px] overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-guesty-cream/50 text-guesty-forest/70 uppercase tracking-wider text-xs border-b border-guesty-beige sticky top-0 z-10">
                      <tr>
                        <th className="p-4 w-12 text-center">
                          <input 
                            type="checkbox" 
                            checked={bulkAssignSelectedUsers.length > 0 && bulkAssignSelectedUsers.length === users.filter(u => !u.groups?.includes(groups.find(g => g.id === selectedGroupId)?.name || '')).length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBulkAssignSelectedUsers(users.filter(u => !u.groups?.includes(groups.find(g => g.id === selectedGroupId)?.name || '')).map(u => u.id));
                              } else {
                                setBulkAssignSelectedUsers([]);
                              }
                            }}
                            className="rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                          />
                        </th>
                        <th className="p-4 font-bold">User</th>
                        <th className="p-4 font-bold">Department & Site</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-guesty-beige bg-white">
                      {users.filter(u => !u.groups?.includes(groups.find(g => g.id === selectedGroupId)?.name || '') && (
                        u.name.toLowerCase().includes(bulkAssignSearchQuery.toLowerCase()) || 
                        u.email.toLowerCase().includes(bulkAssignSearchQuery.toLowerCase()) ||
                        (u.domain && u.domain.toLowerCase().includes(bulkAssignSearchQuery.toLowerCase())) ||
                        (u.site && u.site.toLowerCase().includes(bulkAssignSearchQuery.toLowerCase()))
                      )).map(user => (
                        <tr key={user.id} className="hover:bg-guesty-cream/30 transition-colors">
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={bulkAssignSelectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBulkAssignSelectedUsers([...bulkAssignSelectedUsers, user.id]);
                                } else {
                                  setBulkAssignSelectedUsers(bulkAssignSelectedUsers.filter(id => id !== user.id));
                                }
                              }}
                              className="rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-guesty-ocean/10 text-guesty-ocean flex items-center justify-center font-bold text-xs shrink-0">
                                {user.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-bold text-guesty-black">{user.name}</p>
                                <p className="text-xs text-guesty-forest/60">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-guesty-black text-xs">{user.domain || 'N/A'}</p>
                            <p className="text-xs text-guesty-forest/60">{user.site || 'N/A'}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-6">
                <div className="bg-guesty-ice/50 border border-guesty-beige rounded-[12px] p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-guesty-ocean/10 text-guesty-ocean rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-guesty-black">Confirm Bulk Assignment</h4>
                  <p className="text-guesty-forest/70">
                    You are about to assign <strong className="text-guesty-black">{bulkAssignSelectedUsers.length} users</strong> to the group <strong className="text-guesty-black">{groups.find(g => g.id === selectedGroupId)?.name}</strong>.
                    <br />
                    This action can also be used to assign users to profiles or roles.
                  </p>
                  <p className="text-sm text-guesty-forest/50">
                    This operation will be processed in the background. You can continue working.
                  </p>
                </div>
              </div>
            )}

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button 
                onClick={() => {
                  if (showBulkAssignConfirmation) {
                    setShowBulkAssignConfirmation(false);
                  } else {
                    setShowBulkAssignModal(false);
                  }
                }} 
                className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige/50 transition-colors"
              >
                {showBulkAssignConfirmation ? 'Back' : 'Cancel'}
              </button>
              {!showBulkAssignConfirmation ? (
                <button 
                  onClick={() => setShowBulkAssignConfirmation(true)} 
                  disabled={bulkAssignSelectedUsers.length === 0}
                  className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-ocean text-white hover:bg-guesty-ocean/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Assignment
                </button>
              ) : (
                <button 
                  onClick={() => {
                    const groupName = groups.find(g => g.id === selectedGroupId)?.name || '';
                    
                    // Simulate background processing
                    setTimeout(() => {
                      setUsers(prevUsers => prevUsers.map(u => 
                        bulkAssignSelectedUsers.includes(u.id) 
                          ? { ...u, groups: [...(u.groups || []), groupName] } 
                          : u
                      ));
                      
                      const logEntry = {
                        id: `log${Date.now()}`,
                        action: 'Bulk Group Assignment',
                        target: `${bulkAssignSelectedUsers.length} users -> ${groupName}`,
                        user: 'Admin User',
                        timestamp: new Date().toISOString(),
                        details: `Assigned ${bulkAssignSelectedUsers.length} users to group ${groupName} via bulk action.`
                      };
                      setAuditLogs(prev => [logEntry, ...prev]);
                      
                      alert(`Bulk assignment of ${bulkAssignSelectedUsers.length} users completed successfully.`);
                    }, 1500);

                    setShowBulkAssignModal(false);
                    setShowBulkAssignConfirmation(false);
                    setBulkAssignSelectedUsers([]);
                  }} 
                  className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-ocean text-white hover:bg-guesty-ocean/90 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Execute Bulk Assign
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* USER PROGRESS MODAL */}
      {showUserProgressModal && progressUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50 shrink-0">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <Activity className="w-6 h-6 text-guesty-ocean" /> Learning Progress Report
              </h3>
              <button onClick={() => { setShowUserProgressModal(false); setProgressUserId(null); }} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
              {(() => {
                const user = users.find(u => u.id === progressUserId);
                if (!user) return null;
                
                return (
                  <div className="space-y-8">
                    {/* User Info Header */}
                    <div className="flex items-center gap-6 pb-6 border-b border-guesty-beige">
                      <div className="w-16 h-16 rounded-full bg-guesty-ocean/10 text-guesty-ocean flex items-center justify-center font-bold text-2xl shrink-0">
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-guesty-black">{user.name}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-guesty-forest/70">
                          <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user.email}</span>
                          <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {user.domain || 'N/A'}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.site || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Summary */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-guesty-ice/50 border border-guesty-beige rounded-[16px] p-6">
                        <div className="text-sm font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">Total Enrolled</div>
                        <div className="text-3xl font-bold text-guesty-black">12</div>
                      </div>
                      <div className="bg-guesty-nature/10 border border-guesty-nature/20 rounded-[16px] p-6">
                        <div className="text-sm font-bold text-guesty-nature uppercase tracking-widest mb-2">Completed</div>
                        <div className="text-3xl font-bold text-guesty-nature">8</div>
                      </div>
                      <div className="bg-guesty-sun/10 border border-guesty-sun/20 rounded-[16px] p-6">
                        <div className="text-sm font-bold text-guesty-sun uppercase tracking-widest mb-2">In Progress</div>
                        <div className="text-3xl font-bold text-guesty-sun">3</div>
                      </div>
                      <div className="bg-guesty-coral/10 border border-guesty-coral/20 rounded-[16px] p-6">
                        <div className="text-sm font-bold text-guesty-coral uppercase tracking-widest mb-2">Overdue</div>
                        <div className="text-3xl font-bold text-guesty-coral">1</div>
                      </div>
                    </div>

                    {/* Course Enrollments & Certifications */}
                    <div className="space-y-4">
                      <h5 className="text-lg font-bold text-guesty-black flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-guesty-ocean" /> Enrollments & Certifications
                      </h5>
                      <div className="border border-guesty-beige rounded-[12px] overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-guesty-cream/50 text-guesty-forest/70 uppercase tracking-wider text-xs border-b border-guesty-beige">
                            <tr>
                              <th className="p-4 font-bold">Course / Learning Plan</th>
                              <th className="p-4 font-bold">Enrollment Source</th>
                              <th className="p-4 font-bold">Status</th>
                              <th className="p-4 font-bold">Certification Status</th>
                              <th className="p-4 font-bold">Progress</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-guesty-beige bg-white">
                            <tr className="hover:bg-guesty-cream/30">
                              <td className="p-4 font-bold text-guesty-black">Security Basics</td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-guesty-ocean/10 text-guesty-ocean text-[10px] font-bold uppercase tracking-wider">
                                  <Zap className="w-3 h-3" /> Automation
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-guesty-nature font-bold text-xs">Completed</span>
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1 text-guesty-nature font-bold text-xs">
                                  <CheckCircle2 className="w-4 h-4" /> Certified
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-guesty-beige rounded-full overflow-hidden">
                                    <div className="h-full bg-guesty-nature" style={{ width: '100%' }}></div>
                                  </div>
                                  <span className="text-xs font-bold text-guesty-forest">100%</span>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-guesty-cream/30">
                              <td className="p-4 font-bold text-guesty-black">Data Privacy 101</td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-guesty-ocean/10 text-guesty-ocean text-[10px] font-bold uppercase tracking-wider">
                                  <Zap className="w-3 h-3" /> Automation
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-guesty-sun font-bold text-xs">In Progress</span>
                              </td>
                              <td className="p-4">
                                <span className="text-guesty-forest/50 font-bold text-xs">Pending</span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-guesty-beige rounded-full overflow-hidden">
                                    <div className="h-full bg-guesty-sun" style={{ width: '45%' }}></div>
                                  </div>
                                  <span className="text-xs font-bold text-guesty-forest">45%</span>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-guesty-cream/30">
                              <td className="p-4 font-bold text-guesty-black">Leadership Fundamentals</td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-guesty-beige text-guesty-forest text-[10px] font-bold uppercase tracking-wider">
                                  Manual
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-guesty-coral font-bold text-xs">Overdue</span>
                              </td>
                              <td className="p-4">
                                <span className="text-guesty-coral font-bold text-xs">Expired</span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-guesty-beige rounded-full overflow-hidden">
                                    <div className="h-full bg-guesty-coral" style={{ width: '80%' }}></div>
                                  </div>
                                  <span className="text-xs font-bold text-guesty-forest">80%</span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN USERS MODAL */}
      {showAssignUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                <Users className="w-6 h-6 text-guesty-ocean" /> Assign Users to Profile
              </h3>
              <button onClick={() => setShowAssignUsersModal(false)} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-guesty-forest/60">Select the Power Users you want to assign to this profile. Only users with the "Power User" role are shown.</p>
              <div className="space-y-2">
                {users.filter(u => u.role === 'Power User').map(u => (
                  <label key={u.id} className="flex items-center gap-3 p-3 border border-guesty-beige rounded-[12px] cursor-pointer hover:bg-guesty-cream/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={assignUsersSelection.includes(u.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssignUsersSelection([...assignUsersSelection, u.id]);
                        } else {
                          setAssignUsersSelection(assignUsersSelection.filter(id => id !== u.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-guesty-ocean/10 text-guesty-ocean flex items-center justify-center font-bold text-xs">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-guesty-black">{u.name}</div>
                        <div className="text-xs text-guesty-forest/60">{u.email}</div>
                      </div>
                    </div>
                  </label>
                ))}
                {users.filter(u => u.role === 'Power User').length === 0 && (
                  <div className="text-sm text-guesty-forest/60 bg-guesty-cream/50 p-4 rounded-[12px] border border-guesty-beige text-center">
                    No Power Users found. Create a user with the "Power User" role first.
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button onClick={() => setShowAssignUsersModal(false)} className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setUsers(users.map(u => {
                    if (u.role !== 'Power User') return u;
                    
                    const isSelected = assignUsersSelection.includes(u.id);
                    const currentProfiles = u.powerProfileIds || [];
                    
                    if (isSelected && !currentProfiles.includes(activeProfileId)) {
                      return { ...u, powerProfileIds: [...currentProfiles, activeProfileId] };
                    } else if (!isSelected && currentProfiles.includes(activeProfileId)) {
                      return { ...u, powerProfileIds: currentProfiles.filter(id => id !== activeProfileId) };
                    }
                    return u;
                  }));
                  setShowAssignUsersModal(false);
                }} 
                className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-ocean text-white shadow-sm hover:bg-[#2b8a9e] transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200 ${impersonatingUser ? 'top-14' : ''}`}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                  <Users className="w-5 h-5 text-guesty-ocean" />
                  Live Preview: Affected Users
                </h3>
                <p className="text-sm text-guesty-forest/70 mt-1">Review the users who will be automatically enrolled based on the current rules.</p>
              </div>
              <button onClick={() => { setShowPreviewModal(false); setSelectedPreviewUser(null); }} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-guesty-forest/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={previewSearchQuery}
                    onChange={(e) => setPreviewSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-guesty-ice/50 border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-guesty-cream/50 p-1 rounded-[8px] border border-guesty-beige">
                    <button 
                      onClick={() => setPreviewTab('included')}
                      className={`px-4 py-1.5 text-sm font-bold rounded-[6px] transition-colors ${previewTab === 'included' ? 'bg-white text-guesty-black shadow-sm' : 'text-guesty-forest/60 hover:text-guesty-black'}`}
                    >
                      Included
                    </button>
                    <button 
                      onClick={() => setPreviewTab('excluded')}
                      className={`px-4 py-1.5 text-sm font-bold rounded-[6px] transition-colors ${previewTab === 'excluded' ? 'bg-white text-guesty-black shadow-sm' : 'text-guesty-forest/60 hover:text-guesty-black'}`}
                    >
                      Excluded ({newGroupExceptions.length})
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-guesty-forest/70">
                    <RefreshCw className="w-3.5 h-3.5" /> Data synced from HiBob 2 hours ago
                  </div>
                </div>
              </div>

              <div className="border border-guesty-beige rounded-[12px] overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-guesty-cream/50 text-guesty-forest/70 font-bold border-b border-guesty-beige">
                    <tr>
                      <th className="px-4 py-3 w-10"></th>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Job Title <span className="inline-flex items-center gap-1 ml-1 text-[10px] bg-guesty-ocean/10 text-guesty-ocean px-1.5 py-0.5 rounded-full"><RefreshCw className="w-2.5 h-2.5" /> HiBob</span></th>
                      <th className="px-4 py-3">Start Date</th>
                      <th className="px-4 py-3">Email Domain</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-guesty-beige">
                    {users.filter(user => {
                      if (!newGroupApplyToExisting) return false;
                      
                      const isExcluded = newGroupExceptions.includes(user.id);
                      
                      if (previewTab === 'included') {
                        if (isExcluded) return false;
                        if (newGroupDynamicRules.length === 0) return false;
                        const matchesRules = newGroupDynamicLogic === 'AND' 
                          ? newGroupDynamicRules.every(rule => evaluateRule(rule, user))
                          : newGroupDynamicRules.some(rule => evaluateRule(rule, user));
                        if (!matchesRules) return false;
                      } else {
                        if (!isExcluded) return false;
                      }

                      if (!previewSearchQuery) return true;
                      
                      const searchLower = previewSearchQuery.toLowerCase();
                      return user.name.toLowerCase().includes(searchLower) || 
                             user.email.toLowerCase().includes(searchLower) ||
                             (user.jobTitle && user.jobTitle.toLowerCase().includes(searchLower));
                    }).map(user => {
                      const isExcluded = newGroupExceptions.includes(user.id);
                      return (
                      <React.Fragment key={user.id}>
                        <tr className={`hover:bg-guesty-ice/30 transition-colors ${isExcluded ? 'opacity-50 bg-guesty-beige/20' : ''}`}>
                          <td className="px-4 py-3">
                            <input 
                              type="checkbox" 
                              className="rounded border-guesty-beige text-guesty-ocean focus:ring-guesty-ocean cursor-pointer"
                              checked={!isExcluded}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewGroupExceptions(newGroupExceptions.filter(id => id !== user.id));
                                } else {
                                  setNewGroupExceptions([...newGroupExceptions, user.id]);
                                }
                              }}
                            />
                          </td>
                          <td className={`px-4 py-3 font-medium ${isExcluded ? 'text-guesty-forest/60 line-through' : 'text-guesty-black'}`}>{user.name}</td>
                          <td className="px-4 py-3 text-guesty-forest">{user.jobTitle || '-'}</td>
                          <td className="px-4 py-3 text-guesty-forest">{user.startDate || '-'}</td>
                          <td className="px-4 py-3 text-guesty-forest">{user.email.split('@')[1]}</td>
                          <td className="px-4 py-3 text-right">
                            {isExcluded ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-guesty-peach/20 text-guesty-merlot px-2 py-1 rounded-full">
                                <X className="w-3 h-3" /> Excluded by Admin
                              </span>
                            ) : (
                              <button 
                                onClick={() => setSelectedPreviewUser(selectedPreviewUser === user.id ? null : user.id)}
                                className="text-xs font-bold text-guesty-ocean hover:underline"
                              >
                                Why Included?
                              </button>
                            )}
                          </td>
                        </tr>
                        {selectedPreviewUser === user.id && !isExcluded && (
                          <tr className="bg-guesty-ocean/5">
                            <td colSpan={6} className="px-4 py-3">
                              <div className="text-xs space-y-2">
                                <p className="font-bold text-guesty-black">Why is {user.name} included?</p>
                                <ul className="space-y-1">
                                  {newGroupDynamicRules.map(rule => {
                                    const matched = evaluateRule(rule, user);
                                    return (
                                      <li key={rule.id} className={`flex items-center gap-2 ${matched ? 'text-guesty-ocean font-medium' : 'text-guesty-forest/50 line-through'}`}>
                                        {matched ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                        {rule.attribute} {rule.operator} {rule.value}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )})}
                    {users.filter(user => {
                      if (!newGroupApplyToExisting) return false;
                      const isExcluded = newGroupExceptions.includes(user.id);
                      if (previewTab === 'included') {
                        if (isExcluded) return false;
                        if (newGroupDynamicRules.length === 0) return false;
                        return newGroupDynamicLogic === 'AND' 
                          ? newGroupDynamicRules.every(rule => evaluateRule(rule, user))
                          : newGroupDynamicRules.some(rule => evaluateRule(rule, user));
                      } else {
                        return isExcluded;
                      }
                    }).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-guesty-forest/50">
                          {!newGroupApplyToExisting 
                            ? 'Toggle "Apply to existing users" to preview affected users.' 
                            : previewTab === 'excluded' 
                              ? 'No users have been excluded.' 
                              : 'No users match the current rules.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end">
              <button onClick={() => { setShowPreviewModal(false); setSelectedPreviewUser(null); }} className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-ocean text-white hover:bg-[#2b8a9e] transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      {showCreateGroupModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200 ${impersonatingUser ? 'top-14' : ''}`}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                  <Users className="w-6 h-6 text-guesty-ocean" /> Create Group
                </h3>
                <p className="text-guesty-forest/70 text-sm mt-1">Define group metadata and membership rules.</p>
              </div>
              <button onClick={() => setShowCreateGroupModal(false)} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto">
              {/* General Information */}
              <div className="space-y-6">
                <h4 className="font-bold text-guesty-black border-b border-guesty-beige pb-2">General Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-guesty-black">Group Name <span className="text-guesty-coral">*</span></label>
                    <input 
                      type="text" 
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g., Q2 Onboarding Cohort" 
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-guesty-black">Description</label>
                    <input 
                      type="text" 
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      placeholder="e.g., New hires joining in Q2" 
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-guesty-black">Tags</label>
                    <input 
                      type="text" 
                      value={newGroupTags}
                      onChange={(e) => setNewGroupTags(e.target.value)}
                      placeholder="e.g., Onboarding, Sales" 
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Membership Logic */}
              <div className="space-y-6">
                <h4 className="font-bold text-guesty-black border-b border-guesty-beige pb-2">Membership Logic</h4>
                
                <div className="bg-guesty-cream/30 p-6 rounded-[16px] border border-guesty-beige space-y-6">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="groupType" 
                        value="Manual" 
                        checked={newGroupType === 'Manual'}
                        onChange={(e) => setNewGroupType(e.target.value)}
                        className="text-guesty-ocean focus:ring-guesty-ocean"
                      />
                      <span className="text-sm font-bold text-guesty-black">Manual Assignment</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="groupType" 
                        value="Dynamic" 
                        checked={newGroupType === 'Dynamic'}
                        onChange={(e) => setNewGroupType(e.target.value)}
                        className="text-guesty-ocean focus:ring-guesty-ocean"
                      />
                      <span className="text-sm font-bold text-guesty-black">Dynamic (Smart Group)</span>
                    </label>
                  </div>

                  {newGroupType === 'Dynamic' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex border-b border-guesty-beige">
                        <button
                          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${newGroupTab === 'rules' ? 'border-guesty-ocean text-guesty-ocean' : 'border-transparent text-guesty-forest/60 hover:text-guesty-black'}`}
                          onClick={() => setNewGroupTab('rules')}
                        >
                          Rules
                        </button>
                        <button
                          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${newGroupTab === 'exceptions' ? 'border-guesty-ocean text-guesty-ocean' : 'border-transparent text-guesty-forest/60 hover:text-guesty-black'}`}
                          onClick={() => setNewGroupTab('exceptions')}
                        >
                          Exceptions
                          {newGroupExceptions.length > 0 && (
                            <span className="ml-2 bg-guesty-ocean/10 text-guesty-ocean px-1.5 py-0.5 rounded-full text-[10px]">{newGroupExceptions.length}</span>
                          )}
                        </button>
                      </div>

                      {newGroupTab === 'rules' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div className="bg-guesty-ice/30 p-4 rounded-[12px] border border-guesty-beige space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-bold text-guesty-black">Dynamic Rules Engine</label>
                              <select
                                value={newGroupDynamicLogic}
                                onChange={(e) => setNewGroupDynamicLogic(e.target.value as 'AND' | 'OR')}
                                className="px-3 py-1.5 bg-white border border-guesty-beige rounded-[8px] text-xs font-bold focus:border-guesty-ocean outline-none"
                              >
                                <option value="AND">Match ALL rules (AND)</option>
                                <option value="OR">Match ANY rule (OR)</option>
                              </select>
                            </div>
                            
                            <div className="space-y-3">
                              {newGroupDynamicRules.map((rule, index) => (
                                <div key={rule.id} className="flex items-center gap-2">
                                  {index > 0 && <span className="text-xs font-bold text-guesty-forest/50 w-8 text-center">{newGroupDynamicLogic}</span>}
                                  {index === 0 && <span className="text-xs font-bold text-guesty-forest/50 w-8 text-center">IF</span>}
                                  
                                  <select 
                                    value={rule.attribute}
                                    onChange={(e) => {
                                      const newRules = [...newGroupDynamicRules];
                                      newRules[index].attribute = e.target.value;
                                      const allowedOps = getOperatorsForAttribute(e.target.value);
                                      newRules[index].operator = allowedOps[0];
                                      if (allowedOps[0] === 'Is empty') {
                                        newRules[index].value = '';
                                      } else if (allowedOps[0] === 'Within the last X') {
                                        newRules[index].value = '30 Days';
                                      } else if (allowedOps[0] === 'Is one of') {
                                        newRules[index].value = '[]';
                                      } else {
                                        newRules[index].value = '';
                                      }
                                      setNewGroupDynamicRules(newRules);
                                    }}
                                    className="flex-1 px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                                  >
                                    <optgroup label="User Attributes">
                                      <option value="Job Title">Job Title</option>
                                      <option value="Start Date">Start Date</option>
                                      <option value="Enrollment Date">Enrollment Date</option>
                                      <option value="Email Domain">Email Domain</option>
                                      <option value="Department">Department</option>
                                      <option value="Site">Site</option>
                                      <option value="Employment Type">Employment Type</option>
                                    </optgroup>
                                    <optgroup label="External Apps">
                                      <option value="Salesforce: Account Type">Salesforce: Account Type</option>
                                      <option value="Zendesk: Organization">Zendesk: Organization</option>
                                      <option value="Airtable: Tag">Airtable: Tag</option>
                                    </optgroup>
                                  </select>

                                  <select 
                                    value={rule.operator}
                                    onChange={(e) => {
                                      const newRules = [...newGroupDynamicRules];
                                      newRules[index].operator = e.target.value;
                                      if (e.target.value === 'Is empty') {
                                        newRules[index].value = '';
                                      } else if (e.target.value === 'Within the last X') {
                                        newRules[index].value = '30 Days';
                                      } else if (e.target.value === 'Is one of') {
                                        newRules[index].value = '[]';
                                      } else {
                                        newRules[index].value = '';
                                      }
                                      setNewGroupDynamicRules(newRules);
                                    }}
                                    className="w-32 px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                                  >
                                    {getOperatorsForAttribute(rule.attribute).map(op => (
                                      <option key={op} value={op}>{op}</option>
                                    ))}
                                  </select>

                                  {rule.operator === 'Is empty' ? (
                                    <div className="flex-1"></div>
                                  ) : rule.operator === 'Is one of' ? (
                                    <div className="flex-1 flex flex-wrap gap-1 p-1 bg-white border border-guesty-beige rounded-[8px] min-h-[38px]">
                                      {(() => {
                                        let selectedVals: string[] = [];
                                        try { selectedVals = JSON.parse(rule.value || '[]'); } catch (e) {}
                                        return (
                                          <>
                                            {selectedVals.map(val => (
                                              <span key={val} className="inline-flex items-center gap-1 px-2 py-1 bg-guesty-ice text-guesty-forest text-xs rounded-[4px]">
                                                {val}
                                                <button onClick={() => {
                                                  const newRules = [...newGroupDynamicRules];
                                                  newRules[index].value = JSON.stringify(selectedVals.filter(v => v !== val));
                                                  setNewGroupDynamicRules(newRules);
                                                }}><X className="w-3 h-3" /></button>
                                              </span>
                                            ))}
                                            <select 
                                              className="flex-1 min-w-[100px] text-sm outline-none bg-transparent"
                                              value=""
                                              onChange={(e) => {
                                                if (!e.target.value) return;
                                                const newRules = [...newGroupDynamicRules];
                                                const newVals = [...selectedVals, e.target.value];
                                                newRules[index].value = JSON.stringify(newVals);
                                                setNewGroupDynamicRules(newRules);
                                              }}
                                            >
                                              <option value="" disabled>Add value...</option>
                                              {Array.from(new Set(users.map(u => {
                                                if (rule.attribute === 'Job Title') return u.jobTitle;
                                                if (rule.attribute === 'Department') return u.department;
                                                if (rule.attribute === 'Site') return u.site;
                                                if (rule.attribute === 'Employment Type') return u.employmentType;
                                                return null;
                                              }).filter(Boolean))).filter(val => !selectedVals.includes(val as string)).map(val => (
                                                <option key={val as string} value={val as string}>{val}</option>
                                              ))}
                                            </select>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  ) : rule.operator === 'Within the last X' ? (
                                    <div className="flex-1 flex gap-2">
                                      <input 
                                        type="number"
                                        min="1"
                                        value={rule.value.split(' ')[0] || '30'}
                                        onChange={(e) => {
                                          const newRules = [...newGroupDynamicRules];
                                          const unit = rule.value.split(' ')[1] || 'Days';
                                          newRules[index].value = `${e.target.value} ${unit}`;
                                          setNewGroupDynamicRules(newRules);
                                        }}
                                        className="w-20 px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                                      />
                                      <select
                                        value={rule.value.split(' ')[1] || 'Days'}
                                        onChange={(e) => {
                                          const newRules = [...newGroupDynamicRules];
                                          const num = rule.value.split(' ')[0] || '30';
                                          newRules[index].value = `${num} ${e.target.value}`;
                                          setNewGroupDynamicRules(newRules);
                                        }}
                                        className="flex-1 px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                                      >
                                        <option value="Days">Days</option>
                                        <option value="Weeks">Weeks</option>
                                        <option value="Months">Months</option>
                                        <option value="Years">Years</option>
                                      </select>
                                    </div>
                                  ) : ['Job Title', 'Department', 'Site', 'Employment Type'].includes(rule.attribute) ? (
                                    <select
                                      value={rule.value}
                                      onChange={(e) => {
                                        const newRules = [...newGroupDynamicRules];
                                        newRules[index].value = e.target.value;
                                        setNewGroupDynamicRules(newRules);
                                      }}
                                      className="flex-1 px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                                    >
                                      <option value="" disabled>Select {rule.attribute}...</option>
                                      {Array.from(new Set(users.map(u => {
                                        if (rule.attribute === 'Job Title') return u.jobTitle;
                                        if (rule.attribute === 'Department') return u.department;
                                        if (rule.attribute === 'Site') return u.site;
                                        if (rule.attribute === 'Employment Type') return u.employmentType;
                                        return null;
                                      }).filter(Boolean))).map(val => (
                                        <option key={val as string} value={val as string}>{val}</option>
                                      ))}
                                    </select>
                                  ) : ['Start Date', 'Enrollment Date'].includes(rule.attribute) ? (
                                    <input 
                                      type="date"
                                      value={rule.value}
                                      onChange={(e) => {
                                        const newRules = [...newGroupDynamicRules];
                                        newRules[index].value = e.target.value;
                                        setNewGroupDynamicRules(newRules);
                                      }}
                                      className="flex-1 px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                                    />
                                  ) : (
                                    <input 
                                      type="text"
                                      value={rule.value}
                                      onChange={(e) => {
                                        const newRules = [...newGroupDynamicRules];
                                        newRules[index].value = e.target.value;
                                        setNewGroupDynamicRules(newRules);
                                      }}
                                      placeholder="Value..."
                                      className="flex-1 px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean outline-none"
                                    />
                                  )}

                                  <button 
                                    onClick={() => {
                                      if (newGroupDynamicRules.length > 1) {
                                        setNewGroupDynamicRules(newGroupDynamicRules.filter(r => r.id !== rule.id));
                                      }
                                    }}
                                    className="p-2 text-guesty-forest/50 hover:text-guesty-coral transition-colors disabled:opacity-30"
                                    disabled={newGroupDynamicRules.length === 1}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <button 
                              onClick={() => {
                                setNewGroupDynamicRules([
                                  ...newGroupDynamicRules, 
                                  { id: Date.now().toString(), attribute: 'Job Title', operator: 'Equals', value: '' }
                                ]);
                              }}
                              className="text-xs font-bold text-guesty-ocean hover:underline flex items-center gap-1 mt-2"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Rule
                            </button>

                            <div className="mt-4 p-3 bg-guesty-ocean/5 border border-guesty-ocean/20 rounded-[8px] flex items-start gap-3">
                              <Activity className="w-4 h-4 text-guesty-ocean shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-guesty-ocean">Live Preview</p>
                                {newGroupDynamicRules.some(r => !getOperatorsForAttribute(r.attribute).includes(r.operator)) ? (
                                  <p className="text-xs text-guesty-coral mt-0.5 font-bold flex items-center gap-1">
                                    <X className="w-3.5 h-3.5" /> Invalid Rule Configuration
                                  </p>
                                ) : (
                                  <p className="text-xs text-guesty-forest/70 mt-0.5">
                                    Based on these rules, approximately <button onClick={() => setShowPreviewModal(true)} className="font-bold text-guesty-ocean hover:underline">
                                      {users.filter(user => {
                                        if (!newGroupApplyToExisting) return false;
                                        if (newGroupExceptions.includes(user.id)) return false;
                                        if (newGroupDynamicRules.length === 0) return false;

                                        if (newGroupDynamicLogic === 'AND') {
                                          return newGroupDynamicRules.every(rule => evaluateRule(rule, user));
                                        } else {
                                          return newGroupDynamicRules.some(rule => evaluateRule(rule, user));
                                        }
                                      }).length} existing users
                                    </button> will be automatically enrolled.
                                  </p>
                                )}
                                <p className="text-[10px] text-guesty-forest/50 mt-1 flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3" /> Last synced with HiBob: 2 hours ago
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-guesty-ice/30 p-4 rounded-[12px] border border-guesty-beige space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold text-guesty-black">Apply to existing users in the system</p>
                                <p className="text-xs text-guesty-forest/70 mt-1">
                                  If enabled, the rule scans the entire database and adds all matching users immediately.
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={newGroupApplyToExisting}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      const affectedCount = users.filter(user => {
                                        if (newGroupExceptions.includes(user.id)) return false;
                                        if (newGroupDynamicRules.length === 0) return false;
                                        return newGroupDynamicLogic === 'AND' 
                                          ? newGroupDynamicRules.every(rule => evaluateRule(rule, user))
                                          : newGroupDynamicRules.some(rule => evaluateRule(rule, user));
                                      }).length;
                                      if (window.confirm(`This will affect ${affectedCount} existing users and trigger their associated automations. Do you wish to proceed?`)) {
                                        setIsScanning(true);
                                        setScanError('');
                                        setTimeout(() => {
                                          setIsScanning(false);
                                          // Simulate a 10% chance of failure for debugging interface requirement
                                          if (Math.random() < 0.1) {
                                            setScanError('Unable to scan existing users. Please check HRIS sync status.');
                                            setNewGroupApplyToExisting(false);
                                          } else {
                                            setNewGroupApplyToExisting(true);
                                          }
                                        }, 800);
                                      }
                                    } else {
                                      setNewGroupApplyToExisting(false);
                                      setScanError('');
                                    }
                                  }}
                                />
                                <div className={`w-11 h-6 bg-guesty-beige peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-guesty-ocean ${isScanning ? 'opacity-50 cursor-wait' : ''}`}></div>
                              </label>
                            </div>
                            {scanError && (
                              <p className="text-xs text-guesty-coral mt-2 font-bold flex items-center gap-1">
                                <X className="w-3.5 h-3.5" /> {scanError}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {newGroupTab === 'exceptions' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-guesty-black">Manual Exceptions</h4>
                              <p className="text-xs text-guesty-forest/70 mt-1">Users listed here will never be added by the dynamic rule, even if they meet all criteria.</p>
                            </div>
                          </div>

                          <div className="relative">
                            <Search className="w-4 h-4 text-guesty-forest/50 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                              type="text" 
                              placeholder="Search users to add to exceptions..." 
                              value={newGroupExceptionSearch}
                              onChange={(e) => setNewGroupExceptionSearch(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                            />
                            {newGroupExceptionSearch && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-guesty-beige rounded-[8px] shadow-lg max-h-48 overflow-y-auto z-10">
                                {users.filter(u => !newGroupExceptions.includes(u.id) && (u.name.toLowerCase().includes(newGroupExceptionSearch.toLowerCase()) || u.email.toLowerCase().includes(newGroupExceptionSearch.toLowerCase()))).map(user => (
                                  <button
                                    key={user.id}
                                    onClick={() => {
                                      setNewGroupExceptions([...newGroupExceptions, user.id]);
                                      setNewGroupExceptionSearch('');
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-guesty-cream/50 text-sm flex items-center justify-between"
                                  >
                                    <div>
                                      <p className="font-bold text-guesty-black">{user.name}</p>
                                      <p className="text-xs text-guesty-forest/60">{user.email}</p>
                                    </div>
                                    <Plus className="w-4 h-4 text-guesty-ocean" />
                                  </button>
                                ))}
                                {users.filter(u => !newGroupExceptions.includes(u.id) && (u.name.toLowerCase().includes(newGroupExceptionSearch.toLowerCase()) || u.email.toLowerCase().includes(newGroupExceptionSearch.toLowerCase()))).length === 0 && (
                                  <div className="px-4 py-3 text-sm text-guesty-forest/50 text-center">No users found</div>
                                )}
                              </div>
                            )}
                          </div>

                          {newGroupExceptions.length > 0 ? (
                            <div className="border border-guesty-beige rounded-[8px] overflow-hidden">
                              <table className="w-full text-left text-sm">
                                <thead className="bg-guesty-cream/50 text-guesty-forest/70 font-bold border-b border-guesty-beige">
                                  <tr>
                                    <th className="px-4 py-2">User</th>
                                    <th className="px-4 py-2 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-guesty-beige">
                                  {newGroupExceptions.map(userId => {
                                    const user = users.find(u => u.id === userId);
                                    if (!user) return null;
                                    return (
                                      <tr key={user.id} className="hover:bg-guesty-ice/30">
                                        <td className="px-4 py-2">
                                          <p className="font-bold text-guesty-black">{user.name}</p>
                                          <p className="text-xs text-guesty-forest/60">{user.email}</p>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                          <button
                                            onClick={() => setNewGroupExceptions(newGroupExceptions.filter(id => id !== userId))}
                                            className="text-guesty-coral hover:text-red-700 transition-colors p-1"
                                            title="Remove Exception"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="p-6 text-center border border-dashed border-guesty-beige rounded-[8px] bg-guesty-ice/30">
                              <p className="text-sm text-guesty-forest/60">No exceptions added yet.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-guesty-black">Employment Type Filter</label>
                    <select 
                      value={newGroupEmploymentType}
                      onChange={(e) => setNewGroupEmploymentType(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="All">All Types</option>
                      <option value="Employees Only">Employees Only</option>
                      <option value="Contractors">Contractors</option>
                      <option value="Partners">Partners</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Automations & Visibility */}
              <div className="space-y-6">
                <h4 className="font-bold text-guesty-black border-b border-guesty-beige pb-2">Settings & Automations</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-guesty-black">Visibility</label>
                    <select 
                      value={newGroupVisibility}
                      onChange={(e) => setNewGroupVisibility(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="All Admins">All Admins</option>
                      <option value="Specific Roles">Specific Roles Only</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-center space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-guesty-ice/50 border border-guesty-beige rounded-[12px] hover:bg-guesty-cream/30 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={newGroupApplyDefaultRules}
                        onChange={(e) => setNewGroupApplyDefaultRules(e.target.checked)}
                        className="w-4 h-4 text-guesty-ocean rounded border-guesty-beige focus:ring-guesty-ocean"
                      />
                      <div>
                        <span className="text-sm font-bold text-guesty-black block">Apply Default Rules</span>
                        <span className="text-xs text-guesty-forest/70">Automatically enrolls users in Company Onboarding</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* External Sync & Webhooks */}
              {newGroupType === 'Dynamic' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <h4 className="font-bold text-guesty-black border-b border-guesty-beige pb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-guesty-ocean" /> External Sync & Webhooks
                  </h4>
                  
                  <div className="bg-guesty-ice/30 p-4 rounded-[12px] border border-guesty-beige space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-guesty-black">Real-time Synchronization</p>
                        <p className="text-xs text-guesty-forest/70 mt-1">
                          Listen for external events (e.g., Salesforce updates, Zendesk tickets) to instantly update group membership.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-guesty-beige peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-guesty-ocean"></div>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-guesty-beige">
                      <label className="text-sm font-bold text-guesty-black block mb-2">Webhook Endpoint URL</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-guesty-cream border border-guesty-beige rounded-[8px] text-xs text-guesty-forest/80 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                          https://api.guesty-lms.com/v1/webhooks/groups/sync/g{Date.now()}
                        </code>
                        <button className="p-2 text-guesty-ocean hover:bg-guesty-ocean/10 rounded-[8px] transition-colors" title="Copy URL">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                      </div>
                      <p className="text-[10px] text-guesty-forest/50 mt-2">
                        Send POST requests to this URL to trigger a re-evaluation of dynamic rules for specific users.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-between items-center shrink-0">
              <button 
                onClick={() => handleCreateGroup(true)}
                disabled={!newGroupName || (newGroupType === 'Dynamic' && newGroupDynamicRules.some(r => !r.value))}
                className="text-sm font-bold text-guesty-ocean hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
              >
                <GitMerge className="w-4 h-4" /> Create & Add Automation
              </button>
              <div className="flex gap-3">
                <button onClick={() => setShowCreateGroupModal(false)} className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={() => handleCreateGroup(false)}
                  disabled={!newGroupName || (newGroupType === 'Dynamic' && newGroupDynamicRules.some(r => !r.value))}
                  className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-ocean text-white shadow-sm hover:bg-[#2b8a9e] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" /> Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW AUTOMATION MODAL */}
      {showNewAutomationModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200 ${impersonatingUser ? 'top-14' : ''}`}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
              <div>
                <h3 className="text-xl font-bold text-guesty-black flex items-center gap-2">
                  <GitMerge className="w-6 h-6 text-guesty-ocean" /> New Automation
                </h3>
                {selectedGroupId && (
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    {groups.find(g => g.id === selectedGroupId)?.tags?.map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] font-bold text-guesty-forest/60 uppercase tracking-wider bg-guesty-cream px-1.5 py-0.5 rounded-[4px]">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setShowNewAutomationModal(false)} className="text-guesty-forest/50 hover:text-guesty-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-guesty-black">Automation Name</label>
                <input 
                  type="text" 
                  value={newAutomationName}
                  onChange={(e) => setNewAutomationName(e.target.value)}
                  placeholder="e.g., Onboarding Sync" 
                  className="w-full px-4 py-3 bg-guesty-ice/50 border border-guesty-beige rounded-[12px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                />
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-guesty-black border-b border-guesty-beige pb-2">Automation Logic</h4>
                
                <div className="bg-guesty-cream/30 p-6 rounded-[16px] border border-guesty-beige space-y-6">
                  {/* TRIGGER SENTENCE */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-bold text-guesty-black uppercase tracking-widest mr-2">When</span>
                    <select 
                      value={newAutomationTriggerType}
                      onChange={(e) => setNewAutomationTriggerType(e.target.value)}
                      className="px-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm font-bold text-guesty-ocean focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Time-Based">Time-Based</option>
                      <option value="Course Completion">User Completes</option>
                      <option value="Inactivity">User is Inactive for</option>
                      <option value="User Joins Group">User Joins Group</option>
                    </select>

                    {newAutomationTriggerType === 'Time-Based' && (
                      <>
                        <input 
                          type="number" 
                          value={timeBasedValue}
                          onChange={(e) => setTimeBasedValue(e.target.value)}
                          className="w-20 px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                        />
                        <select 
                          value={timeBasedUnit}
                          onChange={(e) => setTimeBasedUnit(e.target.value)}
                          className="px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="Days">Days</option>
                          <option value="Weeks">Weeks</option>
                          <option value="Months">Months</option>
                          <option value="Years">Years</option>
                        </select>
                        <span className="text-sm font-bold text-guesty-black">After</span>
                        <select 
                          value={timeBasedReference}
                          onChange={(e) => setTimeBasedReference(e.target.value)}
                          className="px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="Start Date">Start Date</option>
                          <option value="Enrollment Date">Enrollment Date</option>
                          <option value="Last Login">Last Login</option>
                        </select>
                      </>
                    )}

                    {newAutomationTriggerType === 'Course Completion' && (
                      <>
                        <input 
                          type="text"
                          list="trigger-course-suggestions"
                          value={courses.find(c => c.id === courseCompletionCourseId)?.title || courseCompletionCourseId}
                          onChange={(e) => {
                            const selectedCourse = courses.find(c => c.title === e.target.value);
                            setCourseCompletionCourseId(selectedCourse ? selectedCourse.id : e.target.value);
                          }}
                          placeholder="Search Course..."
                          className="flex-1 min-w-[200px] px-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                        />
                        <datalist id="trigger-course-suggestions">
                          {courses.map(c => (
                            <option key={c.id} value={c.title} />
                          ))}
                        </datalist>
                      </>
                    )}

                    {newAutomationTriggerType === 'Inactivity' && (
                      <>
                        <input 
                          type="number" 
                          value={inactivityValue}
                          onChange={(e) => setInactivityValue(e.target.value)}
                          className="w-20 px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                        />
                        <select 
                          value={inactivityUnit}
                          onChange={(e) => setInactivityUnit(e.target.value)}
                          className="px-3 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="Days">Days</option>
                          <option value="Weeks">Weeks</option>
                          <option value="Months">Months</option>
                        </select>
                      </>
                    )}

                    {newAutomationTriggerType === 'User Joins Group' && (
                      <span className="text-sm text-guesty-forest/70 italic">(Triggers immediately)</span>
                    )}
                  </div>

                  {/* ACTION SENTENCE */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-bold text-guesty-black uppercase tracking-widest mr-2">Then</span>
                    <select 
                      value={newAutomationActionType}
                      onChange={(e) => setNewAutomationActionType(e.target.value)}
                      className="px-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm font-bold text-guesty-ocean focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Auto-Enrollment">Enroll in</option>
                      <option value="Group Transition">Move to Group (Remove from current)</option>
                      <option value="Send Notification">Send Email Template</option>
                      <option value="Deactivate/Archive">Deactivate/Archive</option>
                    </select>

                    {newAutomationActionType === 'Auto-Enrollment' && (
                      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <input 
                          type="text"
                          list="course-suggestions"
                          value={courses.find(c => c.id === actionTargetCourseId)?.title || actionTargetCourseId}
                          onChange={(e) => {
                            const selectedCourse = courses.find(c => c.title === e.target.value);
                            setActionTargetCourseId(selectedCourse ? selectedCourse.id : e.target.value);
                          }}
                          placeholder="Search Course or Learning Plan..."
                          className="flex-1 px-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                        />
                        <datalist id="course-suggestions">
                          {courses.map(c => (
                            <option key={c.id} value={c.title} />
                          ))}
                        </datalist>
                        {actionTargetCourseId && courses.find(c => c.id === actionTargetCourseId) && (
                          <button 
                            onClick={() => window.open(`/?courseId=${actionTargetCourseId}&tab=production`, '_blank')}
                            className="text-xs font-bold text-guesty-ocean hover:underline flex items-center gap-1 whitespace-nowrap"
                          >
                            <ExternalLink className="w-3 h-3" /> View
                          </button>
                        )}
                      </div>
                    )}

                    {newAutomationActionType === 'Group Transition' && (
                      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <input 
                          type="text"
                          list="group-suggestions"
                          value={groups.find(g => g.id === actionTargetGroupId)?.name || actionTargetGroupId}
                          onChange={(e) => {
                            const selectedGroup = groups.find(g => g.name === e.target.value);
                            setActionTargetGroupId(selectedGroup ? selectedGroup.id : e.target.value);
                          }}
                          placeholder="Search Destination Group..."
                          className="flex-1 px-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all"
                        />
                        <datalist id="group-suggestions">
                          {groups.map(g => (
                            <option key={g.id} value={g.name} />
                          ))}
                        </datalist>
                        {actionTargetGroupId && groups.find(g => g.id === actionTargetGroupId) && (
                          <button 
                            onClick={() => window.open(`/?groupId=${actionTargetGroupId}`, '_blank')}
                            className="text-xs font-bold text-guesty-ocean hover:underline flex items-center gap-1 whitespace-nowrap"
                          >
                            <ExternalLink className="w-3 h-3" /> View
                          </button>
                        )}
                      </div>
                    )}

                    {newAutomationActionType === 'Send Notification' && (
                      <select 
                        value={newAutomationActionTarget}
                        onChange={(e) => setNewAutomationActionTarget(e.target.value)}
                        className="flex-1 min-w-[200px] px-4 py-2 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-ocean focus:ring-1 focus:ring-guesty-ocean outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select Email Template...</option>
                        <option value="Welcome to the Group">Welcome to the Group</option>
                        <option value="Course Enrollment Notification">Course Enrollment Notification</option>
                        <option value="Inactivity Reminder (3 Days)">Inactivity Reminder (3 Days)</option>
                        <option value="Inactivity Reminder (7 Days)">Inactivity Reminder (7 Days)</option>
                        <option value="Course Completion Certificate">Course Completion Certificate</option>
                        <option value="Manager Escalation">Manager Escalation</option>
                      </select>
                    )}

                    {newAutomationActionType === 'Deactivate/Archive' && (
                      <span className="text-sm text-guesty-forest/70 italic">(User will be archived)</span>
                    )}
                  </div>
                </div>
              </div>

              {newAutomationActionType === 'Auto-Enrollment' && newAutomationTriggerType === 'Time-Based' && actionTargetCourseId && (
                <div className="p-4 bg-guesty-ocean/5 border border-guesty-ocean/20 rounded-[12px] flex items-start gap-3">
                  <Activity className="w-4 h-4 text-guesty-ocean shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-guesty-ocean">Rule Set Preview</p>
                    <p className="text-sm text-guesty-forest/80 mt-1">
                      Any user {groups.find(g => g.id === selectedGroupId)?.type === 'Dynamic' && groups.find(g => g.id === selectedGroupId)?.dynamicRules?.length ? `where ${groups.find(g => g.id === selectedGroupId)?.dynamicRules?.map(r => `${r.attribute} ${r.operator} ${r.value}`).join(` ${groups.find(g => g.id === selectedGroupId)?.dynamicLogic} `)}` : 'in this group'} will be enrolled in <span className="font-bold text-guesty-black">{courses.find(c => c.id === actionTargetCourseId)?.title}</span> {timeBasedValue} {timeBasedUnit} {timeBasedRelation.toLowerCase()} their {timeBasedReference}.
                    </p>
                    
                    <div className="mt-4 border-t border-guesty-ocean/20 pt-4">
                      <p className="text-xs font-bold text-guesty-black mb-2">Sample Testing (First 3 Users)</p>
                      <ul className="space-y-2">
                        {users.filter(u => {
                          const group = groups.find(g => g.id === selectedGroupId);
                          if (!group) return false;
                          if (group.type === 'Dynamic' && group.dynamicRules) {
                            return group.dynamicLogic === 'AND' 
                              ? group.dynamicRules.every(rule => evaluateRule(rule, u))
                              : group.dynamicRules.some(rule => evaluateRule(rule, u));
                          }
                          return u.groups?.includes(group.name);
                        }).slice(0, 3).map(u => {
                          let baseDateStr = '';
                          if (timeBasedReference === 'Start Date') baseDateStr = u.startDate;
                          else if (timeBasedReference === 'Last Login') baseDateStr = new Date().toISOString().split('T')[0]; // Mocking last login as today for preview
                          else if (timeBasedReference === 'Enrollment Date') baseDateStr = new Date().toISOString().split('T')[0]; // Mocking enrollment date as today
                          
                          let expectedDateStr = 'Unknown';
                          if (baseDateStr) {
                            const date = new Date(baseDateStr);
                            const val = parseInt(timeBasedValue) || 0;
                            const multiplier = timeBasedRelation === 'After' ? 1 : -1;
                            
                            if (timeBasedUnit === 'Days') date.setDate(date.getDate() + (val * multiplier));
                            else if (timeBasedUnit === 'Weeks') date.setDate(date.getDate() + (val * 7 * multiplier));
                            else if (timeBasedUnit === 'Months') date.setMonth(date.getMonth() + (val * multiplier));
                            else if (timeBasedUnit === 'Years') date.setFullYear(date.getFullYear() + (val * multiplier));
                            
                            expectedDateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          }

                          return (
                            <li key={u.id} className="text-xs text-guesty-forest flex items-center justify-between bg-white/50 p-2 rounded-[6px]">
                              <span><span className="font-medium text-guesty-black">{u.name}</span> will be enrolled on <span className="font-bold text-guesty-ocean">{expectedDateStr}</span></span>
                              <span className="text-[10px] text-guesty-forest/50">Based on {timeBasedReference}</span>
                            </li>
                          );
                        })}
                        {users.filter(u => {
                          const group = groups.find(g => g.id === selectedGroupId);
                          if (!group) return false;
                          if (group.type === 'Dynamic' && group.dynamicRules) {
                            return group.dynamicLogic === 'AND' 
                              ? group.dynamicRules.every(rule => evaluateRule(rule, u))
                              : group.dynamicRules.some(rule => evaluateRule(rule, u));
                          }
                          return u.groups?.includes(group.name);
                        }).length === 0 && (
                          <li className="text-xs text-guesty-forest/50 italic">No users currently match this group's criteria.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Bulk Trigger Toggle */}
              <div className="flex items-center justify-between p-4 bg-guesty-ice/50 border border-guesty-beige rounded-[12px]">
                <div>
                  <h4 className="font-bold text-guesty-black text-sm">Run on existing members</h4>
                  <p className="text-xs text-guesty-forest/60 mt-0.5">Apply this automation to current group users immediately.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={runOnExistingMembers}
                    onChange={(e) => setRunOnExistingMembers(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-guesty-beige peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-guesty-ocean"></div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
              <button onClick={() => setShowNewAutomationModal(false)} className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleCreateAutomation}
                disabled={
                  !newAutomationName || 
                  (newAutomationTriggerType === 'Time-Based' && !timeBasedValue) ||
                  (newAutomationTriggerType === 'Course Completion' && !courseCompletionCourseId) ||
                  (newAutomationTriggerType === 'Inactivity' && !inactivityValue) ||
                  (newAutomationActionType === 'Auto-Enrollment' && !actionTargetCourseId) ||
                  (newAutomationActionType === 'Group Transition' && !actionTargetGroupId) ||
                  (newAutomationActionType === 'Send Notification' && !newAutomationActionTarget)
                }
                className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-ocean text-white shadow-sm hover:bg-[#2b8a9e] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" /> Create Automation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
