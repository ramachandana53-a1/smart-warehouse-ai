import React, { useState } from 'react';
import { 
  History, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Zap
} from 'lucide-react';
import { ActionHistoryItem } from '../types';

interface ActionHistoryLogProps {
  history: ActionHistoryItem[];
}

export const ActionHistoryLog: React.FC<ActionHistoryLogProps> = ({ history }) => {
  const [filterTag, setFilterTag] = useState<string>('ALL');

  const filtered = history.filter((item) => {
    if (filterTag === 'ALL') return true;
    return item.tag === filterTag;
  });

  return (
    <div id="action-history-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              AI Action History (Why & What Happened)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Live log showing automatically resolved inventory conflicts, route optimizations, and zero-penalty reallocations.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {[
            { id: 'ALL', label: 'All Actions' },
            { id: 'STOCK_REALLOCATION', label: 'Stock Shifts' },
            { id: 'PRIORITY_DISPATCH', label: 'Priority Dispatch' },
            { id: 'BOT_REROUTE', label: 'Bot Detours' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTag(tab.id)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterTag === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline */}
      <div className="mt-4 space-y-3">
        {filtered.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <h4 className="font-bold text-sm text-white">{event.title}</h4>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {event.timestamp}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold text-[10px]">
                  {event.confidenceScore}% AI Confidence
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed font-normal">
              {event.description}
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-semibold flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Impact: {event.impactText}
              </span>
              <span className="text-slate-500 font-mono">ID: {event.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
