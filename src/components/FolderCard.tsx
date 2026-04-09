import React, { useState } from "react";
import { Folder as FolderIcon, MoreVertical, Edit2, Trash2, Move } from "lucide-react";
import { Folder } from "../lib/api";
import { cn } from "../lib/utils";

interface FolderCardProps {
  folder: Folder;
  onNavigate: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, onNavigate, onRename, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
      onClick={() => onNavigate(folder.id)}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
          <FolderIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{folder.name}</h3>
          <p className="text-xs text-gray-500">Folder</p>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {showMenu && (
        <div 
          className="absolute right-2 top-12 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => { onRename(folder.id, folder.name); setShowMenu(false); }}
            className="w-full flex items-center px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
          >
            <Edit2 className="w-3 h-3 mr-2" /> Rename
          </button>
          <button 
            onClick={() => { onDelete(folder.id); setShowMenu(false); }}
            className="w-full flex items-center px-3 py-2 text-xs text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3 mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
