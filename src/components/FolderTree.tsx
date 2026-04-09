import React, { useState } from "react";
import { ChevronRight, ChevronDown, Folder as FolderIcon, FolderOpen } from "lucide-react";
import { Folder } from "../types";
import { cn } from "../lib/utils";

interface FolderTreeProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folder: Folder) => void;
  className?: string;
  isSelectable?: (folder: Folder) => boolean;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  className,
  isSelectable = () => true,
}) => {
  // Build tree structure
  const rootFolders = folders.filter((f) => !f.parentId);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {rootFolders.map((folder) => (
        <FolderNode
          key={folder.id}
          folder={folder}
          allFolders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={onSelectFolder}
          isSelectable={isSelectable}
        />
      ))}
    </div>
  );
};

interface FolderNodeProps {
  folder: Folder;
  allFolders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folder: Folder) => void;
  level?: number;
  isSelectable: (folder: Folder) => boolean;
}

const FolderNode: React.FC<FolderNodeProps> = ({
  folder,
  allFolders,
  selectedFolderId,
  onSelectFolder,
  level = 0,
  isSelectable,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const children = allFolders.filter((f) => f.parentId === folder.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedFolderId === folder.id;
  const selectable = isSelectable(folder);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    if (selectable) {
      onSelectFolder(folder);
    } else if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex items-center py-1.5 px-2 rounded-md transition-colors",
          isSelected
            ? "bg-blue-100 text-blue-900 font-medium"
            : selectable
            ? "hover:bg-gray-100 text-gray-700 cursor-pointer"
            : "text-gray-600 cursor-pointer hover:bg-gray-50",
          level > 0 && "ml-4"
        )}
        onClick={handleSelect}
      >
        <div
          className="w-5 h-5 flex items-center justify-center mr-1 cursor-pointer text-gray-400 hover:text-gray-600"
          onClick={hasChildren ? handleToggle : undefined}
        >
          {hasChildren ? (
            isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <div className="w-4 h-4" /> // Spacer
          )}
        </div>
        {isOpen && hasChildren ? (
          <FolderOpen className={cn("w-4 h-4 mr-2", isSelected ? "text-blue-600" : "text-gray-400")} />
        ) : (
          <FolderIcon className={cn("w-4 h-4 mr-2", isSelected ? "text-blue-600" : "text-gray-400")} />
        )}
        <span className="text-sm truncate select-none">{folder.name}</span>
      </div>
      {isOpen && hasChildren && (
        <div className="flex flex-col mt-1">
          {children.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              allFolders={allFolders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              level={level + 1}
              isSelectable={isSelectable}
            />
          ))}
        </div>
      )}
    </div>
  );
};
