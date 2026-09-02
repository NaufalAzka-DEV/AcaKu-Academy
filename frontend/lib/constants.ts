import type { OrderStatus, ServiceType } from "./types";

export const serviceLabels: Record<ServiceType, string> = {
  assignment_help: "Assignment Help",
  mentoring: "Mentoring",
  document_review: "Document Review"
};

export const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed"
};

export const services: Array<{
  type: ServiceType;
  title: string;
  summary: string;
  details: string[];
}> = [
  {
    type: "assignment_help",
    title: "Assignment Help",
    summary: "Structured academic support for essays, reports, problem sets, and presentations.",
    details: ["Brief review", "Source planning", "Draft feedback", "Submission checklist"]
  },
  {
    type: "mentoring",
    title: "Mentoring",
    summary: "One-on-one guidance for study planning, research direction, and academic confidence.",
    details: ["Study roadmap", "Concept coaching", "Research direction", "Progress check-ins"]
  },
  {
    type: "document_review",
    title: "Document Review",
    summary: "Clear feedback on grammar, structure, citations, and academic presentation.",
    details: ["Grammar pass", "Structure notes", "Citation review", "Final polish"]
  }
];

export const statuses: OrderStatus[] = ["pending", "in_progress", "completed"];
