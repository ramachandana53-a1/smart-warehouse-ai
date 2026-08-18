import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Barcode, 
  AlertCircle,
  Eye,
  Check,
  ChevronRight,
  Send,
  Printer,
  Search,
  Filter
} from 'lucide-react';
import { Order, ProductInventory } from '../types';

interface OrderFulfillmentLifecycleViewProps {
  orders: Order[];
  onAdvanceOrderStage: (orderId: string) => void;
  onRunQualityCheck: (orderId: string, passed: boolean, notes: string) => void;
  onDispatchOrder: (orderId: string, carrier: string, gate: string) => void;
  onOpenDamagedModal: (order: Order) => void;
}

export const LIFECYCLE_STAGES = [
  { id: 0, key: 'created', name: '1. Order Created', icon: '📝', desc: 'Received from customer ERP/Store' },
  { id: 1, key: 'prioritized', name: '2. Priority Determined', icon: '⚡', desc: 'VIP status, SLA deadline & value calculated' },
  { id: 2, key: 'checked', name: '3. Inventory Checked', icon: '🔍', desc: 'Shelf bins & stock levels verified' },
  { id: 3, key: 'allocated', name: '4. Stock Allocated', icon: '🔒', desc: 'Stock reserved & route generated' },
  { id: 4, key: 'picking', name: '5. Picking from Shelves', icon: '👷', desc: 'Assigned to picker/bot via shortest path' },
  { id: 5, key: 'packing', name: '6. Packing & Boxing', icon: '📦', desc: 'Items verified, boxed, and sealed' },
  { id: 6, key: 'quality_check', name: '7. Quality Check (QC)', icon: '🛡️', desc: 'Barcode matched & damage inspection' },
  { id: 7, key: 'dispatched', name: '8. Dispatched & In Transit', icon: '🚚', desc: 'Courier loaded & tracking generated' },
  { id: 8, key: 'inventory_updated', name: '9. Inventory Updated', icon: '📊', desc: 'Bin counts deducted & analytics logged' },
];

