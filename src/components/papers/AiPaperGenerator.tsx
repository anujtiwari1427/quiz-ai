import React, { useState, useRef, useCallback } from "react";
import {
  Sparkles, Printer, Download, Copy, Check, Sliders,
  FileText, CheckCircle2, Layers, Eye, X, FileCheck,
  Upload, School, FileType2, ChevronRight, Shuffle, AlertCircle
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AI_PAPER_SERVICE, GeneratePaperInput } from "../../services/aiPaperService";
import { AiGeneratedPaper, BoardType } from "../../types";
import { LIVE_AI_SERVICE } from "../../services/liveAiService";
import { PDF_EXPORT_SERVICE, PdfExportMode } from "../../services/pdfExportService";

async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function extractTopicsFromText(raw: string): string {
  const lines = raw.split(/[\n\r]+/).map((l) => l.trim()).filter(Boolean);
  const chapterLines = lines
    .filter((l) => /chapter|unit|topic|section|\d+\./i.test(l) || l.length < 80)
    .slice(0, 18);
  if (chapterLines.length > 0) return chapterLines.join(", ");
  return raw.slice(0, 200).replace(/\s+/g, " ");
}

export const AiPaperGenerator: React.FC = () => {
  const { setCurrentView, theme } = useApp();
  const isLight = theme === 'light';

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"paper" | "solutions" | "blueprint">("paper");
  const [activeSectionFilter, setActiveSectionFilter] = useState<"all" | "A" | "B" | "C" | "D">("all");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [exportingMode, setExportingMode] = useState<PdfExportMode | null>(null);

  const [paperSets, setPaperSets] = useState<AiGeneratedPaper[]>(() => {
    const saved = AI_PAPER_SERVICE.getSavedPapers();
    return saved.length > 0 ? [saved[0]] : [AI_PAPER_SERVICE.getDefaultSeedPapers()[0]];
  });
  const [activeSetIdx, setActiveSetIdx] = useState(0);
  const currentPaper = paperSets[activeSetIdx] ?? paperSets[0];

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [board, setBoard] = useState<BoardType>("CBSE");
  const [classGrade, setClassGrade] = useState<number>(10);
  const [subject, setSubject] = useState<string>("Science");
  const [topics, setTopics] = useState<string>("Chemical Reactions and Equations, Electricity, Light - Reflection & Refraction, Life Processes");
  const [totalMarks, setTotalMarks] = useState<number>(80);
  const [durationMinutes, setDurationMinutes] = useState<number>(180);
  const [difficulty, setDifficulty] = useState<"balanced" | "easy" | "hard" | "olympiad">("balanced");
  const [includeCaseStudy] = useState(true);
  const [setCount, setSetCount] = useState<1 | 2 | 3>(1);
  const [schoolName, setSchoolName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [invigilatorName, setInvigilatorName] = useState("");
  const [academicSession, setAcademicSession] = useState("2025-2026");

  const aiConfig = LIVE_AI_SERVICE.getActiveConfig();

  const handleFileDrop = useCallback(async (file: File) => {
    setUploadedFileName(file.name);
    try {
      const raw = await extractTextFromFile(file);
      const extracted = extractTopicsFromText(raw);
      if (extracted) setTopics(extracted);
    } catch { /* ignore */ }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileDrop(file);
  }, [handleFileDrop]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileDrop(file);
  }, [handleFileDrop]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault(); setIsGenerating(true); setProgressPct(10);
    setProgressMsg("Analyzing board blueprint & syllabus weighting...");
    try {
      const input: GeneratePaperInput = {
        title: title.trim() || undefined, board, classGrade, subject,
        topics: topics.trim() || subject, totalMarks: Number(totalMarks),
        durationMinutes: Number(durationMinutes), difficulty, includeCaseStudy,
        schoolName: schoolName.trim() || undefined, teacherName: teacherName.trim() || undefined,
        invigilatorName: invigilatorName.trim() || undefined,
        academicSession: academicSession.trim() || undefined, setCount,
      };
      const basePaper = await AI_PAPER_SERVICE.generatePaper(input, (pct, msg) => { setProgressPct(pct); setProgressMsg(msg); });
      let sets: AiGeneratedPaper[] = [{ ...basePaper, title: `${basePaper.title} — SET 1` }];
      if (setCount > 1) {
        setProgressMsg(`Generating ${setCount} exam sets with shuffled MCQ distribution...`);
        setProgressPct(95);
        sets = AI_PAPER_SERVICE.generatePaperSets(basePaper, setCount as 2 | 3);
      }
      setPaperSets(sets); setActiveSetIdx(0); setActiveTab("paper");
    } catch (err: any) { alert(`Generation failed: ${err.message || "Please check API keys."}`); }
    finally { setIsGenerating(false); }
  };

  const handleExportPdf = (mode: PdfExportMode = "student_paper") => {
    if (!currentPaper) return; setExportingMode(mode);
    try { PDF_EXPORT_SERVICE.generateAndPrintPaperPdf(currentPaper, mode); }
    catch (err: any) { alert(`PDF failed: ${err.message}`); }
    finally { setTimeout(() => setExportingMode(null), 1200); }
  };

  const handleExportWord = (mode: PdfExportMode = "student_paper") => {
    if (!currentPaper) return;
    try { PDF_EXPORT_SERVICE.generateWordDoc(currentPaper, mode); }
    catch (err: any) { alert(`Word export failed: ${err.message}`); }
  };

  const handleDownloadHtml = (mode: PdfExportMode = "student_paper") => {
    if (!currentPaper) return;
    const html = PDF_EXPORT_SERVICE.buildExaminationHtmlDocument(currentPaper, mode);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${currentPaper.title.replace(/[^a-zA-Z0-9]/g, "_")}_${mode}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleCopyPaper = () => {
    if (!currentPaper) return;
    const text = currentPaper.sections.map((sec) =>
      `${sec.title}\n` + currentPaper.questions.filter((q) => q.section === sec.sectionId).map((q) =>
        `Q${q.questionNumber}. ${q.questionText}` + (q.options ? "\n" + q.options.map((o) => `  (${o.id}) ${o.text}`).join("\n") : "")
      ).join("\n\n")
    ).join("\n\n---\n\n");
    navigator.clipboard?.writeText(`${currentPaper.title}\n\n${text}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const displayedQuestions = activeSectionFilter === "all" ? currentPaper.questions : currentPaper.questions.filter((q) => q.section === activeSectionFilter);
  
  const ic = isLight
    ? "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all font-medium"
    : "w-full bg-[#1c2230] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 transition-all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in-up">

      {/* ── Header Banner ─────────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition-all ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-[#0f172a] border-slate-800 shadow-md'
      }`}>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isLight
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-purple-500/15 text-purple-300 border-purple-600/30'
              }`}>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiConfig.provider === "gemini" ? "Google Gemini 2.0 Flash" : `AI: ${aiConfig.model}`}</span>
              </span>
              <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                isLight ? 'text-slate-600 bg-slate-100 border-slate-200' : 'text-slate-400 bg-white/[0.04] border-white/5'
              }`}>NEP 2020 · Board-Standard</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>AI Question Paper Generator</h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Upload your syllabus, configure parameters, and instantly generate board-standard examination papers with marking schemes — export to PDF or Word in seconds.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            {[{label:"Configure",icon:Sliders},{label:"Generate",icon:Sparkles},{label:"Export",icon:Download}].map(({label,icon:Icon},i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                    i===0
                      ? isLight ? 'bg-purple-100 text-purple-800 border-purple-300' : "bg-purple-500/20 border-purple-600/50 text-purple-300"
                      : isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : "bg-white/[0.04] border-white/10 text-slate-400"
                  }`}><Icon className="w-4 h-4" /></div>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
                </div>
                {i<2&&<ChevronRight className={`w-4 h-4 mb-4 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0 md:self-start">
            <button onClick={() => setCurrentView("paper-builder")} className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2">
              <Layers className="w-4 h-4 text-white" /> Open Split Canvas Studio (QP-M)
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: Form ─────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <div className={`rounded-3xl p-5 border backdrop-blur-2xl shadow-xl space-y-4 transition-all ${
            isLight
              ? 'bg-white border-slate-200 shadow-slate-200/50'
              : 'bg-[#141821]/90 border-white/[0.09] shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-white/[0.08]'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isLight ? 'bg-purple-100 text-purple-800' : 'bg-purple-500/10 text-purple-400'}`}><Sliders className="w-4 h-4" /></div>
                <h2 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Paper Blueprint</h2>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isLight ? 'text-purple-700 bg-purple-50 border-purple-200' : 'text-purple-400 bg-purple-500/10 border-purple-600/20'
              }`}>
                {aiConfig.provider==="gemini"?"Gemini 2.0":aiConfig.model}
              </span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">

              {/* Syllabus upload */}
              <div>
                <label className={`flex items-center gap-1.5 text-[11px] font-semibold mb-1.5 ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  <Upload className="w-3.5 h-3.5 text-orange-500" /> Upload Syllabus (PDF/TXT/DOC)
                </label>
                <div onDragOver={(e)=>{e.preventDefault();setIsDragging(true);}} onDragLeave={()=>setIsDragging(false)} onDrop={handleDrop} onClick={()=>fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-2xl p-3.5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-purple-600 bg-purple-500/10"
                      : isLight
                        ? "border-slate-300 bg-slate-50/80 hover:border-purple-600 hover:bg-purple-50/40"
                        : "border-white/10 bg-[#1c2230]/60 hover:border-purple-600/40 hover:bg-orange-500/5"
                  }`}>
                  {uploadedFileName ? (
                    <div className="flex items-center justify-center gap-2 text-orange-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs truncate max-w-[180px]">{uploadedFileName}</span>
                      <button type="button" onClick={(e)=>{e.stopPropagation();setUploadedFileName("");}} className="text-slate-400 hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className={`w-6 h-6 mx-auto ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                      <p className={`text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>Drag &amp; drop or click to upload</p>
                      <p className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>Topics auto-extracted from file</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" onChange={handleFileInput} />
              </div>

              {/* Subject & Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Subject</label>
                  <select value={subject} onChange={(e)=>setSubject(e.target.value)} className={ic}>
                    {["Science","Physics","Chemistry","Mathematics","Biology","Social Science","English","Computer Science","Economics","Accountancy","History","Geography"].map((s)=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-[11px] font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Class</label>
                  <select value={classGrade} onChange={(e)=>setClassGrade(Number(e.target.value))} className={ic}>
                    {[6,7,8,9,10,11,12].map((g)=><option key={g} value={g}>Class {g}{g===10||g===12?" (Board)":""}</option>)}
                  </select>
                </div>
              </div>

              {/* Board */}
              <div>
                <label className={`block text-[11px] font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Board</label>
                <select value={board} onChange={(e)=>setBoard(e.target.value as BoardType)} className={ic}>
                  <option value="CBSE">CBSE (All India)</option>
                  <option value="ICSE">ICSE / ISC</option>
                  <option value="State Board (Maharashtra)">Maharashtra State Board</option>
                  <option value="State Board (Karnataka)">Karnataka State Board</option>
                  <option value="State Board (Tamil Nadu)">Tamil Nadu State Board</option>
                  <option value="State Board (UP)">UP State Board</option>
                </select>
              </div>

              {/* Topics */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Chapters / Topics</label>
                  <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Comma separated</span>
                </div>
                <textarea value={topics} onChange={(e)=>setTopics(e.target.value)} rows={3}
                  placeholder="e.g. Thermodynamics, Wave Optics, Trigonometry..."
                  className={`w-full rounded-xl p-3 text-xs leading-relaxed resize-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600'
                      : 'bg-[#1c2230] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600'
                  }`} />
              </div>

              {/* Marks & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Total Marks</label>
                  <select value={totalMarks} onChange={(e)=>{ const m=Number(e.target.value); setTotalMarks(m); setDurationMinutes(m<=30?45:m<=50?90:180); }} className={ic}>
                    <option value={25}>25 (Unit Test)</option><option value={40}>40 (Term 1)</option>
                    <option value={50}>50 (Mid-Term)</option><option value={70}>70 (Theory)</option>
                    <option value={80}>80 (Annual Board)</option><option value={100}>100 (Full)</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-[11px] font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Duration (min)</label>
                  <div className="relative">
                    <input type="number" value={durationMinutes} onChange={(e)=>setDurationMinutes(Number(e.target.value))} min={15} max={240} step={15}
                      className={ic} />
                    <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">min</span>
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className={`block text-[11px] font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Difficulty Profile</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{id:"balanced",label:"Balanced (CBSE)",desc:"40-40-20"},{id:"easy",label:"Foundation",desc:"60-30-10"},{id:"hard",label:"Pre-Board",desc:"20-50-30"},{id:"olympiad",label:"JEE/Olympiad",desc:"10-40-50"}].map((d)=>(
                    <button key={d.id} type="button" onClick={()=>setDifficulty(d.id as any)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        difficulty===d.id
                          ? isLight ? "border-purple-600 bg-purple-50/80 ring-2 ring-emerald-500/20" : "border-purple-600 bg-purple-500/15"
                          : isLight ? "border-slate-200 bg-slate-50/80 hover:border-slate-300" : "border-white/5 bg-[#1c2230]/50 text-slate-400 hover:border-white/15"
                      }`}>
                      <div className={`font-semibold ${isLight ? (difficulty===d.id ? 'text-purple-900' : 'text-slate-800') : 'text-white'}`}>{d.label}</div>
                      <div className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper Sets */}
              <div>
                <label className={`flex items-center gap-1.5 text-[11px] font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <Shuffle className="w-3.5 h-3.5 text-orange-500" /> Paper Sets (anti-cheating MCQ shuffle)
                </label>
                <div className="flex gap-2">
                  {([1,2,3] as const).map((n)=>(
                    <button key={n} type="button" onClick={()=>setSetCount(n)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                        setCount===n
                          ? isLight ? "bg-orange-50 border-orange-500 text-orange-800 ring-2 ring-teal-500/20" : "bg-orange-500/20 border-orange-500/60 text-orange-300"
                          : isLight ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100" : "bg-[#1c2230]/50 border-white/5 text-slate-400 hover:border-white/15"
                      }`}>
                      {n===1?"1 Set":`${n} Sets`}
                    </button>
                  ))}
                </div>
                {setCount>1&&<p className={`text-[10px] mt-1.5 ${isLight ? 'text-orange-700 font-medium' : 'text-orange-400'}`}>Sec A MCQs shuffled between sets</p>}
              </div>

              {/* School / Teacher */}
              <div className={`border-t pt-3 space-y-2.5 ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
                <div className={`flex items-center gap-1.5 text-[11px] font-semibold mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}><School className="w-3.5 h-3.5" /> School / Institution Header</div>
                <input type="text" value={schoolName} onChange={(e)=>setSchoolName(e.target.value)} placeholder="School / Institution Name" className={ic} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={teacherName} onChange={(e)=>setTeacherName(e.target.value)} placeholder="Subject Teacher" className={ic} />
                  <input type="text" value={invigilatorName} onChange={(e)=>setInvigilatorName(e.target.value)} placeholder="Invigilator (opt.)" className={ic} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Paper Title (opt.)" className={ic} />
                  <input type="text" value={academicSession} onChange={(e)=>setAcademicSession(e.target.value)} placeholder="2025-2026" className={ic} />
                </div>
              </div>

              {/* Generate button */}
              <button type="submit" disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                {isGenerating?(<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Generating{setCount>1?` ${setCount} Sets`:""}...</span></>):(<><Sparkles className="w-4 h-4" /><span>Generate{setCount>1?` ${setCount} Paper Sets`:""}</span></>)}
              </button>

              {isGenerating&&(
                <div className="space-y-2 animate-fade-in">
                  <div className="flex justify-between text-[11px]"><span className={`truncate pr-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{progressMsg}</span><span className="font-mono text-orange-600 font-bold">{progressPct}%</span></div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-black/40 border-white/5'}`}>
                    <div className="bg-orange-600 h-1.5 rounded-full transition-all duration-500" style={{width:`${progressPct}%`}} />
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* AI Status */}
          <div className={`rounded-2xl p-4 border text-xs flex items-start gap-3 transition-all ${
            aiConfig.provider!=="offline"
              ? isLight ? "bg-purple-50/80 border-purple-200" : "bg-orange-500/5 border-purple-600/20"
              : isLight ? "bg-amber-50/80 border-amber-200" : "bg-amber-500/5 border-amber-500/20"
          }`}>
            {aiConfig.provider!=="offline"?<CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />:<AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
            <div>
              <p className={`font-semibold ${aiConfig.provider!=="offline" ? (isLight ? "text-purple-900" : "text-purple-300") : (isLight ? "text-amber-900" : "text-amber-300")}`}>{aiConfig.provider!=="offline"?"Live AI Connected":"Offline Heuristic Mode"}</p>
              <p className={`mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{aiConfig.provider!=="offline"?`Using ${aiConfig.model} — curriculum-accurate unique questions.`:"No API key. Blueprint engine generates structured template questions."}</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Preview ─────────────────────────── */}
        <div className="lg:col-span-8 space-y-4">

          {/* Set tabs */}
          {paperSets.length>1&&(
            <div className={`flex items-center gap-2 rounded-2xl p-2 border backdrop-blur-xl transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#141821]/90 border-white/[0.09]'
            }`}>
              <span className={`text-[11px] font-semibold pl-1 flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}><Shuffle className="w-3.5 h-3.5 text-orange-500" />Sets:</span>
              {paperSets.map((ps,i)=>(
                <button key={ps.id} onClick={()=>setActiveSetIdx(i)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeSetIdx===i
                      ? isLight ? "bg-orange-50 border border-teal-400 text-orange-800" : "bg-orange-500/20 border border-orange-500/50 text-orange-300"
                      : isLight ? "text-slate-600 hover:text-slate-900 border border-transparent" : "text-slate-400 hover:text-white border border-transparent"
                  }`}>Set {i+1}</button>
              ))}
              <span className={`ml-auto text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>MCQs shuffled per set</span>
            </div>
          )}

          {/* Toolbar */}
          <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl p-2.5 border backdrop-blur-xl shadow-xl transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-[#141821]/90 border-white/[0.09]'
          }`}>
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'
            }`}>
              {[{id:"paper",label:"Question Paper",icon:FileText},{id:"solutions",label:"Marking Scheme",icon:Eye},{id:"blueprint",label:"Blueprint",icon:Layers}].map(({id,label,icon:Icon})=>(
                <button key={id} onClick={()=>setActiveTab(id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab===id
                      ? isLight ? "bg-orange-600 text-white shadow-sm" : "bg-orange-500 text-black shadow-md"
                      : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  }`}>
                  <Icon className="w-3.5 h-3.5" /><span>{label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={handleCopyPaper} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 border-white/10'
              }`}>
                {copied?<Check className="w-3.5 h-3.5 text-orange-500" />:<Copy className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />}<span>{copied?"Copied!":"Copy"}</span>
              </button>
              <button onClick={()=>setShowPdfModal(true)} className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95">
                <Download className="w-3.5 h-3.5 stroke-[2.5]" /><span>Export / Print Paper</span>
              </button>
            </div>
          </div>

          {/* Section filter */}
          <div className="flex items-center gap-2 px-1">
            <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Filter:</span>
            <div className="flex items-center gap-1">
              {(["all","A","B","C","D"] as const).map((sec)=>(
                <button key={sec} onClick={()=>setActiveSectionFilter(sec)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                    activeSectionFilter===sec
                      ? isLight ? "bg-purple-100 text-purple-800 border border-purple-300 font-bold" : "bg-purple-500/20 text-purple-400 border border-purple-600/40 font-bold"
                      : isLight ? "text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200" : "text-slate-400 hover:text-white bg-white/[0.03] border border-white/5"
                  }`}>
                  {sec==="all"?"All":`Sec ${sec}`}
                </button>
              ))}
            </div>
          </div>

          {/* Paper Canvas */}
          <div className={`rounded-3xl p-6 sm:p-10 border shadow-2xl min-h-[600px] transition-all ${
            isLight
              ? 'bg-white border-slate-200 shadow-slate-200/60'
              : 'bg-[#121620] border-white/[0.1]'
          }`}>
            <div className={`border-b-2 pb-6 text-center space-y-2 ${isLight ? 'border-slate-300' : 'border-white/20'}`}>
              {(currentPaper as any).schoolName&&<div className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>{(currentPaper as any).schoolName}</div>}
              <div className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase border ${
                isLight ? 'bg-purple-50 text-purple-800 border-purple-300' : 'bg-purple-500/10 text-purple-400 border-purple-600/20'
              }`}>OFFICIAL CURRICULAR ASSESSMENT · CONFIDENTIAL</div>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight uppercase font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentPaper.title}</h2>
              <div className={`flex flex-wrap items-center justify-center gap-4 text-xs pt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                <span>Class: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentPaper.classGrade}th</strong></span>
                <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>•</span><span>Subject: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentPaper.subject}</strong></span>
                <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>•</span><span>Board: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentPaper.board}</strong></span>
                <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>•</span><span>Session: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{(currentPaper as any).academicSession||currentPaper.academicYear}</strong></span>
              </div>
              {(currentPaper as any).teacherName&&<p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Teacher: <strong className={isLight ? 'text-slate-800' : 'text-slate-300'}>{(currentPaper as any).teacherName}</strong></p>}
              <div className={`flex items-center justify-between text-xs border-t pt-3 mt-3 px-2 ${
                isLight ? 'text-slate-600 border-slate-200' : 'text-slate-400 border-white/10'
              }`}>
                <span>Time: <strong className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentPaper.durationMinutes} Min</strong></span>
                <span>Max Marks: <strong className={`font-bold font-mono text-sm ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>{currentPaper.totalMarks}</strong></span>
              </div>
            </div>

            {activeTab==="paper"&&(
              <div className="mt-6 space-y-8">
                <div className={`rounded-2xl p-4 text-xs space-y-1.5 border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'
                }`}>
                  <div className={`flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}><FileText className="w-3.5 h-3.5 text-orange-500" />General Instructions:</div>
                  <ul className={`list-decimal list-inside space-y-1 leading-relaxed pl-1 text-[11.5px] ${
                    isLight ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {currentPaper.generalInstructions.map((inst,i)=><li key={i}>{inst}</li>)}
                  </ul>
                </div>
                {currentPaper.sections.map((section)=>{
                  const sqs=displayedQuestions.filter((q)=>q.section===section.sectionId);
                  if(sqs.length===0) return null;
                  return(
                    <div key={section.sectionId} className="space-y-4">
                      <div className={`border-b pb-2.5 flex items-center justify-between ${
                        isLight ? 'border-slate-200' : 'border-white/10'
                      }`}>
                        <div>
                          <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-purple-800' : 'text-purple-400'}`}>{section.title}</h3>
                          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{section.description}</p>
                        </div>
                        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                          isLight ? 'text-slate-800 bg-slate-100 border-slate-200' : 'text-slate-300 bg-white/[0.06] border-white/10'
                        }`}>{section.totalMarks} Marks</span>
                      </div>
                      <div className="space-y-4">
                        {sqs.map((q)=>(
                          <div key={q.id} className={`p-4 rounded-2xl border transition-all space-y-3 ${
                            isLight
                              ? 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
                          }`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className={`text-xs sm:text-sm font-medium leading-relaxed flex-1 ${
                                isLight ? 'text-slate-800' : 'text-slate-200'
                              }`}>
                                <span className={`font-bold mr-2 font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>Q{q.questionNumber}.</span>
                                <span className="whitespace-pre-line">{q.questionText}</span>
                              </div>
                              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap ${
                                isLight ? 'text-purple-800 bg-purple-100 border-purple-300' : 'text-purple-400 bg-purple-500/10 border-purple-600/20'
                              }`}>[{q.marks}M]</span>
                            </div>
                            {q.options&&q.options.length>0&&(
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-4">
                                {q.options.map((opt)=>(
                                  <div key={opt.id} className={`text-xs p-2.5 rounded-xl border flex items-start gap-2.5 ${
                                    isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/40 border-white/5 text-slate-300'
                                  }`}>
                                    <span className={`font-bold font-mono ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>({opt.id})</span>
                                    <span>{opt.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className={`flex items-center justify-between pt-1 border-t text-[10px] font-mono ${
                              isLight ? 'border-slate-200 text-slate-500' : 'border-white/[0.04] text-slate-500'
                            }`}>
                              <span>Topic: <strong className={isLight ? 'text-slate-700' : 'text-slate-400'}>{q.topic}</strong></span>
                              <span>Bloom: <strong className={isLight ? 'text-indigo-700' : 'text-indigo-400'}>{q.bloomsLevel}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab==="solutions"&&(
              <div className="mt-6 space-y-5">
                <div className={`rounded-2xl p-4 text-xs flex items-center gap-2 border ${
                  isLight ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-purple-500/10 border-purple-600/20 text-purple-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                  <span><strong>Teacher &amp; Evaluator Answer Key</strong> — model solutions with step-wise rubrics.</span>
                </div>
                {displayedQuestions.map((q)=>(
                  <div key={q.id} className={`rounded-2xl p-5 space-y-3 border ${
                    isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-black/40 border-white/10'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-2.5 ${
                      isLight ? 'border-slate-200' : 'border-white/5'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>Q{q.questionNumber} (Sec {q.section})</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                          isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-slate-400 border-white/5'
                        }`}>{q.topic}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                          isLight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20'
                        }`}>Bloom: {q.bloomsLevel}</span>
                        <span className={`font-bold font-mono ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>{q.marks}M</span>
                      </div>
                    </div>
                    <div className={`border-l-4 p-3.5 rounded-r-xl text-xs space-y-1.5 ${
                      isLight ? 'bg-purple-50/80 border-purple-600 text-slate-800' : 'bg-purple-950/20 border-purple-600 text-slate-200'
                    }`}>
                      <strong className={`block ${isLight ? 'text-purple-800' : 'text-purple-400'}`}>Model Answer:</strong>
                      <p className="whitespace-pre-line leading-relaxed">{q.correctAnswer}</p>
                      {q.solutionExplanation&&<p className={`text-[11px] pt-1.5 border-t ${
                        isLight ? 'border-purple-200 text-slate-600' : 'border-purple-600/10 text-slate-400'
                      }`}><strong className={isLight ? 'text-slate-800' : 'text-slate-300'}>Examiner Note:</strong> {q.solutionExplanation}</p>}
                    </div>
                    {q.markingRubric&&q.markingRubric.length>0&&(
                      <div className="space-y-1">
                        <strong className={`block text-[11px] uppercase tracking-wider font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Step-wise Rubric:</strong>
                        {q.markingRubric.map((r,i)=>(
                          <div key={i} className={`flex items-center justify-between text-[11px] p-2 rounded-xl border ${
                            isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/[0.03] border-white/5 text-slate-300'
                          }`}>
                            <span>• {r.step}</span><span className={`font-mono font-bold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>+{r.marks}M</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab==="blueprint"&&(
              <div className="mt-6 space-y-6">
                <div className="overflow-x-auto">
                  <table className={`w-full text-left text-xs border rounded-2xl overflow-hidden ${
                    isLight ? 'border-slate-200' : 'border-white/10'
                  }`}>
                    <thead className={`font-semibold border-b font-mono text-[11px] ${
                      isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-black/60 text-slate-300 border-white/10'
                    }`}>
                      <tr><th className="p-3.5">Section</th><th className="p-3.5">Format</th><th className="p-3.5">Questions</th><th className="p-3.5">Marks/Q</th><th className="p-3.5 text-right">Total</th></tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? 'divide-slate-200 text-slate-700' : 'divide-white/5 text-slate-300'}`}>
                      {currentPaper.sections.map((sec)=>(
                        <tr key={sec.sectionId} className={isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"}>
                          <td className={`p-3.5 font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>Section {sec.sectionId}</td>
                          <td className="p-3.5">{sec.description}</td><td className="p-3.5 font-mono">{sec.questionCount}</td>
                          <td className="p-3.5 font-mono">{sec.marksPerQuestion}</td><td className={`p-3.5 text-right font-mono font-bold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>{sec.totalMarks}M</td>
                        </tr>
                      ))}
                      <tr className={`font-bold ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-white/[0.06] text-white'}`}>
                        <td colSpan={2} className="p-3.5">Grand Total</td><td className="p-3.5 font-mono">{currentPaper.questions.length} Qs</td>
                        <td className="p-3.5">—</td><td className={`p-3.5 text-right font-mono text-sm ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>{currentPaper.totalMarks}M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`border rounded-2xl p-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'}`}>
                    <div className={`text-[10px] uppercase tracking-wider font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>AI Engine</div>
                    <div className={`text-sm font-bold flex items-center gap-1.5 mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}><Sparkles className="w-4 h-4 text-orange-500" /><span>{currentPaper.modelUsed}</span></div>
                  </div>
                  <div className={`border rounded-2xl p-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'}`}>
                    <div className={`text-[10px] uppercase tracking-wider font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Curriculum</div>
                    <div className={`text-sm font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentPaper.board} · Grade {currentPaper.classGrade}</div>
                  </div>
                  <div className={`border rounded-2xl p-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'}`}>
                    <div className={`text-[10px] uppercase tracking-wider font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Sets Generated</div>
                    <div className={`text-sm font-bold mt-1 flex items-center gap-1.5 ${isLight ? 'text-orange-700' : 'text-orange-400'}`}><Shuffle className="w-4 h-4" />{paperSets.length} Set{paperSets.length>1?"s":""}</div>
                  </div>
                </div>
              </div>
            )}

            <div className={`border-t mt-10 pt-5 text-center text-xs font-mono ${isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-600'}`}>*** END OF EXAMINATION — QP-M Blueprint Engine ***</div>
          </div>
        </div>
      </div>

      {/* ── Export Modal ────────────────────────────────────────────── */}
      {showPdfModal&&(
        <div onClick={(e)=>{if(e.target===e.currentTarget)setShowPdfModal(false);}} className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`max-w-2xl w-full border rounded-3xl p-6 shadow-2xl space-y-5 relative my-auto transition-all ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 shadow-2xl'
              : 'bg-[#111622] border-white/20 text-white'
          }`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-700 rounded-t-3xl" />
            <div className="flex items-start justify-between">
              <div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-2 border ${
                  isLight ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-purple-500/10 border-purple-600/25 text-purple-400'
                }`}>
                  <Download className="w-3 h-3" /> Export Examination Documents
                </div>
                <h3 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Download Paper</h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>PDF · Word (.docx) · HTML — all include school/teacher header.</p>
              </div>
              <button onClick={()=>setShowPdfModal(false)} className={`p-1.5 rounded-xl transition-all ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {[
                {mode:"student_paper" as PdfExportMode,title:"Student Question Paper",badge:"Official Exam Copy",desc:"Roll No boxes, sections, marks. Zero answers.",icon:FileText,btnColor:"bg-orange-600 hover:bg-orange-700 text-white"},
                {mode:"marking_scheme" as PdfExportMode,title:"Teacher Marking Scheme",badge:"Confidential Evaluator",desc:"Model answers, step-wise rubrics, Bloom tags, examiner notes.",icon:FileCheck,btnColor:"bg-purple-700 hover:bg-purple-800 text-white"},
                {mode:"complete_bundle" as PdfExportMode,title:"Complete Exam Bundle",badge:"Archival Master",desc:"Question paper + marking scheme, one document with page break.",icon:Layers,btnColor:"bg-blue-600 hover:bg-blue-500 text-white"},
              ].map((opt)=>(
                <div key={opt.mode} className={`p-4 rounded-2xl border transition-all ${
                  isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                        isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-300'
                      }`}><opt.icon className="w-5 h-5" /></div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{opt.title}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-300'
                          }`}>{opt.badge}</span>
                        </div>
                        <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{opt.desc}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={()=>handleExportPdf(opt.mode)} disabled={exportingMode===opt.mode}
                        className={`px-3.5 py-2 rounded-xl ${opt.btnColor} font-bold text-xs flex items-center gap-1.5 active:scale-95 whitespace-nowrap transition-all shadow-sm`}>
                        <Printer className="w-3.5 h-3.5" /><span>{exportingMode===opt.mode?"Opening...":"PDF"}</span>
                      </button>
                      <button onClick={()=>handleExportWord(opt.mode)}
                        className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 whitespace-nowrap transition-all shadow-sm">
                        <FileType2 className="w-3.5 h-3.5" /><span>Word (.docx)</span>
                      </button>
                      <button onClick={()=>handleDownloadHtml(opt.mode)} className={`text-[11px] flex items-center justify-center gap-1 py-0.5 transition-colors ${
                        isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                      }`}>
                        <Download className="w-3 h-3" /><span>HTML</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {paperSets.length>1&&(
              <div className={`rounded-2xl p-3 text-xs flex items-center gap-2 border ${
                isLight ? 'bg-orange-50 border-teal-200 text-orange-800' : 'bg-teal-500/10 border-orange-500/20 text-orange-300'
              }`}>
                <Shuffle className="w-4 h-4 shrink-0" />
                <span><strong>{paperSets.length} sets</strong> generated. Switch sets using the tabs above the preview before exporting each one.</span>
              </div>
            )}
            <div className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs ${
              isLight ? 'bg-purple-50/70 border-purple-200 text-slate-700' : 'bg-orange-500/5 border-purple-600/15 text-slate-400'
            }`}>
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>PDF:</strong> In print dialog → <code className={isLight ? 'text-purple-700 font-bold' : 'text-purple-400'}>Save as PDF</code>, A4 size, enable Background graphics.
                <br /><strong className={`mt-1 block ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Word (.docx):</strong> Opens in Microsoft Word or LibreOffice Writer for editing before printing.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};