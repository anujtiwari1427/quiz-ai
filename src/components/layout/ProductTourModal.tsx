import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { BookOpen, Sliders, Sparkles, Printer, ShieldCheck, Check } from 'lucide-react';

export interface ProductTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductTourModal: React.FC<ProductTourModalProps> = ({ isOpen, onClose }) => {
  const [slide, setSlide] = useState(0);

  const tourSlides = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: '100% Local-First & Private',
      description: 'Your textbooks, question banks, and generated exam papers never leave your computer. Everything is persisted locally in IndexedDB and optional local folders.',
    },
    {
      icon: <BookOpen className="w-8 h-8 text-brand-600" />,
      title: 'In-Browser Ingestion & OCR',
      description: 'Upload textbook PDFs, DOCX, or PYQ papers. Our built-in worker extracts pages, detects chapters and exercises, and uses tesseract.js OCR for scanned pages without freezing your screen.',
    },
    {
      icon: <Sliders className="w-8 h-8 text-brand-700 dark:text-brand-400" />,
      title: 'Deterministic Blueprint Validation',
      description: 'You control the exact question counts, marks, and chapter weightages. The system validates arithmetic in code, ensuring totals match 100% before generation begins.',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      title: 'Grounded Generation & Multi-Sets',
      description: 'Questions are retrieved from your question bank or generated strictly from textbook snippets. Create Set A, Set B, and Set C permutations with synchronized answer keys instantly.',
    },
    {
      icon: <Printer className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />,
      title: 'Board-Standard Word & PDF Exports',
      description: 'Export print-ready PDFs with full Devanagari (Hindi/Marathi) font support, or editable Microsoft Word (.docx) question papers and model answer keys with one click.',
    },
  ];

  const current = tourSlides[slide];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton
      title={
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <span>TOUR STEP {slide + 1} OF {tourSlides.length}</span>
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {tourSlides.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === slide ? 'bg-brand-600 w-5' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {slide > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSlide((s) => s - 1)}>
                Back
              </Button>
            )}
            {slide < tourSlides.length - 1 ? (
              <Button variant="primary" size="sm" onClick={() => setSlide((s) => s + 1)}>
                Next
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={onClose} leftIcon={<Check className="w-3.5 h-3.5" />}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="py-4 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mb-4 shadow-soft-xs">
          {current.icon}
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          {current.title}
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-sm">
          {current.description}
        </p>
      </div>
    </Modal>
  );
};
