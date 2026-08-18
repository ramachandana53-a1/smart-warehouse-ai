import React, { useState } from 'react';
import { 
  Info, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Search, 
  User, 
  Bot, 
  ChevronDown,
  ChevronUp,
  PackageCheck
} from 'lucide-react';
import { Order } from '../types';

interface OrderQueueTableProps {
  orders: Order[];
  onOpenConflictModal: () => void;
  onSelectOrder: (order: Order) => void;
  selectedOrderId?: string;
  hasActiveConflict: boolean;
}

export const OrderQueueTable: React.FC<OrderQueueTableProps> = ({
  orders,
  onOpenConflictModal,
  onSelectOrder,
  selectedOrderId,
  hasActiveConflict,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterTier === 'ALL') return matchesSearch;
    if (filterTier === 'VIP') return matchesSearch && order.tier === 'VIP';
    if (filterTier === 'STANDARD') return matchesSearch && order.tier === 'Standard';
    if (filterTier === 'CONFLICT') return matchesSearch && order.status === 'Stock Conflict';
    return matchesSearch;
  });

  return (
    <div id="order-queue-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Orders sorted by Urgency (VIP Client + Express Delivery Deadline)
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {filteredOrders.length} In Line
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Orders are automatically ranked so the most urgent customer packages are packed and shipped first.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer, item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'ALL', label: 'All Orders' },
              { id: 'VIP', label: 'VIP Urgent' },
              { id: 'STANDARD', label: 'Regular' },
              { id: 'CONFLICT', label: '⚠️ Needs Stock Fix' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTier(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  filterTier === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Order & Customer</th>
              <th className="py-3 px-3">Items in Box</th>
              <th className="py-3 px-3">Total Value</th>
              <th className="py-3 px-3">Must Arrive By</th>
              <th className="py-3 px-3">Urgency Score (Why It&apos;s First)</th>
              <th className="py-3 px-3">Current Stage</th>
              <th className="py-3 px-3">Who Is Grabbing It</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredOrders.map((order) => {
              const isSelected = selectedOrderId === order.id;
              const isExpanded = expandedOrderId === order.id;
              const isConflict = order.status === 'Stock Conflict';

              return (
                <React.Fragment key={order.id}>
                  <tr
                    className={`transition-colors hover:bg-slate-800/40 cursor-pointer ${
                      isSelected ? 'bg-blue-950/40' : ''
                    } ${isConflict ? 'bg-rose-950/20' : ''}`}
                    onClick={() => onSelectOrder(order)}
                  >
                    {/* Order ID & Client */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{order.id}</span>
                        {order.tier === 'VIP' ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            VIP Customer
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                            Regular
                          </span>
                        )}
                      </div>
                      <div className="text-slate-300 font-medium truncate max-w-[170px] mt-0.5">
                        {order.clientName}
                      </div>
                    </td>

                    {/* Ordered Items */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {order.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] border border-slate-700 font-medium"
                          >
                            <span className="text-blue-400 font-bold mr-1">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Order Value */}
                    <td className="py-3.5 px-3 font-semibold text-slate-200">
                      ${order.totalValue.toLocaleString()}
                    </td>

                    {/* Deadline */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-1 text-slate-300">
                        <Clock className={`w-3.5 h-3.5 ${order.deadlineMinutesLeft < 120 ? 'text-rose-400' : 'text-slate-400'}`} />
                        <span className={order.deadlineMinutesLeft < 120 ? 'text-rose-300 font-semibold' : ''}>
                          {order.deadlineText}
                        </span>
                      </div>
                    </td>

                    {/* Priority Score with (i) Tooltip */}
                    <td className="py-3.5 px-3 relative">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2.5 py-1 rounded-md font-bold text-xs shadow-sm flex items-center space-x-1 ${
                          order.priorityScore.total >= 90
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : order.priorityScore.total >= 60
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          <span>{order.priorityScore.total} pts</span>
                        </span>

                        {/* (i) Tooltip Breakdown Button */}
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltipId(activeTooltipId === order.id ? null : order.id);
                            }}
                            onMouseEnter={() => setActiveTooltipId(order.id)}
                            onMouseLeave={() => setActiveTooltipId(null)}
                            className="p-1 text-slate-400 hover:text-blue-300 transition-colors rounded-full hover:bg-slate-800"
                            title="Click or hover to inspect Priority Score breakdown"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>

                          {/* Hover Tooltip Card */}
                          {activeTooltipId === order.id && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 p-3.5 bg-slate-950 border border-indigo-500/40 rounded-xl shadow-2xl z-50 text-left pointer-events-auto ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150">
                              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                                <span className="font-bold text-xs text-white">Why This Order Is Ranked Here</span>
                                <span className="font-bold text-xs text-amber-400">{order.priorityScore.total} Total Points</span>
                              </div>
                              <p className="text-[11px] text-slate-300 font-medium mb-2.5 leading-relaxed">
                                &ldquo;Score = VIP Client Status (50 pts) + Urgent Delivery Deadline (35 pts) + High Order Value (20 pts)&rdquo;
                              </p>
                              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-bold">
                                <div className="p-1.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  +{order.priorityScore.vipScore} VIP Client
                                </div>
                                <div className="p-1.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                  +{order.priorityScore.deadlineScore} Urgent Clock
                                </div>
                                <div className="p-1.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                  +{order.priorityScore.valueScore} Big Value
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {isConflict ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/25 text-rose-300 border border-rose-500/50 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                          Low Stock Alert
                        </span>
                      ) : order.status === 'In Progress' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          📦 Being Picked
                        </span>
                      ) : order.status === 'Packed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Box Sealed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          <PackageCheck className="w-3 h-3 mr-1" />
                          Items Reserved
                        </span>
                      )}
                    </td>

                    {/* Assigned Worker / Bot */}
                    <td className="py-3.5 px-3 text-slate-300">
                      <div className="flex items-center space-x-1.5">
                        {order.assignedTo.includes('Bot') ? (
                          <Bot className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span className="font-semibold">{order.assignedTo}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                        {order.route}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      {isConflict ? (
                        <button
                          id="btn-resolve-conflict-row"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenConflictModal();
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Fix Stock Issue</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedOrderId(isExpanded ? null : order.id);
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                          title="View order packing route"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Detail Accordion */}
                  {isExpanded && (
                    <tr className="bg-slate-950/70 border-b border-slate-800">
                      <td colSpan={8} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                            <span className="font-semibold text-slate-300 block mb-1">Walking & Driving Route</span>
                            <p className="text-slate-400">{order.route}</p>
                          </div>
                          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                            <span className="font-semibold text-slate-300 block mb-1">Why It Was Chosen First</span>
                            <p className="text-slate-400">{order.priorityScore.explanation}</p>
                          </div>
                          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                            <span className="font-semibold text-slate-300 block mb-1">Who Is Responsible</span>
                            <p className="text-slate-400">{order.assignedTo} is moving along the shortest empty hallway.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
