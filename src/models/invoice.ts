import mongoose, { Schema, model } from "mongoose";

interface Service {
  title: string;
  description: string;
  quantity: number;
  rate: number;
}

enum InvoiceStatus {
  APPROVED = "Approved",
  COMPLETE = "Complete",
  DISPUTED = "Disputed",
  PAID = "Paid",
  PENDING = "Pending",
}

export interface InvoiceDocument {
  invoiceAddress: string;
  userId: string;
  amount: number;
  currency: string;
  paymentType: string;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  services: Service[];
  startDate: String;
  endDate: String;
  duration: number;
  installment: number;
  initialDeposit: number;
  discount: number;
  termsAndConditions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    invoiceAddress: { type: String, required: false, unique: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentType: { type: String, required: true },
    status: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    services: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
      },
    ],
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    duration: { type: Number, required: true },
    installment: { type: Number, required: true },
    initialDeposit: { type: Number, required: true },
    discount: { type: Number, required: true },
    termsAndConditions: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);
export const InvoiceModel = model<InvoiceDocument>("Invoice", invoiceSchema);
