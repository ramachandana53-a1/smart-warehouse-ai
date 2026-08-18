import React from 'react';
import { Presentation, ArrowRight, ArrowLeft, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface PitchModeOverlayProps {
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSelectStep: (step: number) => void;
  onClose: () => void;
}

export const PitchModeOverlay: React.FC<PitchModeOverlayProps> = ({
  currentStep,
  onNextStep,
  onPrevStep,
  onSelectStep,
  onClose,
}) => {
  const steps = [
    {
      num: 1,
      title: 'Dynamic Urgency Scoring & Order Prioritization',
      summary: 'Orders are automatically ranked by an urgency score: VIP Client (+50 pts) + Urgent SLA (+35 pts) + High Value (+20 pts). Click the (i) badge on any order to see the full point breakdown.',
      targetTab: 'orders',
    },
    {
      num: 2,
      title: 'Autonomous Stock Tradeoff & Exception Decision-Making',
      summary: 'When urgent VIP order #101 (Apex Robotics) needs 10 units with only 7 on shelf, the AI borrows 3 units from flexible order #102 (Rahul Sharma), which is restocked by the 2:00 PM supplier delivery with $0 late penalties!',
      targetTab: 'decision-engine',
    },
    {
      num: 3,
      title: 'Damaged / Missing Item Exception Handling',
      summary: 'When a picker finds a damaged item in a bin, the system instantly quarantines it to Bin Q-01, auto-retrieves a pristine replacement from Reserve Bay R-04, and logs a supplier RMA ticket.',
      targetTab: 'decision-engine',
    },
    {
      num: 4,
      title: 'Full 9-Stage Fulfillment Lifecycle & Courier Dispatch',
      summary: 'Order Created ➔ Priority Determined ➔ Inventory Checked ➔ Stock Allocated ➔ Picking ➔ Packing ➔ Quality Check ➔ Dispatch ➔ Inventory Updated with live FedEx/DHL tracking and gate routing.',
      targetTab: 'fulfillment',
    },
    {
      num: 5,
      title: 'ROI Analytics & Bottleneck Identification',
      summary: 'Live analytics dashboard showing $1,850 in late delivery penalty fees saved today, 3.2 hours of walking time saved, and 1-click bottleneck bypass resolutions.',
      targetTab: 'delays',
    },
  ];

  const currentInfo = steps[currentStep - 1] || steps[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900/95 backdrop-blur-md border-2 border-indigo-500 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-indigo-950/80 text-slate-100 ring-2 ring-indigo-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-600/30">
              {currentStep}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Guided Operations Tour (Step {currentStep} of {steps.length})</span>
              </span>
              <h4 className="text-sm font-bold text-white">{currentInfo.title}</h4>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Presentation Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          {currentInfo.summary}
        </p>

        {/* Step Indicator Tabs & Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => onSelectStep(s.num)}
                className={`w-7 h-7 rounded-lg font-bold text-xs transition-all ${
                  currentStep === s.num
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {s.num}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevStep}
              disabled={currentStep === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors flex items-center space-x-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              onClick={onNextStep}
              disabled={currentStep === steps.length}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center space-x-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
