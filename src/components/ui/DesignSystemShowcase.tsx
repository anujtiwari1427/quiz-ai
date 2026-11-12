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
  MoreVertical,
  Sun,
  Moon,
  CheckCircle2
} from 'lucide-react';
import { CONTRAST_RATIOS, COLOR_TOKENS } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';

export const DesignSystemShowcase: React.FC = () => {
  const { theme, toggleTheme } = useApp();
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
      {/* Header with Theme Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <Breadcrumbs
            items={[
              { label: 'EduPulse AI' },
              { label: 'Design System', isCurrent: true }
            ]}
            className="mb-2"
          />
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Design Tokens & Component Catalog
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            Education + craft aesthetic for EduPulse AI. Warm stone neutrals (90%), deep indigo/ink-blue brand action (8%),
            and warm saffron accent (2%). Strict WCAG AA & AAA contrast compliant.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
          </Button>
        </div>
      </div>

      {/* 1. Color Palette & Tokens */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-700" />
          Color Scales & Tokens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Primary (Action)</CardTitle>
              <CardDescription>Deep Indigo / Ink-Blue (#4338ca base) for primary CTAs & focus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-10 rounded-lg bg-brand-700 text-white font-mono text-xs flex items-center justify-between px-3 shadow-xs">
                <span>brand-700</span>
                <span>#4338ca (Base)</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono text-neutral-700">
                <div className="p-2 rounded bg-brand-50">50</div>
                <div className="p-2 rounded bg-brand-100">100</div>
                <div className="p-2 rounded bg-brand-300">300</div>
                <div className="p-2 rounded bg-brand-500 text-white">500</div>
                <div className="p-2 rounded bg-brand-900 text-white">900</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accent (Warm Saffron)</CardTitle>
              <CardDescription>Warm Amber (#f59e0b base) used sparingly (&le; 2%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-10 rounded-lg bg-accent-500 text-white font-mono text-xs flex items-center justify-between px-3 shadow-xs">
                <span>accent-500</span>
                <span>#f59e0b (Saffron)</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono text-neutral-700">
                <div className="p-2 rounded bg-accent-50">50</div>
                <div className="p-2 rounded bg-accent-100">100</div>
                <div className="p-2 rounded bg-accent-300">300</div>
                <div className="p-2 rounded bg-accent-700 text-white">700</div>
                <div className="p-2 rounded bg-accent-900 text-white">900</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warm Stone Neutrals</CardTitle>
              <CardDescription>90% of surfaces, borders & text (#fafaf9 canvas, #ffffff card)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-10 rounded-lg bg-neutral-900 text-white font-mono text-xs flex items-center justify-between px-3 shadow-xs">
                <span>neutral-900</span>
                <span>#1c1917</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono text-neutral-700">
                <div className="p-2 rounded bg-neutral-50 border border-neutral-200">50</div>
                <div className="p-2 rounded bg-neutral-100">100</div>
                <div className="p-2 rounded bg-neutral-300">300</div>
                <div className="p-2 rounded bg-neutral-600 text-white">600</div>
                <div className="p-2 rounded bg-neutral-950 text-white">950</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. WCAG Contrast Ratios Report */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          WCAG Contrast Ratios Verification
        </h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UI Element & Combination</TableHead>
                <TableHead>Contrast Ratio</TableHead>
                <TableHead>WCAG Level</TableHead>
                <TableHead>Target Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CONTRAST_RATIOS.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
                    {item.element}
                  </TableCell>
                  <TableCell className="font-mono text-brand-700 dark:text-brand-400 font-bold">
                    {item.ratio}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" size="xs">{item.wcagRating}</Badge>
                  </TableCell>
                  <TableCell className="text-neutral-500 text-xs">
                    {item.usage}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* 3. Buttons & Actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Buttons & Actions</h2>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Primary Button
              </Button>
              <Button variant="secondary">
                Secondary Button
              </Button>
              <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                Outline Button
              </Button>
              <Button variant="ghost">
                Ghost Button
              </Button>
              <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                Danger Button
              </Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider w-full">Sizes</span>
              <Button size="xs" variant="primary">Extra Small</Button>
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium (Default)</Button>
              <Button size="lg" variant="primary">Large Hero</Button>
              <IconButton icon={<Edit3 className="w-4 h-4" />} ariaLabel="Edit item" variant="outline" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Badges & Chips */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Badges & Indicators</h2>
        <Card>
          <CardContent className="flex flex-wrap items-center gap-2.5 pt-6">
            <Badge variant="brand">Brand Badge</Badge>
            <Badge variant="accent">Warm Saffron Accent</Badge>
            <Badge variant="neutral">Neutral Slate</Badge>
            <Badge variant="success">Pass / Completed</Badge>
            <Badge variant="warning">Warning Notice</Badge>
            <Badge variant="danger">High Risk / Error</Badge>
            <Badge variant="info">Local Sync</Badge>
            <Badge variant="brand" onRemove={() => info('Removed badge')}>Removable</Badge>
          </CardContent>
        </Card>
      </section>

      {/* 5. Inputs & Form Controls */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Form Inputs & Accessible Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Examination Title"
                placeholder="e.g. Mid-Term Science Assessment"
                helperText="Stored locally on device"
                required
              />
              <Select
                label="Educational Board"
                value={selectVal}
                onValueChange={setSelectVal}
                options={[
                  { value: 'cbse', label: 'CBSE (Central Board)' },
                  { value: 'icse', label: 'ICSE / CISCE' },
                  { value: 'state', label: 'Maharashtra State Board' },
                ]}
              />
              <Textarea
                label="General Instructions"
                rows={3}
                placeholder="All questions are compulsory..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selection Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Checkbox
                label="Auto-generate Answer Key"
                description="Creates aligned model solution sheet"
                checked={checkVal}
                onCheckedChange={setCheckVal}
              />
              <Switch
                label="High-Density Question Layout"
                description="Save printer paper during examination printing"
                checked={switchVal}
                onCheckedChange={setSwitchVal}
              />
              <Slider
                label="Difficulty Split (% Medium/Hard)"
                value={sliderVal}
                onChange={setSliderVal}
                min={0}
                max={100}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. Alerts & Callouts */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Alerts & Status Callouts</h2>
        <div className="space-y-3">
          <Alert variant="info" title="100% Local-First Storage">
            All textbooks, question items, and generated papers remain stored exclusively inside this browser's IndexedDB.
          </Alert>
          <Alert variant="success" title="Paper Generated Successfully">
            Set A, Set B, and Set C permutations are ready for inspection and Word/PDF export.
          </Alert>
          <Alert variant="warning" title="Blueprint Arithmetic Warning">
            Section B requires 30 marks, but selected question slots total 25 marks. Please adjust marks allocation.
          </Alert>
          <Alert variant="danger" title="Storage Quota Alert">
            Browser storage is exceeding 80% capacity. Please export a full backup ZIP.
          </Alert>
        </div>
      </section>

      {/* 7. Dialogs & Overlays Trigger */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Modals, Drawers & Toast Feedback</h2>
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 pt-6">
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              Open Sample Modal
            </Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              Open Slide-Over Drawer
            </Button>
            <Button variant="secondary" onClick={() => success('Saved locally in IndexedDB ✓')}>
              Trigger Toast (with Undo)
            </Button>
          </CardContent>
        </Card>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Sample Radix Dialog"
          description="Standard accessible modal dialog for blueprint and export workflows."
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm Action</Button>
            </div>
          }
        >
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            This dialog passes focus management, backdrop dismiss, and keyboard escape trapping cleanly.
          </p>
        </Modal>

        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Slide-over Drawer"
          description="Useful for chapter trees and tag inspectors."
        >
          <div className="py-4 space-y-3">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Drawers slide smoothly from the right side and adapt nicely to mobile viewports.
            </p>
          </div>
        </Drawer>
      </section>
    </div>
  );
};

export default DesignSystemShowcase;
