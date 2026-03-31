import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Plus, FileVideo, FileText, FileArchive, Link, ListChecks, Layers, HelpCircle, UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react';
import JSZip from 'jszip';

interface UploadAssetModalProps {
  onClose: () => void;
  onUploadSuccess: (asset: any) => void;
  tenantId: string;
}

export const UploadAssetModal: React.FC<UploadAssetModalProps> = ({ onClose, onUploadSuccess, tenantId }) => {
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetType, setNewAssetType] = useState('Video (MP4)');
  const [file, setFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrorMsg('');
      setUploadStatus('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 500 * 1024 * 1024, // 500MB
    accept: getAcceptTypes(newAssetType),
  });

  function getAcceptTypes(type: string) {
    switch (type) {
      case 'Video (MP4)': return { 'video/mp4': ['.mp4'] };
      case 'PDF': return { 'application/pdf': ['.pdf'] };
      case 'SCORM / xApi / web': return { 'application/zip': ['.zip'] };
      case 'Slides': return { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] };
      case 'Assessments - authoring tools': return { 'application/zip': ['.zip'] };
      default: return undefined;
    }
  }

  const validateZip = async (file: File): Promise<boolean> => {
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      // Check for SCORM or xAPI manifest
      if (contents.file('imsmanifest.xml') || contents.file('tincan.xml')) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const handleUpload = async () => {
    if (!newAssetTitle) {
      setErrorMsg('Please enter an asset title');
      return;
    }

    if (newAssetType === 'HTML link') {
      if (!urlInput || !urlInput.startsWith('http')) {
        setErrorMsg('Please enter a valid URL');
        return;
      }
      saveMetadata({ url: urlInput, size: 0, extension: 'link', originalName: urlInput });
      return;
    }

    if (!file) {
      setErrorMsg('Please select a file to upload');
      return;
    }

    setUploadStatus('validating');

    // Validate ZIP for SCORM/xAPI
    if (newAssetType === 'SCORM / xApi / web') {
      const isValid = await validateZip(file);
      if (!isValid) {
        setErrorMsg('Invalid package: Missing imsmanifest.xml or tincan.xml');
        setUploadStatus('error');
        return;
      }
    }

    if (newAssetType === 'Assessments - authoring tools') {
      if (!file.name.toLowerCase().endsWith('.zip')) {
        setErrorMsg('Invalid package: Must be a ZIP file');
        setUploadStatus('error');
        return;
      }
    }

    if (newAssetType === 'Slides') {
      if (!file.name.toLowerCase().endsWith('.pptx')) {
        setErrorMsg('Invalid file: Must be a PPTX file');
        setUploadStatus('error');
        return;
      }
    }

    setUploadStatus('uploading');

    try {
      // 1. Get pre-signed URL
      const presignedRes = await fetch('/api/upload/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          tenantId
        })
      });
      
      if (!presignedRes.ok) throw new Error('Failed to get upload URL');
      const { signedUrl, key } = await presignedRes.json();

      // 2. Upload to S3 (mocked via our API)
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          setUploadStatus('processing');
          await saveMetadata({
            url: key,
            size: file.size,
            extension: file.name.split('.').pop() || '',
            originalName: file.name
          });
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Network error during upload');
      };

      xhr.send(file);

    } catch (err: any) {
      setErrorMsg(err.message || 'Upload failed');
      setUploadStatus('error');
    }
  };

  const saveMetadata = async (fileData: any) => {
    try {
      let mappedType = 'LINK';
      if (newAssetType === 'SCORM / xApi / web') mappedType = 'SCORM';
      else if (newAssetType === 'Video (MP4)') mappedType = 'VIDEO';
      else if (newAssetType === 'PDF') mappedType = 'PDF';
      else if (newAssetType === 'Slides') mappedType = 'SLIDES';
      else if (newAssetType === 'Assessments - authoring tools') mappedType = 'ASSESSMENT';

      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          title: newAssetTitle,
          type: mappedType,
          url: fileData.url,
          metadata: {
            size: fileData.size,
            extension: fileData.extension,
            originalName: fileData.originalName
          },
          status: 'PROCESSING'
        })
      });

      if (!res.ok) throw new Error('Failed to save metadata');
      const savedAsset = await res.json();
      
      setUploadStatus('success');
      
      // Map back to frontend model
      const frontendAsset = {
        id: savedAsset.id,
        title: savedAsset.title,
        type: newAssetType,
        version: 'v1.0',
        usedIn: 0,
        status: 'Active',
        icon: getIconForType(newAssetType)
      };

      setTimeout(() => {
        onUploadSuccess(frontendAsset);
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save metadata');
      setUploadStatus('error');
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Video (MP4)': return <FileVideo className="w-5 h-5" />;
      case 'PDF': return <FileText className="w-5 h-5" />;
      case 'SCORM / xApi / web': return <FileArchive className="w-5 h-5" />;
      case 'HTML link': return <Link className="w-5 h-5" />;
      case 'Assessments - authoring tools': return <ListChecks className="w-5 h-5" />;
      case 'Slides': return <Layers className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-guesty-night/40 backdrop-blur-sm animate-in fade-in duration-200" aria-modal="true" role="dialog" aria-labelledby="upload-modal-title">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-guesty-beige animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-guesty-beige flex items-center justify-between bg-guesty-cream/50">
          <h3 id="upload-modal-title" className="text-xl font-bold text-guesty-black">Upload New Asset</h3>
          <button onClick={onClose} className="text-guesty-forest/50 hover:text-guesty-black transition-colors" aria-label="Close modal">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2" htmlFor="asset-title">Asset Title</label>
            <input 
              id="asset-title"
              type="text" 
              value={newAssetTitle}
              onChange={(e) => setNewAssetTitle(e.target.value)}
              placeholder="e.g., Advanced Python Labs"
              className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all"
              disabled={uploadStatus !== 'idle' && uploadStatus !== 'error'}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2" htmlFor="asset-type">Asset Type</label>
            <select 
              id="asset-type"
              value={newAssetType}
              onChange={(e) => {
                setNewAssetType(e.target.value);
                setFile(null);
                setUrlInput('');
              }}
              className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all"
              disabled={uploadStatus !== 'idle' && uploadStatus !== 'error'}
            >
              <option value="SCORM / xApi / web">SCORM / xApi / web</option>
              <option value="Video (MP4)">Video (MP4)</option>
              <option value="HTML link">HTML link</option>
              <option value="Assessments - authoring tools">Assessments - authoring tools</option>
              <option value="PDF">PDF</option>
              <option value="Slides">Slides</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-guesty-forest/60 uppercase tracking-widest mb-2">
              {newAssetType === 'HTML link' ? 'Enter URL' : 'Upload File'}
            </label>
            
            {newAssetType === 'HTML link' ? (
              <input 
                type="url" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-white border border-guesty-beige rounded-[8px] text-sm focus:border-guesty-forest focus:ring-1 focus:ring-guesty-forest outline-none transition-all"
                disabled={uploadStatus !== 'idle' && uploadStatus !== 'error'}
              />
            ) : (
              <div 
                {...getRootProps()} 
                className={`w-full p-8 border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center gap-3 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-guesty-forest focus:ring-offset-2
                  ${isDragActive ? 'border-guesty-forest bg-guesty-forest/5' : 'border-guesty-beige bg-guesty-cream/50 hover:border-guesty-forest/30 hover:bg-guesty-cream'}
                  ${uploadStatus !== 'idle' && uploadStatus !== 'error' ? 'opacity-50 pointer-events-none' : ''}
                `}
                aria-label="File upload drop zone"
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-guesty-forest">
                  {file ? <CheckCircle2 className="w-6 h-6 text-guesty-nature" /> : <UploadCloud className="w-6 h-6" />}
                </div>
                <div className="text-center">
                  {file ? (
                    <p className="text-sm font-bold text-guesty-black">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-guesty-black">
                        {isDragActive ? 'Drop file here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-guesty-forest/60 mt-1">
                        {newAssetType === 'Video (MP4)' && 'MP4 (max. 500MB)'}
                        {newAssetType === 'PDF' && 'PDF (max. 50MB)'}
                        {newAssetType === 'SCORM / xApi / web' && 'ZIP (max. 500MB)'}
                        {newAssetType === 'Slides' && 'PPTX (max. 100MB)'}
                        {newAssetType === 'Assessments - authoring tools' && 'ZIP (max. 500MB)'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-guesty-blush/50 border border-guesty-merlot/20 rounded-[8px] flex items-start gap-2 text-guesty-merlot text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          {uploadStatus !== 'idle' && uploadStatus !== 'error' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-guesty-forest/70">
                <span>
                  {uploadStatus === 'validating' && 'Validating package...'}
                  {uploadStatus === 'uploading' && 'Uploading...'}
                  {uploadStatus === 'processing' && 'Processing metadata...'}
                  {uploadStatus === 'success' && 'Upload complete!'}
                </span>
                {uploadStatus === 'uploading' && <span>{uploadProgress}%</span>}
              </div>
              <div className="h-2 bg-guesty-beige rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${uploadStatus === 'success' ? 'bg-guesty-nature' : 'bg-guesty-forest'}`}
                  style={{ width: uploadStatus === 'uploading' ? `${uploadProgress}%` : uploadStatus === 'validating' ? '10%' : '100%' }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-guesty-beige bg-guesty-cream/30 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-[8px] font-bold text-guesty-forest hover:bg-guesty-beige transition-colors disabled:opacity-50"
            disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={uploadStatus !== 'idle' && uploadStatus !== 'error'}
            className="px-6 py-2.5 rounded-[8px] font-bold bg-guesty-nature text-white hover:bg-[#11554f] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {uploadStatus === 'uploading' || uploadStatus === 'processing' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Upload to Repository'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
