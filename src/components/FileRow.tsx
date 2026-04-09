import React, { useState } from "react";
import { File as FileIcon, MoreVertical, Download, Edit2, Trash2, FileText, Image, Video, FileArchive } from "lucide-react";
import { File } from "../lib/api";
import { formatBytes } from "../lib/utils";
import { format } from "date-fns";

interface FileRowProps {
  file: File;
  onDownload: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return <Image className="w-5 h-5 text-blue-500" />;
  if (mimeType.startsWith("video/")) return <Video className="w-5 h-5 text-purple-500" />;
  if (mimeType.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
  if (mimeType.includes("zip") || mimeType.includes("tar")) return <FileArchive className="w-5 h-5 text-yellow-600" />;
  return <FileIcon className="w-5 h-5 text-gray-400" />;
};

export const FileRow: React.FC<FileRowProps> = ({ file, onDownload, onRename, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors">
      <div className="w-10 flex-shrink-0">
        {getFileIcon(file.mimeType)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <span>{formatBytes(file.fileSize)}</span>
          <span>•</span>
          <span>{format(new Date(file.createdAt), "MMM d, yyyy")}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDownload(file.id)}
          className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-10 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
              <button 
                onClick={() => { onRename(file.id, file.name); setShowMenu(false); }}
                className="w-full flex items-center px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
              >
                <Edit2 className="w-3 h-3 mr-2" /> Rename
              </button>
              <button 
                onClick={() => { onDelete(file.id); setShowMenu(false); }}
                className="w-full flex items-center px-3 py-2 text-xs text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3 mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
