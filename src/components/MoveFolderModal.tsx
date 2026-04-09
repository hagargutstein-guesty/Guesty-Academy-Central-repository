import React, { useState } from "react";
import { X, Move, Folder as FolderIcon, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Folder } from "../types";

interface MoveFolderModalProps {
  folder: Folder | null;
  onClose: () => void;
  onMove: (folderId: string, targetFolderId: string | null) => void;
  folders: Folder[];
}

const MoveFolderModal: React.FC<MoveFolderModalProps> = ({ folder, onClose, onMove, folders }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const handleMove = () => {
    if (folder) {
      setIsMoving(true);
      setTimeout(() => {
        onMove(folder.id, selectedFolderId);
        setIsMoving(false);
        onClose();
      }, 800);
    }
  };

  if (!folder) return null;

  const currentParentName = folders.find(f => f.id === folder.parentId)?.name || "Root";

  // Prevent moving into itself or its descendants
  const getDescendants = (id: string): string[] => {
    const children = folders.filter(f => f.parentId === id);
    return [...children.map(c => c.id), ...children.flatMap(c => getDescendants(c.id))];
  };
  const descendants = getDescendants(folder.id);
  const forbiddenIds = [folder.id, ...descendants];

  // Only show folders that are not forbidden and are not the current parent
  const availableFolders = folders.filter(f => !forbiddenIds.includes(f.id) && f.id !== folder.parentId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
        >
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-guesty-lemon to-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-guesty-ice rounded-xl text-guesty-nature">
                <Move className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Move Folder</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Moving Folder</p>
              <p className="font-bold text-gray-900 text-lg truncate">{folder.name}</p>
              <div className="flex items-center space-x-2 mt-4 text-xs font-medium">
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-500">{currentParentName}</span>
                <ArrowRight className="w-4 h-4 text-gray-300" />
                <span className="text-guesty-nature font-bold">New Parent</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Select Target Parent Folder</p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {/* Root option */}
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    folder.parentId === null
                      ? "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
                      : selectedFolderId === null
                      ? "bg-guesty-nature text-white border-transparent shadow-lg shadow-guesty-nature/10"
                      : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FolderIcon className={`w-4 h-4 ${selectedFolderId === null ? "text-white" : "text-gray-400"}`} />
                    <span className="font-bold text-sm">Root Directory</span>
                  </div>
                  {selectedFolderId === null && <CheckCircle2 className="w-4 h-4" />}
                </button>

                {availableFolders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      selectedFolderId === f.id
                        ? "bg-guesty-nature text-white border-transparent shadow-lg shadow-guesty-nature/10"
                        : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FolderIcon className={`w-4 h-4 ${selectedFolderId === f.id ? "text-white" : "text-gray-400"}`} />
                      <span className="font-bold text-sm">{f.name}</span>
                    </div>
                    {selectedFolderId === f.id && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isMoving}
                onClick={handleMove}
                className="flex-1 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 bg-guesty-nature text-white hover:bg-guesty-forest shadow-lg shadow-guesty-nature/20 active:scale-[0.98]"
              >
                {isMoving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm Move</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MoveFolderModal;
