import React, { useState } from "react";
import { X, Move, Folder as FolderIcon, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FileItem, Folder } from "../types";

interface MoveFileModalProps {
  file: FileItem | null;
  onClose: () => void;
  onMove: (fileId: string, targetFolderId: string) => void;
  folders: Folder[];
}

const MoveFileModal: React.FC<MoveFileModalProps> = ({ file, onClose, onMove, folders }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [isMoving, setIsMoving] = useState(false);

  const handleMove = () => {
    if (file && selectedFolderId) {
      setIsMoving(true);
      setTimeout(() => {
        onMove(file.id, selectedFolderId);
        setIsMoving(false);
        onClose();
      }, 800);
    }
  };

  if (!file) return null;

  const currentFolderName = folders.find(f => f.id === file.folderId)?.name || "Unknown";

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
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Move Asset</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Moving Asset</p>
              <p className="font-bold text-gray-900 text-lg truncate">{file.title || file.name}</p>
              <div className="flex items-center space-x-2 mt-4 text-xs font-medium">
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-500">{currentFolderName}</span>
                <ArrowRight className="w-4 h-4 text-gray-300" />
                <span className="text-guesty-nature font-bold">New Destination</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Select Target Folder</p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    disabled={folder.id === file.folderId}
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      folder.id === file.folderId
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
                        : selectedFolderId === folder.id
                        ? "bg-guesty-nature text-white border-transparent shadow-lg shadow-guesty-nature/10"
                        : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-guesty-nature/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FolderIcon className={`w-4 h-4 ${selectedFolderId === folder.id ? "text-white" : "text-gray-400"}`} />
                      <span className="font-bold text-sm">
                        {folder.parentId ? "  ↳ " : ""}{folder.name}
                      </span>
                    </div>
                    {selectedFolderId === folder.id && <CheckCircle2 className="w-4 h-4" />}
                    {folder.id === file.folderId && <span className="text-[10px] uppercase font-bold text-gray-400">Current</span>}
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
                disabled={!selectedFolderId || selectedFolderId === file.folderId || isMoving}
                onClick={handleMove}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !selectedFolderId || selectedFolderId === file.folderId
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-guesty-nature text-white hover:bg-guesty-forest shadow-lg shadow-guesty-nature/20 active:scale-[0.98]"
                }`}
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

export default MoveFileModal;
