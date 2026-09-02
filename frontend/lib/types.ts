export type Role = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type ServiceType = "assignment_help" | "mentoring" | "document_review";

export type OrderStatus = "pending" | "in_progress" | "completed";

export type Order = {
  id: string;
  customerName: string;
  serviceType: ServiceType;
  description: string;
  deadline: string;
  budget: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userEmail?: string;
  invoiceId: string;
};

export type Invoice = {
  invoiceId: string;
  amount: string;
  issuedAt: string;
  orderId: string;
  customerName: string;
  serviceType: ServiceType;
  description: string;
  deadline: string;
  status: OrderStatus;
  userId: string;
  email: string;
  accountName: string;
};
