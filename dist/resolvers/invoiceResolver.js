"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceResolver = void 0;
const invoice_1 = require("../models/invoice");
const joiSchemas_1 = require("../utils/joiSchemas");
exports.invoiceResolver = {
    Query: {
        invoices: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield invoice_1.InvoiceModel.find().exec();
        }),
        invoice: (_root, { invoiceAddress }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                return yield invoice_1.InvoiceModel.findOne({ invoiceAddress });
            }
            catch (error) {
                return error;
            }
        }),
        invoiceById: (_root, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                return yield invoice_1.InvoiceModel.findById({ _id });
            }
            catch (error) {
                return error;
            }
        }),
    },
    Mutation: {
        createInvoice: (_root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield joiSchemas_1.invoiceSchema.validateAsync(input);
                const newInvoice = new invoice_1.InvoiceModel(input);
                yield newInvoice.save();
                return newInvoice;
            }
            catch (error) {
                return error;
            }
        }),
        updateInvoice: (_root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { _id, field } = input;
                const updateFields = field;
                const updatedInvoice = yield invoice_1.InvoiceModel.findByIdAndUpdate(_id, updateFields, { new: true });
                if (!updatedInvoice) {
                    return { error: "Invoice not found" };
                }
                yield updatedInvoice.save();
                return updatedInvoice;
            }
            catch (error) {
                return error;
            }
        }),
        deleteInvoice: (_root, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const deletedInvoice = yield invoice_1.InvoiceModel.findByIdAndDelete(_id);
                if (!deletedInvoice) {
                    return { error: "Invoice not found" };
                }
                return deletedInvoice;
            }
            catch (error) {
                return error;
            }
        }),
    },
};
