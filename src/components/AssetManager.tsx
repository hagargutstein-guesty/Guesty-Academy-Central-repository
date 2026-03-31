import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, X, FileVideo, FileText, FileArchive, Link as LinkIcon, 
  Layers, HelpCircle, CheckCircle, AlertCircle, RefreshCw, Eye, Play
} from 'lucide-react';

// --- AssetUploader Component ---

export function AssetUploader({ isOpen, onClose, onUpload }: { isOpen: boolean, onClose: () => void, onUpload: (asset: any) => void }) {
  const [assetTitle, setAssetTitle] = useState('');
  const [assetType, setAssetType] = useState('SCORM');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState('');
  
  // Upload State
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAssetTitle('');
      setAssetType('SCORM');
      setUploadFile(null);
      setUploadUrl('');
      setUploadStatus('idle');
      setProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const simulateUpload = () => {
    setUploadStatus('uploading');
    setProgress(0);
    
    const totalSize = uploadFile?.size || 15000000; // Default 15MB for simulation
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      // Random progress increment
      const increment = Math.random() * 15;
      currentProgress += increment;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setUploadStatus('success');
        clearInterval(interval);
        
        // Auto-close and trigger onUpload after success
        setTimeout(() => {
          onUpload({
            title: assetTitle,
            type: assetType,
            file: uploadFile,
            url: uploadUrl || (uploadFile ? URL.createObjectURL(uploadFile) : ''),
          });
          onClose();
        }, 1000);
      } else {
        setProgress(currentProgress);
        
        // Simulate speed and time remaining
        const currentSpeed = (Math.random() * 2 + 1).toFixed(1); // 1.0 - 3.0 MB/s
        setSpeed(`${currentSpeed} MB/s`);
        
        const remainingBytes = totalSize * ((100 - currentProgress) / 100);
        const remainingSeconds = Math.ceil(remainingBytes / (parseFloat(currentSpeed) * 1024 * 1024));
        setTimeRemaining(`${remainingSeconds}s remaining`);
      }
      
      // Randomly simulate an error (10% chance during upload)
      if (currentProgress > 30 && currentProgress < 80 && Math.random() < 0.05) {
        setUploadStatus('error');
        clearInterval(interval);
      }
    }, 500);
  };

  const handleUploadClick = () => {
    if (!assetTitle || (assetType !== 'HTML Link' && !uploadFile) || (assetType === 'HTML Link' && !uploadUrl)) {
      return;
    }
    
    if (assetType === 'HTML Link') {
      // Instant upload for links
      onUpload({
        title: assetTitle,
        type: assetType,
        url: uploadUrl,
      });
      onClose();
    } else {
      simulateUpload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">Upload New Asset</h3>
          <button onClick={onClose} disabled={uploadStatus === 'uploading'} className="text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Form Fields - Disabled during upload */}
          <div className={uploadStatus !== 'idle' ? 'opacity-50 pointer-events-none' : ''}>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Asset Title</label>
              <input 
                type="text" 
                value={assetTitle}
                onChange={(e) => setAssetTitle(e.target.value)}
                placeholder="e.g., Advanced Python Labs"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[8px] text-sm focus:border-[#2D5A56] focus:ring-1 focus:ring-[#2D5A56] outline-none transition-all"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Asset Type</label>
              <select 
                value={assetType}
                onChange={(e) => {
                  setAssetType(e.target.value);
                  setUploadFile(null);
                  setUploadUrl('');
                }}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[8px] text-sm focus:border-[#2D5A56] focus:ring-1 focus:ring-[#2D5A56] outline-none transition-all"
              >
                <option value="SCORM">SCORM</option>
                <option value="xAPI">xAPI</option>
                <option value="PDF">PDF</option>
                <option value="Slides">Slides</option>
                <option value="Video">Video</option>
                <option value="HTML Link">HTML Link</option>
              </select>
            </div>

            {assetType === 'HTML Link' ? (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">URL</label>
                <input 
                  type="url" 
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[8px] text-sm focus:border-[#2D5A56] focus:ring-1 focus:ring-[#2D5A56] outline-none transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Upload File</label>
                <div className="relative w-full p-8 bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#2D5A56]/30 hover:bg-gray-50 transition-all cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept={
                      assetType === 'SCORM' || assetType === 'xAPI' ? '.zip' :
                      assetType === 'PDF' ? '.pdf' :
                      assetType === 'Slides' ? '.ppt,.pptx' :
                      assetType === 'Video' ? 'video/*' :
                      '*'
                    }
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setUploadFile(e.target.files[0]);
                        if (!assetTitle) {
                          setAssetTitle(e.target.files[0].name.split('.').slice(0, -1).join('.'));
                        }
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-[#2D5A56]">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">
                      {uploadFile ? uploadFile.name : 'Click to upload or drag and drop'}
                    </p>
                    {!uploadFile && (
                      <p className="text-xs text-gray-500 mt-1">
                        {assetType === 'SCORM' || assetType === 'xAPI' ? 'ZIP (max. 500MB)' :
                         assetType === 'PDF' ? 'PDF (max. 500MB)' :
                         assetType === 'Slides' ? 'PPT, PPTX (max. 500MB)' :
                         assetType === 'Video' ? 'MP4, MOV (max. 500MB)' :
                         'Max. 500MB'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress UI */}
          <AnimatePresence>
            {uploadStatus !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-gray-50 rounded-[12px] border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {uploadStatus === 'uploading' && <RefreshCw className="w-4 h-4 text-[#2D5A56] animate-spin" />}
                      {uploadStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {uploadStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                      <span className="text-sm font-bold text-gray-900">
                        {uploadStatus === 'uploading' ? 'Uploading...' : 
                         uploadStatus === 'success' ? 'Upload Complete' : 
                         'Upload Failed'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-500">{Math.round(progress)}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      className={`h-full ${uploadStatus === 'error' ? 'bg-red-500' : 'bg-[#2D5A56]'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear", duration: 0.5 }}
                    />
                  </div>
                  
                  {/* Speed and Time */}
                  {uploadStatus === 'uploading' && (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{speed}</span>
                      <span>{timeRemaining}</span>
                    </div>
                  )}
                  
                  {uploadStatus === 'error' && (
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={simulateUpload}
                        className="text-xs font-bold text-[#2D5A56] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry Upload
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={uploadStatus === 'uploading'}
            className="px-6 py-2.5 rounded-[8px] font-bold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleUploadClick}
            disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
            className="px-6 py-2.5 rounded-[8px] font-bold text-white transition-colors shadow-sm disabled:opacity-50"
            style={{ backgroundColor: '#2D5A56' }}
          >
            {uploadStatus === 'error' ? 'Retry' : 'Upload to Repository'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- UniversalPreviewer Component ---

export function UniversalPreviewer({ asset, onClose }: { asset: any, onClose: () => void }) {
  if (!asset) return null;

  const renderPreviewContent = () => {
    // Fallback URL if none provided (for demo purposes)
    const url = asset.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    switch (asset.type) {
      case 'PDF':
      case 'Slides':
        // Using Google Docs Viewer for PDF/Slides preview
        return (
          <iframe 
            src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`} 
            className="w-full h-full bg-white rounded-[12px]"
            title={`Preview of ${asset.title}`}
          />
        );
      case 'Video':
      case 'Video (MP4)':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black rounded-[12px] relative group">
            <video 
              src={url} 
              controls 
              controlsList="nodownload"
              className="max-w-full max-h-full rounded-[12px]"
              poster="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
            >
              Your browser does not support the video tag.
            </video>
            {/* Custom overlay hint for playback speed (native controls handle this, but we add a UI hint) */}
            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 backdrop-blur-md">
              <Play className="w-3 h-3" /> Playback Speed Controls Available
            </div>
          </div>
        );
      case 'HTML Link':
      case 'HTML link':
        return (
          <iframe 
            src={url} 
            sandbox="allow-scripts allow-same-origin" 
            className="w-full h-full bg-white rounded-[12px]"
            title={`Preview of ${asset.title}`}
          />
        );
      case 'SCORM':
      case 'xAPI':
      case 'SCORM / xApi / web':
        // Simulating SCORM/xAPI index.html launch file
        return (
          <div className="w-full h-full bg-white rounded-[12px] flex flex-col">
            <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center gap-2 text-sm text-gray-600 font-mono">
              <FileArchive className="w-4 h-4" /> /s3-bucket/unzipped/{asset.id}/index.html
            </div>
            <iframe 
              src={url} 
              className="flex-1 w-full"
              title={`SCORM Player: ${asset.title}`}
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-[12px] text-gray-500">
            <HelpCircle className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-bold">Preview not available for this format</p>
            <p className="text-sm mt-2">({asset.type})</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[90vw] h-[90vh] flex flex-col bg-gray-900 rounded-[24px] overflow-hidden shadow-2xl border border-gray-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{asset.title}</h3>
              <p className="text-xs text-gray-400">{asset.type} • Version {asset.version || '1.0'}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-6 overflow-hidden">
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  );
}

// --- EditAssetModal Component ---

export function EditAssetModal({ 
  isOpen, 
  onClose, 
  asset, 
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  asset: any, 
  onSave: (updatedAsset: any) => void 
}) {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isOpen && asset) {
      setTitle(asset.title || '');
      setTags(asset.tags || []);
      setNewTag('');
    }
  }, [isOpen, asset]);

  if (!isOpen || !asset) return null;

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      ...asset,
      title,
      tags
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">Edit Asset Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Asset Metadata */}
          <div className="bg-gray-50 p-4 rounded-[12px] border border-gray-200 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Uploaded By</span>
              <span className="font-bold text-gray-900">{asset.uploadedBy || 'Unknown User'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Uploaded At</span>
              <span className="font-bold text-gray-900">{asset.uploadedAt || 'Unknown Date'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">File Name</span>
              <span className="font-bold text-gray-900 truncate max-w-[200px]" title={asset.fileName || 'N/A'}>
                {asset.fileName || 'N/A'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Asset Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Advanced Python Labs"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[8px] text-sm focus:border-[#2D5A56] focus:ring-1 focus:ring-[#2D5A56] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tags</label>
            <div className="w-full p-2 bg-white border border-gray-200 rounded-[8px] focus-within:border-[#2D5A56] focus-within:ring-1 focus-within:ring-[#2D5A56] transition-all flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-[4px] text-xs font-bold">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-gray-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input 
                type="text" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "Type a tag and press Enter" : "Add tag..."}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm px-2 py-1"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Press Enter to add a tag. Tags help with sorting and filtering.</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-[8px] font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2.5 rounded-[8px] font-bold text-white transition-colors shadow-sm disabled:opacity-50"
            style={{ backgroundColor: '#2D5A56' }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
