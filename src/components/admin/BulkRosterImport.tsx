import React, { useState } from 'react';
import { UploadCloud, FileText, Check, AlertCircle, Users, ArrowRight } from 'lucide-react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';

export const BulkRosterImport: React.FC = () => {
  const { students, logAuditEvent, addNotification } = useApp();

  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [csvPreview, setCsvPreview] = useState<Array<{
    name: string;
    roll: string;
    grade: string;
    parentPhone: string;
  }>>([
    { name: 'Kavya Nair', roll: '10A-25', grade: 'Class 10 CBSE', parentPhone: '+91 98111 22334' },
    { name: 'Ishaan Gupta', roll: '10A-26', grade: 'Class 10 CBSE', parentPhone: '+91 98222 33445' },
    { name: 'Meera Patel', roll: '10A-27', grade: 'Class 10 CBSE', parentPhone: '+91 98333 44556' },
    { name: 'Aditya Rao', roll: '10A-28', grade: 'Class 10 CBSE', parentPhone: '+91 98444 55667' }
  ]);

  const handleSimulateUpload = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setImportedCount(csvPreview.length);
      logAuditEvent('ROSTER_BULK_IMPORTED', 'Student', `Bulk imported ${csvPreview.length} student records for Class 10 CBSE`);
      addNotification('Roster Sync Complete', `Successfully provisioned ${csvPreview.length} Global Student IDs (GSID).`, 'result_ready');
    }, 900);
  };

  return (
    <div className="space-y-6">
      
      {/* Upload Box */}
      <div className="p-8 rounded-3xl glass-panel-glow border-slate-800 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-xl font-display font-bold text-white">
            Bulk Student & Teacher CSV Roster Importer
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Drag and drop your school MIS or Google Classroom export CSV. We auto-generate Global Student IDs (GSID) and dispatch WhatsApp welcome links to parents.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={handleSimulateUpload}
            disabled={isImporting}
            className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all"
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Validating Indian Phone & Roll Formats...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Upload Sample Roster CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {importedCount !== null && (
        <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/40 text-brand-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-brand-400" />
            <span>Successfully imported and provisioned <strong>{importedCount} students</strong> with DPDP consent tokens.</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">Status: Active</span>
        </div>
      )}

      {/* CSV Preview Table */}
      <div className="p-6 rounded-3xl glass-panel border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-bold text-sm text-white">Parsed CSV Roster Preview</h4>
          <span className="text-xs text-slate-400">{csvPreview.length} records staged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Roll Number</th>
                <th className="pb-3">Academic Batch</th>
                <th className="pb-3">Parent WhatsApp Number</th>
                <th className="pb-3 text-right">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {csvPreview.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="py-3 font-sans font-semibold text-white">{row.name}</td>
                  <td className="py-3 text-brand-400">{row.roll}</td>
                  <td className="py-3">{row.grade}</td>
                  <td className="py-3">{row.parentPhone}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">
                      VALID
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
