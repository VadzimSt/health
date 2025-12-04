export type UserRole = "patient" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  bloodType?: string;
  allergies?: string;
  medicalConditions?: string;
}

export type RequestStatus = "pending" | "approved" | "rejected";

export interface PrescriptionRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  title: string;
  description: string;
  symptoms: string[];
  attachments: Attachment[];
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  doctorNotes?: string;
  prescription?: Prescription;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Prescription {
  id: string;
  requestId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  doctorId: string;
  doctorName: string;
  issuedAt: Date;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}
