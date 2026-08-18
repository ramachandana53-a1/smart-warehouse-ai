import React from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Truck, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ProductInventory, ReorderPurchaseOrder } from '../types';

interface AutoReorderPanelProps {
  products: ProductInventory[];
  purchaseOrders: ReorderPurchaseOrder[];
  onApprovePO: (poId: string) => void;
  onTriggerInstantPO: (productId: string) => void;
}

export const AutoReorderPanel: React.FC<AutoReorderPanelProps> = ({
  products,
  purchaseOrders,
  onApprovePO,
  onTriggerInstantPO,
}) => {
  const lowStockProducts = products.filter((p) => p.totalStock <= p.safetyThreshold);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Low-Stock Detection & Supplier Auto-Replenishment</span>
              {lowStockProducts.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {lowStockProducts.length} Needs Restock
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Continuously monitors safety buffer thresholds and auto-generates supplier purchase orders.
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Lead Time Buffer: <strong className="text-emerald-400">100% Guaranteed</strong>
        </span>
      </div>

      {/* Low Stock Items Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {products.map((product) => {
          const isLowStock = product.totalStock <= product.safetyThreshold;
          const po = purchaseOrders.find((p) => p.sku === product.sku);

          return (
            <div
              key={product.id}
              className={`p-4 rounded-xl border transition-all space-y-2 ${
                isLowStock
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-md shadow-rose-950/30'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{product.imageEmoji}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{product.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{product.sku}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-white">
                    <span className={isLowStock ? 'text-rose-400' : 'text-emerald-400'}>
                      {product.totalStock} units
                    </span>
                    <span className="text-slate-500 text-[10px]"> / min {product.safetyThreshold}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isLowStock
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isLowStock ? '🚨 Low Stock' : '✓ Healthy Stock'}
                  </span>
                </div>
              </div>

              {/* Supplier and Lead Time Info */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="flex items-center space-x-1 truncate max-w-[200px]">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  <span>{product.supplierName}</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-300">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  <span>Lead Time: <strong>{product.leadTimeDays} days</strong></span>
                </span>
              </div>

              {/* Action */}
              {isLowStock && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-amber-300 font-semibold">
                    ⚡ Auto-PO ({product.reorderQuantity} units @ ${product.unitPrice * 0.65} cost)
                  </span>
                  {po ? (
                    <button
                      onClick={() => onApprovePO(po.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1 ${
                        po.status === 'Approved & Sent'
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
                      }`}
                    >
                      {po.status === 'Approved & Sent' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PO Sent & In Transit</span>
                        </>
                      ) : (
                        <>
                          <Truck className="w-3.5 h-3.5" />
                          <span>Approve Restock PO</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => onTriggerInstantPO(product.id)}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      Generate Restock PO
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
