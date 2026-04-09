import React, { useState } from "react";
import { Folder as FolderIcon, FolderOpen, Archive, Users, ShieldCheck, ChevronDown, ChevronRight, Plus, Database, MoreVertical, Edit3, FolderPlus, Trash2 } from "lucide-react";
import { Folder } from "../types";

interface SidebarProps {
  selectedFolderId: string;
  onSelectFolder: (folderId: string) => void;
  folders: Folder[];
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onRenameFolder: (folder: Folder) => void;
  onMoveFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedFolderId,
  onSelectFolder,
  folders,
  isAdmin,
  onToggleAdmin,
  onRenameFolder,
  onMoveFolder,
  onDeleteFolder,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["f1", "f2", "f3"]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const rootFolders = folders.filter(f => f.parentId === null);

  const renderFolder = (folder: Folder, depth: number = 0) => {
    const isExpanded = expandedFolders.includes(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const children = folders.filter(f => f.parentId === folder.id);
    const hasChildren = children.length > 0;
    const isSystemFolder = folder.isSystemFolder;

    const getIcon = () => {
      if (folder.id === "f1") return <ShieldCheck className="w-4 h-4" />;
      if (folder.id === "f2") return <Users className="w-4 h-4" />;
      if (folder.id === "f3") return <Archive className="w-4 h-4" />;
      return isExpanded ? <FolderOpen className="w-4 h-4" /> : <FolderIcon className="w-4 h-4" />;
    };

    return (
      <div key={folder.id} className="space-y-1">
        <div className="relative group">
          <button
            onClick={() => onSelectFolder(folder.id)}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-[12px] transition-all duration-200 ${
              isSelected
                ? "bg-guesty-lemon/20 text-guesty-nature"
                : "text-guesty-forest/60 hover:bg-guesty-ice/50 hover:text-guesty-black"
            }`}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <span 
                onClick={(e) => hasChildren && toggleExpand(folder.id, e)}
                className={`p-0.5 rounded hover:bg-black/5 transition-colors ${!hasChildren && 'opacity-0 cursor-default'}`}
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </span>
              <span className={`${isSelected ? "text-guesty-nature" : "text-guesty-forest/40 group-hover:text-guesty-nature"}`}>
                {getIcon()}
              </span>
              <span className="font-medium text-sm truncate">{folder.name}</span>
            </div>

            {isAdmin && !isSystemFolder && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === folder.id ? null : folder.id);
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-black/5 rounded-lg transition-all"
                >
                  <MoreVertical className="w-3.5 h-3.5 text-guesty-forest/40" />
                </button>

                {openMenuId === folder.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setOpenMenuId(null)} 
                    />
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-guesty-beige z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRenameFolder(folder);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-guesty-forest/60 hover:bg-guesty-ice hover:text-guesty-black transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Rename</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveFolder(folder);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-guesty-forest/60 hover:bg-guesty-ice hover:text-guesty-black transition-colors"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        <span>Move</span>
                      </button>
                      <div className="h-px bg-guesty-beige mx-2 my-1" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFolder(folder);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </button>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="space-y-1">
            {children.map(child => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-guesty-beige h-full flex flex-col z-20">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-guesty-nature rounded-[12px] flex items-center justify-center shadow-sm">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-guesty-black tracking-tight leading-tight">Repository</h1>
            <p className="text-[10px] text-guesty-forest/40 uppercase font-bold tracking-widest">Asset Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          <button
            onClick={() => onSelectFolder("all")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[12px] transition-all duration-200 group ${
              selectedFolderId === "all"
                ? "bg-guesty-lemon/20 text-guesty-nature"
                : "text-guesty-forest/60 hover:bg-guesty-ice/50 hover:text-guesty-black"
            }`}
          >
            <Database className={`w-4 h-4 ${selectedFolderId === "all" ? "text-guesty-nature" : "text-guesty-forest/40 group-hover:text-guesty-nature"}`} />
            <span className="font-bold text-sm">All Assets</span>
          </button>
        </div>

        <div className="space-y-3">
          <p className="px-4 text-[10px] font-bold text-guesty-forest/40 uppercase tracking-[0.2em]">Folders</p>
          <div className="space-y-1">
            {rootFolders.map(folder => renderFolder(folder))}
          </div>
        </div>
      </nav>

      <div className="p-6 border-t border-guesty-beige/50 bg-guesty-ice/10">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${isAdmin ? "bg-guesty-nature" : "bg-guesty-beige"}`} />
            <span className="text-[10px] font-bold text-guesty-forest/60 uppercase tracking-wider">{isAdmin ? "Admin View" : "User View"}</span>
          </div>
          <button
            onClick={onToggleAdmin}
            className="text-[10px] uppercase font-bold text-guesty-nature hover:text-guesty-forest tracking-widest transition-colors"
          >
            Switch
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
