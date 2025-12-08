export interface Purchase {
  id: string;
  invoice: string;
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  total: number;
  status: "Delivered" | "Pending" | "Cancelled";
  itemsCount: number;
}

export const mockPurchases: Purchase[] = [
  {
    id: "1",
    invoice: "INV-2024-001",
    supplier: "PharmaCorp Ltd",
    orderDate: "15/01/2024",
    expectedDelivery: "20/01/2024",
    total: 378.0,
    status: "Delivered",
    itemsCount: 1,
  },
  {
    id: "2",
    invoice: "INV-2024-002",
    supplier: "MediSupply Inc",
    orderDate: "18/01/2024",
    expectedDelivery: "25/01/2024",
    total: 1250.5,
    status: "Pending",
    itemsCount: 5,
  },
  {
    id: "3",
    invoice: "INV-2024-003",
    supplier: "Global Health Distributors",
    orderDate: "20/01/2024",
    expectedDelivery: "28/01/2024",
    total: 4500.0,
    status: "Pending",
    itemsCount: 12,
  },
  {
    id: "4",
    invoice: "INV-2024-004",
    supplier: "PharmaCorp Ltd",
    orderDate: "10/01/2024",
    expectedDelivery: "15/01/2024",
    total: 890.25,
    status: "Delivered",
    itemsCount: 3,
  },
  {
    id: "5",
    invoice: "INV-2024-005",
    supplier: "BioTech Solutions",
    orderDate: "22/01/2024",
    expectedDelivery: "30/01/2024",
    total: 2150.0,
    status: "Pending",
    itemsCount: 8,
  },
];