export const OrderFulfillmentLifecycleView: React.FC<OrderFulfillmentLifecycleViewProps> = ({
  orders,
  onAdvanceOrderStage,
  onRunQualityCheck,
  onDispatchOrder,
  onOpenDamagedModal,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '#101');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [qcNotesInput, setQcNotesInput] = useState('Barcode scans matched 100%. Protective packaging verified.');
  const [selectedCarrier, setSelectedCarrier] = useState('FedEx Priority Overnight');
  const [selectedGate, setSelectedGate] = useState('Gate #3 (FedEx Air Express)');

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStage === 'all') return matchesSearch;
    if (filterStage === 'allocated') return matchesSearch && o.currentStageIndex <= 3;
    if (filterStage === 'picking') return matchesSearch && o.currentStageIndex === 4;
    if (filterStage === 'packing') return matchesSearch && o.currentStageIndex === 5;
    if (filterStage === 'qc') return matchesSearch && o.currentStageIndex === 6;
    if (filterStage === 'dispatched') return matchesSearch && o.currentStageIndex >= 7;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Explaining the Complete End-to-End Fulfillment Lifecycle */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-200 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                Full Fulfillment Lifecycle
              </span>
              <span className="text-xs text-slate-400">9-Step Autonomous Progression</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Order Fulfillment Lifecycle & Dispatch Tracking
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Every customer order progresses through strict, transparent steps: from initial creation and AI urgency calculation, to picking, packing, quality check, courier dispatch, and automated inventory sync.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="text-lg font-black text-emerald-400">
                {orders.filter((o) => o.currentStageIndex >= 7).length} / {orders.length}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Dispatched Today</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="text-lg font-black text-cyan-400">99.94%</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">QC Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Order Selector, Right Column Interactive Lifecycle Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Orders Queue List */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-400" />
              <span>Select Order to Track</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {filteredOrders.length} orders
            </span>
          </div>

          {/* Search and Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search order # or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'allocated', label: 'Allocated' },
                { id: 'picking', label: 'Picking' },
                { id: 'packing', label: 'Packing' },
                { id: 'qc', label: 'Quality Check' },
                { id: 'dispatched', label: 'Dispatched' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStage(tab.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                    filterStage === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Scrollable List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              const currentStage = LIFECYCLE_STAGES[order.currentStageIndex] || LIFECYCLE_STAGES[0];

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-white">{order.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          order.tier === 'VIP'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : order.tier === 'Express'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {order.tier}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400">
                      ${order.totalValue.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium truncate mt-1">
                    {order.clientName}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <span>{currentStage.icon}</span>
                      <span className="font-semibold text-slate-200">{currentStage.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Order Detailed Lifecycle Visualizer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card for Active Order */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-white">{activeOrder.id}</h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      activeOrder.tier === 'VIP'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {activeOrder.tier} Tier Customer
                  </span>
                  <span className="text-xs text-slate-400">
                    Urgency Score: <strong className="text-amber-400">{activeOrder.priorityScore.total} pts</strong>
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-200 mt-1">{activeOrder.clientName}</p>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Deadline: {activeOrder.deadlineText}</span>
                </div>
              </div>

              {/* Action Buttons for Current Lifecycle Stage */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onOpenDamagedModal(activeOrder)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
                  title="Report damaged or missing item during picking/packing"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Report Damaged Item</span>
                </button>

                {activeOrder.currentStageIndex < 8 && (
                  <button
                    onClick={() => onAdvanceOrderStage(activeOrder.id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.02] active:scale-95"
                  >
                    <span>Advance to Next Stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 9-Stage Visual Progress Bar */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-300">Live Lifecycle Progression</span>
                <span className="text-blue-400 font-bold">
                  Step {activeOrder.currentStageIndex + 1} of 9 (
                  {Math.round(((activeOrder.currentStageIndex + 1) / 9) * 100)}%)
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full transition-all duration-300"
                  style={{
                    width: `${((activeOrder.currentStageIndex + 1) / 9) * 100}%`,
                  }}
                />
              </div>

              {/* Interactive Stage Stepper Badges */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 pt-2">
                {LIFECYCLE_STAGES.map((stage) => {
                  const isCompleted = activeOrder.currentStageIndex > stage.id;
                  const isCurrent = activeOrder.currentStageIndex === stage.id;

                  return (
                    <div
                      key={stage.id}
                      className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isCurrent
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                          : isCompleted
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="text-base mb-1">
                        {isCompleted ? '✅' : stage.icon}
                      </div>
                      <span className="text-[10px] font-bold leading-tight">
                        {stage.name.split('. ')[1] || stage.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Action Control Center per Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Items Manifest & Verification */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Barcode className="w-4 h-4 text-blue-400" />
                  <span>Items Manifest & Pick Verification</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  {activeOrder.items.length} product(s)
                </span>
              </div>

              <div className="space-y-2">
                {activeOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {item.sku}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Qty: <strong className="text-white">{item.quantity} units</strong> • Unit Price: ${item.unitPrice}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          activeOrder.currentStageIndex >= 4
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {activeOrder.currentStageIndex >= 4 ? '✓ Picked' : 'Pending Pick'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Assigned Picker/Bot:</span>
                  <strong className="text-slate-200">{activeOrder.assignedTo}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Assigned Boxing Table:</span>
                  <strong className="text-slate-200">{activeOrder.packingTable || 'Boxing Table 1'}</strong>
                </div>
              </div>
            </div>

            {/* Box 2: Quality Check (QC) & Outbound Dispatch */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Quality Check (QC) & Dispatch Gateway</span>
                </h4>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeOrder.currentStageIndex >= 7
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : activeOrder.currentStageIndex === 6
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {activeOrder.currentStageIndex >= 7 ? 'Dispatched' : activeOrder.currentStageIndex === 6 ? 'Ready for QC Inspection' : 'Awaiting QC'}
                </span>
              </div>

              {/* Stage 6 & 7 Interactive Workflow */}
              {activeOrder.currentStageIndex >= 6 ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">QC Status:</span>
                      <span className="text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Quality Inspection Passed (100% Match)</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                      {activeOrder.qualityNotes || 'Barcode verification matched 100%. Protective packing inspected and certified.'}
                    </div>
                  </div>

                  {/* Dispatch Details */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Courier Carrier:</span>
                      <strong className="text-white">{activeOrder.shippingCarrier || 'FedEx Priority Overnight'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Outbound Truck Gate:</span>
                      <strong className="text-cyan-400">{activeOrder.dispatchGate || 'Gate #3 (Air Express)'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Live Tracking #:</span>
                      <span className="font-mono text-indigo-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {activeOrder.trackingNumber || `FDX-${Math.floor(100000000 + Math.random() * 900000000)}`}
                      </span>
                    </div>
                  </div>

                  {activeOrder.currentStageIndex === 6 && (
                    <button
                      onClick={() => onDispatchOrder(activeOrder.id, selectedCarrier, selectedGate)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Confirm Courier Pickup & Dispatch</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-2">
                  <Clock className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300 font-semibold">
                    Currently in Stage: {LIFECYCLE_STAGES[activeOrder.currentStageIndex]?.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Advance the order to Stage 6 & 7 to trigger automated Quality Inspection and Outbound Courier Dispatch.
                  </p>
                  <button
                    onClick={() => onAdvanceOrderStage(activeOrder.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Advance to Next Stage ➔
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
