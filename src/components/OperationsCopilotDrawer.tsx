import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  ChevronRight, 
  Loader2, 
  Zap,
  HelpCircle,
  BarChart2,
  Pin,
  ShoppingCart,
  Wrench,
  DollarSign
} from 'lucide-react';
import { CopilotMessage, Order, ProductInventory, WarehouseWorker, BottleneckDelay } from '../types';

interface OperationsCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: ProductInventory[];
  workers: WarehouseWorker[];
  bottlenecks: BottleneckDelay[];
}

export const OperationsCopilotDrawer: React.FC<OperationsCopilotDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  products,
  workers,
  bottlenecks,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am your **Warehouse Operations Helper**.\n\nI monitor all customer orders, items on the shelves, where our workers and rolling helper bots are, and how to avoid delivery delays. Ask me anything in plain English!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getHardcodedAnswer = (query: string): string => {
    const q = query.toLowerCase();

    // 1. "What is this app?" or "Overview"
    if (
      q.includes('what is this app') ||
      q.includes('overview') ||
      q.includes('about this app') ||
      (q.includes('what') && q.includes('app'))
    ) {
      return "This is an Autonomous Smart Warehouse Control Tower. It continuously monitors customer orders, manages stock levels, automatically re-routes workers around aisle blockages, and resolves stock shortages in real-time.";
    }

    // 2. "Why is Apex Robotics packed first?"
    if (
      q.includes('apex') ||
      q.includes('why is apex') ||
      q.includes('101') ||
      (q.includes('pack') && q.includes('first')) ||
      (q.includes('order') && q.includes('first') && !q.includes('where') && !q.includes('see'))
    ) {
      return "Apex Robotics is an Urgent VIP Account. Their order scored 105 points based on 3 factors: VIP SLA contract status (+50 pts), express 2-hour delivery deadline (+35 pts), and high order value (+20 pts).";
    }

    // 3. "What do Aisles & Detours mean?"
    if (
      q.includes('aisle') ||
      q.includes('detour') ||
      q.includes('aisles & detours') ||
      (q.includes('aisles') && q.includes('detours'))
    ) {
      return "Aisles are shelf rows (like Row A for Cameras, Row B for Batteries). A Detour means a shelf row was blocked, so the AI automatically rerouted the worker or bot via an alternative path to save time.";
    }

    // 4. "How does AI fix low stock?"
    if (
      q.includes('low stock') ||
      q.includes('how does the ai fix') ||
      q.includes('how does ai fix') ||
      (q.includes('fix') && q.includes('stock')) ||
      q.includes('shortage') ||
      q.includes('reallocate')
    ) {
      return "When stock is insufficient, the AI evaluates 3 strategies: 1) Reallocate items from lower-priority standard orders, 2) Split shipment, or 3) Trigger express restock, picking the option with zero late delivery penalty.";
    }

    // 5. "How are savings ($1,850) calculated?"
    if (
      q.includes('savings') ||
      q.includes('saving') ||
      q.includes('1,850') ||
      q.includes('1850') ||
      (q.includes('how') && (q.includes('saving') || q.includes('savings') || q.includes('cost') || q.includes('calculated')))
    ) {
      return "Savings are calculated by tracking late-delivery penalty fees avoided ($1,250) plus saved labor hours (3.2 hours saved by AI automated route picking).";
    }

    // 6. Decision Flow queries ("view decision flow", "decision flow", "how to view")
    if (
      q.includes('view decision flow') ||
      q.includes('decision flow') ||
      q.includes('how to view') ||
      (q.includes('view') && q.includes('decision'))
    ) {
      return "To view the Decision Flow, click directly on the 'Urgent Stock Conflict' card in the Decision Engine tab, or click the red 'Resolve Conflict' badge on Order #101. This opens the AI resolution modal showing how inventory is reallocated in real-time.";
    }

    // 7. Navigation: Order queries with navigation or location
    if (q.includes('order') && (q.includes('where') || q.includes('see') || q.includes('find') || q.includes('view') || q.includes('tab'))) {
      return "To see all customer orders and their live urgency priority scores, click the 'Orders & Shelf Stock' tab or the 'Fulfillment Lifecycle' tab in the top navigation.";
    }

    // 8. Navigation: Stock queries with navigation or location
    if ((q.includes('stock') || q.includes('inventory') || q.includes('shelf')) && (q.includes('where') || q.includes('see') || q.includes('find') || q.includes('view') || q.includes('tab'))) {
      return "To view live shelf inventory, remaining quantities, and low stock warnings, click the 'Orders & Shelf Stock' tab in the top navigation.";
    }

    // 9. Navigation: Delay / Bottleneck queries with navigation or location
    if ((q.includes('delay') || q.includes('bottleneck') || q.includes('slow') || q.includes('queue')) && (q.includes('where') || q.includes('see') || q.includes('find') || q.includes('view') || q.includes('tab'))) {
      return "To track stage bottlenecks and live station queues, click the 'Fulfillment Lifecycle' tab on your screen to inspect stage-by-stage cycle times.";
    }

    // 10. Navigation: Cost / Penalty queries
    if (q.includes('cost') || q.includes('fee') || q.includes('penalty') || q.includes('roi')) {
      return "To see financial metrics and total late penalty fees saved ($1,850 today), click the 'Decision Engine' tab in the top navigation.";
    }

    // 11. General navigation / location queries ("where", "see", "where can I see that", "where is that", etc.)
    if (
      q.includes('where') ||
      q.includes('see') ||
      q.includes('navigate') ||
      q.includes('screen') ||
      q.includes('tab') ||
      q.includes('find') ||
      q.includes('look')
    ) {
      return "You can view this directly across 3 main areas on your screen: 1) Click the 'Orders & Shelf Stock' tab for live inventory, 2) Click the 'Fulfillment Lifecycle' tab for stage tracking, or 3) View the 'Decision Engine' tab to see automatic conflict resolutions and saved costs.";
    }

    // 12. Damaged items
    if (
      q.includes('damaged') ||
      q.includes('broken') ||
      q.includes('missing') ||
      q.includes('defect') ||
      q.includes('exception')
    ) {
      return 'The AI automatically quarantines damaged units into Bin Q-01, swaps a replacement from Reserve Bay R-04, and files a supplier RMA note.';
    }

    // 13. Worker and robot status
    if (q.includes('robot') || q.includes('bot') || q.includes('worker') || q.includes('staff')) {
      return 'Bot-01, Bot-02, and floor staff are actively picking and transporting items across Shelf Rows A & B at 99.8% on-time efficiency.';
    }

    return 'Smart Warehouse Operations Helper: All systems operational. Order #101 is allocated with 105 priority points, stock buffers are monitored, and $1,850 in late delivery penalty fees have been saved today.';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText: string, actionLabel?: string) => {
    const textToSend = queryText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActionUsed: actionLabel,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    const fallbackResponse = getHardcodedAnswer(textToSend);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: {
            orders: orders.map((o) => ({
              id: o.id,
              client: o.clientName,
              tier: o.tier,
              status: o.status,
              priorityScore: o.priorityScore.total,
              deadline: o.deadlineText,
              items: o.items.map((i) => `${i.quantity}x ${i.name}`),
            })),
            products: products.map((p) => ({
              name: p.name,
              sku: p.sku,
              totalStock: p.totalStock,
              reserved: p.reservedStock,
              location: p.location,
            })),
            bottlenecks: bottlenecks.map((b) => ({
              location: b.location,
              delayMinutes: b.delayMinutes,
              cause: b.cause,
              resolved: b.resolved,
            })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json().catch(() => ({}));
      const replyText = (data && data.reply && typeof data.reply === 'string' && data.reply.trim().length > 0)
        ? data.reply
        : fallbackResponse;

      const assistantMessage: CopilotMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Copilot backend fetch failed, using instant operational answer:', err);
      const fallbackMsg: CopilotMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: fallbackResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-200 ring-1 ring-white/10">
      {/* Drawer Header */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white">Warehouse Helper AI</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">
              Instant answers about orders, items, robots, and delays in plain English
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 5 Instant Quick-Action Chips in Plain English */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-col gap-1.5 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Frequently Asked Questions (Click to Ask)
        </span>
        <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
          {/* Chip 1 */}
          <button
            onClick={() => handleSend('What is this app?', '📌 What is this app? (Overview)')}
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 text-left text-xs text-slate-300 hover:text-white transition-all group shadow-sm shrink-0"
          >
            <span className="flex items-center truncate">
              <Pin className="w-3.5 h-3.5 mr-2 text-indigo-400 shrink-0" />
              <span>📌 What is this app? (Overview)</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 shrink-0 ml-1" />
          </button>

          {/* Chip 2 */}
          <button
            onClick={() => handleSend('Why is Apex Robotics packed first?', '⚡ Why is Apex Robotics packed first?')}
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 text-left text-xs text-slate-300 hover:text-white transition-all group shadow-sm shrink-0"
          >
            <span className="flex items-center truncate">
              <Zap className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" />
              <span>⚡ Why is Apex Robotics packed first?</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 shrink-0 ml-1" />
          </button>

          {/* Chip 3 */}
          <button
            onClick={() => handleSend('What do Aisles & Detours mean?', '🛒 What do Aisles & Detours mean?')}
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 text-left text-xs text-slate-300 hover:text-white transition-all group shadow-sm shrink-0"
          >
            <span className="flex items-center truncate">
              <ShoppingCart className="w-3.5 h-3.5 mr-2 text-emerald-400 shrink-0" />
              <span>🛒 What do Aisles & Detours mean?</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 shrink-0 ml-1" />
          </button>

          {/* Chip 4 */}
          <button
            onClick={() => handleSend('How does AI fix low stock?', '🛠 How does AI fix low stock?')}
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 text-left text-xs text-slate-300 hover:text-white transition-all group shadow-sm shrink-0"
          >
            <span className="flex items-center truncate">
              <Wrench className="w-3.5 h-3.5 mr-2 text-blue-400 shrink-0" />
              <span>🛠 How does AI fix low stock?</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 shrink-0 ml-1" />
          </button>

          {/* Chip 5 */}
          <button
            onClick={() => handleSend('How are savings ($1,850) calculated?', '💰 How are savings ($1,850) calculated?')}
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 text-left text-xs text-slate-300 hover:text-white transition-all group shadow-sm shrink-0"
          >
            <span className="flex items-center truncate">
              <DollarSign className="w-3.5 h-3.5 mr-2 text-amber-300 shrink-0" />
              <span>💰 How are savings ($1,850) calculated?</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 shrink-0 ml-1" />
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.quickActionUsed && (
              <span className="text-[10px] text-indigo-400 font-semibold mb-1">
                Question: {msg.quickActionUsed}
              </span>
            )}
            <div
              className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {/* Formatted lines */}
              <div className="space-y-1.5">
                {msg.text.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 w-fit">
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            <span className="text-xs">Checking live warehouse status...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputQuery);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask anything in simple English (e.g. where is Bot-01?)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-md shadow-indigo-600/30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
