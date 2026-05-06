import React, { useState, useEffect } from "react";
import { 
  X, CheckCircle2, AlertCircle, Package, Layers, Search, 
  ArrowRight, ShieldAlert, Zap, Globe, Cpu, RefreshCw,
  FileCheck, History, Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ManifestInfo {
  identifier: string;
  title: string;
  masteryScore: string;
  version: string;
  entryPoint: string;
}

interface ScormDiffusionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: DiffusionConfig) => void;
  oldManifest: ManifestInfo | null;
  newManifest: ManifestInfo;
  associatedCourses: any[];
}

export interface DiffusionConfig {
  pushToCourseIds: string[];
  conflictPolicy: 'soft' | 'hard';
  clearCDN: boolean;
}

const ScormDiffusionWizard: React.FC<ScormDiffusionWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  oldManifest,
  newManifest,
  associatedCourses
}) => {
  const [step, setStep] = useState(1);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(associatedCourses.map(c => c.id));
  const [conflictPolicy, setConflictPolicy] = useState<'soft' | 'hard'>('soft');
  const [clearCDN, setClearCDN] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSteps, setProcessSteps] = useState<{label: string, status: 'pending' | 'loading' | 'done', progress: number}[]>([
    { label: 'Unzipping Atomic Bundle', status: 'pending', progress: 0 },
    { label: 'Manifest Integrity Check', status: 'pending', progress: 0 },
    { label: 'Mapping Course References', status: 'pending', progress: 0 },
    { label: 'Informing n8n Automation', status: 'pending', progress: 0 },
    { label: 'Clearing CloudFront Edge Cache', status: 'pending', progress: 0 }
  ]);

  const handleDiffusion = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < processSteps.length; i++) {
       setProcessSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'loading' } : s));
       
       // Simulate progress
       for (let p = 0; p <= 100; p += 20) {
         setProcessSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress: p } : s));
         await new Promise(resolve => setTimeout(resolve, 300));
       }
       
       setProcessSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done', progress: 100 } : s));
    }

    onComplete({
      pushToCourseIds: selectedCourseIds,
      conflictPolicy,
      clearCDN
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-guesty-night/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-guesty-nature to-guesty-forest text-white">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">SCORM Diffusion Wizard</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                   <span className="text-[10px] font-bold tracking-widest opacity-80">READY FOR PROPAGATION</span>
                </div>
              </div>
            </div>
            {!isProcessing && (
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {!isProcessing ? (
              <div className="space-y-8">
                {/* Step 1: Manifest Comparison */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <FileCheck className="w-4 h-4 text-guesty-nature" />
                       Manifest Analysis
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Old Manifest */}
                    <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 space-y-3 opacity-60">
                       <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previous Build</span>
                         <span className="px-2 py-0.5 bg-gray-200 rounded-full text-[8px] font-black">{oldManifest?.version || 'v1.0'}</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-900 truncate">{oldManifest?.title || 'Initial Package'}</p>
                          <p className="text-[9px] text-gray-500 font-mono italic">{oldManifest?.identifier || 'scorm_id_001'}</p>
                       </div>
                       <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="text-[9px] font-medium text-gray-400">Mastery Score</span>
                          <span className="text-[9px] font-bold text-gray-900">{oldManifest?.masteryScore || '80'}%</span>
                       </div>
                    </div>

                    {/* New Manifest */}
                    <div className="p-5 bg-guesty-lemon/40 rounded-3xl border-2 border-guesty-nature/20 space-y-3 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[1.8]">
                          <Zap className="w-full h-full text-guesty-nature" />
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-guesty-nature uppercase tracking-widest">New Deployment</span>
                         <span className="px-2 py-0.5 bg-guesty-nature text-white rounded-full text-[8px] font-black">{newManifest.version}</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-900 truncate">{newManifest.title}</p>
                          <p className="text-[9px] font-mono italic text-guesty-forest">{newManifest.identifier}</p>
                       </div>
                       <div className="flex items-center justify-between pt-2 border-t border-guesty-nature/10">
                          <span className="text-[9px] font-medium text-gray-400">Mastery Score</span>
                          <span className="text-[9px] font-bold text-guesty-nature">{newManifest.masteryScore}%</span>
                       </div>
                    </div>
                  </div>

                  {oldManifest && oldManifest.identifier !== newManifest.identifier && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
                       <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                       <div className="space-y-1">
                          <p className="text-xs font-black text-orange-700 uppercase tracking-widest">Identifier Mismatch Detected</p>
                          <p className="text-[10px] text-orange-600 leading-relaxed">
                            The identifier has changed from <span className="font-mono">"{oldManifest.identifier}"</span> to <span className="font-mono">"{newManifest.identifier}"</span>. 
                            This will result in new attempt tracking records for all users.
                          </p>
                       </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Conflict Policy */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <History className="w-4 h-4 text-guesty-nature" />
                     Progress & Migration Policy
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setConflictPolicy('soft')}
                      className={`p-5 rounded-3xl border-2 transition-all flex flex-col text-left space-y-2 ${
                        conflictPolicy === 'soft' 
                        ? 'bg-guesty-cream/50 border-guesty-nature shadow-lg scale-[1.02]' 
                        : 'bg-white border-gray-100 hover:border-gray-200 opacity-60'
                      }`}
                    >
                       <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-xl ${conflictPolicy === 'soft' ? 'bg-guesty-nature text-white' : 'bg-gray-100 text-gray-400'}`}>
                             <RefreshCw className="w-4 h-4" />
                          </div>
                          {conflictPolicy === 'soft' && <CheckCircle2 className="w-4 h-4 text-guesty-nature" />}
                       </div>
                       <p className="text-xs font-black text-gray-900 uppercase">Soft Rollout</p>
                       <p className="text-[10px] text-gray-500 leading-relaxed">
                          New enrollments see the new version. Existing users finish on the old version (v1) to prevent progress loss.
                       </p>
                    </button>

                    <button 
                      onClick={() => setConflictPolicy('hard')}
                      className={`p-5 rounded-3xl border-2 transition-all flex flex-col text-left space-y-2 ${
                        conflictPolicy === 'hard' 
                        ? 'bg-guesty-merlot/5 border-guesty-merlot shadow-lg scale-[1.02]' 
                        : 'bg-white border-gray-100 hover:border-gray-200 opacity-60'
                      }`}
                    >
                       <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-xl ${conflictPolicy === 'hard' ? 'bg-guesty-merlot text-white' : 'bg-gray-100 text-gray-400'}`}>
                             <Zap className="w-4 h-4" />
                          </div>
                          {conflictPolicy === 'hard' && <CheckCircle2 className="w-4 h-4 text-guesty-merlot" />}
                       </div>
                       <p className="text-xs font-black text-guesty-merlot uppercase">Hard Cutover</p>
                       <p className="text-[10px] text-gray-500 leading-relaxed">
                          Synchronous migration for ALL users. Existing progress will be mapped to the new version (high risk).
                       </p>
                    </button>
                  </div>
                </div>

                {/* Step 3: Global CDN Settings */}
                <div className="p-6 bg-guesty-night text-white rounded-[32px] flex items-center justify-between shadow-xl">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-2xl">
                         <Globe className="w-5 h-5 text-guesty-lemon" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-black uppercase tracking-[0.15em]">CDN Edge Cache Cleanse</p>
                         <p className="text-[10px] text-white/50">Invalidate current assets on CloudFront across all edge locations.</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setClearCDN(!clearCDN)}
                     className={`w-14 h-8 rounded-full border-2 transition-all p-1 flex items-center ${
                       clearCDN ? 'bg-guesty-nature border-guesty-nature justify-end' : 'bg-white/10 border-white/20 justify-start'
                     }`}
                   >
                      <motion.div 
                        layout
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                      />
                   </button>
                </div>
              </div>
            ) : (
              <div className="py-12 space-y-10">
                 <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-24 h-24 relative">
                       <div className="absolute inset-0 border-4 border-guesty-nature/10 rounded-full" />
                       <svg className="w-full h-full -rotate-90">
                          <circle 
                            cx="48" cy="48" r="44" 
                            fill="none" stroke="currentColor" 
                            strokeWidth="6"
                            className="text-guesty-nature"
                            strokeDasharray={2 * Math.PI * 44}
                            strokeDashoffset={2 * Math.PI * 44 * (1 - (processSteps.reduce((acc, s) => acc + s.progress, 0) / (processSteps.length * 100)))}
                            strokeLinecap="round"
                          />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Cpu className="w-8 h-8 text-guesty-nature animate-pulse" />
                       </div>
                    </div>
                    <div className="text-center">
                       <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Processing Diffusion</h4>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter opacity-60">System Synchronizing Distributed Course Edges</p>
                    </div>
                 </div>

                 <div className="space-y-4 max-w-sm mx-auto">
                    {processSteps.map((step) => (
                       <div key={step.label} className="space-y-2">
                          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
                             <div className="flex items-center gap-2">
                                {step.status === 'loading' ? <RefreshCw className="w-3 h-3 text-guesty-nature animate-spin" /> : 
                                 step.status === 'done' ? <CheckCircle2 className="w-3 h-3 text-guesty-nature" /> :
                                 <div className="w-3 h-3 border border-gray-200 rounded-full" />}
                                <span className={step.status === 'pending' ? 'text-gray-300' : 'text-gray-600'}>{step.label}</span>
                             </div>
                             <span className={step.status === 'loading' ? 'text-guesty-nature' : 'text-gray-400'}>{step.progress}%</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${step.progress}%` }}
                               className={`h-full ${step.status === 'done' ? 'bg-guesty-nature' : 'bg-guesty-lemon'}`}
                             />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isProcessing && (
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-400">
                 <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedCourseIds.length}课程受影响</span>
                 </div>
                 <div className="w-1 h-1 bg-gray-300 rounded-full" />
                 <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{conflictPolicy.toUpperCase()} UPDATE</span>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <button 
                  onClick={onClose}
                  className="px-6 py-3 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest"
                 >
                   Cancel
                 </button>
                 <button 
                  onClick={handleDiffusion}
                  className="px-10 py-4 bg-guesty-night text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center gap-3 active:scale-95 group"
                 >
                   <ArrowRight className="w-4 h-4 text-guesty-lemon group-hover:translate-x-1 transition-transform" />
                   Execute Diffusion
                 </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScormDiffusionWizard;
