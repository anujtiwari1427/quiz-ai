import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Trash2, 
  Copy, 
  Edit3, 
  Clock, 
  Filter, 
  LayoutGrid, 
  List,
  Printer
} from 'lucide-react';
import { db } from '../../db';
import { SavedPaper } from '../../types';
import { exportQuestionPaperDocx, exportAnswerKeyDocx, exportPrintReadyPdf, exportPaperJson } from '../../services/paperExportService';
import { Button, IconButton } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DropdownMenu } from '../ui/DropdownMenu';
import { EmptyState } from '../ui/EmptyState';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { useToast } from '../ui/Toast';

export interface SavedPapersHubProps {
  onOpenEditor: (paperId: string) => void;
  onCreateNew: () => void;
  onReuseBlueprint?: (blueprintId: string) => void;
}

export const SavedPapersHub: React.FC<SavedPapersHubProps> = ({
  onOpenEditor,
  onCreateNew,
  onReuseBlueprint
}) => {
  const { success, error } = useToast();
  const [papers, setPapers] = useState<SavedPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);
      const all = await db.savedPapers.toArray();
      all.sort((a, b) => b.updatedAt - a.updatedAt);
      setPapers(all);
    } catch (err: any) {
      error(`Failed to load papers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (paper: SavedPaper) => {
    try {
      const duplicated: SavedPaper = {
        ...paper,
        id: `paper_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: `${paper.title} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await db.savedPapers.add(duplicated);
      success(`Duplicated "${paper.title}".`);
      await loadPapers();
    } catch (err: any) {
      error(`Duplicate failed: ${err.message}`);
    }
  };

  const handleDelete = async (paper: SavedPaper) => {
    try {
      await db.savedPapers.delete(paper.id);
      success(`Deleted "${paper.title}".`, async () => {
        // Undo Action: re-add to database!
        await db.savedPapers.add(paper);
        await loadPapers();
      });
      await loadPapers();
    } catch (err: any) {
      error(`Delete failed: ${err.message}`);
    }
  };

  const subjects = Array.from(new Set(papers.map(p => p.subject))).filter(Boolean);
  const grades = Array.from(new Set(papers.map(p => p.grade))).filter(Boolean);

  const filtered = papers.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.schoolName && p.schoolName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.examName && p.examName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || p.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || String(p.grade) === selectedGrade;

    return matchesSearch && matchesSubject && matchesGrade;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Saved Exam Papers
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Question papers, marking schemes, and answer keys stored strictly on your local device.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onCreateNew}
        >
          Create New Paper
        </Button>
      </div>

      {/* Filter and View Toggle Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft-xs">
        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search saved papers..."
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            options={[
              { value: 'all', label: 'All Subjects' },
              ...subjects.map(s => ({ value: s, label: s }))
            ]}
          />

          <Select
            value={selectedGrade}
            onValueChange={setSelectedGrade}
            options={[
              { value: 'all', label: 'All Classes' },
              ...grades.map(g => ({ value: String(g), label: `Class ${g}` }))
            ]}
          />

          <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

          {/* Grid / Table Toggle */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <IconButton
              ariaLabel="Grid view"
              icon={<LayoutGrid className="w-3.5 h-3.5" />}
              size="xs"
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('grid')}
            />
            <IconButton
              ariaLabel="Table view"
              icon={<List className="w-3.5 h-3.5" />}
              size="xs"
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('table')}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No papers match your search' : 'No question papers generated yet'}
          description={
            searchQuery
              ? 'Try searching with different subject or class filters.'
              : 'Configure an examination blueprint or pick a starter template to generate your first board paper.'
          }
          action={
            searchQuery
              ? undefined
              : {
                  label: 'Create Your First Paper',
                  onClick: onCreateNew,
                  icon: <Plus className="w-4 h-4" />
                }
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((paper) => {
            const totalQ = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
            const dateStr = new Date(paper.updatedAt || paper.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <Card key={paper.id} className="flex flex-col justify-between">
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="structure">{paper.subject} • Class {paper.grade}</Badge>
                      <Badge variant="brand">{paper.totalMarks} Marks</Badge>
                    </div>
                    <CardTitle className="text-base truncate" title={paper.title}>
                      {paper.title}
                    </CardTitle>
                    <CardDescription className="truncate">
                      {paper.schoolName || 'Standard Exam'} • {paper.examName || 'Assessment'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-3 text-xs space-y-2">
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
                      <div>
                        <div className="text-[10px] text-neutral-400">Sections</div>
                        <div className="font-bold text-neutral-800 dark:text-neutral-200">{paper.sections.length}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400">Questions</div>
                        <div className="font-bold text-neutral-800 dark:text-neutral-200">{totalQ}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400">Time</div>
                        <div className="font-bold text-neutral-800 dark:text-neutral-200">{paper.durationMinutes || 180}m</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Updated {dateStr}
                      </span>
                      {paper.sets && paper.sets.length > 1 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {paper.sets.length} Sets (A/B/C)
                        </span>
                      )}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-3">
                  <Button
                    variant="primary"
                    size="xs"
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    onClick={() => onOpenEditor(paper.id)}
                  >
                    Edit Paper
                  </Button>

                  <div className="flex items-center gap-1.5">
                    {/* Export Dropdown */}
                    <DropdownMenu
                      trigger={
                        <Button variant="outline" size="xs">
                          Export
                        </Button>
                      }
                      items={[
                        {
                          label: 'Print PDF Question Paper',
                          icon: <Printer className="w-4 h-4" />,
                          onClick: () => exportPrintReadyPdf(paper, 'qp')
                        },
                        {
                          label: 'Print PDF Answer Key',
                          icon: <Printer className="w-4 h-4" />,
                          onClick: () => exportPrintReadyPdf(paper, 'ak')
                        },
                        { separator: true, label: '' },
                        {
                          label: 'Download Word (.DOCX)',
                          icon: <FileText className="w-4 h-4" />,
                          onClick: () => exportQuestionPaperDocx(paper)
                        },
                        {
                          label: 'Download JSON Backup',
                          icon: <Download className="w-4 h-4" />,
                          onClick: () => exportPaperJson(paper)
                        }
                      ]}
                    />

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDuplicate(paper)}
                      title="Duplicate this paper"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDelete(paper)}
                      className="text-danger-600 hover:text-danger-700"
                      title="Delete paper"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paper Title</TableHead>
                <TableHead>Subject & Class</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Sections / Qs</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((paper) => {
                const totalQ = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
                const dateStr = new Date(paper.updatedAt || paper.createdAt).toLocaleDateString();

                return (
                  <TableRow key={paper.id}>
                    <TableCell>
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">{paper.title}</div>
                      <div className="text-[11px] text-neutral-400">{paper.schoolName || 'School Paper'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="structure">{paper.subject} • Class {paper.grade}</Badge>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-brand-600">
                      {paper.totalMarks}M
                    </TableCell>
                    <TableCell>
                      <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                        {paper.sections.length} Sec • {totalQ} Qs
                      </span>
                    </TableCell>
                    <TableCell className="text-neutral-400 text-[11px]">
                      {dateStr}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="primary" size="xs" onClick={() => onOpenEditor(paper.id)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="xs" onClick={() => handleDuplicate(paper)}>
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="xs" className="text-danger-600" onClick={() => handleDelete(paper)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

    </div>
  );
};
