import React from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  X,
  Zap,
  Split
} from 'lucide-react';
import { Order, ProductInventory } from '../types';

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResolution: () => void;
  onSplitShipment: () => void;
  order101: Order;
  order102: Order;
  product: ProductInventory;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen,
  onClose,
  onApplyResolution,
  onSplitShipment,
  order101,
  order102,
  product,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-500/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 relative overflow-hidden ring-4 ring-rose-500/20">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-white">
                  Not Enough Items in Stock for Urgent Order
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                  Needs Decision
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Item in question: <strong className="text-white">{product.name}</strong> (Only 1 free on shelf, but urgent customer needs 4)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Recommendation Box (Prominent) */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-purple-950/80 border border-indigo-500/50 shadow-inner">
          <div className="flex items-center space-x-2 text-indigo-300 mb-1.5 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Smart Recommendation</span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            &ldquo;AI Recommendation: Reallocate 3 units from Rahul Sharma (Standard Order #102) to Apex Robotics (VIP Order #101) because Order #101 has an express delivery deadline in 2 hours.&rdquo;
          </p>
          <p className="text-xs text-slate-300 mt-2 font-normal">
            Why this works: Rahul Sharma's order does not need to ship until tomorrow (22 hours left), and a new delivery truck arrives at Gate #3 in 3 hours. Both customers get their items on time with zero penalties!
          </p>
        </div>

        {/* Comparison of the Two Orders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4 text-xs">
          {/* Order 101 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/40">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-amber-300">Order #101 (Apex Robotics)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                VIP SLA
              </span>
            </div>
            <div className="mt-2 space-y-1.5 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Deadline:</span>
                <span className="font-semibold text-rose-300 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> In 1 hour 45 min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Needs:</span>
                <span className="font-bold text-white">4x {product.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Late Penalty:</span>
                <span className="font-bold text-rose-400">$850 penalty fee if late</span>
              </div>
            </div>
          </div>

          {/* Order 102 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-slate-200">Order #102 (Rahul Sharma)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                Standard Express
              </span>
            </div>
            <div className="mt-2 space-y-1.5 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Deadline:</span>
                <span className="font-semibold text-slate-300 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Tomorrow (22 hrs left)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Has on shelf:</span>
                <span className="font-bold text-slate-200">3x {product.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Restock plan:</span>
                <span className="font-bold text-emerald-400">Truck arrives at 2:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onSplitShipment}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center space-x-1.5"
          >
            <Split className="w-3.5 h-3.5 text-blue-400" />
            <span>Split Shipment (1 Now, 3 Later)</span>
          </button>

          <button
            id="btn-confirm-apply-resolution"
            onClick={onApplyResolution}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Apply AI Fix (Borrow 3 Units for VIP Order #101)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
