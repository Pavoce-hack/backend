import { Request, Response } from "express";
import { invoiceSchema } from "../utils/joiSchemas";
import { invoiceResolver } from "../resolvers/invoiceResolver";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const loggedInUser: any = req.user;
    const userId = loggedInUser?.id;
    req.body["userId"] = userId;
    const { error } = invoiceSchema.validate(req.body);
    if (error) {
      res.status(409).json({
        error: error.details[0].message,
      });
    } else {
      const existingInvoice = await invoiceResolver.Query.invoice(null, {
        invoiceAddress: req.body.invoiceAddress,
      });
      if (existingInvoice) {
        return res
          .status(409)
          .json(
            `Invoice with address:${req.body.invoiceAddress} already exists`
          );
      }
      const newInvoice = await invoiceResolver.Mutation.createInvoice(null, {
        input: req.body,
      });
      if (newInvoice.errors) {
        return res.status(400).json(newInvoice);
      }

      return res
        .status(201)
        .json({ message: "Invoice created successfully", newInvoice });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedInvoice = await invoiceResolver.Mutation.updateInvoice(null, {
      input: { _id: id, field: { ...req.body } },
    });
    if (updatedInvoice.error) {
      return res.status(400).json(updatedInvoice.error);
    }
    return res.status(200).json({
      message: `Invoice with ID: ${id} updated successfully`,
      updatedInvoice,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedInvoice: any = await invoiceResolver.Mutation.deleteInvoice(
      null,
      {
        _id: id,
      }
    );
    if (deletedInvoice.error) {
      return res.status(400).json(deletedInvoice.error);
    }
    return res.status(200).json({
      message: `Invoice with ID: ${id} deleted successfully`,
      deletedInvoice,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const allInvoices = await invoiceResolver.Query.invoices();
    if (!allInvoices) {
      return res.status(404).json({ error: "No invoices found" });
    }
    return res.status(200).json({ allInvoices });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getUserInvoices = async (req: Request, res: Response) => {
  try {
    const loggedInUser: any = req.user;
    const userId = loggedInUser?.id;
    const requiredInvoices = await invoiceResolver.Query.invoiceById(
      null,
      userId
    );
    if (!requiredInvoices) {
      return res
        .status(404)
        .json({ error: `No invoice found for user with ID:${userId}` });
    }
    return res.status(200).json({ requiredInvoices });
  } catch (error) {
    return res.status(500).json(error);
  }
};
