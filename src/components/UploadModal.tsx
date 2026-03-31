import React, { useState } from "react";
import { X } from "lucide-react";
import { Folder } from "../types";
import { FolderTree } from "./FolderTree";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onUpload: (name: string, folderId: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, folders, onUpload }) => {
  const [assetName, setAssetName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Logic: "If a user selects Internal, they must then select one of the 5 sub-folders to proceed."
  // We can enforce this by making "Internal" unselectable, or just disabling the upload button if "Internal" is selected.
  // Let's make "Internal" unselectable in the tree.
  const internalFolder = folders.find((f) => f.name === "Internal" && f.isSystemFolder);

  const isSelectable = (folder: Folder) => {
    // Cannot select the root "Internal" folder directly
    if (internalFolder && folder.id === internalFolder.id) {
      return false;
    }
    return true;
  };

  const handleUpload = () => {
    if (assetName && selectedFolderId) {
      onUpload(assetName, selectedFolderId);
      setAssetName("");
      setSelectedFolderId(null);
      onClose();
    }
  };

  const isUploadDisabled = !assetName || !selectedFolderId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Upload Asset</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
            <input
              type="text"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter asset name..."
            />
          </div>

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
            {internalFolder && selectedFolderId === internalFolder.id && (
              <p className="text-red-500 text-xs mt-1">Please select a sub-folder within Internal.</p>
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
            onClick={handleUpload}
            disabled={isUploadDisabled}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};
