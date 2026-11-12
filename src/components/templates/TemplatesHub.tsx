import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Plus, 
  Copy, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { db } from '../../db';
import { PaperBlueprint } from '../../types';
import { BLUEPRINT_SERVICE } from '../../services/blueprintService';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export const TemplatesHub: React.FC = () => {
  const { openCreatePaper } = useApp();
  const { success, error } = useToast();
  const [templates, setTemplates] = useState<PaperBlueprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const list = await db.blueprints.toArray();
      setTemplates(list);
    } catch (err: any) {
      error(`Failed to load templates: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (blueprint: PaperBlueprint) => {
    try {
      const cloned = await BLUEPRINT_SERVICE.cloneBlueprint(blueprint.id);
      if (cloned) {
        success(`Cloned "${blueprint.name}" successfully.`);
        await loadTemplates();
      }
    } catch (err: any) {
      error(`Clone failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete template "${name}"?`)) return;
    try {
      await db.blueprints.delete(id);
      success(`Template deleted.`);
      await loadTemplates();
    } catch (err: any) {
      error(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Examination Blueprint Templates
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Starter patterns and board specifications. Use any template to generate a paper instantly.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => openCreatePaper()}
        >
          Create Custom Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const totalQ = tpl.sections.reduce((acc, s) => acc + s.questionCount, 0);

          return (
            <Card key={tpl.id} className="flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="structure">{tpl.board} Board</Badge>
                    <Badge variant="brand">{tpl.totalMarks} Marks</Badge>
                  </div>
                  <CardTitle className="text-base truncate">{tpl.name}</CardTitle>
                  <CardDescription className="truncate">
                    {tpl.subject} • Class {tpl.grade} • {tpl.durationMinutes} minutes
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-3 text-xs">
                  <div className="space-y-1.5">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 block text-[11px] uppercase tracking-wider">
                      Sections Structure ({tpl.sections.length} Sections, {totalQ} Questions)
                    </span>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {tpl.sections.map((sec, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-[11px]"
                        >
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
                            {sec.name}: {sec.title}
                          </span>
                          <span className="font-mono text-brand-600 font-bold">
                            {sec.questionCount} × {sec.marksPerQuestion}M
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-3">
                <Button
                  variant="primary"
                  size="xs"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => openCreatePaper(tpl.id)}
                >
                  Use Template
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleClone(tpl)}
                    title="Clone this blueprint"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  {!tpl.isBuiltIn && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDelete(tpl.id, tpl.name)}
                      className="text-danger-600 hover:text-danger-700"
                      title="Delete template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
