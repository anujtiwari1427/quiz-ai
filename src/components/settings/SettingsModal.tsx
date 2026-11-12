import React, { useState, useEffect } from 'react';
import { 
  X, 
  Folder, 
  HardDrive, 
  Key, 
  Download, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Cpu,
  Shield,
  ExternalLink
} from 'lucide-react';
import { db, getStorageEstimate, deleteAllLocalData } from '../../db';
import { FILE_SYSTEM_SERVICE } from '../../services/fileSystemService';
import { AI_PROVIDER_SERVICE } from '../../services/aiProviderService';
import { AIProviderConfig, StorageEstimateInfo } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onDataReset }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'storage' | 'backup' | 'danger'>('ai');
  
  // AI Keys state
  const [aiConfig, setAiConfig] = useState<AIProviderConfig>({ provider: 'gemini', apiKey: '', model: '' });
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  // Storage state
  const [storageInfo, setStorageInfo] = useState<StorageEstimateInfo | null>(null);
  const [connectedFolder, setConnectedFolder] = useState<string | null>(null);
  const [isSelectingFolder, setIsSelectingFolder] = useState(false);

  // Backup state
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isRestoringZip, setIsRestoringZip] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'overwrite'>('merge');

  // Danger state
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    const config = await AI_PROVIDER_SERVICE.getConfig();
    setAiConfig(config);

    const est = await getStorageEstimate();
    setStorageInfo(est);

    const folderName = FILE_SYSTEM_SERVICE.getConnectedFolderName();
    setConnectedFolder(folderName);
  };

  const handleSaveAiConfig = async () => {
    await AI_PROVIDER_SERVICE.saveConfig(aiConfig);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleTestKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    const res = await AI_PROVIDER_SERVICE.testKey(aiConfig);
    setIsTestingKey(false);
    setTestResult(res);
  };

  const handleConnectFolder = async () => {
    setIsSelectingFolder(true);
    const res = await FILE_SYSTEM_SERVICE.selectLibraryFolder();
    setIsSelectingFolder(false);
    if (res.success && res.name) {
      setConnectedFolder(res.name);
    } else if (res.error && res.error !== 'User cancelled folder selection.') {
      alert(res.error);
    }
  };

  const handleExportZip = async () => {
    setIsExportingZip(true);
    try {
      const blob = await FILE_SYSTEM_SERVICE.createFullBackupZip();
      const dateStr = new Date().toISOString().slice(0, 10);
      FILE_SYSTEM_SERVICE.triggerBrowserDownload(blob, `EduPulse_AI_Backup_${dateStr}.zip`);
    } catch (e: any) {
      alert(`Export failed: ${e.message}`);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleRestoreFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm(`Are you sure you want to restore from ${file.name}? (${restoreMode.toUpperCase()} mode)`)) {
      return;
    }

    setIsRestoringZip(true);
    setRestoreMessage(null);
    const res = await FILE_SYSTEM_SERVICE.restoreFromBackupZip(file, restoreMode);
    setIsRestoringZip(false);

    if (res.success) {
      setRestoreMessage(`✓ Backup restored successfully! Imported ${res.counts.textbooks} books and ${res.counts.savedPapers} papers.`);
      await loadSettings();
      onDataReset?.();
    } else {
      setRestoreMessage(`✕ Restore failed: ${res.error}`);
    }
  };

  const handleDeleteAll = async () => {
    if (!deleteConfirmed) return;
    if (confirm('PERMANENT ACTION: This will completely delete all your uploaded textbooks, questions, blueprints and saved papers from this device. Continue?')) {
      await deleteAllLocalData();
      alert('All local data has been deleted.');
      onDataReset?.();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#edf2ff] text-[#4555fd] flex items-center justify-center font-bold">
              ⚙️
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Local Settings &amp; Storage</h3>
              <p className="text-xs text-slate-500">100% on your device • Zero server database</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'ai' ? 'border-[#4555fd] text-[#4555fd]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>AI Keys (BYOK)</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'storage' ? 'border-[#4555fd] text-[#4555fd]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Library Folder</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'backup' ? 'border-[#4555fd] text-[#4555fd]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup &amp; Restore</span>
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'danger' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-red-600'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 flex-1">
          
          {/* TAB 1: AI KEYS */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#edf2ff] border border-[#c2d4ff] flex items-start gap-3">
                <Shield className="w-4 h-4 text-[#4555fd] shrink-0 mt-0.5" />
                <div className="text-xs text-[#202342] leading-relaxed">
                  <strong>Bring Your Own Key (BYOK):</strong> Your API key is stored exclusively in your browser's IndexedDB. We recommend generating a restricted key with spending caps.
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">AI Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['gemini', 'openai', 'anthropic'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAiConfig({ ...aiConfig, provider: p })}
                      className={`p-2.5 rounded-xl border text-center font-bold capitalize transition-all ${
                        aiConfig.provider === p 
                          ? 'bg-[#4555fd] text-white border-[#4555fd] shadow-xs' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {p === 'gemini' ? 'Google Gemini' : p === 'openai' ? 'OpenAI GPT-4o' : 'Anthropic Claude'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {aiConfig.provider === 'gemini' ? 'Gemini API Key' : aiConfig.provider === 'openai' ? 'OpenAI Secret Key' : 'Anthropic API Key'}
                </label>
                <input
                  type="password"
                  value={aiConfig.apiKey}
                  onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                  placeholder={aiConfig.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:border-[#4555fd]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isTestingKey || !aiConfig.apiKey}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingKey ? 'animate-spin' : ''}`} />
                  <span>{isTestingKey ? 'Testing...' : 'Test Key'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAiConfig}
                  className="px-5 py-2 rounded-xl bg-[#4555fd] hover:bg-[#3343e0] text-white font-bold transition-all shadow-xs"
                >
                  {keySaved ? 'Saved Locally ✓' : 'Save Key'}
                </button>
              </div>

              {testResult && (
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIBRARY FOLDER */}
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-[#4555fd]" />
                    EduPulse Library Folder (Chrome &amp; Edge)
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    connectedFolder ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {connectedFolder ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed text-xs">
                  Select a local folder on your computer. EduPulse AI will automatically organize your uploaded textbooks, saved papers JSON, and exported DOCX/PDF files inside it.
                </p>

                {connectedFolder ? (
                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-700 flex items-center justify-between">
                    <span>📁 {connectedFolder}</span>
                    <button
                      onClick={handleConnectFolder}
                      className="text-xs text-[#4555fd] font-bold hover:underline"
                    >
                      Change Folder
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <button
                      onClick={handleConnectFolder}
                      disabled={isSelectingFolder}
                      className="px-4 py-2.5 rounded-xl bg-[#4555fd] hover:bg-[#3343e0] text-white font-bold transition-all flex items-center gap-2"
                    >
                      <Folder className="w-4 h-4" />
                      <span>{isSelectingFolder ? 'Selecting...' : 'Select Library Folder'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* IndexedDB Storage Quota Bar */}
              {storageInfo && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-slate-400" />
                      Device Storage Quota
                    </span>
                    <span>{storageInfo.usagePercent}% used</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        storageInfo.isLowStorage ? 'bg-red-500' : 'bg-[#4555fd]'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(2, storageInfo.usagePercent))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Used: {(storageInfo.usage / (1024 * 1024)).toFixed(1)} MB</span>
                    <span>Total Quota: {(storageInfo.quota / (1024 * 1024 * 1024)).toFixed(1)} GB</span>
                  </div>

                  {storageInfo.isLowStorage && (
                    <p className="text-red-600 font-bold text-xs pt-1">
                      ⚠️ Low browser storage remaining! Please export a backup ZIP and delete old textbooks.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs">One-Click Complete Backup (ZIP)</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Export a single timestamped ZIP file containing all your textbooks, questions, blueprints, and examination papers. Ideal for moving to another laptop or keeping an offline backup.
                </p>
                <button
                  type="button"
                  onClick={handleExportZip}
                  disabled={isExportingZip}
                  className="px-4 py-2.5 rounded-xl bg-[#202342] hover:bg-slate-900 text-white font-bold flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingZip ? 'Creating ZIP...' : 'Download Full Backup (.zip)'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs">Restore from Backup ZIP</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Select an EduPulse AI backup ZIP to restore your data.
                </p>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="restoreMode" 
                      checked={restoreMode === 'merge'} 
                      onChange={() => setRestoreMode('merge')} 
                    />
                    <span>Merge with existing</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="restoreMode" 
                      checked={restoreMode === 'overwrite'} 
                      onChange={() => setRestoreMode('overwrite')} 
                    />
                    <span>Overwrite existing</span>
                  </label>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-[#4555fd]" />
                  <span>{isRestoringZip ? 'Restoring...' : 'Select Backup ZIP'}</span>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleRestoreFileSelected}
                    disabled={isRestoringZip}
                    className="hidden"
                  />
                </label>

                {restoreMessage && (
                  <p className="text-xs font-semibold pt-1 text-slate-700">{restoreMessage}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DANGER ZONE */}
          {activeTab === 'danger' && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
              <h4 className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Delete All Local Data
              </h4>
              <p className="text-xs text-red-800 leading-relaxed">
                This will erase all local databases, saved examination papers, uploaded textbooks, custom blueprints, and configured API keys from this device.
              </p>

              <label className="flex items-center gap-2 text-xs font-bold text-red-950 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={deleteConfirmed}
                  onChange={(e) => setDeleteConfirmed(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span>I understand that this action cannot be undone.</span>
              </label>

              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={!deleteConfirmed}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all disabled:opacity-40"
              >
                Permanently Delete All Data
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
