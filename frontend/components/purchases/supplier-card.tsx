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
 <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm dark:border-[#212121] dark:bg-neutral-900">
 <div className="mb-6 flex items-start justify-between">
 <div className="flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary dark:bg-blue-900/20 dark:text-blue-400">
 <Building2 className="h-6 w-6" />
 </div>
 <div className="flex gap-2">
 <button className="rounded-full p-2 text-primary hover:bg-primary/10 dark:text-blue-400 dark:hover:bg-blue-900/20">
 <Pencil className="h-4 w-4" />
 </button>
 <button className="rounded-full p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
 <Trash2 className="h-4 w-4" />
 </button>
 </div>
 </div>

 <div className="mb-6">
 <h3 className="h3 text-lg font-semibold text-card-foreground">
 {supplier.name}
 </h3>
 <p className="text-sm text-muted-foreground">
 {supplier.contactPerson}
 </p>
 </div>

 <div className="mb-6 flex flex-col gap-3">
 <div className="flex items-center gap-3 text-sm text-muted-foreground">
 <Mail className="h-4 w-4 text-muted-foreground" />
 <span>{supplier.email}</span>
 </div>
 <div className="flex items-center gap-3 text-sm text-muted-foreground">
 <Phone className="h-4 w-4 text-muted-foreground" />
 <span>{supplier.phone}</span>
 </div>
 <div className="flex items-start gap-3 text-sm text-muted-foreground">
 <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
 <span>{supplier.address}</span>
 </div>
 </div>

 <div className="mt-auto border-t border-border pt-4 ">
 <span className="text-xs text-muted-foreground">
 Added: {supplier.addedDate}
 </span>
 </div>
 </div>
 );
}
