import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Search,
  Package
} from 'lucide-react';
import { Order, ProductInventory } from '../types';

interface DamagedItemExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  products: ProductInventory[];
  onResolveDamagedItem: (data: {
    orderId: string;
    productSku: string;
    productName: string;
    issueType: 'Cracked / Defective' | 'Missing from Shelf' | 'Packaging Torn';
    reserveLocation: string;
    actionTaken: string;
  }) => void;
}

export const DamagedItemExceptionModal: React.FC<DamagedItemExceptionModalProps> = ({
  isOpen,
  onClose,
  order,
  products,
  onResolveDamagedItem,
}) => {
  const [selectedSku, setSelectedSku] = useState<string>(order?.items[0]?.sku || 'SKU-OPT-CAM');
  const [issueType, setIssueType] = useState<'Cracked / Defective' | 'Missing from Shelf' | 'Packaging Torn'>('Cracked / Defective');
  const [isResolved, setIsResolved] = useState(false);

  if (!isOpen || !order) return null;

  const currentProduct = products.find((p) => p.sku === selectedSku) || products[0];
  const orderItem = order.items.find((i) => i.sku === selectedSku) || order.items[0];

  const handleConfirmResolution = () => {
    onResolveDamagedItem({
      orderId: order.id,
      productSku: currentProduct.sku,
      productName: currentProduct.name,
      issueType,
      reserveLocation: currentProduct.reserveLocation || 'Reserve Bay R-01',
      actionTaken: `Quarantined damaged unit in Bin Q-01. Automatically retrieved pristine unit from ${currentProduct.reserveLocation || 'Reserve Bay R-01'}. Dispatched RMA claim to ${currentProduct.supplierName}.`,
    });
    setIsResolved(true);
    setTimeout(() => {
      setIsResolved(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-600/70 rounded-2xl max-w-xl w-full p-6 shadow-2xl shadow-rose-950/50 text-slate-100 ring-2 ring-rose-500/20 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Exception Handling Workflow
              </span>
              <h3 className="text-base font-bold text-white">
                Report Damaged / Missing Item (Order {order.id})
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isResolved ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white">Damaged Item Resolved Autonomously!</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Defective unit quarantined to Bin Q-01. Replacement item successfully retrieved from {currentProduct.reserveLocation}. Order {order.id} will dispatch on schedule with 0 delay.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Step 1: Select Item and Issue */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Select Affected Item from Order:
                </label>
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  {order.items.map((item) => (
                    <option key={item.sku} value={item.sku}>
                      {item.name} ({item.sku}) - Qty: {item.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Defect / Exception Type:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cracked / Defective', 'Missing from Shelf', 'Packaging Torn'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIssueType(type)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        issueType === type
                          ? 'bg-rose-950/60 border-rose-500 text-white shadow-md ring-1 ring-rose-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: AI Autonomous Decision Preview */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  AI Decision & Auto-Resolution Strategy:
                </span>
              </div>
              <ul className="text-slate-300 text-[11px] space-y-1.5 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-white">Instant Reserve Bay Swap:</strong> Locate pristine unit in <strong>{currentProduct.reserveLocation || 'Reserve Bay R-01'}</strong> (4 units available).
                </li>
                <li>
                  <strong className="text-white">Defect Quarantine:</strong> Flag defective unit in warehouse ERP to Bin Q-01 for quality inspection.
                </li>
                <li>
                  <strong className="text-white">Supplier RMA Note:</strong> Auto-credit ticket of ${currentProduct.unitPrice} generated for {currentProduct.supplierName}.
                </li>
                <li>
                  <strong className="text-emerald-400">Customer Impact:</strong> $0 late fee, 0 minutes delivery delay.
                </li>
              </ul>
            </div>

            {/* Footer Action */}
            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResolution}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-600/30 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Execute Auto-Resolution & Swap Unit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
