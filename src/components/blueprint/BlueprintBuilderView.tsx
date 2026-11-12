import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Clock, 
  HelpCircle,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { db } from '../../db';
import { BLUEPRINT_SERVICE } from '../../services/blueprintService';
import { PAPER_GENERATOR_SERVICE } from '../../services/paperGeneratorService';
import { PaperBlueprint, SectionBlueprint, BoardType, SupportedLanguage, QuestionType } from '../../types';

interface BlueprintBuilderViewProps {
  initialBlueprintId?: string;
  onPaperGenerated?: (paperId: string) => void;
  onStartGeneration?: (blueprint: PaperBlueprint) => void;
}

export const BlueprintBuilderView: React.FC<BlueprintBuilderViewProps> = ({ 
  initialBlueprintId,
  onPaperGenerated,
  onStartGeneration 
}) => {
  const [blueprints, setBlueprints] = useState<PaperBlueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<PaperBlueprint | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{ stage: string; percent: number }>({ stage: '', percent: 0 });

  useEffect(() => {
    loadBlueprints();
  }, []);

  const loadBlueprints = async () => {
    const list = await db.blueprints.toArray();
    setBlueprints(list);
    if (initialBlueprintId) {
      const match = list.find(b => b.id === initialBlueprintId);
      if (match) {
        setSelectedBlueprint(match);
        validate(match);
        return;
      }
    }
    if (list.length > 0 && !selectedBlueprint) {
      setSelectedBlueprint(list[0]);
      validate(list[0]);
    }
  };

  const validate = (bp: PaperBlueprint) => {
    const res = BLUEPRINT_SERVICE.validateBlueprint(bp);
    setValidationErrors(res.errors);
    return res.isValid;
  };

  const handleSelectBlueprint = (bp: PaperBlueprint) => {
    setSelectedBlueprint(bp);
    validate(bp);
  };

  const handleUpdateField = (field: keyof PaperBlueprint, value: any) => {
    if (!selectedBlueprint) return;
    const updated = { ...selectedBlueprint, [field]: value };
    setSelectedBlueprint(updated);
    validate(updated);
  };

  const handleUpdateSection = (index: number, field: keyof SectionBlueprint, value: any) => {
    if (!selectedBlueprint) return;
    const sections = [...selectedBlueprint.sections];
    sections[index] = { ...sections[index], [field]: value };
    const updated = { ...selectedBlueprint, sections };
    setSelectedBlueprint(updated);
    validate(updated);
  };

  const handleAddSection = () => {
    if (!selectedBlueprint) return;
    const secLetter = String.fromCharCode(65 + selectedBlueprint.sections.length);
    const newSection: SectionBlueprint = {
      id: `sec_${Date.now()}`,
      name: `Section ${secLetter}`,
      title: 'Short Answer Questions',
      questionType: 'short_answer',
      questionCount: 5,
      marksPerQuestion: 2,
      sourceMode: 'mix',
      exerciseMode: 'mix'
    };
    const updated = {
      ...selectedBlueprint,
      sections: [...selectedBlueprint.sections, newSection]
    };
    setSelectedBlueprint(updated);
    validate(updated);
  };

  const handleDeleteSection = (index: number) => {
    if (!selectedBlueprint || selectedBlueprint.sections.length <= 1) {
      alert('Blueprint must have at least one section.');
      return;
    }
    const sections = selectedBlueprint.sections.filter((_, i) => i !== index);
    const updated = { ...selectedBlueprint, sections };
    setSelectedBlueprint(updated);
    validate(updated);
  };

  const handleSaveBlueprint = async () => {
    if (!selectedBlueprint) return;
    await BLUEPRINT_SERVICE.saveBlueprint(selectedBlueprint);
    await loadBlueprints();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClone = async () => {
    if (!selectedBlueprint) return;
    const cloned = await BLUEPRINT_SERVICE.cloneBlueprint(selectedBlueprint.id);
    if (cloned) {
      await loadBlueprints();
      setSelectedBlueprint(cloned);
      validate(cloned);
    }
  };

  const handleNewBlueprint = () => {
    const fresh: PaperBlueprint = {
      id: `bp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: 'Custom Examination Blueprint',
      board: 'CBSE',
      grade: 10,
      subject: 'Science',
      examName: 'Mid-Term Examination 2026',
      schoolName: 'Your School Name',
      durationMinutes: 180,
      totalMarks: 50,
      generalInstructions: [
        'All questions are compulsory.',
        'Use of calculators is strictly prohibited.'
      ],
      sections: [
        { id: 's1', name: 'Section A', title: 'Objective Type (MCQs)', questionType: 'mcq', questionCount: 10, marksPerQuestion: 1 },
        { id: 's2', name: 'Section B', title: 'Short Answer Questions', questionType: 'short_answer', questionCount: 10, marksPerQuestion: 2 },
        { id: 's3', name: 'Section C', title: 'Long Answer Questions', questionType: 'long_answer', questionCount: 4, marksPerQuestion: 5 }
      ],
      chapterWeightages: [],
      difficultySplit: { easy: 30, medium: 50, hard: 20 },
      language: 'English',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSelectedBlueprint(fresh);
    validate(fresh);
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202342]">
            Exam Blueprint Builder
          </h1>
          <p className="text-xs sm:text-sm text-[#4e516a] mt-0.5">
            Configure board specs, section marks, and chapter weightages. Deterministically validated in code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewBlueprint}
            className="px-4 py-2 rounded-full border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Blueprint</span>
          </button>

          <button
            onClick={handleClone}
            className="px-4 py-2 rounded-full border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Clone</span>
          </button>

          <button
            onClick={handleSaveBlueprint}
            className="px-5 py-2 rounded-full bg-[#4555fd] hover:bg-[#3343e0] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved ✓' : 'Save Blueprint'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column: Blueprint Selector */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Saved Blueprints</h3>
          
          <div className="space-y-2">
            {blueprints.map(bp => (
              <div
                key={bp.id}
                onClick={() => handleSelectBlueprint(bp)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedBlueprint?.id === bp.id
                    ? 'bg-white border-[#4555fd] shadow-md ring-1 ring-[#4555fd]'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#edf2ff] text-[#4555fd] text-[10px]">
                    {bp.board}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {bp.totalMarks} Marks • Class {bp.grade}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#202342] mt-1">{bp.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{bp.subject} • {bp.sections.length} Sections</p>
              </div>
            ))}
          </div>

          {/* Validation Box */}
          <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
            validationErrors.length === 0 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              {validationErrors.length === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Blueprint Arithmetic Valid (100% Matches)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Validation Inconsistencies ({validationErrors.length}):</span>
                </>
              )}
            </div>

            {validationErrors.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-[11px] text-red-700 pl-1">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Generate CTA Button & Progress */}
          {isGenerating ? (
            <div className="w-full p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-indigo-700 font-bold text-xs">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
                <span>{generationProgress.stage || 'Generating Paper...'}</span>
              </div>
              <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300" 
                  style={{ width: `${generationProgress.percent}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={async () => {
                if (!selectedBlueprint || validationErrors.length > 0) return;
                if (onStartGeneration) {
                  onStartGeneration(selectedBlueprint);
                  return;
                }
                try {
                  setIsGenerating(true);
                  const result = await PAPER_GENERATOR_SERVICE.generatePaper(
                    selectedBlueprint,
                    {
                      generateSets: true,
                      onProgress: (cur: number, total: number, msg: string) => {
                        const pct = Math.round((cur / Math.max(total, 1)) * 100);
                        setGenerationProgress({ stage: msg, percent: pct });
                      }
                    }
                  );
                  if (onPaperGenerated) {
                    onPaperGenerated(result.paper.id);
                  }
                } catch (err: any) {
                  alert(`Generation failed: ${err.message}`);
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={validationErrors.length > 0}
              className="w-full py-3.5 rounded-2xl bg-[#202342] hover:bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Examination Paper</span>
            </button>
          )}
        </div>

        {/* Right Column: Blueprint Form Editor */}
        {selectedBlueprint && (
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
            
            {/* Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Blueprint Title</label>
                <input
                  type="text"
                  value={selectedBlueprint.name}
                  onChange={(e) => handleUpdateField('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:border-[#4555fd]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">School / Institution Name</label>
                <input
                  type="text"
                  value={selectedBlueprint.schoolName}
                  onChange={(e) => handleUpdateField('schoolName', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#4555fd]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Board</label>
                <select
                  value={selectedBlueprint.board}
                  onChange={(e) => handleUpdateField('board', e.target.value as BoardType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board (Maharashtra)">Maharashtra State</option>
                  <option value="State Board (Karnataka)">Karnataka PUE</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Class</label>
                <select
                  value={selectedBlueprint.grade}
                  onChange={(e) => handleUpdateField('grade', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {[6, 7, 8, 9, 10, 11, 12].map(g => (
                    <option key={g} value={g}>Class {g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={selectedBlueprint.totalMarks}
                  onChange={(e) => handleUpdateField('totalMarks', parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-[#4555fd]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={selectedBlueprint.durationMinutes}
                  onChange={(e) => handleUpdateField('durationMinutes', parseInt(e.target.value, 10) || 180)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            {/* Sections Builder */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-[#202342] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#4555fd]" />
                  Examination Sections
                </h4>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="text-xs font-bold text-[#4555fd] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="space-y-3">
                {selectedBlueprint.sections.map((sec, idx) => (
                  <div key={sec.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={sec.name}
                          onChange={(e) => handleUpdateSection(idx, 'name', e.target.value)}
                          className="w-24 px-2 py-1 rounded-lg border border-slate-300 font-bold bg-white text-center"
                        />
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                          placeholder="Section Title / Question Type description"
                          className="px-3 py-1 rounded-lg border border-slate-300 flex-1 bg-white font-medium"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSection(idx)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">Question Type</label>
                        <select
                          value={sec.questionType}
                          onChange={(e) => handleUpdateSection(idx, 'questionType', e.target.value as QuestionType)}
                          className="w-full p-1.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="mcq">MCQ</option>
                          <option value="short_answer">Short Answer</option>
                          <option value="long_answer">Long Answer</option>
                          <option value="assertion_reason">Assertion-Reason</option>
                          <option value="case_study">Case Study</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">Question Count</label>
                        <input
                          type="number"
                          min={1}
                          value={sec.questionCount}
                          onChange={(e) => handleUpdateSection(idx, 'questionCount', parseInt(e.target.value, 10) || 1)}
                          className="w-full p-1.5 rounded-lg border border-slate-300 bg-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">Marks Each</label>
                        <input
                          type="number"
                          min={1}
                          value={sec.marksPerQuestion}
                          onChange={(e) => handleUpdateSection(idx, 'marksPerQuestion', parseInt(e.target.value, 10) || 1)}
                          className="w-full p-1.5 rounded-lg border border-slate-300 bg-white font-bold"
                        />
                      </div>

                      <div className="p-1.5 rounded-lg bg-white border border-slate-200 flex flex-col justify-center text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Section Total</span>
                        <span className="font-extrabold text-[#4555fd] text-sm">
                          {(sec.questionCount || 0) * (sec.marksPerQuestion || 0)} Marks
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Instructions */}
            <div className="pt-4 border-t border-slate-200">
              <label className="block font-bold text-slate-700 mb-1.5">General Instructions</label>
              <textarea
                rows={3}
                value={selectedBlueprint.generalInstructions.join('\n')}
                onChange={(e) => handleUpdateField('generalInstructions', e.target.value.split('\n'))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:border-[#4555fd]"
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
