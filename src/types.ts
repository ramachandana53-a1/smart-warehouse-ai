export type PriorityTier = 'VIP' | 'Express' | 'Standard';

export type OrderStatus = 
  | 'Order Created'
  | 'Priority Determined'
  | 'Inventory Checked'
  | 'Allocated'
  | 'Stock Conflict'
  | 'In Progress' // Picking
  | 'Packing'
  | 'Quality Check'
  | 'Dispatched'
  | 'Delivered';

export interface PriorityScoreBreakdown {
  vipScore: number;       // e.g. 50
  deadlineScore: number;  // e.g. 35
  valueScore: number;     // e.g. 20
  total: number;          // e.g. 105
  explanation: string;
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  availableInBin: number;
  picked?: boolean;
  qualityPassed?: boolean;
  damagedReported?: boolean;
}

export interface Order {
  id: string;             // e.g. "#101"
  clientName: string;
  tier: PriorityTier;
  items: OrderItem[];
  totalValue: number;
  deadlineText: string;
  deadlineMinutesLeft: number;
  priorityScore: PriorityScoreBreakdown;
  status: OrderStatus;
  currentStageIndex: number; // 0 to 8 corresponding to lifecycle
  assignedTo: string;     // e.g. "Bot-02 Atlas" or "Sam K."
  assignedPacker?: string;// e.g. "Dev P."
  packingTable?: string;  // e.g. "Boxing Table #1"
  dispatchGate?: string;  // e.g. "Gate 3 (FedEx Priority)"
  trackingNumber?: string;// e.g. "FDX-994821034"
  route: string;          // e.g. "Aisle A (Bay 03) ➔ Station 1"
  conflictReason?: string;
  suggestedAction?: string;
  qualityNotes?: string;
  dispatchTime?: string;
  shippingCarrier?: string;
}

export interface ProductInventory {
  id: string;
  sku: string;
  name: string;           // "4K Drone Camera", "Laser Distance Sensor", etc.
  category: string;
  location: string;       // "Aisle A - Shelf 3"
  reserveLocation: string;// "Reserve Bin C-02"
  totalStock: number;
  reservedStock: number;
  safetyThreshold: number;
  reorderQuantity: number;
  unitPrice: number;
  imageEmoji: string;
  supplierName: string;
  leadTimeDays: number;
  damagedUnitsCount: number;
  pendingRestockPO?: boolean;
}

export interface ReorderPurchaseOrder {
  id: string;
  sku: string;
  productName: string;
  supplierName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  status: 'Recommended' | 'Approved & Sent' | 'In Transit' | 'Received & Restocked';
  leadTimeDays: number;
  reason: string;
  generatedAt: string;
}

export interface DamagedItemIncident {
  id: string;
  orderId: string;
  productName: string;
  sku: string;
  quantity: number;
  location: string;
  reportedBy: string;
  timestamp: string;
  issueType: 'Cracked / Defective' | 'Missing from Shelf' | 'Packaging Torn';
  aiDecision: string;
  replacementSource: string;
  resolutionStatus: 'Resolved' | 'Quarantined & Swapped' | 'Pending QC Review';
}

export interface WarehouseWorker {
  id: string;
  name: string;
  role: 'Human Picker' | 'Human Packer' | 'Autonomous Delivery Bot';
  locationName: string;   // Plain English: "Aisle A: Collecting Items"
  targetBay: string;
  currentTask: string;
  speed: string;
  batteryOrEnergy: string; // e.g. "84%" or "Active"
  statusBadge: string;
  coordinates: { x: number; y: number }; // Percentage on floor map (0-100)
}

export interface BottleneckDelay {
  id: string;
  location: string;
  delayMinutes: number;
  cause: string;
  severity: 'low' | 'medium' | 'high';
  aiMitigation: string;
  resolved: boolean;
}

export interface ActionHistoryItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  tag: 'STOCK_REALLOCATION' | 'PRIORITY_DISPATCH' | 'BOT_REROUTE' | 'RUSH_INJECTION' | 'SLA_PROTECTED' | 'DAMAGE_QUARANTINE' | 'RESTOCK_PO' | 'LIFECYCLE_STAGE';
  impactText: string;
  confidenceScore: number;
}

export interface BusinessImpactMetrics {
  hoursSavedToday: number;       // 3.2
  revenuePenaltySaved: number;   // 1850
  routeEfficiencyGain: number;   // 28%
  fulfillmentAccuracy: number;   // 99.94%
  ordersFulfilledToday: number;  // 142
  activeExceptionsResolved: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  quickActionUsed?: string;
}
