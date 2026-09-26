"use client";

import { useState } from "react";
import { Plus, ShieldPlus, ReceiptText, Banknote, X } from "lucide-react";
import { useInsurancePanels, useCreateInsurancePanel, useInsuranceLedger, usePayInsurance } from "@/hooks/useInsurance";
import { toast } from "react-hot-toast";

export default function InsurancePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState<number | null>(null);
  
  const { data: panels = [], isLoading } = useInsurancePanels();

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6 max-w-7xl mx-auto">
      {/* Left Sidebar - Panels List */}
      <div className="w-1/3 flex flex-col bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <h2 className="font-bold">Insurance Panels</h2>
          <button onClick={() => setShowCreateModal(true)} className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : panels.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              <ShieldPlus className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
              No panels configured
            </div>
          ) : (
            panels.map((panel: any) => (
              <button
                key={panel.id}
                onClick={() => setSelectedPanelId(panel.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedPanelId === panel.id 
                    ? "border-primary bg-primary/5 dark:bg-primary/10" 
                    : "border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                <div className="font-bold text-sm">{panel.name}</div>
                <div className="flex justify-between mt-1 text-xs text-zinc-500">
                  <span>{panel.discount_percentage}% claim</span>
                  <span className={panel.receivable_balance > 0 ? "text-amber-600 font-bold" : ""}>
                    Owes: {Number(panel.receivable_balance).toFixed(2)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Content - Ledger */}
      <div className="flex-1 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        {selectedPanelId ? (
          <LedgerView panelId={selectedPanelId} panel={panels.find((p: any) => p.id === selectedPanelId)} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400">
            <ReceiptText className="h-16 w-16 mb-4 opacity-20" />
            <p>Select an insurance panel to view its ledger</p>
          </div>
        )}
      </div>

      {showCreateModal && <CreatePanelModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

function LedgerView({ panelId, panel }: { panelId: number, panel: any }) {
  const { data: ledger = [], isLoading } = useInsuranceLedger(panelId);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
        <div>
          <h2 className="text-xl font-bold">{panel?.name} Ledger</h2>
          <p className="text-sm text-zinc-500">Total Receivable: <span className="font-bold text-amber-600">{Number(panel?.receivable_balance).toFixed(2)}</span></p>
        </div>
        <button 
          onClick={() => setShowPaymentModal(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Banknote className="h-4 w-4" /> Record Payment
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 sticky top-0">
            <tr>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Reference</th>
              <th className="px-6 py-3 font-semibold text-right text-red-500">Claimed (Dr)</th>
              <th className="px-6 py-3 font-semibold text-right text-green-500">Paid (Cr)</th>
              <th className="px-6 py-3 font-semibold text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {ledger.map((entry: any) => (
              <tr key={entry.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                <td className="px-6 py-3 text-zinc-500">{new Date(entry.created_at).toLocaleString()}</td>
                <td className="px-6 py-3">
                  <div className="font-medium text-foreground capitalize">{entry.reference_type}</div>
                  {entry.notes && <div className="text-[10px] text-zinc-400 mt-0.5">{entry.notes}</div>}
                </td>
                <td className="px-6 py-3 text-right text-red-600 font-medium">{Number(entry.debit) > 0 ? Number(entry.debit).toFixed(2) : '-'}</td>
                <td className="px-6 py-3 text-right text-green-600 font-medium">{Number(entry.credit) > 0 ? Number(entry.credit).toFixed(2) : '-'}</td>
                <td className="px-6 py-3 text-right font-bold">{Number(entry.balance_after).toFixed(2)}</td>
              </tr>
            ))}
            {ledger.length === 0 && !isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No transactions recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {showPaymentModal && <PaymentModal panelId={panelId} onClose={() => setShowPaymentModal(false)} />}
    </div>
  );
}

function CreatePanelModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("0");
  const createPanel = useCreateInsurancePanel();

  const handleSubmit = async () => {
    try {
      await createPanel.mutateAsync({ name, discount_percentage: Number(discount) });
      toast.success("Panel created");
      onClose();
    } catch (e) {
      toast.error("Failed to create panel");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-bold">New Insurance Panel</h2>
          <button onClick={onClose}><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500">Company Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800" />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500">Claim Percentage (%)</label>
            <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full mt-1 p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800" />
          </div>
          <button onClick={handleSubmit} disabled={createPanel.isPending} className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-xl">Save Panel</button>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ panelId, onClose }: { panelId: number, onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const payInsurance = usePayInsurance();

  const handleSubmit = async () => {
    try {
      await payInsurance.mutateAsync({ panelId, amount: Number(amount), notes });
      toast.success("Payment recorded");
      onClose();
    } catch (e) {
      toast.error("Failed to record payment");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-bold">Record Insurance Payment</h2>
          <button onClick={onClose}><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500">Amount Received</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full mt-1 p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800" />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500">Reference / Check No</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full mt-1 p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800" />
          </div>
          <button onClick={handleSubmit} disabled={payInsurance.isPending} className="w-full bg-primary text-white font-bold py-2 rounded-xl">Save Payment</button>
        </div>
      </div>
    </div>
  );
}
