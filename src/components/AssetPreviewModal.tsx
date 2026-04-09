import React from "react";
import { X, Maximize2, Download, ExternalLink, FileText, Video, Package, AlertCircle, Globe, Link, FileCode, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FileItem } from "../types";

interface AssetPreviewModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ file, isOpen, onClose }) => {
  if (!file) return null;

  const renderPreview = () => {
    if (!file.url) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No preview available for this asset</p>
          <p className="text-xs text-gray-400 mt-1">This file might not have a valid URL associated with it.</p>
        </div>
      );
    }

    switch (file.type) {
      case "Video":
        return (
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video 
              src={file.url} 
              controls 
              className="w-full h-full"
              poster="https://picsum.photos/seed/video/1280/720"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "PDF":
        return (
          <div className="h-[600px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
            <iframe 
              src={`${file.url}#toolbar=0`} 
              className="w-full h-full" 
              title={file.title || file.name}
            />
          </div>
        );
      case "HTML":
      case "Link":
        return (
          <div className="h-[600px] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => window.open(file.url, '_blank')}
                className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-lg text-guesty-nature hover:text-guesty-forest border border-gray-100"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <iframe 
              src={file.url} 
              className="w-full h-full border-none" 
              title={file.title || file.name}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        );
      case "SCORM":
      case "xAPI":
        return (
          <div className="flex flex-col items-center justify-center h-[500px] bg-gradient-to-br from-guesty-ice to-white rounded-2xl border border-guesty-nature/10 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#00a699 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>
            <div className="relative z-10 text-center p-8">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl border border-guesty-nature/10">
                {file.type === "SCORM" ? <Package className="w-10 h-10 text-guesty-nature" /> : <FileCode className="w-10 h-10 text-guesty-ocean" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{file.type} Content Player</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">
                {file.type} packages require a dedicated player environment to track progress and reporting.
              </p>
              <button 
                className="px-8 py-3 bg-guesty-nature text-white rounded-2xl font-bold text-sm hover:bg-guesty-forest shadow-lg shadow-guesty-nature/20 transition-all flex items-center space-x-2 mx-auto"
                onClick={() => window.open(file.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch in New Window</span>
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-2xl border border-gray-100">
            <FileText className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-gray-500">Preview not supported for {file.type} files</p>
            <button className="mt-4 text-sm font-bold text-guesty-nature hover:underline">
              Download to view
            </button>
          </div>
        );
    }
  };

  const getIcon = () => {
    switch (file.type) {
      case "Video": return <Video className="w-5 h-5 text-guesty-ocean" />;
      case "SCORM": return <Package className="w-5 h-5 text-guesty-merlot" />;
      case "xAPI": return <FileCode className="w-5 h-5 text-guesty-ocean" />;
      case "PDF": return <FileText className="w-5 h-5 text-guesty-nature" />;
      case "HTML": return <Globe className="w-5 h-5 text-guesty-nature" />;
      case "Link": return <Link className="w-5 h-5 text-guesty-ocean" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl overflow-hidden border border-white/20 flex flex-col max-h-full"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  {getIcon()}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                    {file.title || file.name}
                  </h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      {file.type}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Version {file.version}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {file.size}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100" title="Download">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100" title="Full Screen">
                  <Maximize2 className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-100 mx-2" />
                <button 
                  onClick={onClose}
                  className="p-2.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all border border-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto custom-scrollbar bg-gray-50/30 flex-1">
              {renderPreview()}
              
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {file.description && (
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Description</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{file.description}</p>
                    </div>
                  )}

                  {file.tags && file.tags.length > 0 && (
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tags & Metadata</p>
                      <div className="flex flex-wrap gap-2">
                        {file.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-guesty-ice/50 text-guesty-forest text-[10px] font-bold uppercase tracking-wider rounded-full border border-guesty-beige/30">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Usage Statistics</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black text-gray-900">{file.views || 0}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Total Views</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-guesty-nature">{file.completionRate || '0%'}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Completion</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Course Associations</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                            <img src={`https://picsum.photos/seed/course${i}/32/32`} alt="" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-600">Used in {file.usedIn || 0} courses</span>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Last Updated</p>
                    <p className="text-sm font-bold text-gray-900">{file.createdAt || 'Recently'}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">By Admin User</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AssetPreviewModal;
