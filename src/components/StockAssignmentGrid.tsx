import React from 'react';
import { MapPin, AlertCircle, CheckCircle2, Plus, Minus, PackageCheck, Layers, Building2 } from 'lucide-react';
import { ProductInventory } from '../types';

interface StockAssignmentGridProps {
  products: ProductInventory[];
  onUpdateStock: (productId: string, delta: number) => void;
}

export const StockAssignmentGrid: React.FC<StockAssignmentGridProps> = ({
  products,
  onUpdateStock,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Items on Warehouse Shelves (Aisles A & B)
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
              4 Main Products
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Live inventory counts tracking shelf stock, reserved allocations, reserve buffer bays, and safety replenishment thresholds.
          </p>
        </div>
        <div className="text-xs text-slate-400 flex items-center space-x-3">
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" /> Healthy Stock</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5" /> High Allocation</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-400 mr-1.5" /> Below Safety Threshold</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {products.map((product) => {
          const available = Math.max(0, product.totalStock - product.reservedStock);
          const percentAvailable = product.totalStock > 0 
            ? Math.round((available / product.totalStock) * 100) 
            : 0;
          const isCritical = product.totalStock <= product.safetyThreshold;

          return (
            <div
              key={product.id}
              className={`p-4 rounded-xl bg-slate-950 border transition-all duration-200 ${
                isCritical
                  ? 'border-rose-500/50 shadow-lg shadow-rose-950/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Product Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl" role="img" aria-label={product.name}>
                    {product.imageEmoji}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">{product.name}</h3>
                    <p className="text-[11px] text-slate-400">{product.category}</p>
                  </div>
                </div>
                {isCritical ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Low Stock
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                  </span>
                )}
              </div>

              {/* Bay Location & Reserve Location */}
              <div className="mt-3 flex flex-col space-y-1 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 mr-1 shrink-0" />
                    <strong className="text-slate-300">{product.location}</strong>
                  </span>
                  <span className="text-[11px] text-slate-400">${product.unitPrice}/ea</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center text-slate-500">
                    <Layers className="w-3 h-3 text-purple-400 mr-1 shrink-0" />
                    <span>Reserve: <strong className="text-slate-300">{product.reserveLocation || 'Bay R-01'}</strong></span>
                  </span>
                  <span className="text-slate-500">Min: {product.safetyThreshold} units</span>
                </div>
              </div>

              {/* Stock Numbers */}
              <div className="mt-3.5 grid grid-cols-3 gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">On Shelf</span>
                  <span className="text-sm font-bold text-white">{product.totalStock}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Promised</span>
                  <span className="text-sm font-bold text-amber-400">{product.reservedStock}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Free Left</span>
                  <span className={`text-sm font-bold ${available <= 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {available}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Available Buffer</span>
                  <span>{percentAvailable}% available</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCritical
                        ? 'bg-rose-500'
                        : percentAvailable < 30
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, percentAvailable))}%` }}
                  />
                </div>
              </div>

              {/* Quick Adjustment Controls */}
              <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">Change shelf count:</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onUpdateStock(product.id, -1)}
                    disabled={product.totalStock <= 0}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                    title="Take 1 item away"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onUpdateStock(product.id, 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Put 1 item on shelf"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
