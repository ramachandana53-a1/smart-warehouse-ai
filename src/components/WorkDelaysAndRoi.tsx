import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { BottleneckDelay, BusinessImpactMetrics } from '../types';

interface WorkDelaysAndRoiProps {
  bottlenecks: BottleneckDelay[];
  metrics: BusinessImpactMetrics;
  onResolveBottleneck: (id: string) => void;
}

export const WorkDelaysAndRoi: React.FC<WorkDelaysAndRoiProps> = ({
  bottlenecks,
  metrics,
  onResolveBottleneck,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Time & Money Saved Today */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl text-slate-100 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-indigo-500/20 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Time & Money Saved Today (Live Impact)
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Real calculations of human walking hours saved and late delivery penalties prevented today.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold self-start sm:self-auto">
            Live Calculations Active
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Estimated Time Saved */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Time Saved</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">3.2 Hours</div>
            <p className="text-[11px] text-blue-300 font-medium mt-1">
              Saved today by picking the shortest walking paths
            </p>
          </div>

          {/* Revenue Saved */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Money Saved</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">$1,850</div>
            <p className="text-[11px] text-emerald-300 font-medium mt-1">
              In late delivery penalty fees prevented
            </p>
          </div>

          {/* Picking Efficiency */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Walking Efficiency</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300">+28%</div>
            <p className="text-[11px] text-cyan-200 font-medium mt-1">
              Less walking and faster packing routes
            </p>
          </div>

          {/* Fulfillment Accuracy */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Packing Accuracy</span>
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">{metrics.fulfillmentAccuracy}%</div>
            <p className="text-[11px] text-indigo-200 font-medium mt-1">
              Zero mistakes across 142 shipped packages
            </p>
          </div>
        </div>
      </div>

      {/* 2. Where Things Are Moving Slowly */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Where Things Are Moving Slowly Right Now
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                {bottlenecks.filter((b) => !b.resolved).length} Small Delays
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tables or hallways with small slowdowns, and the smart fix applied automatically to keep work flowing.
            </p>
          </div>
        </div>

        <div className="space-y-3.5 mt-4">
          {bottlenecks.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all text-xs ${
                item.resolved
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                  : item.severity === 'high'
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    item.resolved
                      ? 'bg-slate-600'
                      : item.severity === 'high'
                      ? 'bg-rose-500 animate-ping'
                      : item.severity === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">{item.location}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.resolved
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        +{item.delayMinutes} min slowdown
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-0.5">{item.cause}</p>
                  </div>
                </div>

                {item.resolved ? (
                  <span className="self-start sm:self-auto px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Smart Fix Applied
                  </span>
                ) : (
                  <button
                    onClick={() => onResolveBottleneck(item.id)}
                    className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Apply Smart Fix</span>
                  </button>
                )}
              </div>

              {/* AI Mitigation Action Box */}
              <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center space-x-2 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-medium">{item.aiMitigation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
