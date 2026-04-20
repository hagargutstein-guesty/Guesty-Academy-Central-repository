import React, { useState, useMemo, useEffect } from "react";
import { FolderPlus, Search, Plus, Database, Filter, Info, ChevronRight, Folder as FolderIcon, X, Edit3, Trash2, Archive, BarChart3, History, Link2, AlertTriangle, ChevronLeft, Columns, Download, MoreVertical, Layers, ChevronDown, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./Sidebar";
import UploadModal from "./UploadModal";
import FileTableRow from "./FileTableRow";
import MoveFileModal from "./MoveFileModal";
import MoveFolderModal from "./MoveFolderModal";
import AssetPreviewModal from "./AssetPreviewModal";
import RestoreAssetModal from "./RestoreAssetModal";
import AssignToCourseModal from "./AssignToCourseModal";
import BulkAssignModal from "./BulkAssignModal";
import BulkMoveModal from "./BulkMoveModal";
import { FileItem, Folder, HistoryEntry, Assessment, AssessmentAttempt, Group, Course } from "../types";
import { AssessmentBuilder } from "./AssessmentBuilder";
import { AssessmentAnalytics } from "./AssessmentAnalytics";
import { v4 as uuidv4 } from "uuid";

interface RepositoryDashboardProps {
  repository: FileItem[];
  setRepository: React.Dispatch<React.SetStateAction<FileItem[]>>;
  folders: Folder[];
  onCreateFolder: (name: string, parentId: string | null, rootType: "internal" | "customer" | "archived") => Folder;
  onUpdateFolder: (folderId: string, updates: Partial<Folder>) => void;
  onDeleteFolder: (folderId: string) => void;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  groups: Group[];
  attempts: AssessmentAttempt[];
  onSaveAssessmentAttempt?: (attempt: AssessmentAttempt) => void;
  userRole?: string;
}

export const RepositoryDashboard: React.FC<RepositoryDashboardProps> = ({ 
  repository, 
  setRepository,
  folders,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  courses,
  setCourses,
  groups,
  attempts,
  onSaveAssessmentAttempt,
  userRole = "Admin"
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const isAdmin = userRole === "Admin" || userRole === "Instructor";
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [movingFile, setMovingFile] = useState<FileItem | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<FileItem | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveCourseSearchQuery, setArchiveCourseSearchQuery] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedArchiveCourseIds, setSelectedArchiveCourseIds] = useState<string[]>([]);
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [isBulkMoveModalOpen, setIsBulkMoveModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkArchiveModalOpen, setIsBulkArchiveModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);
  const [isMoveFolderModalOpen, setIsMoveFolderModalOpen] = useState(false);
  const [folderRenameValue, setFolderRenameValue] = useState("");
  const [renameValue, setRenameValue] = useState("");
  
  // New states for table view
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['title', 'type', 'created', 'status', 'versions', 'courses']);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [creationDateStart, setCreationDateStart] = useState<string>("");
  const [creationDateEnd, setCreationDateEnd] = useState<string>("");
  const [updatedDateStart, setUpdatedDateStart] = useState<string>("");
  const [updatedDateEnd, setUpdatedDateEnd] = useState<string>("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [isAssessmentBuilderOpen, setIsAssessmentBuilderOpen] = useState(false);

  const selectedFolder = useMemo(() => 
    folders.find(f => f.id === selectedFolderId) || { id: "all", name: "All Assets", rootType: "internal" }
  , [folders, selectedFolderId]);

  const filteredFiles = useMemo(() => {
    return repository.filter(file => {
      const matchesSearch = (file.name || file.title || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFolder = selectedFolderId === "all" || file.folderId === selectedFolderId;
      const matchesType = typeFilter === "all" || file.type === typeFilter;
      const matchesStatus = statusFilter === "all" || file.status === statusFilter;
      
      const matchesCourse = courseFilter === "all" 
        ? true 
        : courseFilter === "associated" 
          ? (file.usedIn || 0) > 0 
          : (file.usedIn || 0) === 0;

      const fileDate = file.createdAt ? new Date(file.createdAt) : null;
      const matchesCreationDate = (!creationDateStart || (fileDate && fileDate >= new Date(creationDateStart))) &&
                                  (!creationDateEnd || (fileDate && fileDate <= new Date(creationDateEnd)));

      // For updated date, we'll use history if available, otherwise createdAt
      const lastUpdated = file.history && file.history.length > 0 
        ? new Date(file.history[0].date) 
        : fileDate;
      const matchesUpdatedDate = (!updatedDateStart || (lastUpdated && lastUpdated >= new Date(updatedDateStart))) &&
                                 (!updatedDateEnd || (lastUpdated && lastUpdated <= new Date(updatedDateEnd)));

      return matchesSearch && matchesFolder && matchesType && matchesStatus && matchesCourse && matchesCreationDate && matchesUpdatedDate;
    });
  }, [repository, selectedFolderId, searchQuery, typeFilter, statusFilter, courseFilter, creationDateStart, creationDateEnd, updatedDateStart, updatedDateEnd]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFiles.length / rowsPerPage);
  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredFiles.slice(start, start + rowsPerPage);
  }, [filteredFiles, currentPage, rowsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedFiles.map(f => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const breadcrumbs = useMemo(() => {
    if (selectedFolderId === "all") return [{ id: "all", name: "All Assets" }];
    const path: any[] = [];
    let current = folders.find(f => f.id === selectedFolderId);
    while (current) {
      path.unshift(current);
      const parent = folders.find(f => f.id === current.parentId);
      current = parent;
    }
    return [{ id: "all", name: "All Assets" }, ...path];
  }, [folders, selectedFolderId]);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const parentId = selectedFolderId === "all" ? null : selectedFolderId;
    onCreateFolder(newFolderName, parentId, (selectedFolder as Folder).rootType || "internal");
    setNewFolderName("");
    setIsCreateFolderModalOpen(false);
  };

  const handleUpload = (newFile: FileItem) => {
    setRepository(prev => [newFile, ...prev]);
  };

  const handleMove = (fileId: string, targetFolderId: string) => {
    setRepository(prev => prev.map(file => 
      file.id === fileId ? { ...file, folderId: targetFolderId } : file
    ));
    setMovingFile(null);
  };

  const handleDelete = (id: string) => {
    setRepository(prev => prev.filter(file => file.id !== id));
    setIsDeleteModalOpen(false);
    setSelectedAsset(null);
  };

  useEffect(() => {
    if (isArchiveModalOpen && selectedAsset) {
      const associatedCourses = courses.filter(course => 
        course.modules?.some((m: any) => m.id === selectedAsset.id)
      );
      setSelectedArchiveCourseIds(associatedCourses.map(c => c.id));
      setArchiveCourseSearchQuery("");
    }
  }, [isArchiveModalOpen, selectedAsset, courses]);

  const handleArchive = (asset: FileItem) => {
    const archiveFolder = folders.find(f => f.rootType === 'archived');
    if (archiveFolder) {
      // Remove from selected courses
      if (selectedArchiveCourseIds.length > 0) {
        setCourses(prev => prev.map(course => {
          if (selectedArchiveCourseIds.includes(course.id)) {
            return {
              ...course,
              modules: course.modules?.filter((m: any) => m.id !== asset.id)
            };
          }
          return course;
        }));
      }

      // Move to archive folder
      setRepository(prev => prev.map(file => 
        file.id === asset.id ? { 
          ...file, 
          folderId: archiveFolder.id, 
          status: 'Archived',
          usedIn: Math.max(0, (file.usedIn || 0) - selectedArchiveCourseIds.length)
        } : file
      ));
    }
    setIsArchiveModalOpen(false);
    setSelectedAsset(null);
    setSelectedArchiveCourseIds([]);
  };

  const handleSaveAssessment = async (assessment: Assessment) => {
    // Save to backend
    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": "default-tenant"
        },
        body: JSON.stringify(assessment)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save assessment");
      }

      const result = await response.json();

      // Update local repository state
      const existingAsset = repository.find(a => a.id === assessment.id);
      
      if (existingAsset) {
        setRepository(prev => prev.map(a => a.id === assessment.id ? {
          ...a,
          title: assessment.title,
          assessmentData: assessment,
          version: `v${(parseInt(a.version?.replace('v', '') || '1') + 1)}`
        } : a));
      } else {
        const newAsset: FileItem = {
          id: result.id,
          title: assessment.title,
          type: "Assessment",
          folderId: selectedFolderId === "all" ? folders[0].id : selectedFolderId,
          createdAt: new Date().toLocaleDateString(),
          version: "v1",
          status: "Active",
          usedIn: 0,
          views: 0,
          completionRate: "0%",
          assessmentData: assessment
        };
        setRepository(prev => [newAsset, ...prev]);
      }

      setIsAssessmentBuilderOpen(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleRestore = (fileId: string, targetFolderId: string) => {
    setRepository(prev => prev.map(file => 
      file.id === fileId ? { ...file, status: 'Active', folderId: targetFolderId } : file
    ));
    setIsRestoreModalOpen(false);
    setSelectedAsset(null);
  };

  const handleAssignToCourse = (courseId: string, position: 'start' | 'end' | 'after', relativeToId?: string) => {
    if (!selectedAsset) return;

    setCourses(prev => prev.map(course => {
      if (course.id !== courseId) return course;

      const newModule = {
        id: `m-${Date.now()}`,
        assetId: selectedAsset.id,
        title: selectedAsset.title || selectedAsset.name,
        type: selectedAsset.type,
        version: selectedAsset.version || 'v1.0'
      };

      let updatedModules = [...(course.modules || [])];
      
      if (position === 'start') {
        updatedModules.unshift(newModule);
      } else if (position === 'end') {
        updatedModules.push(newModule);
      } else if (position === 'after' && relativeToId) {
        const index = updatedModules.findIndex(m => m.id === relativeToId);
        if (index !== -1) {
          updatedModules.splice(index + 1, 0, newModule);
        } else {
          updatedModules.push(newModule);
        }
      }

      return { ...course, modules: updatedModules };
    }));

    // Update asset usage count
    setRepository(prev => prev.map(item => 
      item.id === selectedAsset.id ? { ...item, usedIn: (item.usedIn || 0) + 1 } : item
    ));
  };

  const handleBulkDelete = () => {
    setRepository(prev => prev.filter(file => !selectedIds.includes(file.id)));
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  const handleBulkArchive = () => {
    const archiveFolder = folders.find(f => f.rootType === 'archived');
    if (archiveFolder) {
      setRepository(prev => prev.map(file => 
        selectedIds.includes(file.id) ? { ...file, folderId: archiveFolder.id, status: 'Archived' } : file
      ));
    }
    setSelectedIds([]);
    setIsBulkArchiveModalOpen(false);
  };

  const handleBulkMove = (targetFolderId: string) => {
    setRepository(prev => prev.map(file => 
      selectedIds.includes(file.id) ? { ...file, folderId: targetFolderId } : file
    ));
    setSelectedIds([]);
    setIsBulkMoveModalOpen(false);
  };

  const handleBulkAssign = (courseIds: string[], position: 'start' | 'end' | 'after', relativeToId?: string) => {
    const selectedAssets = repository.filter(f => selectedIds.includes(f.id));
    
    setCourses(prev => prev.map(course => {
      if (!courseIds.includes(course.id)) return course;

      const newModules = selectedAssets.map(asset => ({
        id: `m-${Date.now()}-${asset.id}`,
        title: asset.title || asset.name,
        type: asset.type,
        version: asset.version || 'v1.0'
      }));

      let updatedModules = [...(course.modules || [])];
      
      if (position === 'start') {
        updatedModules = [...newModules, ...updatedModules];
      } else if (position === 'end') {
        updatedModules = [...updatedModules, ...newModules];
      } else if (position === 'after' && relativeToId) {
        const index = updatedModules.findIndex(m => m.id === relativeToId);
        if (index !== -1) {
          updatedModules.splice(index + 1, 0, ...newModules);
        } else {
          updatedModules = [...updatedModules, ...newModules];
        }
      }

      return { ...course, modules: updatedModules };
    }));

    // Update usage counts
    setRepository(prev => prev.map(item => 
      selectedIds.includes(item.id) ? { ...item, usedIn: (item.usedIn || 0) + courseIds.length } : item
    ));

    setSelectedIds([]);
    setIsBulkAssignModalOpen(false);
  };

  const handleRename = () => {
    if (selectedAsset && renameValue.trim()) {
      setRepository(prev => prev.map(file => 
        file.id === selectedAsset.id ? { ...file, title: renameValue, name: renameValue } : file
      ));
      setIsRenameModalOpen(false);
      setSelectedAsset(null);
      setRenameValue("");
    }
  };

  const handleVersionUpload = (newFile: FileItem, pushToCourseIds?: string[]) => {
    if (selectedAsset) {
      const oldVersion = selectedAsset.version || 'v1.0';
      const newVersionNum = (parseFloat(oldVersion.replace('v', '')) + 0.1).toFixed(1);
      const newVersion = `v${newVersionNum}`;
      
      const historyEntry: HistoryEntry = {
        version: oldVersion,
        date: selectedAsset.createdAt || new Date().toLocaleDateString(),
        size: selectedAsset.size || '0 MB',
        pushedToCourses: []
      };

      setRepository(prev => prev.map(file => 
        file.id === selectedAsset.id ? { 
          ...file, 
          title: newFile.title,
          name: newFile.title,
          version: newVersion,
          createdAt: new Date().toLocaleDateString(),
          size: newFile.size,
          history: [historyEntry, ...(file.history || [])]
        } : file
      ));

      if (pushToCourseIds && pushToCourseIds.length > 0) {
        setCourses(prev => prev.map(course => {
          if (pushToCourseIds.includes(course.id)) {
            return {
              ...course,
              modules: course.modules?.map((m: any) => 
                m.id === selectedAsset.id ? { ...m, version: newVersion, title: newFile.title } : m
              )
            };
          }
          return course;
        }));
      }
    }
    setIsVersionModalOpen(false);
    setSelectedAsset(null);
  };

  const handleMoveFolder = (folderId: string, targetFolderId: string | null) => {
    onUpdateFolder(folderId, { parentId: targetFolderId });
  };

  const handleRenameFolder = () => {
    if (editingFolder && folderRenameValue.trim()) {
      onUpdateFolder(editingFolder.id, { name: folderRenameValue.trim() });
      setIsRenameFolderModalOpen(false);
      setEditingFolder(null);
    }
  };

  const handleDeleteFolder = () => {
    if (editingFolder) {
      onDeleteFolder(editingFolder.id);
      setIsDeleteFolderModalOpen(false);
      setEditingFolder(null);
      if (selectedFolderId === editingFolder.id) {
        setSelectedFolderId("all");
      }
    }
  };

  return (
    <div className="flex h-full bg-white overflow-hidden font-sans">
      <Sidebar 
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        folders={folders}
        isAdmin={isAdmin}
        onRenameFolder={(folder) => {
          setEditingFolder(folder);
          setFolderRenameValue(folder.name);
          setIsRenameFolderModalOpen(true);
        }}
        onMoveFolder={(folder) => {
          setEditingFolder(folder);
          setIsMoveFolderModalOpen(true);
        }}
        onDeleteFolder={(folder) => {
          setEditingFolder(folder);
          setIsDeleteFolderModalOpen(true);
        }}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Action Bar */}
        <header className="h-20 border-b border-guesty-beige flex items-center justify-between px-8 flex-shrink-0 bg-white sticky top-0 z-30">
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/40 group-focus-within:text-guesty-nature transition-colors" />
            <input
              type="text"
              placeholder={`Search in ${selectedFolder.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-guesty-ice/30 border border-transparent rounded-xl text-sm focus:bg-white focus:border-guesty-nature focus:ring-1 focus:ring-guesty-nature outline-none transition-all font-medium"
            />
          </div>

          <div className="flex items-center space-x-3 ml-4">
            <div className="relative">
              <button 
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className={`p-2.5 rounded-xl transition-all border ${isFilterMenuOpen ? 'bg-guesty-lemon/20 border-guesty-nature/20 text-guesty-nature' : 'text-guesty-forest/50 hover:text-guesty-nature hover:bg-guesty-ice border-transparent'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {isFilterMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-guesty-beige z-50 p-6 space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-guesty-black">Filters</h4>
                      <button 
                        onClick={() => { 
                          setTypeFilter("all"); 
                          setStatusFilter("all"); 
                          setCourseFilter("all");
                          setCreationDateStart("");
                          setCreationDateEnd("");
                          setUpdatedDateStart("");
                          setUpdatedDateEnd("");
                        }}
                        className="text-xs font-bold text-guesty-nature hover:underline uppercase tracking-wider"
                      >
                        Clear all
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-widest">Content Type</label>
                          <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full bg-guesty-ice/30 border border-guesty-beige/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-guesty-nature transition-colors"
                          >
                            <option value="all">All Types</option>
                            <option value="SCORM">SCORM</option>
                            <option value="xAPI">xAPI</option>
                            <option value="Video">Video</option>
                            <option value="PDF">PDF</option>
                          </select>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-widest">Status</label>
                          <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-guesty-ice/30 border border-guesty-beige/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-guesty-nature transition-colors"
                          >
                            <option value="all">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-widest">Course Association</label>
                          <select 
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="w-full bg-guesty-ice/30 border border-guesty-beige/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-guesty-nature transition-colors"
                          >
                            <option value="all">All Assets</option>
                            <option value="associated">Associated with Courses</option>
                            <option value="not-associated">Not Associated</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-widest">Creation Date Range</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="date" 
                              value={creationDateStart}
                              onChange={(e) => setCreationDateStart(e.target.value)}
                              className="w-full bg-guesty-ice/30 border border-guesty-beige/50 rounded-xl px-2 py-2 text-xs outline-none focus:border-guesty-nature transition-colors"
                            />
                            <input 
                              type="date" 
                              value={creationDateEnd}
                              onChange={(e) => setCreationDateEnd(e.target.value)}
                              className="w-full bg-guesty-ice/30 border border-guesty-beige/50 rounded-xl px-2 py-2 text-xs outline-none focus:border-guesty-nature transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-widest">Last Updated Range</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="date" 
                              value={updatedDateStart}
                              onChange={(e) => setUpdatedDateStart(e.target.value)}
                              className="w-full bg-guesty-ice/30 border border-guesty-beige/50 rounded-xl px-2 py-2 text-xs outline-none focus:border-guesty-nature transition-colors"
                            />
                            <input 
                              type="date" 
                              value={updatedDateEnd}
                              onChange={(e) => setUpdatedDateEnd(e.target.value)}
                              className="w-full bg-guesty-ice/30 border border-guesty-beige/50 rounded-xl px-2 py-2 text-xs outline-none focus:border-guesty-nature transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-widest">Folder</label>
                          <select 
                            value={selectedFolderId}
                            onChange={(e) => setSelectedFolderId(e.target.value)}
                            className="w-full bg-guesty-ice/30 border border-guesty-beige/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-guesty-nature transition-colors"
                          >
                            <option value="all">All Folders</option>
                            {folders.map(f => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-guesty-beige/30 flex justify-end">
                      <button 
                        onClick={() => setIsFilterMenuOpen(false)}
                        className="px-6 py-2 bg-guesty-nature text-white rounded-xl font-bold text-sm hover:bg-guesty-forest transition-colors shadow-sm"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                className={`p-2.5 rounded-xl transition-all border ${isColumnMenuOpen ? 'bg-guesty-lemon/20 border-guesty-nature/20 text-guesty-nature' : 'text-guesty-forest/50 hover:text-guesty-nature hover:bg-guesty-ice border-transparent'}`}
              >
                <Columns className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isColumnMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4"
                  >
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Visible Columns</h4>
                    <div className="space-y-2">
                      {[
                        { id: 'title', label: 'Title' },
                        { id: 'type', label: 'Type' },
                        { id: 'created', label: 'Creation Date' },
                        { id: 'status', label: 'Status' },
                        { id: 'versions', label: 'Versions' },
                        { id: 'courses', label: 'Courses' }
                      ].map(col => (
                        <label key={col.id} className="flex items-center space-x-3 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={visibleColumns.includes(col.id)}
                            onChange={() => {
                              setVisibleColumns(prev => 
                                prev.includes(col.id) ? prev.filter(c => c !== col.id) : [...prev, col.id]
                              );
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-guesty-nature focus:ring-guesty-nature"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="w-px h-6 bg-guesty-beige mx-2" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  setIsAssessmentBuilderOpen(true);
                }}
                className="flex items-center space-x-2 px-4 py-3 bg-white border border-guesty-beige text-guesty-black rounded-xl text-sm font-bold hover:bg-guesty-ice transition-all active:scale-95 shadow-sm"
              >
                <Plus className="w-4 h-4 text-guesty-nature" />
                <span>New Quiz</span>
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-guesty-nature text-white rounded-xl text-sm font-bold hover:bg-guesty-forest transition-all active:scale-95 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumbs & Actions */}
          <div className="px-8 py-4 flex items-center justify-between bg-white border-b border-guesty-beige/50">
            <div className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id}>
                  {index > 0 && <ChevronRight className="w-4 h-4 text-guesty-forest/30" />}
                  <button 
                    onClick={() => setSelectedFolderId(crumb.id)}
                    className={`hover:text-guesty-nature transition-colors ${index === breadcrumbs.length - 1 ? "font-bold text-guesty-black" : "text-guesty-forest/50"}`}
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              {selectedIds.length > 0 && (
                <div className="flex items-center space-x-1 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center space-x-2 mr-2">
                    <span className="text-xs font-bold text-guesty-nature bg-guesty-lemon/20 px-3 py-1.5 rounded-full border border-guesty-nature/10">
                      {selectedIds.length} Selected
                    </span>
                    <button 
                      onClick={() => setSelectedIds([])}
                      className="p-1.5 text-guesty-forest/40 hover:text-guesty-forest hover:bg-guesty-ice rounded-lg transition-all"
                      title="Clear selection"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="h-6 w-px bg-guesty-beige mx-1" />
                  
                  <button 
                    onClick={() => setIsBulkAssignModalOpen(true)}
                    className="flex items-center space-x-2 px-3 py-2 text-guesty-forest/60 hover:text-guesty-nature hover:bg-guesty-lemon/20 rounded-xl transition-all group"
                  >
                    <Layers className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Assign to courses</span>
                  </button>

                  <button 
                    onClick={() => setIsBulkMoveModalOpen(true)}
                    className="flex items-center space-x-2 px-3 py-2 text-guesty-forest/60 hover:text-guesty-ocean hover:bg-guesty-ice rounded-xl transition-all group"
                  >
                    <FolderIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Move to folder</span>
                  </button>

                  <button 
                    onClick={() => setIsBulkArchiveModalOpen(true)}
                    className="flex items-center space-x-2 px-3 py-2 text-guesty-forest/60 hover:text-guesty-nature hover:bg-guesty-lemon/20 rounded-xl transition-all group"
                  >
                    <Archive className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Archive</span>
                  </button>

                  <button 
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="flex items-center space-x-2 px-3 py-2 text-guesty-forest/60 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                  >
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Delete</span>
                  </button>
                </div>
              )}
              {isAdmin && selectedFolderId !== "all" && (selectedFolder as Folder).rootType !== 'archived' && (
                <button
                  onClick={() => setIsCreateFolderModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-guesty-beige text-guesty-forest rounded-xl text-xs font-bold hover:bg-guesty-ice/30 transition-all"
                >
                  <FolderPlus className="w-4 h-4 text-guesty-nature" />
                  <span>New Folder</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto custom-scrollbar bg-white">
            {filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-guesty-ice/30 rounded-3xl flex items-center justify-center mb-6 border border-guesty-beige/50">
                  <Database className="w-10 h-10 text-guesty-forest/20" />
                </div>
                <h3 className="text-lg font-bold text-guesty-black">No materials found</h3>
                <p className="text-sm text-guesty-forest/50 mt-2 max-w-xs mx-auto">
                  {searchQuery 
                    ? `No results for "${searchQuery}" in this folder.` 
                    : "Start by uploading training materials to this repository."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 bg-white z-20">
                  <tr className="border-b border-guesty-beige/50">
                    <th className="px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedIds.length === paginatedFiles.length && paginatedFiles.length > 0}
                        className="w-4 h-4 rounded border-guesty-beige text-guesty-nature focus:ring-guesty-nature cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 w-16"></th>
                    {visibleColumns.includes('title') && <th className="px-6 py-4 text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em]">Title</th>}
                    {visibleColumns.includes('type') && <th className="px-6 py-4 text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em]">Type</th>}
                    {visibleColumns.includes('created') && <th className="px-6 py-4 text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em]">Created</th>}
                    {visibleColumns.includes('status') && <th className="px-6 py-4 text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em]">Status</th>}
                    {visibleColumns.includes('versions') && <th className="px-6 py-4 text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em]">Versions</th>}
                    {visibleColumns.includes('courses') && <th className="px-6 py-4 text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em]">Courses</th>}
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-guesty-beige/30">
                  {paginatedFiles.map((file) => (
                    <FileTableRow
                      key={file.id}
                      file={file}
                      isSelected={selectedIds.includes(file.id)}
                      visibleColumns={visibleColumns}
                      onSelect={handleSelectOne}
                      onDelete={(id) => { setSelectedAsset(file); setIsDeleteModalOpen(true); }}
                      onArchive={(asset) => { setSelectedAsset(asset); setIsArchiveModalOpen(true); }}
                      onRename={(asset) => { setSelectedAsset(asset); setRenameValue(asset.title || asset.name || ""); setIsRenameModalOpen(true); }}
                      onViewAnalytics={(asset) => { setSelectedAsset(asset); setIsAnalyticsModalOpen(true); }}
                      onUploadVersion={(asset) => { setSelectedAsset(asset); setIsVersionModalOpen(true); }}
                      onViewUsage={(asset) => { setSelectedAsset(asset); setIsUsageModalOpen(true); }}
                      onPreview={(asset) => { setSelectedAsset(asset); setIsPreviewModalOpen(true); }}
                      onRestore={(asset) => { setSelectedAsset(asset); setIsRestoreModalOpen(true); }}
                      onAssignToCourse={(asset) => { setSelectedAsset(asset); setIsAssignModalOpen(true); }}
                      onEditAssessment={(asset) => { setSelectedAsset(asset); setIsAssessmentBuilderOpen(true); }}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Footer */}
          <footer className="h-16 border-t border-gray-100 px-8 flex items-center justify-between bg-white flex-shrink-0">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * rowsPerPage, filteredFiles.length)}</span> of <span className="font-bold text-gray-900">{filteredFiles.length}</span> assets
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Rows per page:</span>
                <select 
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 outline-none focus:border-guesty-nature transition-colors"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === page 
                        ? "bg-guesty-nature text-white shadow-md shadow-guesty-nature/20" 
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </footer>
        </div>
      </main>

      <MoveFileModal
        file={movingFile}
        onClose={() => setMovingFile(null)}
        onMove={handleMove}
        folders={folders}
      />

      {/* Rename Modal */}
      <AnimatePresence>
        {isRenameModalOpen && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-guesty-lemon to-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-guesty-ice rounded-xl text-guesty-nature">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Rename Asset</h2>
                </div>
                <button onClick={() => setIsRenameModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">New Name</label>
                  <input
                    type="text"
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-guesty-nature focus:border-transparent transition-all outline-none text-gray-900 font-medium"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsRenameModalOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRename}
                    disabled={!renameValue.trim() || renameValue === (selectedAsset.title || selectedAsset.name)}
                    className="flex-1 py-3 bg-guesty-nature text-white rounded-xl font-bold text-sm hover:bg-guesty-forest shadow-lg shadow-guesty-nature/10 transition-all disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-red-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-xl text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Delete Asset</h2>
                </div>
                <button onClick={() => setIsDeleteModalOpen(false)} className="p-2 hover:bg-red-100/50 rounded-full transition-colors text-red-400 hover:text-red-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-start gap-4 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Permanent Deletion</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      You are about to permanently delete <span className="font-bold text-red-600">"{selectedAsset.title || selectedAsset.name}"</span>. 
                      This action cannot be undone and will remove the asset from all associated courses.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(selectedAsset.id)}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-600/10 transition-all"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Archive Confirmation Modal */}
      <AnimatePresence>
        {isArchiveModalOpen && selectedAsset && (() => {
          const associatedCourses = courses.filter(course => 
            course.modules?.some((m: any) => m.id === selectedAsset.id)
          );
          
          const filteredAssociatedCourses = associatedCourses.filter(course => 
            course.title.toLowerCase().includes(archiveCourseSearchQuery.toLowerCase())
          );

          const allSelected = selectedArchiveCourseIds.length === associatedCourses.length && associatedCourses.length > 0;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
              >
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-guesty-lemon/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-guesty-ice rounded-xl text-guesty-nature">
                      <Archive className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Archive Asset</h2>
                  </div>
                  <button onClick={() => setIsArchiveModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                  <div className="flex items-start gap-4 p-4 bg-guesty-ice/20 rounded-2xl border border-guesty-nature/10">
                    <Info className="w-6 h-6 text-guesty-nature flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Move to Archive</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Archiving <span className="font-bold">"{selectedAsset.title || selectedAsset.name}"</span> will move it to the Archived folder. 
                        Historical data will be preserved.
                      </p>
                    </div>
                  </div>

                  {associatedCourses.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Remove from Courses</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">Select courses to remove this content from</p>
                        </div>
                        <button 
                          onClick={() => {
                            if (allSelected) {
                              setSelectedArchiveCourseIds([]);
                            } else {
                              setSelectedArchiveCourseIds(associatedCourses.map(c => c.id));
                            }
                          }}
                          className="text-[10px] font-bold text-guesty-nature uppercase tracking-widest hover:text-guesty-forest transition-colors"
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </button>
                      </div>

                      {associatedCourses.length > 5 && (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search associated courses..."
                            value={archiveCourseSearchQuery}
                            onChange={(e) => setArchiveCourseSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-guesty-nature/20 focus:border-guesty-nature transition-all"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        {filteredAssociatedCourses.length > 0 ? (
                          filteredAssociatedCourses.map(course => (
                            <div 
                              key={course.id}
                              onClick={() => {
                                setSelectedArchiveCourseIds(prev => 
                                  prev.includes(course.id) 
                                    ? prev.filter(id => id !== course.id) 
                                    : [...prev, course.id]
                                );
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                selectedArchiveCourseIds.includes(course.id) 
                                  ? "bg-guesty-lemon/30 border-guesty-nature/30" 
                                  : "bg-gray-50 border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-gray-100">
                                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 truncate max-w-[220px]">{course.title}</span>
                              </div>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                selectedArchiveCourseIds.includes(course.id)
                                  ? "bg-guesty-nature border-guesty-nature text-white"
                                  : "bg-white border-gray-200"
                              }`}>
                                {selectedArchiveCourseIds.includes(course.id) && <CheckCircle2 className="w-3 h-3" />}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-xs text-gray-400 italic">No courses match your search.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => setIsArchiveModalOpen(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all border border-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleArchive(selectedAsset)}
                      className="flex-1 py-3 bg-guesty-nature text-white rounded-xl font-bold text-sm hover:bg-guesty-forest shadow-lg shadow-guesty-nature/10 transition-all"
                    >
                      Confirm Archive
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Analytics Modal */}
      <AnimatePresence>
        {isAnalyticsModalOpen && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-br from-guesty-lemon/50 to-white">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-guesty-nature">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Performance Analytics</h2>
                    <p className="text-sm text-gray-500">{selectedAsset.title || selectedAsset.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsAnalyticsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Completion Rate</p>
                    <p className="text-3xl font-black text-guesty-nature">{selectedAsset.completionRate || "88%"}</p>
                    <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-guesty-nature h-full" style={{ width: selectedAsset.completionRate || "88%" }} />
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Avg. View Time</p>
                    <p className="text-3xl font-black text-guesty-ocean">72%</p>
                    <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-guesty-ocean h-full" style={{ width: "72%" }} />
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Avg. Score</p>
                    <p className="text-3xl font-black text-guesty-merlot">94/100</p>
                    <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-guesty-merlot h-full" style={{ width: "94%" }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-guesty-nature" /> Version History
                  </h4>
                  <div className="space-y-3">
                    {/* Current Version */}
                    <div className="p-5 bg-guesty-lemon/10 border border-guesty-nature/20 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 bg-guesty-nature text-white text-[10px] font-bold rounded-bl-xl">
                        CURRENT
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-lg font-black text-gray-900">{selectedAsset.version}</p>
                          <p className="text-xs text-gray-500">{selectedAsset.createdAt} • {selectedAsset.size}</p>
                        </div>
                      </div>
                      
                      {/* Courses using this version */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Used in Courses</p>
                        <div className="flex flex-wrap gap-2">
                          {courses.filter(c => c.modules?.some((m: any) => m.id === selectedAsset.id && m.version === selectedAsset.version)).length > 0 ? (
                            courses.filter(c => c.modules?.some((m: any) => m.id === selectedAsset.id && m.version === selectedAsset.version)).map(course => (
                              <div key={course.id} className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-guesty-nature/10 rounded-full shadow-sm">
                                <div className="w-4 h-4 rounded-full overflow-hidden">
                                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-700">{course.title}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-gray-400 italic">No courses currently using this version.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Previous Versions */}
                    {(selectedAsset.history || []).map((h, i) => (
                      <div key={i} className="p-5 bg-white border border-gray-100 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-lg font-bold text-gray-700">{h.version}</p>
                            <p className="text-xs text-gray-400">{h.date} • {h.size}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-400 rounded-full">
                            PREVIOUS
                          </span>
                        </div>

                        {/* Courses using this version */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Used in Courses</p>
                          <div className="flex flex-wrap gap-2">
                            {courses.filter(c => c.modules?.some((m: any) => m.id === selectedAsset.id && m.version === h.version)).length > 0 ? (
                              courses.filter(c => c.modules?.some((m: any) => m.id === selectedAsset.id && m.version === h.version)).map(course => (
                                <div key={course.id} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
                                  <div className="w-4 h-4 rounded-full overflow-hidden opacity-50">
                                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <span className="text-[10px] font-bold text-gray-500">{course.title}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-[10px] text-gray-400 italic">No courses currently using this version.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Usage Modal */}
      <AnimatePresence>
        {isUsageModalOpen && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-guesty-ice/30">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-guesty-nature">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Asset Usage</h2>
                    <p className="text-sm text-gray-500">Where this material is currently used</p>
                  </div>
                </div>
                <button onClick={() => setIsUsageModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  {courses.filter(c => c.modules?.some((m: any) => m.id === selectedAsset.id)).length > 0 ? (
                    courses.filter(c => c.modules?.some((m: any) => m.id === selectedAsset.id)).map(course => (
                      <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-guesty-nature/30 transition-all group">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100">
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{course.title}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{course.audience}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-guesty-nature transition-colors" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-500 italic">This asset is not currently linked to any courses.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsUsageModalOpen(false)}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AssetPreviewModal
        file={selectedAsset}
        isOpen={isPreviewModalOpen}
        onClose={() => { setIsPreviewModalOpen(false); setSelectedAsset(null); }}
      />

      {/* Assessment Builder Modal */}
      <AnimatePresence>
        {isAssessmentBuilderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="w-full max-w-7xl h-full flex flex-col"
            >
              <AssessmentBuilder 
                initialData={selectedAsset?.assessmentData}
                onSave={handleSaveAssessment}
                onCancel={() => setIsAssessmentBuilderOpen(false)}
                onAttemptComplete={onSaveAssessmentAttempt}
                userRole={userRole}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assessment Analytics Modal */}
      <AnimatePresence>
        {isAnalyticsModalOpen && selectedAsset?.assessmentData && (
          <AssessmentAnalytics 
            assessment={selectedAsset.assessmentData}
            attempts={attempts}
            courses={courses}
            groups={groups}
            onClose={() => { setIsAnalyticsModalOpen(false); setSelectedAsset(null); }}
          />
        )}
      </AnimatePresence>

      <UploadModal
        isOpen={isUploadModalOpen || isVersionModalOpen}
        onClose={() => { setIsUploadModalOpen(false); setIsVersionModalOpen(false); setSelectedAsset(null); }}
        onUpload={isVersionModalOpen ? handleVersionUpload : handleUpload}
        folders={folders}
        initialFolderId={selectedAsset?.folderId || selectedFolderId}
        mode={isVersionModalOpen ? "version" : "upload"}
        fixedType={isVersionModalOpen ? selectedAsset?.type : undefined}
        assetName={isVersionModalOpen ? (selectedAsset?.title || selectedAsset?.name) : ""}
        associatedCourses={isVersionModalOpen ? courses.filter(c => c.modules?.some((m: any) => m.id === selectedAsset?.id)) : []}
      />

      <MoveFileModal
        file={movingFile}
        onClose={() => setMovingFile(null)}
        onMove={handleMove}
        folders={folders}
      />

      <MoveFolderModal
        folder={editingFolder}
        onClose={() => {
          setIsMoveFolderModalOpen(false);
          setEditingFolder(null);
        }}
        onMove={handleMoveFolder}
        folders={folders}
      />

      {/* Rename Folder Modal */}
      <AnimatePresence>
        {isRenameFolderModalOpen && editingFolder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-guesty-beige"
            >
              <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-ice/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Edit3 className="w-5 h-5 text-guesty-nature" />
                  </div>
                  <h2 className="text-xl font-bold text-guesty-black tracking-tight">Rename Folder</h2>
                </div>
                <button onClick={() => setIsRenameFolderModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-guesty-forest/40">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-guesty-forest/40 uppercase tracking-widest ml-1">New Folder Name</label>
                  <input
                    type="text"
                    value={folderRenameValue}
                    onChange={(e) => setFolderRenameValue(e.target.value)}
                    autoFocus
                    className="w-full px-5 py-4 bg-guesty-ice/30 border border-guesty-beige rounded-2xl text-sm focus:bg-white focus:border-guesty-nature focus:ring-4 focus:ring-guesty-nature/10 outline-none transition-all font-medium"
                    placeholder="Enter folder name..."
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setIsRenameFolderModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-sm text-guesty-forest/60 hover:bg-guesty-ice transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRenameFolder}
                    disabled={!folderRenameValue.trim() || folderRenameValue === editingFolder.name}
                    className="flex-1 py-4 bg-guesty-nature text-white rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-guesty-forest shadow-lg shadow-guesty-nature/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Rename
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Folder Modal */}
      <AnimatePresence>
        {isDeleteFolderModalOpen && editingFolder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-red-100"
            >
              <div className="p-6 border-b border-red-50 flex items-center justify-between bg-red-50/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold text-guesty-black tracking-tight">Delete Folder</h2>
                </div>
                <button onClick={() => setIsDeleteFolderModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-guesty-forest/40">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-guesty-black">Are you sure?</p>
                  <p className="text-sm text-guesty-forest/60 leading-relaxed">
                    You are about to delete <span className="font-bold text-guesty-black">"{editingFolder.name}"</span>. 
                    All assets inside will be moved to the <span className="font-bold text-guesty-nature">{editingFolder.rootType === 'internal' ? 'Internal training' : 'Customer training'}</span> root folder.
                  </p>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setIsDeleteFolderModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-sm text-guesty-forest/60 hover:bg-guesty-ice transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteFolder}
                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <RestoreAssetModal
        isOpen={isRestoreModalOpen}
        file={selectedAsset}
        onClose={() => { setIsRestoreModalOpen(false); setSelectedAsset(null); }}
        onRestore={handleRestore}
        folders={folders}
      />

      <AssignToCourseModal
        isOpen={isAssignModalOpen}
        onClose={() => { setIsAssignModalOpen(false); setSelectedAsset(null); }}
        asset={selectedAsset}
        courses={courses}
        onAssign={handleAssignToCourse}
      />

      <BulkAssignModal
        isOpen={isBulkAssignModalOpen}
        onClose={() => setIsBulkAssignModalOpen(false)}
        selectedAssets={repository.filter(f => selectedIds.includes(f.id))}
        courses={courses}
        onAssign={handleBulkAssign}
      />

      <BulkMoveModal
        isOpen={isBulkMoveModalOpen}
        onClose={() => setIsBulkMoveModalOpen(false)}
        selectedAssets={repository.filter(f => selectedIds.includes(f.id))}
        folders={folders}
        onMove={handleBulkMove}
      />

      {/* Bulk Delete Modal */}
      <AnimatePresence>
        {isBulkDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-guesty-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-red-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-xl text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Bulk Delete Assets</h2>
                </div>
                <button onClick={() => setIsBulkDeleteModalOpen(false)} className="p-2 hover:bg-red-100/50 rounded-full transition-colors text-red-400 hover:text-red-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-start gap-4 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Permanent Deletion</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      You are about to permanently delete <span className="font-bold text-red-600">{selectedIds.length} assets</span>. 
                      This action cannot be undone and will remove these assets from all associated courses.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsBulkDeleteModalOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-600/10 transition-all"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Archive Modal */}
      <AnimatePresence>
        {isBulkArchiveModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-guesty-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-guesty-lemon/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-guesty-ice rounded-xl text-guesty-nature">
                    <Archive className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Bulk Archive Assets</h2>
                </div>
                <button onClick={() => setIsBulkArchiveModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-start gap-4 p-4 bg-guesty-ice/20 rounded-2xl border border-guesty-nature/10">
                  <Info className="w-6 h-6 text-guesty-nature flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Move to Archive</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Archiving <span className="font-bold">{selectedIds.length} assets</span> will move them to the Archived folder. 
                      They will no longer be visible in active training modules but historical data will be preserved.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsBulkArchiveModalOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkArchive}
                    className="flex-1 py-3 bg-guesty-nature text-white rounded-xl font-bold text-sm hover:bg-guesty-forest shadow-lg shadow-guesty-nature/10 transition-all"
                  >
                    Confirm Archive
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {isCreateFolderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-guesty-lemon to-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-guesty-ice rounded-xl text-guesty-nature">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">New Folder</h2>
                </div>
                <button onClick={() => setIsCreateFolderModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Folder Name</label>
                  <input
                    type="text"
                    autoFocus
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    placeholder="Enter folder name..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-guesty-nature focus:border-transparent transition-all outline-none text-gray-900 font-medium"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsCreateFolderModalOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="flex-1 py-3 bg-guesty-nature text-white rounded-xl font-bold text-sm hover:bg-guesty-forest shadow-lg shadow-guesty-nature/10 transition-all disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}} />
    </div>
  );
};
