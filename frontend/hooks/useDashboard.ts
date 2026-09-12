import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  totalProducts: number;
  lowStockCount: number;
  totalRevenue: number;
  activeUsers: number;
}

export interface LowStockItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  time: string;
  type: "sale" | "restock" | "order";
  amount?: string;
  status?: string;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [salesRes, medicinesRes, usersRes] = await Promise.all([
        api.get("/sale/", { params: { page_size: 1000 } }),
        api.get("/medicine", { params: { page_size: 1000 } }),
        api.get("/user"),
      ]);

      const sales = salesRes.data?.items || [];
      const medicines = medicinesRes.data?.items || [];
      const users = usersRes.data || [];

      const today = new Date().toISOString().split("T")[0];
      const todaySales = sales.filter((sale: any) => 
        sale.created_at?.startsWith(today)
      );
      
      const todaySalesTotal = todaySales.reduce(
        (sum: number, sale: any) => sum + parseFloat(sale.final_amount || "0"),
        0
      );

      const totalRevenue = sales.reduce(
        (sum: number, sale: any) => sum + parseFloat(sale.final_amount || "0"),
        0
      );

      const lowStockMedicines = medicines.filter(
        (med: any) => med.quantity <= 10 && med.is_active
      );

      const activeUsers = users.filter((user: any) => user.is_active);

      return {
        todaySales: todaySalesTotal,
        todayTransactions: todaySales.length,
        totalProducts: medicines.length,
        lowStockCount: lowStockMedicines.length,
        totalRevenue,
        activeUsers: activeUsers.length,
        lowStockItems: lowStockMedicines.slice(0, 5),
      };
    },
    refetchInterval: 30000,
  });
};

export const useLowStockMedicines = () => {
  return useQuery({
    queryKey: ["low-stock-medicines"],
    queryFn: async () => {
      const { data } = await api.get("/medicine", {
        params: { page_size: 1000, is_active: true },
      });
      const medicines = data?.items || [];
      return medicines
        .filter((med: any) => med.quantity <= 10)
        .map((med: any) => ({
          id: med.id.toString(),
          title: med.name,
          subtitle: `${med.quantity} ${med.unit} remaining`,
          tag: "Low Stock",
          tagColor: "bg-red-100 text-red-700",
        }));
    },
  });
};

export const useRecentSales = () => {
  return useQuery({
    queryKey: ["recent-sales"],
    queryFn: async () => {
      const { data } = await api.get("/sale/", {
        params: { page_size: 5, sort_by: "created_at", sort_order: "desc" },
      });
      const sales = data?.items || [];
      return sales.map((sale: any) => ({
        id: sale.id.toString(),
        title: "New Sale",
        time: new Date(sale.created_at).toLocaleString(),
        type: "sale" as const,
        amount: `+$${parseFloat(sale.final_amount).toFixed(2)}`,
      }));
    },
  });
};
