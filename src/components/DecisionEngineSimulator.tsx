import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Scale, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  TrendingUp,
  RefreshCw,
  Package,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Order, ProductInventory } from '../types';

interface DecisionEngineSimulatorProps {
  orders: Order[];
  products: ProductInventory[];
  onExecutePromptDilemma: () => void;
  onOpenConflictModal?: () => void;
  onExecuteDamagedException: () => void;
  onExecuteBottleneckBypass: () => void;
  onExecuteAutoReorder: () => void;
}

export const DecisionEngineSimulator: React.FC<DecisionEngineSimulatorProps> = ({
  orders,
  products,
  onExecutePromptDilemma,
  onOpenConflictModal,
  onExecuteDamagedException,
  onExecuteBottleneckBypass,
  onExecuteAutoReorder,
}) => {
  const [activeScenario, setActiveScenario] = useState<'prompt-dilemma' | 'damaged-item' | 'bottleneck' | 'auto-reorder'>('prompt-dilemma');

  const handleScenarioClick = (scenarioId: string) => {
    setActiveScenario(scenarioId as any);
    if (scenarioId === 'prompt-dilemma') {
      if (onOpenConflictModal) {
        onOpenConflictModal();
      } else {
        onExecutePromptDilemma();
      }
    } else if (scenarioId === 'damaged-item') {
      onExecuteDamagedException();
    } else if (scenarioId === 'bottleneck') {
      onExecuteBottleneckBypass();
    } else if (scenarioId === 'auto-reorder') {
      onExecuteAutoReorder();
    }
  };

  const scenarios = [
    {
      id: 'prompt-dilemma',
      title: '🔥 Critical Inventory Exception: 10 vs 7 Stock Allocation Conflict',
      shortTitle: 'Urgent Stock Conflict',
      badge: 'LIVE ALLOCATION CONFLICT',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: '📦',
      summary: 'Urgent VIP Order #101 requires 10 units, but only 7 are on shelf. Lower-priority Order #102 holds 5 units.',
    },
    {
      id: 'damaged-item',
      title: '⚠️ Damaged Item Exception During Pick',
      shortTitle: 'Damaged Item Swap',
      badge: 'Pick Exception Flow',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: '🛡️',
      summary: 'Bot-01 discovers 1 cracked sensor during picking at Shelf Row A (Electronics) (Shelf 7).',
    },
    {
      id: 'bottleneck',
      title: '⚡ Packing Station Tape Jam & Bottleneck Rebalance',
      shortTitle: 'Packing Jam Reroute',
      badge: 'Workload Balancing',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: '🏭',
      summary: 'Boxing Table #2 tape runout creates 12-minute delay queue for 5 outbound cartons.',
    },
    {
      id: 'auto-reorder',
      title: '🚨 Low-Stock Auto-Reorder & Supplier Replenishment',
      shortTitle: 'Safety Stock PO',
      badge: 'Inventory Safety Engine',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: '📡',
      summary: 'Wireless Smart Sensors fall to 5 units, breaking 6-unit safety buffer threshold.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Explaining the Competitive Twist & Decision Philosophy */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 border border-purple-900/50 rounded-2xl p-5 shadow-xl text-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Autonomous Decision-Making Engine</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">Exception ➔ Decision ➔ Resolution</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Autonomous Operational Decision-Making System
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              This system does not just display static warehouse telemetry — it autonomously evaluates complex tradeoffs, resolves conflicting priorities, handles exceptions, and recommends optimal operational actions in real time.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="text-lg font-black text-purple-400">100%</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Zero Late Fees</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="text-lg font-black text-emerald-400">&lt; 0.2s</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Decision Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Tabs Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((sc) => {
          const isSelected = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleScenarioClick(sc.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/15 ring-1 ring-purple-400'
                  : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-purple-500/50'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{sc.icon}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">{sc.shortTitle}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {sc.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-purple-300 font-semibold group-hover:text-purple-200">
                <span className="underline decoration-purple-400/50 underline-offset-2">View Decision Flow</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detailed Decision Architecture */}
      {activeScenario === 'prompt-dilemma' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                CRITICAL INVENTORY EXCEPTION
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Urgent Order Needs 10 Units, Only 7 Available; Lower-Priority Order Holds 5 Units
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates client SLA commitments, late delivery penalties, and scheduled supplier deliveries.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenConflictModal ? onOpenConflictModal() : onExecutePromptDilemma()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-600/25 transition-all transform hover:scale-[1.02] active:scale-95 shrink-0"
              >
                <Brain className="w-4 h-4 text-white" />
                <span>Open AI Resolution Modal</span>
              </button>

              <button
                onClick={onExecutePromptDilemma}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95 shrink-0"
              >
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Execute Smart Reallocation</span>
              </button>
            </div>
          </div>

          {/* 3-Step Decision Flow: Exception -> Evaluated Options -> AI Decision & Outcome */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Step 1: The Exception Encountered */}
            <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">1. The Exception</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-400">VIP Order #101: Apex Robotics (VIP Account - Priority SLA)</strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">VIP Tier</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Requires <strong>10 units</strong> of HD Security Cameras. Deadline in <strong>1h 45m</strong>.
                  </p>
                  <p className="text-rose-400 text-[10px] font-bold">
                    Risk: $850 SLA Penalty + Contract Breach
                  </p>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-300">Shelf Stock & Rahul Sharma (#102)</strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Standard</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Only <strong>7 units</strong> currently on shelf. Order #102 holds <strong>5 units</strong> (deadline in 22h).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Evaluated Alternatives & Tradeoffs */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-blue-400">
                <Scale className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">2. Tradeoffs Evaluated</h4>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800 text-slate-400 space-y-0.5">
                  <strong className="text-rose-400">Option A: Delay Urgent VIP Order</strong>
                  <p>Wait for tomorrow morning supplier shipment.</p>
                  <span className="text-[10px] text-rose-400 font-bold">❌ Cost: -$850 late penalty, angry VIP client</span>
                </div>

                <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800 text-slate-400 space-y-0.5">
                  <strong className="text-rose-400">Option B: Cancel Rahul Sharma Order #102</strong>
                  <p>Reject regular customer order.</p>
                  <span className="text-[10px] text-rose-400 font-bold">❌ Cost: -$4,230 lost revenue</span>
                </div>

                <div className="p-2 bg-blue-950/40 rounded-lg border border-blue-500/50 text-blue-200 space-y-0.5">
                  <strong className="text-emerald-400">Option C: Autonomous Reallocation (AI Pick)</strong>
                  <p>Borrow 3 units from #102 (22h left); restock #102 via 2:00 PM supplier delivery.</p>
                  <span className="text-[10px] text-emerald-300 font-bold">✓ Cost: $0 penalty, 100% on-time delivery</span>
                </div>
              </div>
            </div>

            {/* Step 3: Autonomous Resolution & Impact */}
            <div className="bg-slate-950 border border-emerald-900/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">3. AI Decision & Resolution</h4>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1 text-[11px]">
                  <strong className="text-emerald-300 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Resolution Enacted:</span>
                  </strong>
                  <p className="leading-relaxed">
                    1. Reallocate 3 units from Rahul Sharma (#102) to Apex Robotics (VIP Order #101) immediately.<br />
                    2. Order #101 status updated to <strong>Allocated</strong> (Dispatches in 45 min).<br />
                    3. Order #102 assigned to 2:00 PM intake batch (Dispatches on-time at 5:00 PM).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-xs font-bold text-emerald-400">$850 Saved</div>
                    <span className="text-slate-400">Late Penalty</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-xs font-bold text-cyan-400">0 Delay</div>
                    <span className="text-slate-400">Both Clients On Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scenario 2: Damaged / Missing Item Pick Exception */}
      {activeScenario === 'damaged-item' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                Exception Handling Workflow
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Damaged Item Detected During Pick & Instant Reserve Bay Swap
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically quarantines damaged unit, logs supplier RMA, and retrieves backup unit from Reserve Bay R-04.
              </p>
            </div>

            <button
              onClick={onExecuteDamagedException}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-rose-600/25 transition-all transform hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Simulate Damaged Item Swap</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>1. Incident Detected</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Picker Bot-01 scans Wireless Smart Sensor at Shelf Row A (Electronics) (Shelf 7) and detects <strong>1 unit with a cracked optical lens</strong>.
              </p>
              <div className="p-2 bg-slate-900 rounded-lg text-[11px] text-rose-300 border border-slate-800 font-mono">
                FLAG: DEFECT_LENS_CRACKED (SKU-LID-360)
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-1.5">
                <Brain className="w-4 h-4" />
                <span>2. AI Tradeoff Analysis</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                System checks Reserve Locations: <strong>Reserve Bay R-04</strong> has 4 pristine backup units.
              </p>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                <li>Zero picker idle time (+30 sec detour)</li>
                <li>Defective unit marked in quarantine (Bin Q-01)</li>
                <li>Supplier defect claim auto-generated (RMA #4091)</li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-emerald-900/40 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>3. Autonomous Resolution</span>
              </h4>
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs space-y-1 text-slate-300">
                <strong className="text-emerald-300">Priya Patel (Order #103) Protected:</strong>
                <p className="text-[11px]">
                  Bot-01 grabs backup unit from Reserve Bay R-04. Order proceeds to Packing Table 2 on-time. Defective unit credit of $620 logged.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scenario 3: Packing Station Bottleneck */}
      {activeScenario === 'bottleneck' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
                Workload Optimization
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Packing Station Jam & Autonomous Multi-Bot Detour
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Detects queuing bottleneck at Table 2 and distributes workload to idle Table 4.
              </p>
            </div>

            <button
              onClick={onExecuteBottleneckBypass}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-600/25 transition-all transform hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>Execute Bottleneck Reroute</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">1. Live Bottleneck</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Boxing Table #2 tape roll ran out. 5 boxes waiting with an estimated queue delay of <strong>12 minutes</strong>.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">2. Real-Time Rebalancing</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                AI reassigns 4 boxes in transit directly to <strong>Boxing Table #4</strong> which has an active packer and 0 queue.
              </p>
            </div>

            <div className="bg-slate-950 border border-emerald-900/40 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">3. Operational Outcome</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Eliminated 12 minutes of worker idle delay and kept outbound FedEx dispatch truck on exact departure schedule.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scenario 4: Auto-Reorder & Safety Stock */}
      {activeScenario === 'auto-reorder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                Replenishment Automation
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Low-Stock Detection & Automated Supplier Purchase Order
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically calculates lead times, safety thresholds, and optimal batch reorder quantities.
              </p>
            </div>

            <button
              onClick={onExecuteAutoReorder}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all transform hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Approve Restock PO-8821</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">1. Safety Buffer Breach</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Wireless Smart Sensors drop to <strong>5 units</strong> (Safety Threshold: 6 units). System flags incoming stockout risk.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">2. Supplier Lead Time Engine</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Supplier <em>Photonics Sensor Tech</em> lead time is <strong>3 business days</strong>. Recommended batch: <strong>25 units</strong> ($10,250 total).
              </p>
            </div>

            <div className="bg-slate-950 border border-emerald-900/40 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">3. Continuous Fulfillment</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                PO generated and sent with 1 click. Stock arrival scheduled prior to safety buffer exhaustion, guaranteeing 0 days of downtime.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
