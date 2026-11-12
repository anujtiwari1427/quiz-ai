import React, { useState } from 'react';
import { 
  Button, 
  IconButton, 
  Input, 
  Textarea, 
  Select, 
  Checkbox, 
  Switch, 
  Slider, 
  Badge, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Alert, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell, 
  Pagination,
  ProgressBar, 
  Skeleton, 
  EmptyState, 
  FileDropzone, 
  Tabs, 
  Stepper,
  Breadcrumbs,
  KbdHint,
  Avatar,
  Modal,
  Drawer,
  DropdownMenu,
  useToast
} from './index';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Sparkles, 
  Search, 
  BookOpen, 
  Sliders, 
  ShieldCheck, 
  MoreVertical 
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const { success, error, info } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [sliderVal, setSliderVal] = useState(60);
  const [switchVal, setSwitchVal] = useState(true);
  const [checkVal, setCheckVal] = useState(true);
  const [selectVal, setSelectVal] = useState('cbse');
  const [tablePage, setTablePage] = useState(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12 text-left">
      {/* Header */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'EduPulse AI' },
            { label: 'Design System', isCurrent: true }
          ]}
          className="mb-3"
        />
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Design System & Component Catalog
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
          Single source of truth for EduPulse AI. 4px base grid, WCAG AA contrast, warm slate neutrals (90%),
          focused brand orange actions, structural royal purple, and Devanagari typography support.
        </p>
      </div>

      {/* 1. Brand Color Tokens */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
          Color Scales & Tokens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Primary (Action)</CardTitle>
              <CardDescription>Orange scale (#ea580c base) for hero actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-10 rounded-lg bg-brand-600 text-white font-mono text-xs flex items-center justify-between px-3">
                <span>brand-600</span>
                <span>#ea580c (Primary)</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono text-neutral-700">
                <div className="p-2 rounded bg-brand-100">100</div>
                <div className="p-2 rounded bg-brand-200">200</div>
                <div className="p-2 rounded bg-brand-400 text-white">400</div>
                <div className="p-2 rounded bg-brand-700 text-white">700</div>
                <div className="p-2 rounded bg-brand-900 text-white">900</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Structure Secondary</CardTitle>
              <CardDescription>Royal purple scale (#6d28d9 base) for navigation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-10 rounded-lg bg-structure-800 text-white font-mono text-xs flex items-center justify-between px-3">
                <span>structure-800</span>
                <span>#6d28d9 (Structure)</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono text-neutral-700">
                <div className="p-2 rounded bg-structure-100">100</div>
                <div className="p-2 rounded bg-structure-200">200</div>
                <div className="p-2 rounded bg-structure-400 text-white">400</div>
                <div className="p-2 rounded bg-structure-700 text-white">700</div>
                <div className="p-2 rounded bg-structure-900 text-white">900</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warm Slate Neutrals</CardTitle>
              <CardDescription>90% of surfaces, borders & text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-10 rounded-lg bg-neutral-900 text-white font-mono text-xs flex items-center justify-between px-3">
                <span>neutral-900</span>
                <span>#0f172a</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono text-neutral-700">
                <div className="p-2 rounded bg-neutral-100">100</div>
                <div className="p-2 rounded bg-neutral-200">200</div>
                <div className="p-2 rounded bg-neutral-400 text-white">400</div>
                <div className="p-2 rounded bg-neutral-700 text-white">700</div>
                <div className="p-2 rounded bg-neutral-950 text-white">950</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Typography & Devanagari */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Typography & Multilingual Script
        </h2>
        <Card>
          <CardContent className="space-y-4 pt-5">
            <div>
              <span className="text-[11px] font-mono uppercase text-neutral-400">Headings (Plus Jakarta Sans)</span>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Exam Paper Blueprint: Class 10 Science Mid-Term
              </h3>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-neutral-400">Body UI (Inter)</span>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                All questions in Section A are compulsory. Each multiple-choice question carries exactly 1 mark.
              </p>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-neutral-400">Devanagari Support (Hindi & Marathi)</span>
              <p className="text-base font-devanagari text-neutral-800 dark:text-neutral-200">
                प्रश्न १. खालीलपैकी योग्य पर्याय निवडून विधाने पूर्ण करा: (गुरुत्वाकर्षण सिद्धांत)
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. Buttons & Interactive Controls */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Buttons & Actions
        </h2>
        <Card>
          <CardContent className="space-y-6 pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
                Primary Action
              </Button>
              <Button variant="secondary" leftIcon={<BookOpen className="w-4 h-4" />}>
                Secondary Structure
              </Button>
              <Button variant="outline">
                Outline Action
              </Button>
              <Button variant="ghost">
                Ghost Action
              </Button>
              <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                Danger Action
              </Button>
              <Button variant="primary" isLoading>
                Loading State
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs text-neutral-500 font-medium">Icon Buttons:</span>
              <IconButton ariaLabel="Edit" icon={<Edit3 className="w-4 h-4" />} variant="outline" />
              <IconButton ariaLabel="Delete" icon={<Trash2 className="w-4 h-4" />} variant="danger" />
              <IconButton ariaLabel="Add" icon={<Plus className="w-4 h-4" />} variant="primary" />
              <IconButton ariaLabel="Options" icon={<MoreVertical className="w-4 h-4" />} variant="ghost" />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs text-neutral-500 font-medium">Toasts:</span>
              <Button variant="outline" size="sm" onClick={() => success('Exam paper saved locally.', () => alert('Undone!'))}>
                Trigger Undo Toast
              </Button>
              <Button variant="outline" size="sm" onClick={() => error('Failed to parse document format.')}>
                Trigger Error Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Form Inputs */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Form Elements & Inputs
        </h2>
        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
            <Input
              label="School Name"
              placeholder="e.g. Delhi Public School"
              helperText="Printed in the top header of all exam papers."
              defaultValue="Delhi Public School"
              required
            />

            <Input
              label="Exam With Error State"
              placeholder="Total Marks"
              error="Marks total must equal sum of section questions."
              defaultValue="75"
            />

            <Select
              label="Educational Board"
              value={selectVal}
              onValueChange={setSelectVal}
              options={[
                { value: 'cbse', label: 'CBSE (Central Board)', description: 'Standard 80 Marks pattern' },
                { value: 'icse', label: 'ICSE (Council for Indian Certificate)', description: 'Analytical marking rubric' },
                { value: 'maharashtra', label: 'Maharashtra State Board', description: 'Activity-sheet based format' },
              ]}
            />

            <div className="space-y-4">
              <Switch
                label="Shuffle Questions for Set B and Set C"
                description="Synchronizes multiple permutations with matching answer keys."
                checked={switchVal}
                onCheckedChange={setSwitchVal}
              />

              <Checkbox
                label="Educational Fair Use Rights Confirmed"
                description="I confirm this textbook content is used for school assessment purposes."
                checked={checkVal}
                onCheckedChange={setCheckVal}
              />
            </div>

            <div className="md:col-span-2">
              <Slider
                label="Chapter 1 Weightage Distribution"
                value={sliderVal}
                onChange={setSliderVal}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="General Exam Instructions"
                defaultValue="1. All questions are compulsory.&#10;2. Use of scientific calculators is not permitted."
                showCount
                maxLength={200}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 5. Badges, Chips & Alerts */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Badges, Steppers & Alerts
        </h2>
        <Card>
          <CardContent className="space-y-6 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">Brand 80 Marks</Badge>
              <Badge variant="structure">CBSE Class 10</Badge>
              <Badge variant="success">Saved Locally ✓</Badge>
              <Badge variant="warning">Draft Unsaved</Badge>
              <Badge variant="danger">Duplicate (92%)</Badge>
              <Badge variant="info">3 Chunks Grounded</Badge>
              <Badge variant="neutral" onRemove={() => alert('Removed')}>
                Removable Tag
              </Badge>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Alert variant="info" title="Local Storage Security">
                All uploaded textbooks and generated questions are stored purely in client-side IndexedDB.
              </Alert>
              <Alert variant="warning" title="Blueprint Validation Inconsistency">
                Section questions sum to 45 marks, but total marks target is 50. Adjust Section C count.
              </Alert>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs text-neutral-500 font-medium block mb-4">Wizard Stepper:</span>
              <Stepper
                currentStepIndex={activeStep}
                onStepClick={setActiveStep}
                steps={[
                  { id: '1', title: 'Source Books', description: 'Textbooks & PYQs' },
                  { id: '2', title: 'Blueprint', description: 'Sections & Marks' },
                  { id: '3', title: 'Review & Generate', description: 'Deterministic check' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. Tables & Skeletons */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Data Table & Skeletons
        </h2>
        <Card>
          <CardContent className="space-y-4 pt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead sortable sortDirection="asc">Question Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Bloom Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Define oxidation and reduction with chemical equations.</TableCell>
                  <TableCell><Badge variant="neutral">Short Answer</Badge></TableCell>
                  <TableCell className="font-mono">3M</TableCell>
                  <TableCell><Badge variant="structure">Understand</Badge></TableCell>
                  <TableCell><Badge variant="success">Verified</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Which metal is in liquid state at room temperature?</TableCell>
                  <TableCell><Badge variant="neutral">MCQ</Badge></TableCell>
                  <TableCell className="font-mono">1M</TableCell>
                  <TableCell><Badge variant="structure">Remember</Badge></TableCell>
                  <TableCell><Badge variant="success">Verified</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Pagination
              currentPage={tablePage}
              totalPages={3}
              pageSize={2}
              totalItems={6}
              onPageChange={setTablePage}
            />

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <span className="text-xs text-neutral-500 font-medium block">Skeleton Loaders:</span>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="rectangular" height={40} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 7. Modal & Drawer Triggers */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Modals & Drawers
        </h2>
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              Open Demo Modal
            </Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              Open Demo Drawer
            </Button>
          </CardContent>
        </Card>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Sample Dialog Title"
          description="Accessible Radix UI dialog with smooth focus trap and backdrop blur."
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm Action</Button>
            </>
          }
        >
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            This dialog provides a standardized, accessible modal pattern for settings, confirmations, and exports.
          </p>
        </Modal>

        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Side Inspector Drawer"
          description="Slide-over sheet for inspecting question metadata and source textbook chunks."
        >
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Teachers can inspect textbook citations, Bloom taxonomy distribution, and question alternatives in this drawer.
          </p>
        </Drawer>
      </section>
    </div>
  );
};
