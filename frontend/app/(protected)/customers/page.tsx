"use client";

import { useState } from "react";
import { 
  useCustomers, 
  useCreateCustomer, 
  Customer 
} from "@/hooks/useCustomer";
import { Plus, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";
import { CustomerLedgerModal } from "@/components/customers/customer-ledger-modal";

export default function CustomersPage() {
  const { data: customers = [], isLoading, refetch } = useCustomers();
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [ledgerCustomerId, setLedgerCustomerId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    credit_limit: 1000,
  });

  const createCustomer = useCreateCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCustomer.mutateAsync(formData);
      toast.success("Customer created successfully");
      setIsAddingCustomer(false);
      setFormData({ name: "", phone: "", address: "", credit_limit: 1000 });
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Something went wrong");
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Customers & Khata
          </h2>
          <p className="text-sm text-gray-500">Manage customer credit accounts</p>
        </div>
        <button
          onClick={() => setIsAddingCustomer(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {isAddingCustomer && (
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Add New Customer
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Credit Limit ($)</label>
              <input type="number" required value={formData.credit_limit} onChange={(e) => setFormData({...formData, credit_limit: Number(e.target.value)})} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700" />
            </div>
            <div className="md:col-span-2 mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddingCustomer(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800 transition">Cancel</button>
              <button type="submit" disabled={createCustomer.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition">
                Add Customer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Credit Limit</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Outstanding</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900 dark:text-gray-300">{customer.phone || "-"}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  ${customer.credit_limit}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-semibold ${customer.outstanding_balance > 0 ? "text-red-600" : "text-green-600"}`}>
                    ${customer.outstanding_balance}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setLedgerCustomerId(customer.id)} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 dark:bg-blue-900/20 dark:text-blue-400 transition" title="View Ledger">
                    <BookOpen className="w-4 h-4" /> Khata
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No customers found. Click "Add Customer" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {ledgerCustomerId && (
        <CustomerLedgerModal 
          customerId={ledgerCustomerId} 
          onClose={() => setLedgerCustomerId(null)} 
        />
      )}
    </div>
  );
}
