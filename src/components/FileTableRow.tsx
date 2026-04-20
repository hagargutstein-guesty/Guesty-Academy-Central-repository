import React from "react";
import { MoreVertical, FileText, Video, FileArchive, History, Link2, Edit3, Trash2, Archive, BarChart3, Eye, Layers, Globe, Link, FileCode, Tag, HelpCircle } from "lucide-react";
import { FileItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface FileTableRowProps {
  file: FileItem;
  isSelected: boolean;
  visibleColumns: string[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onViewAnalytics: (file: FileItem) => void;
  onUploadVersion: (file: FileItem) => void;
  onViewUsage: (file: FileItem) => void;
  onPreview: (file: FileItem) => void;
  onRestore?: (file: FileItem) => void;
  onAssignToCourse?: (file: FileItem) => void;
  onEditAssessment?: (file: FileItem) => void;
}

const FileTableRow: React.FC<FileTableRowProps> = ({
  file,
  isSelected,
  visibleColumns,
  onSelect,
  onDelete,
  onArchive,
  onRename,
  onViewAnalytics,
  onUploadVersion,
  onViewUsage,
  onPreview,
  onRestore,
  onAssignToCourse,
  onEditAssessment,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
      case "Video": return <Video className="w-4 h-4 text-guesty-ocean" />;
      case "SCORM": return <FileArchive className="w-4 h-4 text-guesty-merlot" />;
      case "xAPI": return <FileCode className="w-4 h-4 text-guesty-ocean" />;
      case "HTML": return <Globe className="w-4 h-4 text-guesty-nature" />;
      case "Link": return <Link className="w-4 h-4 text-guesty-ocean" />;
      case "Assessment": return <HelpCircle className="w-4 h-4 text-guesty-nature" />;
      default: return <FileText className="w-4 h-4 text-guesty-nature" />;
    }
  };

  return (
    <tr className={`group hover:bg-guesty-ice/20 transition-colors border-b border-guesty-beige/30 ${isSelected ? "bg-guesty-lemon/10" : ""}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(file.id)}
          className="w-4 h-4 rounded border-guesty-beige text-guesty-nature focus:ring-guesty-nature cursor-pointer"
        />
      </td>
      <td className="px-6 py-4">
        <div className="w-10 h-10 rounded-[12px] bg-guesty-ice/30 border border-guesty-beige/50 flex items-center justify-center group-hover:bg-white transition-colors">
          {getIcon()}
        </div>
      </td>
      {visibleColumns.includes('title') && (
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <button
              onClick={() => onPreview(file)}
              className="text-sm font-bold text-guesty-black hover:text-guesty-nature transition-colors text-left truncate max-w-[200px]"
            >
              {file.title || file.name}
            </button>
            {file.tags && file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {file.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-1.5 py-0.5 bg-guesty-ice/50 text-[8px] font-bold text-guesty-forest/40 uppercase tracking-wider rounded border border-guesty-beige/30">
                    <Tag className="w-2 h-2" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </td>
      )}
      {visibleColumns.includes('type') && (
        <td className="px-6 py-4">
          <span className="text-[10px] font-bold text-guesty-forest/40 uppercase tracking-widest">{file.type}</span>
        </td>
      )}
      {visibleColumns.includes('created') && (
        <td className="px-6 py-4">
          <span className="text-xs text-guesty-forest/60">{file.createdAt || "N/A"}</span>
        </td>
      )}
      {visibleColumns.includes('status') && (
        <td className="px-6 py-4">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            file.status === 'Active' 
              ? "bg-guesty-lemon/20 text-guesty-nature border-guesty-nature/10" 
              : "bg-guesty-beige/20 text-guesty-forest/40 border-guesty-beige/50"
          }`}>
            {file.status}
          </span>
        </td>
      )}
      {visibleColumns.includes('versions') && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-guesty-forest">{file.version}</span>
            {file.history && file.history.length > 0 && (
              <button 
                onClick={() => onViewAnalytics(file)}
                className="p-1 hover:bg-guesty-ice rounded-md transition-colors text-guesty-forest/30 hover:text-guesty-nature"
                title="View Version History"
              >
                <History className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </td>
      )}
      {visibleColumns.includes('courses') && (
        <td className="px-6 py-4">
          <button 
            onClick={() => onViewUsage(file)}
            className="flex items-center space-x-2 px-2 py-1 hover:bg-guesty-ice rounded-lg transition-colors group/usage"
          >
            <Link2 className="w-3.5 h-3.5 text-guesty-forest/30 group-hover/usage:text-guesty-ocean" />
            <span className="text-xs font-bold text-guesty-forest">{file.usedIn || 0}</span>
          </button>
        </td>
      )}
      <td className="px-6 py-4 text-right relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-guesty-ice rounded-full transition-colors text-guesty-forest/30 hover:text-guesty-forest"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-6 top-12 w-48 bg-white rounded-[16px] shadow-xl border border-guesty-beige/50 z-40 overflow-hidden"
            >
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => { onPreview(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 rounded-[12px] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                {file.type === "Assessment" && onEditAssessment && (
                  <button
                    onClick={() => { onEditAssessment(file); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-guesty-nature hover:bg-guesty-lemon/20 rounded-[12px] transition-colors font-bold"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Questions</span>
                  </button>
                )}
                <button
                  onClick={() => { onRename(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 rounded-[12px] transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => { onUploadVersion(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 rounded-[12px] transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>New Version</span>
                </button>
                <button
                  onClick={() => { onViewAnalytics(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 rounded-[12px] transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => { onArchive(file); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 rounded-[12px] transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archive</span>
                </button>
                {onAssignToCourse && file.status !== 'Archived' && (
                  <button
                    onClick={() => { onAssignToCourse(file); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-guesty-forest hover:bg-guesty-ice/50 rounded-[12px] transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Assign to Course</span>
                  </button>
                )}
                {file.status === 'Archived' && onRestore && (
                  <button
                    onClick={() => { onRestore(file); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-guesty-nature hover:bg-guesty-lemon/20 rounded-[12px] transition-colors"
                  >
                    <History className="w-4 h-4" />
                    <span>Restore</span>
                  </button>
                )}
                <div className="h-px bg-guesty-beige/30 my-1 mx-2" />
                <button
                  onClick={() => { onDelete(file.id); setShowMenu(false); }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-[12px] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
};

export default FileTableRow;
