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
  DEPOSIT = "Deposit",
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
  startDate: Date;
  endDate: Date;
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
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);
export const InvoiceModel = model<InvoiceDocument>("Invoice", invoiceSchema);
