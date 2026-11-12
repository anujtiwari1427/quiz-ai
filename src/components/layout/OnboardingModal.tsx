import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Stepper } from '../ui/NavigationControls';
import { FILE_SYSTEM_SERVICE } from '../../services/fileSystemService';
import { AI_PROVIDER_SERVICE } from '../../services/aiProviderService';
import { db } from '../../db';
import { Check, Folder, Key, Globe, Sparkles, BookOpen } from 'lucide-react';
import { SupportedLanguage } from '../../types';

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [folderName, setFolderName] = useState<string | null>(null);
  const [aiKey, setAiKey] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'anthropic'>('gemini');
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  const handleFinish = (loadSample = false) => {
    localStorage.setItem('edupulse_onboarding_done', 'true');
    localStorage.setItem('edupulse_preferred_lang', language);
    if (loadSample) {
      loadDemoData();
    } else {
      onComplete();
      onClose();
    }
  };

  const handleSelectFolder = async () => {
    const res = await FILE_SYSTEM_SERVICE.selectLibraryFolder();
    if (res.success && res.name) {
      setFolderName(res.name);
    }
  };

  const handleSaveKey = async () => {
    if (aiKey.trim()) {
      await AI_PROVIDER_SERVICE.saveApiKey(provider, aiKey.trim());
    }
  };

  const loadDemoData = async () => {
    try {
      setIsLoadingSample(true);
      // Seed a starter sample textbook and questions into IndexedDB
      const sampleBookId = `tb_demo_${Date.now()}`;
      await db.textbooks.put({
        id: sampleBookId,
        title: 'NCERT Class 10 Science (Sample Chapters)',
        grade: 10,
        subject: 'Science',
        board: 'CBSE',
        totalPages: 45,
        originalFileName: 'class_10_science_sample.pdf',
        language: 'English',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      await db.chapters.bulkPut([
        {
          id: `chap_${sampleBookId}_1`,
          textbookId: sampleBookId,
          chapterNumber: 1,
          title: 'Chemical Reactions and Equations',
          startPage: 1,
          endPage: 16,
          exerciseSections: [{ title: 'Exercises 1.1', startPage: 14, endPage: 16 }]
        },
        {
          id: `chap_${sampleBookId}_2`,
          textbookId: sampleBookId,
          chapterNumber: 2,
          title: 'Acids, Bases and Salts',
          startPage: 17,
          endPage: 32,
          exerciseSections: [{ title: 'Practice Set 2.1', startPage: 30, endPage: 32 }]
        }
      ]);

      await db.questionBank.bulkPut([
        {
          id: `q_demo_1`,
          text: 'Why should a magnesium ribbon be cleaned before burning in air?',
          type: 'short_answer',
          marks: 2,
          difficulty: 'medium',
          bloomLevel: 'Understand',
          subject: 'Science',
          grade: 10,
          board: 'CBSE',
          chapter: 'Chemical Reactions and Equations',
          answer: 'Magnesium ribbon is cleaned with sandpaper to remove the protective layer of basic magnesium oxide so that it can react directly with atmospheric oxygen.',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: `q_demo_2`,
          text: 'Which of the following reaction is an example of a combination reaction?',
          type: 'mcq',
          marks: 1,
          difficulty: 'easy',
          bloomLevel: 'Remember',
          subject: 'Science',
          grade: 10,
          board: 'CBSE',
          chapter: 'Chemical Reactions and Equations',
          options: [
            { id: 'o1', text: 'CaO + H2O → Ca(OH)2', isCorrect: true },
            { id: 'o2', text: 'CaCO3 → CaO + CO2', isCorrect: false },
            { id: 'o3', text: 'Zn + CuSO4 → ZnSO4 + Cu', isCorrect: false },
            { id: 'o4', text: '2H2O → 2H2 + O2', isCorrect: false }
          ],
          answer: 'CaO + H2O → Ca(OH)2 is a combination reaction where two reactants form a single product.',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ]);

      onComplete();
      onClose();
    } catch (e) {
      console.warn('Demo load issue:', e);
      onComplete();
      onClose();
    } finally {
      setIsLoadingSample(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => handleFinish(false)}
      size="lg"
      showCloseButton
      title="Welcome to EduPulse AI"
      description="Quick 3-step setup tailored for Indian teachers and examination authors."
      footer={
        <div className="w-full flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => handleFinish(false)}>
            Skip Setup
          </Button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button variant="primary" size="sm" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={isLoadingSample}
                  leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                  onClick={() => handleFinish(true)}
                >
                  Load Demo Book
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleSaveKey();
                    handleFinish(false);
                  }}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Complete Setup
                </Button>
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        <Stepper
          currentStepIndex={step}
          onStepClick={setStep}
          steps={[
            { id: 'lang', title: '1. Language' },
            { id: 'store', title: '2. Library Folder' },
            { id: 'key', title: '3. AI Provider' },
          ]}
        />

        {step === 0 && (
          <div className="space-y-4 pt-2 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-structure-50 dark:bg-structure-950/40 border border-structure-200 dark:border-structure-800/60">
              <Globe className="w-5 h-5 text-structure-600 dark:text-structure-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-structure-900 dark:text-structure-200">
                  Select Primary Exam Language
                </h4>
                <p className="text-[11px] text-structure-600 dark:text-structure-400">
                  Used for Devanagari font rendering, OCR models, and exam header formatting.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(['English', 'Hindi', 'Marathi'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    language === lang
                      ? 'border-brand-600 bg-brand-50/60 text-brand-900 dark:bg-brand-950/40 dark:text-brand-300 font-bold ring-2 ring-brand-500/30'
                      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                  }`}
                >
                  <div className="text-sm">{lang}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    {lang === 'English' ? 'Standard' : lang === 'Hindi' ? 'हिंदी (देवनागरी)' : 'मराठी (देवनागरी)'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 pt-2 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <Folder className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Select Local Folder for Auto-Saving
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Chrome and Edge can automatically write your textbooks, question banks, and papers directly to your disk.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 text-center space-y-3">
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                Connected Folder:{' '}
                <strong className="text-neutral-900 dark:text-white">
                  {folderName || 'None selected yet'}
                </strong>
              </p>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Folder className="w-4 h-4" />}
                onClick={handleSelectFolder}
              >
                {folderName ? 'Change Folder' : 'Select "EduPulse Library" Folder'}
              </Button>
              <p className="text-[11px] text-neutral-400">
                You can also skip this; data will still be safely stored inside your browser's IndexedDB.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 pt-2 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Bring Your Own API Key (Optional)
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Keys are stored exclusively on your device. If omitted, you can generate papers from your local question bank.
                </p>
              </div>
            </div>

            <Select
              label="AI Provider"
              value={provider}
              onValueChange={(v: any) => setProvider(v)}
              options={[
                { value: 'gemini', label: 'Google Gemini 2.0 Flash / Pro (Recommended)' },
                { value: 'openai', label: 'OpenAI GPT-4o / GPT-4o-mini' },
                { value: 'anthropic', label: 'Anthropic Claude 3.5 Sonnet' },
              ]}
            />

            <Input
              label="API Key"
              placeholder={`Paste your ${provider.toUpperCase()} API key...`}
              type="password"
              value={aiKey}
              onChange={(e) => setAiKey(e.target.value)}
              helperText="Stored locally in IndexedDB. Never sent to our servers."
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
