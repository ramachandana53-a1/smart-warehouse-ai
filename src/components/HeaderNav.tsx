import React from 'react';
import { 
  Zap, 
  RotateCcw, 
  Presentation, 
  Package, 
  Bot, 
  Clock, 
  FileText,
  AlertTriangle,
  Sparkles,
  Truck,
  Brain
} from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'orders' | 'fulfillment' | 'decision-engine' | 'workers' | 'delays' | 'history';
  setActiveTab: (tab: 'orders' | 'fulfillment' | 'decision-engine' | 'workers' | 'delays' | 'history') => void;
  onTriggerConflict: () => void;
  onResetData: () => void;
  pitchMode: boolean;
  onTogglePitchMode: () => void;
  hasActiveConflict: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onTriggerConflict,
  onResetData,
  pitchMode,
  onTogglePitchMode,
  hasActiveConflict,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-2.5 md:py-0 md:h-16 gap-2">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">Smart Warehouse</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  Autonomous Operations
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                End-to-End Fulfillment Lifecycle, Autonomous Decision Engine & Exception Management
              </p>
            </div>
          </div>

          {/* Interactive Top Demo Controls */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* 1. Simulate Shortage */}
            <button
              id="demo-btn-trigger-conflict"
              onClick={onTriggerConflict}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                hasActiveConflict
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/60 animate-pulse'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 hover:border-amber-500/60'
              }`}
              title="Click to test what happens when we suddenly run low on an item that an urgent customer needs"
            >
              {hasActiveConflict ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Stock Shortage Active!</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                  <span>⚡ Test Stock Shortage</span>
                </>
              )}
            </button>

            {/* 2. Reset Demo Data */}
            <button
              id="demo-btn-reset-data"
              onClick={onResetData}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
              title="Reset all shelves, workers, and orders back to normal starting state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>🔄 Reset</span>
            </button>

            {/* 3. Pitch Mode Guide */}
            <button
              id="demo-btn-pitch-mode"
              onClick={onTogglePitchMode}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                pitchMode
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-indigo-500/30'
                  : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50'
              }`}
              title="Shows step-by-step guidance badges (1, 2, 3) to explain the platform to anyone"
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-400" />
              <span>🎤 Pitch Mode</span>
              {pitchMode && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
          {/* Tab 1: Orders */}
          <button
            id="tab-btn-orders"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders & Shelf Stock</span>
            {hasActiveConflict && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-1" />
            )}
          </button>

          {/* Tab 2: Lifecycle Stepper & Dispatch */}
          <button
            id="tab-btn-fulfillment"
            onClick={() => setActiveTab('fulfillment')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'fulfillment'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Fulfillment Lifecycle (9 Stages)</span>
          </button>

          {/* Tab 3: The Decision Engine (The Competitive Twist) */}
          <button
            id="tab-btn-decision-engine"
            onClick={() => setActiveTab('decision-engine')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'decision-engine'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Decision Engine (Competitive Twist)</span>
          </button>

          {/* Tab 4: Workers & Robots */}
          <button
            id="tab-btn-workers"
            onClick={() => setActiveTab('workers')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'workers'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Floor Staff & Rolling Robots</span>
          </button>

          {/* Tab 5: Delays & ROI */}
          <button
            id="tab-btn-delays"
            onClick={() => setActiveTab('delays')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'delays'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Work Delays & Time Saved</span>
          </button>

          {/* Tab 6: History */}
          <button
            id="tab-btn-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Decision Audit Log</span>
          </button>
        </div>
      </div>
    </header>
  );
};
