"use client";

import { useRefills, useMarkRefillSent } from "@/hooks/useRefill";
import { MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RefillsPage() {
  const { data: refills = [], isLoading } = useRefills();
  const markSent = useMarkRefillSent();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  const handleSendWhatsApp = async (refill: any) => {
    const text = `Dear ${refill.customer_name}, your refill for ${refill.medicine_name} is due on ${new Date(refill.next_refill_date).toLocaleDateString()}. Please let us know if you'd like us to prepare it.`;
    
    // Attempt to mark as sent immediately
    try {
      await markSent.mutateAsync(refill.id);
      toast.success("Marked as sent!");
    } catch (e) {
      toast.error("Failed to mark sent");
    }

    if (refill.customer_phone) {
      const url = `https://wa.me/${refill.customer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    } else {
      toast.error("No phone number for customer. Please contact manually.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Refill Reminders
        </h2>
        <p className="text-sm text-gray-500">Automated notifications for chronic medications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {refills.map((refill) => {
          const daysLeft = Math.ceil((new Date(refill.next_refill_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          
          return (
            <div key={refill.id} className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{refill.customer_name}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${daysLeft <= 3 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                    {daysLeft <= 0 ? "Due Today!" : `In ${daysLeft} Days`}
                  </span>
                </div>
                <div className="space-y-1 mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Medicine:</strong> {refill.medicine_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Date:</strong> {new Date(refill.next_refill_date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Phone:</strong> {refill.customer_phone || "N/A"}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleSendWhatsApp(refill)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Send WhatsApp
              </button>
            </div>
          );
        })}
      </div>
      
      {refills.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">All caught up!</h3>
          <p className="mt-1 text-xs text-gray-500">No pending refill reminders at this time.</p>
        </div>
      )}
    </div>
  );
}
