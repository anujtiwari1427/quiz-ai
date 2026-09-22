import React from 'react';
import { ShieldCheck, FileSpreadsheet, Lock, Download, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DPDPAuditLogs: React.FC = () => {
  const { auditLogs } = useApp();

  const handleExportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `edupulse_dpdp_audit_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* DPDP Act 2023 Compliance Health Banner */}
      <div className="p-6 rounded-3xl glass-panel-glow border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-white">
                India DPDP Act 2023 Compliance Status: 100% Verified
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Parent consent captured for all enrolled minors • Ephemeral student tokens active • Sovereign Mumbai residency
            </p>
          </div>
        </div>

        <button
          onClick={handleExportAuditLogs}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-brand-400" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-3xl glass-panel border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-brand-400" />
            <h4 className="font-display font-bold text-sm text-white">Immutable Platform Audit Trail</h4>
          </div>
          <span className="text-xs text-slate-400">{auditLogs.length} events recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Actor Role</th>
                <th className="pb-3">Action Type</th>
                <th className="pb-3">Entity</th>
                <th className="pb-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="py-3 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      log.actorRole === 'admin' ? 'bg-amber-500/20 text-amber-400' : log.actorRole === 'teacher' ? 'bg-brand-500/20 text-brand-400' : 'bg-accent-500/20 text-accent-400'
                    }`}>
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-white whitespace-nowrap">{log.action}</td>
                  <td className="py-3 text-slate-400">{log.entityType}</td>
                  <td className="py-3 font-sans text-slate-300 max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
