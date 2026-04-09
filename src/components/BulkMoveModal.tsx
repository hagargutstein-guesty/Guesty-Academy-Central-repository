import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Folder, Check, ChevronRight, Search } from 'lucide-react';
import { FileItem, Folder as FolderType } from '../types';

interface BulkMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: FileItem[];
  folders: FolderType[];
  onMove: (targetFolderId: string) => void;
}

const BulkMoveModal: React.FC<BulkMoveModalProps> = ({
  isOpen,
  onClose,
  selectedAssets,
  folders,
  onMove
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const internalFolders = folders.filter(f => f.rootType === 'internal');

  const filteredFolders = internalFolders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMove = () => {
    if (!selectedFolderId) return;
    onMove(selectedFolderId);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setSelectedFolderId(null);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-guesty-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-guesty-beige"
      >
        {/* Header */}
        <div className="p-8 border-b border-guesty-beige flex items-center justify-between bg-guesty-ice/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-guesty-ocean rounded-[16px] flex items-center justify-center text-white shadow-sm">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-guesty-black tracking-tight">Bulk Move to Folder</h2>
              <p className="text-xs text-guesty-forest/50 font-medium">Moving {selectedAssets.length} assets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-guesty-ice rounded-full transition-colors text-guesty-forest/40 hover:text-guesty-forest">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-guesty-nature rounded-full flex items-center justify-center text-white shadow-lg shadow-guesty-nature/20">
                <Check className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-guesty-black">Successfully Moved!</h3>
                <p className="text-sm text-guesty-forest/60 mt-1">Assets have been relocated to the selected folder.</p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-guesty-forest/30 group-focus-within:text-guesty-nature transition-colors" />
                  <input 
                    type="text"
                    placeholder="Search folders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-guesty-ice/30 border border-guesty-beige rounded-xl text-sm outline-none focus:bg-white focus:border-guesty-nature transition-all"
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                  {filteredFolders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolderId(folder.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-[20px] border transition-all text-left ${
                        selectedFolderId === folder.id 
                          ? "bg-guesty-lemon/20 border-guesty-nature ring-1 ring-guesty-nature" 
                          : "bg-guesty-ice/10 border-guesty-beige hover:border-guesty-nature/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Folder className={`w-5 h-5 ${selectedFolderId === folder.id ? "text-guesty-nature" : "text-guesty-forest/30"}`} />
                        <span className="text-sm font-bold text-guesty-black">{folder.name}</span>
                      </div>
                      {selectedFolderId === folder.id ? (
                        <Check className="w-4 h-4 text-guesty-nature" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-guesty-forest/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-[16px] font-bold text-sm text-guesty-forest hover:bg-guesty-ice/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMove}
                  disabled={!selectedFolderId}
                  className="flex-[2] py-4 bg-guesty-nature text-white rounded-[16px] font-bold text-sm hover:bg-guesty-forest shadow-lg shadow-guesty-nature/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Move {selectedAssets.length} Assets
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BulkMoveModal;
