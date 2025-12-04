import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { PrescriptionRequest, Prescription, Attachment } from "@/types";

interface RequestsContextType {
  requests: PrescriptionRequest[];
  createRequest: (data: CreateRequestData) => Promise<PrescriptionRequest>;
  updateRequestStatus: (
    requestId: string,
    status: "approved" | "rejected",
    notes?: string
  ) => Promise<void>;
  issuePrescription: (
    requestId: string,
    prescription: Omit<Prescription, "id" | "requestId" | "issuedAt">
  ) => Promise<void>;
  getRequestById: (id: string) => PrescriptionRequest | undefined;
  getRequestsByPatientId: (patientId: string) => PrescriptionRequest[];
}

interface CreateRequestData {
  patientId: string;
  patientName: string;
  patientEmail: string;
  title: string;
  description: string;
  symptoms: string[];
  attachments: Attachment[];
}

const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);

// Mock initial requests
const initialRequests: PrescriptionRequest[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Anna Smith",
    patientEmail: "patient@demo.com",
    title: "Antidepressant Prescription Extension",
    description:
      "Taking sertraline 50mg for 6 months. Feeling good, would like to extend the prescription.",
    symptoms: ["Anxiety", "Sleep Disorders"],
    attachments: [
      {
        id: "1",
        name: "previous_prescription.pdf",
        type: "application/pdf",
        size: 245000,
        url: "#",
      },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    patientId: "1",
    patientName: "Anna Smith",
    patientEmail: "patient@demo.com",
    title: "Consultation Regarding Panic Attacks",
    description:
      "Panic attacks have increased in the last month. Please consider prescribing medication.",
    symptoms: ["Panic Attacks", "Increased Heart Rate", "Dizziness"],
    attachments: [],
    status: "approved",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    doctorNotes: "Recommend starting with the minimum dose.",
    prescription: {
      id: "p1",
      requestId: "2",
      medication: "Alprazolam",
      dosage: "0.25 mg",
      frequency: "As needed, no more than 2 times a day",
      duration: "2 weeks",
      instructions:
        "Take when panic symptoms appear. Do not combine with alcohol.",
      doctorId: "2",
      doctorName: "Dr. John Doe",
      issuedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  },
];

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] =
    useState<PrescriptionRequest[]>(initialRequests);

  const createRequest = useCallback(
    async (data: CreateRequestData): Promise<PrescriptionRequest> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newRequest: PrescriptionRequest = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setRequests((prev) => [newRequest, ...prev]);
      return newRequest;
    },
    []
  );

  const updateRequestStatus = useCallback(
    async (
      requestId: string,
      status: "approved" | "rejected",
      notes?: string
    ) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, status, doctorNotes: notes, updatedAt: new Date() }
            : req
        )
      );
    },
    []
  );

  const issuePrescription = useCallback(
    async (
      requestId: string,
      prescriptionData: Omit<Prescription, "id" | "requestId" | "issuedAt">
    ) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const prescription: Prescription = {
        id: Math.random().toString(36).substr(2, 9),
        requestId,
        ...prescriptionData,
        issuedAt: new Date(),
      };

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "approved",
                prescription,
                updatedAt: new Date(),
              }
            : req
        )
      );
    },
    []
  );

  const getRequestById = useCallback(
    (id: string) => {
      return requests.find((req) => req.id === id);
    },
    [requests]
  );

  const getRequestsByPatientId = useCallback(
    (patientId: string) => {
      return requests.filter((req) => req.patientId === patientId);
    },
    [requests]
  );

  return (
    <RequestsContext.Provider
      value={{
        requests,
        createRequest,
        updateRequestStatus,
        issuePrescription,
        getRequestById,
        getRequestsByPatientId,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
}
