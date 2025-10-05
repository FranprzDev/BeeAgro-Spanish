export interface Order {
  id: string
  customer: string
  product: string
  quantity: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  date: string
}

export const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "João Silva",
    product: "Fertilizante Orgânico 50kg",
    quantity: 10,
    total: 1500.0,
    status: "delivered",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Maria Santos",
    product: "Sementes de Milho Premium",
    quantity: 5,
    total: 750.0,
    status: "processing",
    date: "2024-01-18",
  },
  {
    id: "ORD-003",
    customer: "Pedro Oliveira",
    product: "Adubo NPK 20kg",
    quantity: 20,
    total: 2400.0,
    status: "shipped",
    date: "2024-01-20",
  },
  {
    id: "ORD-004",
    customer: "Ana Costa",
    product: "Defensivo Agrícola",
    quantity: 3,
    total: 450.0,
    status: "pending",
    date: "2024-01-22",
  },
  {
    id: "ORD-005",
    customer: "Carlos Ferreira",
    product: "Fertilizante Líquido 10L",
    quantity: 8,
    total: 960.0,
    status: "cancelled",
    date: "2024-01-23",
  },
  {
    id: "ORD-006",
    customer: "Lucia Almeida",
    product: "Sementes de Soja",
    quantity: 15,
    total: 2250.0,
    status: "delivered",
    date: "2024-01-25",
  },
]

export const filteredOrders = orders
