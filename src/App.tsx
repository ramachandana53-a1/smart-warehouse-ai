import React, { useState } from 'react';
import { 
  HeaderNav 
} from './components/HeaderNav';
import { 
  OrderQueueTable 
} from './components/OrderQueueTable';
import { 
  StockAssignmentGrid 
} from './components/StockAssignmentGrid';
import { 
  WarehouseFloorMap 
} from './components/WarehouseFloorMap';
import { 
  WorkDelaysAndRoi 
} from './components/WorkDelaysAndRoi';
import { 
  ActionHistoryLog 
} from './components/ActionHistoryLog';
import { 
  ConflictResolutionModal 
} from './components/ConflictResolutionModal';
import { 
  EmergencySimulatorPanel 
} from './components/EmergencySimulatorPanel';
import { 
  PitchModeOverlay 
} from './components/PitchModeOverlay';
import { 
  OperationsCopilotDrawer 
} from './components/OperationsCopilotDrawer';
import { 
  OrderFulfillmentLifecycleView 
} from './components/OrderFulfillmentLifecycleView';
import { 
  DecisionEngineSimulator 
} from './components/DecisionEngineSimulator';
import { 
  DamagedItemExceptionModal 
} from './components/DamagedItemExceptionModal';
import { 
  AutoReorderPanel 
} from './components/AutoReorderPanel';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_WORKERS, 
  INITIAL_BOTTLENECKS, 
  INITIAL_ACTION_HISTORY, 
  INITIAL_METRICS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_DAMAGED_INCIDENTS
} from './data/initialData';
import { 
  Order, 
  ProductInventory, 
  WarehouseWorker, 
  BottleneckDelay, 
  ActionHistoryItem, 
  BusinessImpactMetrics,
  ReorderPurchaseOrder,
  DamagedItemIncident
} from './types';
import { 
  CheckCircle2, 
  X, 
  Headphones,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'orders' | 'fulfillment' | 'decision-engine' | 'workers' | 'delays' | 'history'>('orders');

  // Core Warehouse Domain State
  const [products, setProducts] = useState<ProductInventory[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [workers, setWorkers] = useState<WarehouseWorker[]>(INITIAL_WORKERS);
  const [bottlenecks, setBottlenecks] = useState<BottleneckDelay[]>(INITIAL_BOTTLENECKS);
  const [history, setHistory] = useState<ActionHistoryItem[]>(INITIAL_ACTION_HISTORY);
  const [metrics, setMetrics] = useState<BusinessImpactMetrics>(INITIAL_METRICS);
  const [purchaseOrders, setPurchaseOrders] = useState<ReorderPurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [damagedIncidents, setDamagedIncidents] = useState<DamagedItemIncident[]>(INITIAL_DAMAGED_INCIDENTS);

  // UI Modal & Drawer States
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDamagedModalOpen, setIsDamagedModalOpen] = useState(false);
  const [hasActiveConflict, setHasActiveConflict] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Notification Banner State
  const [successBannerText, setSuccessBannerText] = useState<string | null>(null);

  // Pitch Mode State
  const [pitchMode, setPitchMode] = useState(false);
  const [pitchStep, setPitchStep] = useState(1);

  // 1. Trigger Live Conflict
  const handleTriggerConflict = () => {
    setProducts((prev) =>
      prev.map((p) =>
        p.sku === 'SKU-OPT-CAM'
          ? { ...p, totalStock: 2, reservedStock: 2 }
          : p
      )
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === '#101'
          ? {
              ...o,
              status: 'Stock Conflict',
              conflictReason: 'Only 1 unit free on shelf (4 needed by Apex VIP)',
              suggestedAction: 'Borrow 3 units from regular Order #102 (22 hours left)',
            }
          : o
      )
    );

    setHasActiveConflict(true);
    setActiveTab('orders');
    setIsConflictModalOpen(true);

    const conflictEvent: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      title: 'Low Stock Alert on 4K Drone Cameras',
      description: 'Only 2 cameras left on shelf in Aisle A. Urgent VIP Order #101 needs 4 units right now.',
      tag: 'STOCK_REALLOCATION',
      impactText: 'AI flagged risk of $850 late delivery penalty fee',
      confidenceScore: 99.8,
    };
    setHistory((prev) => [conflictEvent, ...prev]);
  };

  // 2. Reset Demo Data
  const handleResetData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setWorkers(INITIAL_WORKERS);
    setBottlenecks(INITIAL_BOTTLENECKS);
    setHistory(INITIAL_ACTION_HISTORY);
    setMetrics(INITIAL_METRICS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setDamagedIncidents(INITIAL_DAMAGED_INCIDENTS);
    setHasActiveConflict(false);
    setIsConflictModalOpen(false);
    setIsDamagedModalOpen(false);
    setSuccessBannerText('Everything has been reset back to normal starting conditions!');
    setTimeout(() => setSuccessBannerText(null), 4000);
  };

  // 3. Pitch Mode Step Navigation
  const handleTogglePitchMode = () => {
    const nextState = !pitchMode;
    setPitchMode(nextState);
    if (nextState) {
      setPitchStep(1);
      setActiveTab('orders');
    }
  };

  const handlePitchStepChange = (step: number) => {
    setPitchStep(step);
    if (step === 1) {
      setActiveTab('orders');
    } else if (step === 2) {
      setActiveTab('decision-engine');
    } else if (step === 3) {
      setActiveTab('decision-engine');
    } else if (step === 4) {
      setActiveTab('fulfillment');
    } else if (step === 5) {
      setActiveTab('delays');
    }
  };

  // 4. Apply Resolution
  const handleApplyResolution = () => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === '#101') {
          return {
            ...o,
            status: 'Allocated',
            currentStageIndex: 3,
            conflictReason: undefined,
          };
        }
        return o;
      })
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.sku === 'SKU-OPT-CAM'
          ? { ...p, totalStock: 6, reservedStock: 6 }
          : p
      )
    );

    setHasActiveConflict(false);
    setIsConflictModalOpen(false);

    setSuccessBannerText('Resolution Applied! 3 units reallocated. Order #101 status updated to Allocated.');
    setTimeout(() => setSuccessBannerText(null), 6000);

    setMetrics((prev) => ({
      ...prev,
      revenuePenaltySaved: prev.revenuePenaltySaved + 850,
      hoursSavedToday: Number((prev.hoursSavedToday + 0.4).toFixed(1)),
      ordersFulfilledToday: prev.ordersFulfilledToday + 1,
      activeExceptionsResolved: prev.activeExceptionsResolved + 1,
    }));

    const resolutionEvent: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      title: 'Smart Stock Reallocation (Zero Late Fees)',
      description: 'Borrowed 3x 4K Drone Cameras from regular Order #102 for VIP Order #101. Regular order will be filled by the 2:00 PM delivery truck with zero delay.',
      tag: 'STOCK_REALLOCATION',
      impactText: 'Avoided $850 late delivery fee and kept VIP customer happy',
      confidenceScore: 99.9,
    };
    setHistory((prev) => [resolutionEvent, ...prev]);
  };

  // 5. Split Shipment Handler
  const handleSplitShipment = () => {
    setIsConflictModalOpen(false);
    setSuccessBannerText('Split Shipment Sent: 1 unit sent in first box right now; remaining 3 units ship with the afternoon truck.');
    setTimeout(() => setSuccessBannerText(null), 5000);
  };

  // 6. Fulfillment Lifecycle Handlers
  const handleAdvanceOrderStage = (orderId: string) => {
    const STAGE_NAMES = [
      'Order Created',
      'Priority Determined',
      'Inventory Checked',
      'Allocated',
      'In Progress',
      'Packing',
      'Quality Check',
      'Dispatched',
      'Delivered',
    ];

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const nextIndex = Math.min(8, o.currentStageIndex + 1);
          const newStatus = (STAGE_NAMES[nextIndex] || 'In Progress') as any;
          return {
            ...o,
            currentStageIndex: nextIndex,
            status: newStatus,
          };
        }
        return o;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      const nextIndex = Math.min(8, targetOrder.currentStageIndex + 1);
      const stageName = STAGE_NAMES[nextIndex];
      setSuccessBannerText(`Order ${orderId} progressed to: ${stageName}`);
      setTimeout(() => setSuccessBannerText(null), 4000);

      const lifeEvent: ActionHistoryItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        title: `Order ${orderId} Stage Update: ${stageName}`,
        description: `Successfully transitioned ${targetOrder.clientName} order to next fulfillment stage.`,
        tag: 'LIFECYCLE_STAGE',
        impactText: 'On-schedule progression towards express dispatch',
        confidenceScore: 99.8,
      };
      setHistory((prev) => [lifeEvent, ...prev]);
    }
  };

  const handleRunQualityCheck = (orderId: string, passed: boolean, notes: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              currentStageIndex: 6,
              status: 'Quality Check',
              qualityNotes: notes,
            }
          : o
      )
    );
    setSuccessBannerText(`Quality Inspection Passed for ${orderId}: 100% Barcode Match!`);
    setTimeout(() => setSuccessBannerText(null), 4000);
  };

  const handleDispatchOrder = (orderId: string, carrier: string, gate: string) => {
    const trackingNum = `FDX-${Math.floor(100000000 + Math.random() * 900000000)}`;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              currentStageIndex: 7,
              status: 'Dispatched',
              shippingCarrier: carrier,
              dispatchGate: gate,
              trackingNumber: trackingNum,
              dispatchTime: 'Just now',
            }
          : o
      )
    );

    setMetrics((prev) => ({
      ...prev,
      ordersFulfilledToday: prev.ordersFulfilledToday + 1,
    }));

    setSuccessBannerText(`Order ${orderId} Dispatched via ${carrier} at ${gate}! Tracking: ${trackingNum}`);
    setTimeout(() => setSuccessBannerText(null), 5000);

    const dispatchEvent: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      title: `Order ${orderId} Handed to Outbound Courier (${carrier})`,
      description: `Loaded onto truck at ${gate} with Tracking #${trackingNum}. 100% On-Time SLA achieved.`,
      tag: 'PRIORITY_DISPATCH',
      impactText: 'Fulfilled on-time with zero penalties',
      confidenceScore: 99.9,
    };
    setHistory((prev) => [dispatchEvent, ...prev]);
  };

  // 7. Damaged Item Exception Handler
  const handleResolveDamagedItem = (data: {
    orderId: string;
    productSku: string;
    productName: string;
    issueType: 'Cracked / Defective' | 'Missing from Shelf' | 'Packaging Torn';
    reserveLocation: string;
    actionTaken: string;
  }) => {
    const newIncident: DamagedItemIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: data.orderId,
      productName: data.productName,
      sku: data.productSku,
      quantity: 1,
      location: data.reserveLocation,
      reportedBy: 'Floor Staff / Autonomous Scanner',
      timestamp: 'Just now',
      issueType: data.issueType,
      aiDecision: data.actionTaken,
      replacementSource: data.reserveLocation,
      resolutionStatus: 'Quarantined & Swapped',
    };

    setDamagedIncidents((prev) => [newIncident, ...prev]);

    setProducts((prev) =>
      prev.map((p) =>
        p.sku === data.productSku
          ? { ...p, damagedUnitsCount: p.damagedUnitsCount + 1 }
          : p
      )
    );

    setMetrics((prev) => ({
      ...prev,
      activeExceptionsResolved: prev.activeExceptionsResolved + 1,
    }));

    setSuccessBannerText(`Exception Resolved: 1 defective unit quarantined. Fresh unit retrieved from ${data.reserveLocation}.`);
    setTimeout(() => setSuccessBannerText(null), 5000);

    const damageEvent: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      title: `Damaged Item Auto-Quarantined (${data.productName})`,
      description: `Detected ${data.issueType} on ${data.orderId}. Replaced seamlessly from ${data.reserveLocation}. Supplier RMA generated.`,
      tag: 'DAMAGE_QUARANTINE',
      impactText: 'Prevented shipping defective goods with 0 fulfillment delay',
      confidenceScore: 99.9,
    };
    setHistory((prev) => [damageEvent, ...prev]);
  };

  // 8. Auto-Reorder PO Approval
  const handleApprovePO = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === poId ? { ...po, status: 'Approved & Sent' } : po
      )
    );

    setSuccessBannerText(`Purchase Order ${poId} Approved & Sent to Supplier! Delivery scheduled.`);
    setTimeout(() => setSuccessBannerText(null), 4000);

    const poEvent: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      title: `Supplier Restock PO Approved (${poId})`,
      description: `Purchase order confirmed with supplier. Inventory pipeline updated to prevent stockouts.`,
      tag: 'RESTOCK_PO',
      impactText: 'Maintained 100% safety buffer',
      confidenceScore: 99.8,
    };
    setHistory((prev) => [poEvent, ...prev]);
  };

  const handleTriggerInstantPO = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newPO: ReorderPurchaseOrder = {
      id: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      sku: product.sku,
      productName: product.name,
      supplierName: product.supplierName,
      quantity: product.reorderQuantity,
      unitCost: Math.round(product.unitPrice * 0.65),
      totalCost: Math.round(product.reorderQuantity * product.unitPrice * 0.65),
      status: 'Approved & Sent',
      leadTimeDays: product.leadTimeDays,
      reason: `Manual Restock Order for ${product.name} triggered by floor manager.`,
      generatedAt: 'Just now',
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    setSuccessBannerText(`Restock PO Generated for ${product.name} (${product.reorderQuantity} units)`);
    setTimeout(() => setSuccessBannerText(null), 4000);
  };

  // 9. Emergency Simulator Triggers
  const handleSimulatePeakRush = () => {
    const rushOrders: Order[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `#RUSH-${106 + i}`,
      clientName: `Rush Customer #${i + 1} (VIP)`,
      tier: 'VIP',
      items: [
        {
          sku: 'SKU-OPT-CAM',
          name: '4K Drone Camera',
          quantity: 1,
          unitPrice: 850,
          availableInBin: 14,
        },
        {
          sku: 'SKU-BAT-48V',
          name: 'High-Capacity Battery Pack',
          quantity: 2,
          unitPrice: 420,
          availableInBin: 20,
        },
      ],
      totalValue: 1690,
      deadlineText: 'Express (1 hour window)',
      deadlineMinutesLeft: 60,
      priorityScore: {
        vipScore: 50,
        deadlineScore: 35,
        valueScore: 15,
        total: 100,
        explanation: 'Score = VIP Rush Client (50 pts) + Urgent 1h Window (35 pts) + High Value (15 pts)',
      },
      status: 'Allocated',
      currentStageIndex: 3,
      assignedTo: i % 2 === 0 ? 'Bot-02 "Atlas"' : 'Bot-01 "Orion"',
      route: 'Aisle A (Shelf 3) ➔ Boxing Table 1',
    }));

    setOrders((prev) => [...rushOrders, ...prev]);
    setSuccessBannerText('Sudden Rush Simulated: 10 urgent VIP orders added! Ranked automatically by urgency.');
    setTimeout(() => setSuccessBannerText(null), 5000);

    const rushEvent: ActionHistoryItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      title: 'Rush Auto-Balancing (10 Orders Added)',
      description: 'Shared 10 urgent orders evenly across Bot-01, Bot-02, and fast-charging Bot-03.',
      tag: 'RUSH_INJECTION',
      impactText: 'Increased packaging speed by 42%',
      confidenceScore: 98.6,
    };
    setHistory((prev) => [rushEvent, ...prev]);
  };

  const handleSimulateRobotBreakdown = () => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === 'bot-1'
          ? {
              ...w,
              statusBadge: 'Stopped for Safety',
              locationName: 'Aisle B: Stopped for Safety Check',
              currentTask: 'Sensor check needed • Other helpers walking around safely',
              speed: '0.0 m/s',
            }
          : w
      )
    );

    setBottlenecks((prev) => [
      {
        id: `btn-${Date.now()}`,
        location: 'Aisle B Main Hallway',
        delayMinutes: 14,
        cause: 'Bot-01 stopped safely for inspection - walking staff taking side hallway',
        severity: 'high',
        aiMitigation: 'AI Action: Sent Bot-02 through the side hallway to avoid getting stuck.',
        resolved: false,
      },
      ...prev,
    ]);

    setSuccessBannerText('Robot Breakdown Handled: Smart system rerouted traffic around stopped unit.');
    setTimeout(() => setSuccessBannerText(null), 5000);
  };

  const handleSimulateRestock = () => {
    setProducts((prev) =>
      prev.map((p) =>
        p.sku === 'SKU-OPT-CAM'
          ? { ...p, totalStock: p.totalStock + 20 }
          : p
      )
    );
    setSuccessBannerText('Delivery Truck Restocked: +20 4K Drone Cameras unloaded and placed on shelves!');
    setTimeout(() => setSuccessBannerText(null), 5000);
  };

  const handleUpdateStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, totalStock: Math.max(0, p.totalStock + delta) }
          : p
      )
    );
  };

  const handleResolveBottleneck = (id: string) => {
    setBottlenecks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, resolved: true } : b))
    );
    setSuccessBannerText('Smart Fix applied: Work is flowing smoothly again!');
    setTimeout(() => setSuccessBannerText(null), 3000);
  };

  const cameraProduct = products.find((p) => p.sku === 'SKU-OPT-CAM') || products[0];
  const order101 = orders.find((o) => o.id === '#101') || orders[0];
  const order102 = orders.find((o) => o.id === '#102') || orders[1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerConflict={handleTriggerConflict}
        onResetData={handleResetData}
        pitchMode={pitchMode}
        onTogglePitchMode={handleTogglePitchMode}
        hasActiveConflict={hasActiveConflict}
      />

      {/* Persistent Green Success Banner */}
      {successBannerText && (
        <div className="sticky top-16 z-40 bg-emerald-600 text-white px-4 py-3 shadow-lg border-b border-emerald-500 animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold tracking-wide">
                {successBannerText}
              </p>
            </div>
            <button
              onClick={() => setSuccessBannerText(null)}
              className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Orders & Stock Assignment & Reorder POs */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <OrderQueueTable
              orders={orders}
              onOpenConflictModal={() => setIsConflictModalOpen(true)}
              onSelectOrder={(order) => {
                setSelectedOrder(order);
                setActiveTab('fulfillment');
              }}
              selectedOrderId={selectedOrder?.id}
              hasActiveConflict={hasActiveConflict}
            />

            <StockAssignmentGrid
              products={products}
              onUpdateStock={handleUpdateStock}
            />

            <AutoReorderPanel
              products={products}
              purchaseOrders={purchaseOrders}
              onApprovePO={handleApprovePO}
              onTriggerInstantPO={handleTriggerInstantPO}
            />

            <EmergencySimulatorPanel
              onSimulatePeakRush={handleSimulatePeakRush}
              onSimulateRobotBreakdown={handleSimulateRobotBreakdown}
              onSimulateRestock={handleSimulateRestock}
            />
          </div>
        )}

        {/* Tab 2: Full 9-Stage Fulfillment Lifecycle & Courier Dispatch */}
        {activeTab === 'fulfillment' && (
          <div className="space-y-6">
            <OrderFulfillmentLifecycleView
              orders={orders}
              onAdvanceOrderStage={handleAdvanceOrderStage}
              onRunQualityCheck={handleRunQualityCheck}
              onDispatchOrder={handleDispatchOrder}
              onOpenDamagedModal={(order) => {
                setSelectedOrder(order);
                setIsDamagedModalOpen(true);
              }}
            />
          </div>
        )}

        {/* Tab 3: The Competitive Twist - Decision-Making Engine Showcase */}
        {activeTab === 'decision-engine' && (
          <div className="space-y-6">
            <DecisionEngineSimulator
              orders={orders}
              products={products}
              onOpenConflictModal={() => setIsConflictModalOpen(true)}
              onExecutePromptDilemma={handleApplyResolution}
              onExecuteDamagedException={() => {
                setSelectedOrder(order101);
                setIsDamagedModalOpen(true);
              }}
              onExecuteBottleneckBypass={() => handleResolveBottleneck('btn-1')}
              onExecuteAutoReorder={() => handleApprovePO('PO-8821')}
            />
          </div>
        )}

        {/* Tab 4: Warehouse Workers & Delivery Bots */}
        {activeTab === 'workers' && (
          <div className="space-y-6">
            <WarehouseFloorMap workers={workers} />
          </div>
        )}

        {/* Tab 5: Work Delays & Live Status (ROI + Bottlenecks) */}
        {activeTab === 'delays' && (
          <div className="space-y-6">
            <WorkDelaysAndRoi
              bottlenecks={bottlenecks}
              metrics={metrics}
              onResolveBottleneck={handleResolveBottleneck}
            />
          </div>
        )}

        {/* Tab 6: AI Action History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <ActionHistoryLog history={history} />
          </div>
        )}
      </main>

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        onApplyResolution={handleApplyResolution}
        onSplitShipment={handleSplitShipment}
        order101={order101}
        order102={order102}
        product={cameraProduct}
      />

      {/* Damaged Item Exception Modal */}
      <DamagedItemExceptionModal
        isOpen={isDamagedModalOpen}
        onClose={() => setIsDamagedModalOpen(false)}
        order={selectedOrder || order101}
        products={products}
        onResolveDamagedItem={handleResolveDamagedItem}
      />

      {/* Pitch Mode Step Guide Overlay */}
      {pitchMode && (
        <PitchModeOverlay
          currentStep={pitchStep}
          onNextStep={() => handlePitchStepChange(Math.min(5, pitchStep + 1))}
          onPrevStep={() => handlePitchStepChange(Math.max(1, pitchStep - 1))}
          onSelectStep={(s) => handlePitchStepChange(s)}
          onClose={() => setPitchMode(false)}
        />
      )}

      {/* Floating Operations Assistant (AI Helper) Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="btn-open-copilot"
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-2xl shadow-indigo-500/40 border border-white/20 transition-all transform hover:scale-105 active:scale-95 group"
          title="Open Warehouse Helper AI"
        >
          <div className="relative">
            <Headphones className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border-2 border-slate-900" />
          </div>
          <span className="text-xs tracking-wide">Warehouse Helper AI</span>
        </button>
      </div>

      {/* Operations Copilot Drawer */}
      <OperationsCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        orders={orders}
        products={products}
        workers={workers}
        bottlenecks={bottlenecks}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Smart Warehouse Platform • Autonomous Order Fulfillment System</span>
          <span>Powered by Autonomous Decision-Making Engine</span>
        </div>
      </footer>
    </div>
  );
}
