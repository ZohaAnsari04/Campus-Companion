import React from 'react';
import { TrendingUp, Flame, PieChart } from 'lucide-react';
import { Task } from '../../types/task';

interface ProgressViewProps {
  tasks: Task[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highPriority = tasks.filter((t) => t.priority === 'high');
  const mediumPriority = tasks.filter((t) => t.priority === 'medium');
  const lowPriority = tasks.filter((t) => t.priority === 'low');

  const highCompleted = highPriority.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#142B61] tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4B55F5]" />
              <span>Academic Productivity Analytics</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Track assignment completion trends, priority distribution, and weekly momentum
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDEBFF] text-[#4B55F5]">
            Live Analytics
          </span>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAF1FF] to-[#EDEBFF] border border-[#C7D7FE]/50">
            <span className="text-xs font-bold text-[#5145E5] uppercase tracking-wider block">
              Overall Completion
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-[#142B61]">{completionRate}%</span>
              <span className="text-xs font-semibold text-slate-500">of total workload</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden mt-3">
              <div
                className="h-full bg-[#4B55F5] rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Completed vs Pending
            </span>
            <div className="flex items-baseline gap-4 mt-2">
              <div>
                <span className="text-2xl font-bold text-[#10B981]">{completed}</span>
                <span className="text-xs text-slate-400 ml-1">done</span>
              </div>
              <div className="text-slate-300">/</div>
              <div>
                <span className="text-2xl font-bold text-[#F59E0B]">{pending}</span>
                <span className="text-xs text-slate-400 ml-1">remaining</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {pending === 0 ? 'Everything cleared! Outstanding job.' : `${pending} active items left.`}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              High-Stakes Tasks
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-rose-600">{highCompleted}</span>
              <span className="text-xs text-slate-500">of {highPriority.length} resolved</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {highPriority.length - highCompleted} high-priority tasks still require attention
            </p>
          </div>
        </div>
      </div>

      {/* Priority Breakdown & Productivity Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card">
          <h3 className="text-sm font-bold text-[#142B61] flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-[#4B55F5]" />
            <span>Workload by Priority Level</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                  <span>High Priority ({highPriority.length})</span>
                </span>
                <span className="text-slate-600">{highCompleted} completed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#F43F5E] rounded-full"
                  style={{
                    width: `${highPriority.length > 0 ? (highCompleted / highPriority.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span>Medium Priority ({mediumPriority.length})</span>
                </span>
                <span className="text-slate-600">
                  {mediumPriority.filter((t) => t.completed).length} completed
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] rounded-full"
                  style={{
                    width: `${
                      mediumPriority.length > 0
                        ? (mediumPriority.filter((t) => t.completed).length / mediumPriority.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Low Priority ({lowPriority.length})</span>
                </span>
                <span className="text-slate-600">
                  {lowPriority.filter((t) => t.completed).length} completed
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full"
                  style={{
                    width: `${
                      lowPriority.length > 0
                        ? (lowPriority.filter((t) => t.completed).length / lowPriority.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Study Habits & Momentum Tips */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card">
          <h3 className="text-sm font-bold text-[#142B61] flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-[#F59E0B]" />
            <span>Productivity Insights</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-bold text-[#142B61]">1. Tackle High-Stakes First</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Prioritizing red-tagged items at the start of your day creates breathing room and reduces exam stress.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-bold text-[#142B61]">2. Consistent Micro-Sessions</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Completing 1-2 small assignments every day builds an unbreakable study streak and prevents last-minute cramming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
