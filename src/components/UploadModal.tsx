import React, { useState, useRef, useMemo } from "react";
import { X, Upload, FileText, Video, File, CheckCircle2, AlertCircle, FileArchive, Link, Globe, FileType, Tag, Search, Presentation, History, ChevronDown, ChevronUp, Layers, Package, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FileItem, Folder } from "../types";
import JSZip from "jszip";
import ScormDiffusionWizard, { DiffusionConfig } from "./ScormDiffusionWizard";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: FileItem, pushToCourseIds?: string[]) => void;
  folders: Folder[];
  initialFolderId?: string;
  mode?: "upload" | "version";
  fixedType?: string;
  initialType?: string;
  assetName?: string;
  associatedCourses?: any[];
  hasLearnerProgress?: boolean;
}

const ALLOWED_TYPES = ["PDF", "Video", "SCORM", "xAPI", "HTML", "Link", "PPTX"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const UploadModal: React.FC<UploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  folders, 
  initialFolderId,
  mode = "upload",
  fixedType,
  initialType,
  assetName = "",
  associatedCourses = [],
  hasLearnerProgress = false
}) => {
  const [fileName, setFileName] = useState(assetName);
  const [fileType, setFileType] = useState(fixedType || initialType || "PDF");
  const [scormScoreCalculation, setScormScoreCalculation] = useState<"last" | "sum" | "average">("last");
  const [videoNavigation, setVideoNavigation] = useState<"none" | "free" | "backward_only" | "after_completion">("free");
  const [selectedFolderId, setSelectedFolderId] = useState<string>(initialFolderId || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [manualTags, setManualTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [updateScope, setUpdateScope] = useState<"all" | "specific">("all");
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [scormManifest, setScormManifest] = useState<any>(null);
  const [showScormWizard, setShowScormWizard] = useState(false);
  const [tempFileRef, setTempFileRef] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset name when assetName changes or mode changes
  React.useEffect(() => {
    if (mode === "version") {
      setFileName(assetName);
      setUpdateScope("all");
      setSelectedCourseIds(associatedCourses.map(c => c.id));
    } else {
      setFileName("");
      setSelectedCourseIds([]);
    }
  }, [assetName, mode, associatedCourses]);

  const filteredCourses = useMemo(() => {
    if (!courseSearchQuery) return associatedCourses;
    return associatedCourses.filter(course => 
      course.title.toLowerCase().includes(courseSearchQuery.toLowerCase())
    );
  }, [associatedCourses, courseSearchQuery]);

  const validateFile = (file: File) => {
    setError(null);
    
    // Check file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    let detectedType = "PDF";
    if (["mp4", "mov", "avi"].includes(extension || "")) detectedType = "Video";
    else if (["zip"].includes(extension || "")) detectedType = "SCORM";
    else if (["pdf"].includes(extension || "")) detectedType = "PDF";
    else if (["pptx", "ppt"].includes(extension || "")) detectedType = "PPTX";
    else if (["html", "htm"].includes(extension || "")) detectedType = "HTML";
    else if (["tincan", "xml"].includes(extension || "")) detectedType = "xAPI";
    else {
      setError("Invalid file type. Allowed: PDF, PPTX, Video, SCORM, xAPI, HTML.");
      return false;
    }

    if (mode === "version" && fixedType && detectedType !== fixedType) {
      setError(`Invalid file type. New version must be a ${fixedType} file.`);
      return false;
    }

    if (!ALLOWED_TYPES.includes(detectedType)) {
      setError(`File type ${detectedType} is not allowed.`);
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the 50MB limit.");
      return false;
    }

    if (mode === "upload") {
      setFileName(file.name.split('.')[0]);
    }
    setFileType(detectedType);
    setTempFileRef(file);

    if (detectedType === "SCORM") {
      handleScormValidation(file);
    }

    return true;
  };

  const handleScormValidation = async (file: File) => {
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const manifestFile = contents.file("imsmanifest.xml");
      
      if (!manifestFile) {
        setError("Invalid SCORM package: imsmanifest.xml not found at root.");
        return;
      }

      const manifestXml = await manifestFile.async("string");
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(manifestXml, "text/xml");
      
      const identifier = xmlDoc.getElementsByTagName("manifest")[0]?.getAttribute("identifier") || "unknown";
      const title = xmlDoc.getElementsByTagName("title")[0]?.textContent || file.name;
      const masteryScore = xmlDoc.getElementsByTagName("adlcp:masteryscore")[0]?.textContent || "80";
      
      setScormManifest({
        identifier,
        title,
        masteryScore,
        version: "v2.0 (New Build)",
        entryPoint: "index.html"
      });

    } catch (err) {
      console.error("SCORM Parsing error:", err);
      setError("Failed to parse SCORM manifest. Ensure the zip is valid.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateFile(file);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      setManualTags(prev => {
        if (prev.includes(trimmedTag)) return prev;
        return [...prev, trimmedTag];
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setManualTags(manualTags.filter(t => t !== tagToRemove));
  };

  const generateTags = (title: string, type: string) => {
    const autoTags = [type.toLowerCase()];
    const keywords = title.toLowerCase().split(/\s+/);
    const commonKeywords = ["training", "guide", "tutorial", "intro", "advanced", "internal", "customer"];
    keywords.forEach(word => {
      if (commonKeywords.includes(word)) autoTags.push(word);
    });
    return [...new Set([...autoTags, ...manualTags])];
  };

  const handleUpload = () => {
    if (!fileName || !selectedFolderId) return;
    if (fileType === "Link" && !url) {
      setError("Please provide a valid URL for the link.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // If SCORM, we trigger the wizard after a short "upload simulation"
    if (fileType === "SCORM" && mode === "version") {
       // Simulate upload progress first
       const interval = setInterval(() => {
         setUploadProgress(prev => {
           if (prev >= 100) {
             clearInterval(interval);
             return 100;
           }
           return prev + 10;
         });
       }, 100);

       setTimeout(() => {
          setIsUploading(false);
          setShowScormWizard(true);
       }, 1500);
       return;
    }

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: fileName,
        name: fileName,
        type: fileType,
        folderId: selectedFolderId,
        description: description,
        createdAt: new Date().toLocaleDateString(),
        size: fileType === "Link" ? "--" : `${(Math.random() * 10 + 1).toFixed(1)} MB`,
        status: 'Active',
        version: 'v1.0',
        url: fileType === "Link" ? url : `https://example.com/assets/${Math.random().toString(36).substr(2, 9)}`,
        tags: generateTags(fileName, fileType),
        config: (fileType === "SCORM" || fileType === "Video") ? {
          scormScoreCalculation: fileType === "SCORM" ? scormScoreCalculation : undefined,
          videoNavigation: fileType === "Video" ? videoNavigation : undefined,
        } : undefined,
        history: [] 
      };
      
      const finalPushIds = updateScope === "all" 
        ? associatedCourses.map(c => c.id) 
        : selectedCourseIds;

      onUpload(newFile, finalPushIds);
      setIsUploading(false);
      setUploadProgress(0);
      resetForm();
      onClose();
    }, 1800);
  };

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourseIds(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId]
    );
  };

  const handleDiffusionComplete = (config: DiffusionConfig) => {
    setShowScormWizard(false);
    
    const newFile: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: fileName,
      name: fileName,
      type: fileType,
      folderId: selectedFolderId,
      description: description,
      createdAt: new Date().toLocaleDateString(),
      size: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
      status: 'Active',
      version: 'v2.0',
      url: `https://example.com/tenant_1/repository/${Math.random().toString(36).substr(2, 9)}/v2/index.html`,
      tags: generateTags(fileName, fileType),
      config: {
        scormScoreCalculation: scormScoreCalculation,
      },
      history: [] 
    };

    onUpload(newFile, config.pushToCourseIds);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFileName("");
    setFileType(fixedType || initialType || "PDF");
    setSelectedFolderId(initialFolderId || "");
    setUrl("");
    setDescription("");
    setManualTags([]);
    setTagInput("");
    setError(null);
    setUploadProgress(0);
    setUpdateScope("all");
    setCourseSearchQuery("");
    setScormScoreCalculation("last");
    setVideoNavigation("free");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
        >
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-guesty-lemon to-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-guesty-ice rounded-xl text-guesty-nature">
                <Upload className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {mode === "version" ? "Upload New Version" : "Upload Material"}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 p-4 bg-guesty-ice/20 rounded-2xl border border-guesty-nature/10">
                <div className="flex items-center justify-between text-[10px] font-bold text-guesty-nature uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-guesty-nature rounded-full animate-pulse" />
                    Uploading Material...
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-guesty-ice rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-guesty-nature"
                  />
                </div>
              </div>
            )}

            {/* Drag and Drop Area */}
            {fileType !== "Link" && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isDragging ? "border-guesty-nature bg-guesty-lemon/30 scale-[1.02]" : "border-gray-200 bg-gray-50 hover:bg-gray-100/50"
                } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.mp4,.mov,.avi,.zip,.html,.htm"
                />
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  fileName ? "bg-guesty-nature text-white" : "bg-white text-gray-400 shadow-sm"
                }`}>
                  {fileType === "Video" ? <Video className="w-8 h-8" /> : 
                   fileType === "SCORM" || fileType === "xAPI" ? <FileArchive className="w-8 h-8" /> : 
                   fileType === "HTML" ? <Globe className="w-8 h-8" /> :
                   fileType === "PPTX" ? <Presentation className="w-8 h-8" /> :
                   <FileText className="w-8 h-8" />}
                </div>
                <p className="text-sm font-bold text-gray-900">{fileName ? fileName : "Click or drag file to upload"}</p>
                <p className="text-xs text-gray-400 mt-1">PDF, PPTX, MP4, SCORM, xAPI, or HTML (Max 50MB)</p>
                
                {fileName && (
                  <div className="absolute top-4 right-4 bg-guesty-nature text-white p-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            )}

            {fileType === "Link" && (
              <div className="space-y-2 animate-in fade-in zoom-in-95">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">External URL</label>
                <div className="relative group">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-guesty-nature transition-colors" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/resource"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-guesty-nature focus:border-transparent transition-all outline-none text-gray-900 font-medium"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  {mode === "version" ? "New Asset Name" : "Asset Title"}
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter asset title..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-guesty-nature focus:border-transparent transition-all outline-none text-gray-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Description <span className="text-[10px] lowercase font-medium">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter asset description..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-guesty-nature focus:border-transparent transition-all outline-none text-gray-900 font-medium resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tags</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-guesty-nature transition-colors" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tag and press Enter..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-guesty-nature focus:border-transparent transition-all outline-none text-gray-900 font-medium"
                    />
                  </div>
                  {manualTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {manualTags.map((tag, idx) => (
                        <span key={`${tag}-${idx}`} className="flex items-center gap-1.5 px-3 py-1 bg-guesty-lemon/30 text-guesty-nature text-[10px] font-bold uppercase tracking-wider rounded-full border border-guesty-nature/10">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-guesty-forest">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {mode === "version" && (
                <div className="p-4 bg-guesty-lemon/20 rounded-2xl border border-guesty-nature/10 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 text-guesty-nature">
                    <History className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Version Control</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    You are uploading a new version of <span className="font-bold text-gray-900">"{assetName}"</span>. 
                    This will maintain the asset's history and central settings.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">File Type</label>
                  <select
                    value={fileType}
                    disabled={mode === "version"}
                    onChange={(e) => setFileType(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-guesty-nature transition-all outline-none font-medium appearance-none ${
                      mode === "version" ? "text-gray-400 cursor-not-allowed" : "text-gray-900"
                    }`}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="PPTX">PowerPoint (PPTX)</option>
                    <option value="Video">Video File</option>
                    <option value="SCORM">SCORM Package</option>
                    <option value="xAPI">xAPI (Tin Can)</option>
                    <option value="HTML">HTML Content</option>
                    <option value="Link">Link / URL</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Destination</label>
                  <select
                    value={selectedFolderId}
                    disabled={mode === "version"}
                    onChange={(e) => setSelectedFolderId(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-guesty-nature transition-all outline-none font-medium appearance-none ${
                      mode === "version" ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed" :
                      selectedFolderId ? "bg-guesty-lemon border-guesty-nature/30 text-guesty-forest" : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}
                  >
                    <option value="" disabled>Select folder...</option>
                    {folders.filter(f => f.rootType !== 'archived').map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.parentId ? "  ↳ " : ""}{folder.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {mode === "version" && associatedCourses.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-bold text-gray-900">Push to Associated Courses?</label>
                          <p className="text-[10px] text-gray-500 font-medium">This asset is currently used in {associatedCourses.length} courses.</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                          <Layers className="w-4 h-4 text-guesty-nature" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setUpdateScope("all");
                            setSelectedCourseIds(associatedCourses.map(c => c.id));
                          }}
                          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                            updateScope === "all" 
                              ? "bg-guesty-nature text-white border-guesty-nature shadow-lg shadow-guesty-nature/20" 
                              : "bg-white text-gray-500 border-gray-200 hover:border-guesty-nature/30 hover:text-guesty-nature"
                          }`}
                        >
                          <CheckCircle2 className={`w-4 h-4 ${updateScope === "all" ? "text-white" : "text-gray-300"}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-center">Update All Courses</span>
                        </button>
                        <button
                          onClick={() => setUpdateScope("specific")}
                          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                            updateScope === "specific" 
                              ? "bg-guesty-nature text-white border-guesty-nature shadow-lg shadow-guesty-nature/20" 
                              : "bg-white text-gray-500 border-gray-200 hover:border-guesty-nature/30 hover:text-guesty-nature"
                          }`}
                        >
                          <Search className={`w-4 h-4 ${updateScope === "specific" ? "text-white" : "text-gray-300"}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-center">Specific Courses</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {updateScope === "specific" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-guesty-nature transition-colors" />
                        <input
                          type="text"
                          value={courseSearchQuery}
                          onChange={(e) => setCourseSearchQuery(e.target.value)}
                          placeholder="Search associated courses..."
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-guesty-nature focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Courses</span>
                        <span className="text-[10px] font-bold text-guesty-nature">{selectedCourseIds.length} Selected</span>
                      </div>

                      <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {filteredCourses.length > 0 ? (
                          filteredCourses.map((course, idx) => (
                            <div 
                              key={`${course.id}-${idx}`}
                              onClick={() => toggleCourseSelection(course.id)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                selectedCourseIds.includes(course.id) 
                                  ? "bg-guesty-lemon/30 border-guesty-nature/30" 
                                  : "bg-gray-50 border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-gray-100">
                                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 truncate max-w-[180px]">{course.title}</span>
                              </div>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                selectedCourseIds.includes(course.id)
                                  ? "bg-guesty-nature border-guesty-nature text-white"
                                  : "bg-white border-gray-200"
                              }`}>
                                {selectedCourseIds.includes(course.id) && <CheckCircle2 className="w-3 h-3" />}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-xs text-gray-400 font-medium">No courses found matching your search</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Configuration Sections */}
            {(fileType === "SCORM" || fileType === "Video") && (
              <div className="pt-4 border-t border-gray-100 space-y-6 animate-in fade-in slide-in-from-top-4">
                {fileType === "SCORM" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-guesty-forest">
                      <Target className="w-4 h-4 text-guesty-nature" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Score calculation</h3>
                    </div>
                    
                    <div className="space-y-3 pl-1">
                      {[
                        { id: "last", label: "The score is the score value of the last executed test" },
                        { id: "sum", label: "The score is calculated as the sum of all scores of the tests taken by the user" },
                        { id: "average", label: "The score is calculated as the average score of all the tests taken by the user" }
                      ].map((opt) => (
                        <label 
                          key={opt.id} 
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            scormScoreCalculation === opt.id 
                              ? "bg-guesty-lemon/30 border-guesty-nature/30" 
                              : "bg-gray-50 border-gray-100 hover:border-gray-200"
                          } ${hasLearnerProgress ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <input 
                            type="radio" 
                            name="scormScore"
                            disabled={hasLearnerProgress}
                            checked={scormScoreCalculation === opt.id}
                            onChange={() => setScormScoreCalculation(opt.id as any)}
                            className="mt-1 text-guesty-nature focus:ring-guesty-nature h-3.5 w-3.5"
                          />
                          <span className="text-xs font-medium text-gray-700 leading-snug">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    
                    {hasLearnerProgress && (
                      <p className="text-[10px] text-gray-500 font-medium italic pl-1 flex items-center gap-1.5 bg-orange-50/50 p-2 rounded-lg border border-orange-100">
                        <AlertCircle className="w-3 h-3 text-orange-400" />
                        You can edit this option only if nobody has completed the SCORM training material yet.
                      </p>
                    )}
                  </div>
                )}

                {fileType === "Video" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-guesty-forest">
                      <Video className="w-4 h-4 text-guesty-nature" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 leading-tight">
                        Allow users to move through the video by dragging the item in the playhead
                      </h3>
                    </div>
                    
                    <div className="space-y-3 pl-1">
                      {[
                        { id: "none", label: "Do not allow learners to move through the video" },
                        { id: "free", label: "Learners can move backwards and forward (accessible experience)" },
                        { id: "backward_only", label: "Learners can only move backwards" },
                        { id: "after_completion", label: "Learners can move backward and forward only after completing the course or lesson" }
                      ].map((opt) => (
                        <label 
                          key={opt.id} 
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            videoNavigation === opt.id 
                              ? "bg-guesty-lemon/30 border-guesty-nature/30" 
                              : "bg-gray-50 border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="videoNav"
                            checked={videoNavigation === opt.id}
                            onChange={() => setVideoNavigation(opt.id as any)}
                            className="mt-1 text-guesty-nature focus:ring-guesty-nature h-3.5 w-3.5"
                          />
                          <span className="text-xs font-medium text-gray-700 leading-snug">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4">
              <button
                disabled={(mode === "upload" && !fileName) || !selectedFolderId || isUploading || !!error}
                onClick={handleUpload}
                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                  (mode === "upload" && !fileName) || !selectedFolderId || !!error
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-guesty-nature text-white hover:bg-guesty-forest shadow-lg shadow-guesty-nature/20 active:scale-[0.98]"
                }`}
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {mode === "version" 
                        ? (selectedCourseIds.length > 0 
                            ? `Update & Push to ${selectedCourseIds.length} Courses` 
                            : "Update Version (No Push)") 
                        : "Upload to Repository"}
                    </span>
                  </>
                )}
              </button>
              {!selectedFolderId && (
                <p className="text-center text-[10px] text-red-400 mt-3 font-bold uppercase tracking-tighter">
                  * Destination folder selection is mandatory
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      {scormManifest && (
        <ScormDiffusionWizard
          isOpen={showScormWizard}
          onClose={() => setShowScormWizard(false)}
          onComplete={handleDiffusionComplete}
          oldManifest={null} // We could pass actual old manifest if we had the object
          newManifest={scormManifest}
          associatedCourses={associatedCourses}
        />
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
