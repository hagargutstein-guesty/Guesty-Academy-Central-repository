import React, { useState, useRef, useEffect } from "react";
import { FileText, Video, File, MoreVertical, Move, Trash2, Calendar, HardDrive, BarChart3, History, Edit3, Archive, Link2 } from "lucide-react";
import { FileItem } from "../types";

interface FileCardProps {
  file: FileItem;
  isAdmin: boolean;
  onMove: (file: FileItem) => void;
  onDelete: (id: string) => void;
  onArchive: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onViewAnalytics: (file: FileItem) => void;
  onUploadVersion: (file: FileItem) => void;
  onViewUsage: (file: FileItem) => void;
  onRestore?: (file: FileItem) => void;
}

const FileCard: React.FC<FileCardProps> = ({ 
  file, 
  isAdmin, 
  onMove, 
  onDelete,
  onArchive,
  onRename,
  onViewAnalytics,
  onUploadVersion,
  onViewUsage,
  onRestore
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = () => {
    switch (file.type) {
      case "PDF":
        return <FileText className="w-6 h-6 text-guesty-merlot" />;
      case "Video":
        return <Video className="w-6 h-6 text-guesty-nature" />;
      case "SCORM":
        return <File className="w-6 h-6 text-guesty-forest" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-guesty-beige/50 hover:shadow-md transition-all duration-300 group relative">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-guesty-ice/30 rounded-[16px] group-hover:bg-white transition-all">
          {getIcon()}
        </div>
        {isAdmin && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-guesty-ice text-guesty-forest/30 hover:text-guesty-forest rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-[16px] shadow-xl border border-guesty-beige/50 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => { onRename(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 hover:text-guesty-nature transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => { onMove(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 hover:text-guesty-nature transition-colors"
                >
                  <Move className="w-4 h-4" />
                  <span>Move to Folder</span>
                </button>
                <button
                  onClick={() => { onUploadVersion(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 hover:text-guesty-nature transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>Upload New Version</span>
                </button>
                <button
                  onClick={() => { onViewAnalytics(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 hover:text-guesty-nature transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => { onViewUsage(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 hover:text-guesty-nature transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                  <span>View Usage</span>
                </button>
                <div className="my-1 border-t border-guesty-beige/30" />
                <button
                  onClick={() => { onArchive(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 hover:text-guesty-nature transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archive</span>
                </button>
                {file.status === 'Archived' && onRestore && (
                  <button
                    onClick={() => { onRestore(file); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-guesty-nature hover:bg-guesty-lemon/20 transition-colors"
                  >
                    <History className="w-4 h-4" />
                    <span>Restore</span>
                  </button>
                )}
                <button
                  onClick={() => { onDelete(file.id); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-guesty-black truncate text-sm" title={file.name || file.title}>
          {file.name || file.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-widest">{file.type}</p>
          {file.version && (
            <div className="relative group/version">
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-guesty-ice text-guesty-forest/60 rounded cursor-help">
                {file.version}
              </span>
              {file.history && file.history.length > 0 && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-guesty-black text-white p-3 rounded-[12px] text-[10px] opacity-0 group-hover/version:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                  <p className="font-bold mb-2 border-b border-white/10 pb-1 uppercase tracking-widest">Version History</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-guesty-lemon">{file.version}</span>
                      <span className="text-white/50">Current</span>
                    </div>
                    {file.history.map((h, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span>{h.version}</span>
                        <span className="text-white/50">{h.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-guesty-beige/30 flex items-center justify-between text-[10px] font-medium text-guesty-forest/50">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{file.createdAt}</span>
        </div>
        <div className="flex items-center space-x-1">
          <HardDrive className="w-3 h-3" />
          <span>{file.size}</span>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
