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
exports.getInvoice = exports.getAllInvoices = exports.deleteInvoice = exports.updateInvoice = exports.createInvoice = void 0;
const joiSchemas_1 = require("../utils/joiSchemas");
const invoiceResolver_1 = require("../resolvers/invoiceResolver");
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = req.user;
        const userId = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id;
        req.body["userId"] = userId;
        const { error } = joiSchemas_1.invoiceSchema.validate(req.body);
        if (error) {
            res.status(409).json({
                error: error.details[0].message,
            });
        }
        else {
            const existingInvoice = yield invoiceResolver_1.invoiceResolver.Query.invoice(null, {
                invoiceAddress: req.body.invoiceAddress,
            });
            if (existingInvoice) {
                return res
                    .status(409)
                    .json(`Invoice with address:${req.body.invoiceAddress} already exists`);
            }
            const newInvoice = yield invoiceResolver_1.invoiceResolver.Mutation.createInvoice(null, {
                input: req.body,
            });
            if (newInvoice.errors) {
                return res.status(400).json(newInvoice);
            }
            console.log(newInvoice);
            return res
                .status(201)
                .json({ message: "Invoice created successfully", newInvoice });
        }
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.createInvoice = createInvoice;
const updateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedInvoice = yield invoiceResolver_1.invoiceResolver.Mutation.updateInvoice(null, {
            input: { _id: id, field: Object.assign({}, req.body) },
        });
        if (updatedInvoice.error) {
            return res.status(400).json(updatedInvoice.error);
        }
        return res.status(200).json({
            message: `Invoice with ID: ${id} updated successfully`,
            updatedInvoice,
        });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.updateInvoice = updateInvoice;
const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedInvoice = yield invoiceResolver_1.invoiceResolver.Mutation.deleteInvoice(null, {
            _id: id,
        });
        if (deletedInvoice.error) {
            return res.status(400).json(deletedInvoice.error);
        }
        return res.status(200).json({
            message: `Invoice with ID: ${id} deleted successfully`,
            deletedInvoice,
        });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.deleteInvoice = deleteInvoice;
const getAllInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allInvoices = yield invoiceResolver_1.invoiceResolver.Query.invoices();
        if (!allInvoices) {
            return res.status(404).json({ error: "No invoices found" });
        }
        return res.status(200).json({ allInvoices });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getAllInvoices = getAllInvoices;
const getInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const requiredInvoice = yield invoiceResolver_1.invoiceResolver.Query.invoiceById(null, {
            _id: id,
        });
        if (!requiredInvoice) {
            return res.status(404).json({ error: `Invoice with ID:${id} not found` });
        }
        return res.status(200).json({ requiredInvoice });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getInvoice = getInvoice;
