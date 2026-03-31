import React, { useState } from "react";
import { X } from "lucide-react";
import { Folder, Asset } from "../types";
import { FolderTree } from "./FolderTree";

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  asset: Asset | null;
  onMove: (assetId: string, newFolderId: string) => void;
}

export const MoveModal: React.FC<MoveModalProps> = ({ isOpen, onClose, folders, asset, onMove }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  if (!isOpen || !asset) return null;

  const internalFolder = folders.find((f) => f.name === "Internal" && f.isSystemFolder);

  const isSelectable = (folder: Folder) => {
    if (internalFolder && folder.id === internalFolder.id) {
      return false;
    }
    return true;
  };

  const handleMove = () => {
    if (selectedFolderId) {
      onMove(asset.id, selectedFolderId);
      setSelectedFolderId(null);
      onClose();
    }
  };

  const isMoveDisabled = !selectedFolderId || selectedFolderId === asset.folderId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Move Asset: {asset.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
          <div className="flex-1 flex flex-col min-h-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Destination Folder</label>
            <div className="border border-gray-300 rounded-md p-2 flex-1 overflow-y-auto bg-gray-50">
              <FolderTree
                folders={folders}
                selectedFolderId={selectedFolderId}
                onSelectFolder={(f) => setSelectedFolderId(f.id)}
                isSelectable={isSelectable}
              />
            </div>
            {selectedFolderId === asset.folderId && (
              <p className="text-red-500 text-xs mt-1">Asset is already in this folder.</p>
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={isMoveDisabled}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
};
