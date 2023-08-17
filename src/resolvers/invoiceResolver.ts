import { InvoiceModel, InvoiceDocument } from "../models/invoice";
import { invoiceSchema } from "../utils/joiSchemas";

export const invoiceResolver = {
  Query: {
    invoices: async (): Promise<InvoiceDocument[]> => {
      return await InvoiceModel.find().exec();
    },
    invoice: async (
      _root: any,
      { invoiceAddress }: any
    ): Promise<InvoiceDocument | null> => {
      try {
        return await InvoiceModel.findOne({ invoiceAddress });
      } catch (error: any) {
        return error;
      }
    },
    invoiceById: async (
      _root: any,
      userId: string
    ): Promise<InvoiceDocument[] | null> => {
      try {
        return await InvoiceModel.find({ userId });
      } catch (error: any) {
        return error;
      }
    },
  },
  Mutation: {
    createInvoice: async (_root: any, { input }: any) => {
      try {
        await invoiceSchema.validateAsync(input);
        const newInvoice = new InvoiceModel(input);
        await newInvoice.save();
        return newInvoice;
      } catch (error: any) {
        return error;
      }
    },
    updateInvoice: async (_root: any, { input }: any) => {
      try {
        const { _id, field } = input;
        const updateFields: Record<string, any> = field;
        const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
          _id,
          updateFields,
          { new: true }
        );
        if (!updatedInvoice) {
          return { error: "Invoice not found" };
        }
        await updatedInvoice.save();
        return updatedInvoice;
      } catch (error: any) {
        return error;
      }
    },
    deleteInvoice: async (_root: any, { _id }: any) => {
      try {
        const deletedInvoice = await InvoiceModel.findByIdAndDelete(_id);
        if (!deletedInvoice) {
          return { error: "Invoice not found" };
        }
        return deletedInvoice;
      } catch (error) {
        return error;
      }
    },
  },
};
