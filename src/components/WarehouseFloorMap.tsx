import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Battery, 
  Gauge, 
  Compass, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import { WarehouseWorker } from '../types';

interface WarehouseFloorMapProps {
  workers: WarehouseWorker[];
}

export const WarehouseFloorMap: React.FC<WarehouseFloorMapProps> = ({ workers }) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || 'worker-1');

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId) || workers[0];

  return (
    <div className="space-y-6">
      {/* Floor Plan Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Warehouse Workers & Delivery Bots
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center font-medium">
                <Radio className="w-3 h-3 mr-1 animate-pulse" /> Live Map
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live map showing where every person and rolling robot is walking, grabbing items, or charging right now.
            </p>
          </div>
          <div className="text-xs text-slate-400 flex items-center space-x-3">
            <span className="flex items-center text-blue-300">
              <User className="w-3.5 h-3.5 mr-1" /> 3 Floor Workers
            </span>
            <span className="flex items-center text-cyan-300">
              <Bot className="w-3.5 h-3.5 mr-1" /> 3 Rolling Helper Bots
            </span>
          </div>
        </div>

        {/* Visual Map Layout */}
        <div className="mt-4 relative bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-hidden min-h-[380px] flex flex-col justify-between">
          {/* Warehouse Zones Background Grids */}
          <div className="grid grid-cols-4 gap-4 h-full pointer-events-none opacity-40">
            {/* Shelf Row A */}
            <div className="border border-dashed border-blue-500/40 rounded-lg p-2.5 flex flex-col justify-between bg-blue-950/10">
              <span className="text-[11px] font-bold text-blue-400 tracking-wide">SHELF ROW A (ELECTRONICS)</span>
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <div className="p-1 bg-slate-900/80 rounded">Shelf 3: HD Security Camera</div>
                <div className="p-1 bg-slate-900/80 rounded">Shelf 7: Wireless Smart Sensor</div>
              </div>
            </div>

            {/* Shelf Row B */}
            <div className="border border-dashed border-indigo-500/40 rounded-lg p-2.5 flex flex-col justify-between bg-indigo-950/10">
              <span className="text-[11px] font-bold text-indigo-400 tracking-wide">SHELF ROW B (BATTERIES & PARTS)</span>
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <div className="p-1 bg-slate-900/80 rounded">Shelf 2: Rechargeable Battery Pack</div>
                <div className="p-1 bg-slate-900/80 rounded">Shelf 5: Computer Processing Chip</div>
              </div>
            </div>

            {/* Packing Stations */}
            <div className="border border-dashed border-emerald-500/40 rounded-lg p-2.5 flex flex-col justify-between bg-emerald-950/10">
              <span className="text-[11px] font-bold text-emerald-400 tracking-wide">BOXING & PACKING TABLES</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300">
                <div className="p-1 bg-slate-900/80 rounded text-center">Table 1 (VIP)</div>
                <div className="p-1 bg-slate-900/80 rounded text-center">Table 2</div>
                <div className="p-1 bg-slate-900/80 rounded text-center">Table 3</div>
                <div className="p-1 bg-slate-900/80 rounded text-center">Table 4</div>
              </div>
            </div>

            {/* Docks & Charging */}
            <div className="border border-dashed border-cyan-500/40 rounded-lg p-2.5 flex flex-col justify-between bg-cyan-950/10">
              <span className="text-[11px] font-bold text-cyan-400 tracking-wide">TRUCK GATES & CHARGING</span>
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <div className="p-1 bg-slate-900/80 rounded text-amber-300">Gate #3: Truck Unloading</div>
                <div className="p-1 bg-slate-900/80 rounded text-emerald-300">Gate A: Courier Pickup</div>
                <div className="p-1 bg-slate-900/80 rounded text-cyan-300">Robot Charging Bay</div>
              </div>
            </div>
          </div>

          {/* Interactive Worker & Bot Pins Overlay */}
          <div className="absolute inset-0 p-4">
            {workers.map((worker) => {
              const isSelected = selectedWorkerId === worker.id;
              const isBot = worker.role === 'Autonomous Delivery Bot';

              return (
                <button
                  key={worker.id}
                  onClick={() => setSelectedWorkerId(worker.id)}
                  style={{
                    left: `${worker.coordinates.x}%`,
                    top: `${worker.coordinates.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10 ${
                    isSelected ? 'scale-110 z-20' : 'hover:scale-105'
                  }`}
                  title={`${worker.name} - ${worker.locationName}`}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Pulsing ring */}
                    <span className={`absolute -inset-1.5 rounded-full opacity-75 animate-ping ${
                      isBot ? 'bg-cyan-500' : 'bg-blue-500'
                    }`} />

                    {/* Pin Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-white text-white ring-4 ring-indigo-500/40'
                        : isBot
                        ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-cyan-500/20'
                        : 'bg-slate-900 border-blue-400 text-blue-300 shadow-blue-500/20'
                    }`}>
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Compact Label */}
                    <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/95 border border-slate-700 text-[11px] font-bold text-slate-200 whitespace-nowrap shadow-md">
                      {worker.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Footer Legend */}
          <div className="mt-6 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 relative z-0">
            <span className="flex items-center">
              <Compass className="w-3.5 h-3.5 mr-1 text-slate-500" /> Building: Zone 4 (North Main Floor)
            </span>
            <div className="flex items-center space-x-3">
              <span className="text-slate-300">Click any worker or helper robot to see what they are doing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Entity Live Details */}
      {selectedWorker && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedWorker.role === 'Autonomous Delivery Bot'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {selectedWorker.role === 'Autonomous Delivery Bot' ? (
                  <Bot className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base text-white">{selectedWorker.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedWorker.role === 'Autonomous Delivery Bot' ? 'Rolling Robot' : 'Floor Staff'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  What they are doing right now: <strong className="text-blue-300 font-semibold">{selectedWorker.locationName}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {selectedWorker.statusBadge}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Current Job</span>
              <span className="font-semibold text-slate-200">{selectedWorker.currentTask}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Target Shelf / Table</span>
              <span className="font-semibold text-blue-300">{selectedWorker.targetBay}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Movement Speed</span>
              <span className="font-semibold text-slate-200 flex items-center">
                <Gauge className="w-3.5 h-3.5 mr-1 text-cyan-400" /> {selectedWorker.speed}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Energy / Battery</span>
              <span className="font-semibold text-emerald-300 flex items-center">
                <Battery className="w-3.5 h-3.5 mr-1 text-emerald-400" /> {selectedWorker.batteryOrEnergy}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of All Workers & Bots Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => {
          const isBot = worker.role === 'Autonomous Delivery Bot';
          const isSelected = selectedWorkerId === worker.id;

          return (
            <div
              key={worker.id}
              onClick={() => setSelectedWorkerId(worker.id)}
              className={`p-4 rounded-xl bg-slate-900 border cursor-pointer transition-all duration-200 text-xs ${
                isSelected
                  ? 'border-indigo-500 bg-slate-850 shadow-lg ring-1 ring-indigo-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isBot ? 'bg-cyan-500/20 text-cyan-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="font-bold text-white">{worker.name}</span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                  {worker.batteryOrEnergy}
                </span>
              </div>
              <p className="text-slate-300 font-medium">{worker.locationName}</p>
              <p className="text-slate-400 text-[11px] mt-1 truncate">Job: {worker.currentTask}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
