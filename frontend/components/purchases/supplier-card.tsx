import { Building2, Mail, Phone, MapPin, Pencil, Trash2 } from "lucide-react";

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  addedDate: string;
}

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#212121] dark:bg-[#212121]">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center justify-center rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="flex gap-2">
          <button className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">
            <Pencil className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {supplier.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {supplier.contactPerson}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Mail className="h-4 w-4 text-gray-400" />
          <span>{supplier.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{supplier.phone}</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
          <span>{supplier.address}</span>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-100 pt-4 dark:border-[#2F2F2F]">
        <span className="text-xs text-gray-400">
          Added: {supplier.addedDate}
        </span>
      </div>
    </div>
  );
}
