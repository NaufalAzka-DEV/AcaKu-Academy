import { serviceLabels, statusLabels } from "./constants";
import type { OrderStatus, ServiceType } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(new Date(value));
}

export function serviceLabel(value: ServiceType) {
  return serviceLabels[value] || value;
}

export function statusLabel(value: OrderStatus) {
  return statusLabels[value] || value;
}
