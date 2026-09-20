"use client";

import { useAlternatives } from "@/hooks/useMedicine";
import { X, PackagePlus } from "lucide-react";

interface Props {
  medicine: any;
  onClose: () => void;
  onAddToCart: (medicine: any) => void;
}

export function AlternativesModal({ medicine, onClose, onAddToCart }: Props) {
  const { data: alternatives, isLoading } = useAlternatives(medicine.id);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Out of Stock Alternatives
            </h3>
            <p className="text-sm text-red-500 mt-0.5">{medicine.name} is unavailable.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {!medicine.generic_salt && (
            <div className="text-center py-6 text-gray-500">
              No generic salt linked to this medicine. Cannot find alternatives.
            </div>
          )}
          
          {medicine.generic_salt && isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {medicine.generic_salt && !isLoading && (!alternatives || alternatives.length === 0) && (
            <div className="text-center py-6 text-gray-500">
              No in-stock alternatives found for {medicine.generic_salt}.
            </div>
          )}

          {medicine.generic_salt && !isLoading && alternatives && alternatives.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Suggested Substitutes ({medicine.generic_salt})
              </p>
              {alternatives.map((alt: any) => (
                <div key={alt.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900/50 bg-gray-50 dark:bg-zinc-800/50 transition">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{alt.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Stock: {alt.quantity} {alt.unit} • ${alt.selling_price}</p>
                  </div>
                  <button
                    onClick={() => {
                      onAddToCart(alt);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-200 transition"
                  >
                    <PackagePlus className="w-3.5 h-3.5" />
                    ADD
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
