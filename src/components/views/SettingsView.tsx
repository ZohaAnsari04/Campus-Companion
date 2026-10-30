import React from 'react';
import { Settings, RotateCcw, Download, Info } from 'lucide-react';
import { Task } from '../../types/task';
import { NavView } from '../Sidebar';

interface SettingsViewProps {
  tasks: Task[];
  onResetSamples: () => void;
  onNavigate: (view: NavView) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  tasks,
  onResetSamples,
  onNavigate,
}) => {
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `campus_companion_tasks_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card">
        <div className="pb-4 mb-5 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-[#142B61] tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#4B55F5]" />
            <span>Preferences & Data Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your student profile, data persistence, and application settings
          </p>
        </div>

        {/* Student Profile Card */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#4B55F5] to-[#8B5CF6] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              S
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#142B61]">Student Scholar</h3>
              <p className="text-xs text-slate-400">Campus Companion Productivity Hub</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDEBFF] text-[#4B55F5]">
                Free Student Plan
              </span>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-4">
          {/* Reset to Sample Tasks */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#142B61] flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-[#4B55F5]" />
                <span>Reset to Seeded Sample Tasks</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Restores the standard sample tasks (Calculus, Computer Science, Physics, etc.)
              </p>
            </div>
            <button
              onClick={onResetSamples}
              className="px-4 py-2 text-xs font-semibold text-[#4B55F5] bg-[#EDEBFF] hover:bg-[#EAF1FF] rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              Reset Samples
            </button>
          </div>

          {/* Export Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#142B61] flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#10B981]" />
                <span>Export Task Backup (JSON)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Download a JSON copy of all your active and completed tasks for safekeeping
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              Export JSON
            </button>
          </div>

          {/* About Section Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#142B61] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#5145E5]" />
                <span>About Campus Companion</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                View platform mission, feature breakdown, and privacy information
              </p>
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="px-4 py-2 text-xs font-semibold text-[#5145E5] bg-[#EDEBFF] hover:bg-[#EAF1FF] rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              View About Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
