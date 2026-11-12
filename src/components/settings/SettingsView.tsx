import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  HardDrive, 
  Key, 
  Palette, 
  HelpCircle, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Folder, 
  Building2, 
  Image as ImageIcon 
} from 'lucide-react';
import { db, getStorageEstimate, deleteAllLocalData } from '../../db';
import { FILE_SYSTEM_SERVICE } from '../../services/fileSystemService';
import { AI_PROVIDER_SERVICE, AiProviderType } from '../../services/aiProviderService';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/FormControls';
import { ProgressBar } from '../ui/Feedback';
import { Alert } from '../ui/Alert';
import { Tabs } from '../ui/NavigationControls';
import { KbdHint } from '../ui/Misc';
import { useToast } from '../ui/Toast';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useApp();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState('storage');
  
  // Storage state
  const [storageInfo, setStorageInfo] = useState<{ usedMB: number; quotaMB: number; percent: number } | null>(null);
  const [connectedFolder, setConnectedFolder] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  // Profile state
  const [schoolName, setSchoolName] = useState('Delhi Public School');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // AI state
  const [provider, setProvider] = useState<AiProviderType>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<{ valid: boolean; message: string } | null>(null);

  useEffect(() => {
    loadSettingsData();
  }, [provider]);

  const loadSettingsData = async () => {
    const [estimate, keyVal, storedSchool] = await Promise.all([
      getStorageEstimate(),
      AI_PROVIDER_SERVICE.getApiKey(provider),
      db.settings.get('schoolName')
    ]);

    if (estimate) {
      setStorageInfo({
        usedMB: Math.round(estimate.usage / (1024 * 1024)),
        quotaMB: Math.round(estimate.quota / (1024 * 1024)),
        percent: estimate.usagePercent
      });
    }

    setConnectedFolder(FILE_SYSTEM_SERVICE.getConnectedFolderName());
    setApiKey(keyVal || '');
    if (storedSchool) setSchoolName(storedSchool.value);
  };

  const handleSelectFolder = async () => {
    const res = await FILE_SYSTEM_SERVICE.selectLibraryFolder();
    if (res.success && res.name) {
      setConnectedFolder(res.name);
      success(`Connected folder "${res.name}" successfully.`);
    } else if (res.error) {
      error(res.error);
    }
  };

  const handleSaveProfile = async () => {
    await db.settings.put({ key: 'schoolName', value: schoolName });
    success('School profile saved.');
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      error('Please enter an API key first.');
      return;
    }
    try {
      setIsTestingKey(true);
      await AI_PROVIDER_SERVICE.saveApiKey(provider, apiKey.trim());
      const test = await AI_PROVIDER_SERVICE.testKey(provider, apiKey.trim());
      setKeyStatus(test);
      if (test.valid) {
        success('API Key verified successfully!');
      } else {
        error(`Key verification failed: ${test.message}`);
      }
    } catch (e: any) {
      error(`Error: ${e.message}`);
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleBackup = async () => {
    const res = await FILE_SYSTEM_SERVICE.exportFullBackupZip();
    if (res.success) {
      success('Full backup ZIP generated and downloaded.');
    } else {
      error('Failed to create backup.');
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('Restoring will merge or update data from this backup archive into your device. Proceed?')) {
      return;
    }

    try {
      setIsRestoring(true);
      const res = await FILE_SYSTEM_SERVICE.restoreFromBackupZip(file, 'merge');
      if (res.success && res.counts) {
        success(`Restored: ${res.counts.textbooks} books, ${res.counts.questions} questions, ${res.counts.savedPapers} papers.`);
        await loadSettingsData();
      } else {
        error(res.error || 'Restore failed.');
      }
    } catch (err: any) {
      error(`Restore error: ${err.message}`);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteAll = async () => {
    const confirmText = prompt('WARNING: This will permanently delete ALL textbooks, questions, blueprints, and papers on this device. Type "DELETE" to confirm:');
    if (confirmText === 'DELETE') {
      await deleteAllLocalData();
      success('All local data has been wiped.');
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Settings & Local Storage
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Manage local device persistence, AI provider keys, institution profile, and appearance.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={[
          {
            id: 'storage',
            label: 'Storage & Backup',
            icon: <HardDrive className="w-4 h-4" />,
            content: (
              <div className="space-y-6">
                {/* Storage Quota Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Local Device Storage</CardTitle>
                    <CardDescription>
                      IndexedDB primary store on this computer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 text-xs">
                    {storageInfo && (
                      <ProgressBar
                        value={storageInfo.percent}
                        label={`Storage Used: ${storageInfo.usedMB} MB / ${storageInfo.quotaMB} MB`}
                        variant="brand"
                      />
                    )}

                    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                          Auto-Sync Folder (Chrome / Edge)
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {connectedFolder ? `Connected to "${connectedFolder}"` : 'No physical folder connected.'}
                        </div>
                      </div>
                      <Button variant="outline" size="xs" onClick={handleSelectFolder}>
                        {connectedFolder ? 'Change Folder' : 'Select Folder'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Backup & Restore Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Backup & Portability</CardTitle>
                    <CardDescription>
                      Export a complete standalone archive of all textbooks, question items, blueprints, and papers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 text-xs">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={handleBackup}
                      >
                        Download Full Backup (.ZIP)
                      </Button>

                      <label className="cursor-pointer">
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={isRestoring}
                          leftIcon={<Upload className="w-4 h-4" />}
                          onClick={() => document.getElementById('restore-file-input')?.click()}
                        >
                          Restore from Backup ZIP
                        </Button>
                        <input
                          id="restore-file-input"
                          type="file"
                          accept=".zip"
                          onChange={handleRestore}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <p className="text-[11px] text-neutral-400">
                      Cross-platform compatibility: ZIP backups can be restored on any computer running Chrome, Edge, Safari, or Firefox.
                    </p>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-danger-200 dark:border-danger-900/60">
                  <CardHeader>
                    <CardTitle className="text-danger-600">Danger Zone</CardTitle>
                    <CardDescription>Permanently wipe all data stored in this browser.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Button variant="danger" size="sm" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDeleteAll}>
                      Delete All My Local Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )
          },
          {
            id: 'ai',
            label: 'AI Provider (BYOK)',
            icon: <Key className="w-4 h-4" />,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Bring Your Own API Key</CardTitle>
                  <CardDescription>
                    Keys are stored strictly in IndexedDB on this device.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-5">
                  <Select
                    label="AI Engine Provider"
                    value={provider}
                    onValueChange={(p: any) => setProvider(p)}
                    options={[
                      { value: 'gemini', label: 'Google Gemini 2.0 Flash / Pro (Fast & Cost-Efficient)' },
                      { value: 'openai', label: 'OpenAI GPT-4o / GPT-4o-mini' },
                      { value: 'anthropic', label: 'Anthropic Claude 3.5 Sonnet' },
                    ]}
                  />

                  <Input
                    label="API Key"
                    type="password"
                    placeholder={`Paste ${provider.toUpperCase()} key...`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    helperText="Stored locally on this device. Only textbook snippets are forwarded during question generation."
                  />

                  <div className="flex items-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isTestingKey}
                      onClick={handleTestKey}
                    >
                      Save & Test Key
                    </Button>
                  </div>

                  {keyStatus && (
                    <Alert
                      variant={keyStatus.valid ? 'success' : 'danger'}
                      title={keyStatus.valid ? 'API Key Valid' : 'API Key Rejected'}
                    >
                      {keyStatus.message}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )
          },
          {
            id: 'profile',
            label: 'School Profile',
            icon: <Building2 className="w-4 h-4" />,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Institution Profile</CardTitle>
                  <CardDescription>Printed on question papers and answer keys.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-5">
                  <Input
                    label="Default School / College Name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Delhi Public School"
                  />
                  <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            )
          },
          {
            id: 'shortcuts',
            label: 'Keyboard Shortcuts',
            icon: <HelpCircle className="w-4 h-4" />,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Keyboard Shortcuts</CardTitle>
                  <CardDescription>Speed up paper editing and navigation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-3 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Open Command Palette</span>
                    <KbdHint>⌘K / Ctrl+K</KbdHint>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Quick Save Draft</span>
                    <KbdHint>⌘S / Ctrl+S</KbdHint>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Close Dialogs & Modals</span>
                    <KbdHint>ESC</KbdHint>
                  </div>
                </CardContent>
              </Card>
            )
          }
        ]}
      />
    </div>
  );
};
