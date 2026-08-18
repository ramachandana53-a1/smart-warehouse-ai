import React, { useState } from 'react';
import { 
  Flame, 
  Bot, 
  Truck, 
  Zap, 
  TrendingUp, 
  AlertOctagon, 
  Loader2 
} from 'lucide-react';

interface EmergencySimulatorPanelProps {
  onSimulatePeakRush: () => void;
  onSimulateRobotBreakdown: () => void;
  onSimulateRestock: () => void;
}

export const EmergencySimulatorPanel: React.FC<EmergencySimulatorPanelProps> = ({
  onSimulatePeakRush,
  onSimulateRobotBreakdown,
  onSimulateRestock,
}) => {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  const handleRunSim = (type: string, callback: () => void) => {
    setActiveSimulation(type);
    callback();
    setTimeout(() => {
      setActiveSimulation(null);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Test What Happens in Warehouse Surprises</h3>
            <p className="text-[11px] text-slate-400">See how our smart AI immediately adapts when things get busy or equipment stops</p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
          Try It Out
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {/* 1. Peak Rush */}
        <button
          id="btn-sim-peak-rush"
          onClick={() => handleRunSim('rush', onSimulatePeakRush)}
          disabled={activeSimulation !== null}
          className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all group relative overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            {activeSimulation === 'rush' ? (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <span className="text-[10px] text-slate-500 group-hover:text-amber-300 font-semibold">
                Test ➔
              </span>
            )}
          </div>
          <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
            Simulate Sudden Rush (10 Urgent Orders)
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Adds 10 urgent VIP packages at once and automatically rearranges who packs what first.
          </p>
        </button>

        {/* 2. Robot Breakdown */}
        <button
          id="btn-sim-robot-breakdown"
          onClick={() => handleRunSim('breakdown', onSimulateRobotBreakdown)}
          disabled={activeSimulation !== null}
          className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 text-left transition-all group relative overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30">
              <AlertOctagon className="w-4 h-4" />
            </div>
            {activeSimulation === 'breakdown' ? (
              <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
            ) : (
              <span className="text-[10px] text-slate-500 group-hover:text-rose-300 font-semibold">
                Test ➔
              </span>
            )}
          </div>
          <h4 className="font-bold text-xs text-white group-hover:text-rose-300 transition-colors">
            Simulate Rolling Robot Getting Stuck
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Stops Bot-01 in Aisle B and automatically tells human staff to pick items without slowing down.
          </p>
        </button>

        {/* 3. Inbound Restock */}
        <button
          id="btn-sim-restock"
          onClick={() => handleRunSim('restock', onSimulateRestock)}
          disabled={activeSimulation !== null}
          className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group relative overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Truck className="w-4 h-4" />
            </div>
            {activeSimulation === 'restock' ? (
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            ) : (
              <span className="text-[10px] text-slate-500 group-hover:text-emerald-300 font-semibold">
                Test ➔
              </span>
            )}
          </div>
          <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">
            Simulate Delivery Truck Restocking Shelves
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Truck Gate #3 unloads +20 fresh 4K Drone Cameras and clears out all low-stock warnings.
          </p>
        </button>
      </div>
    </div>
  );
};
