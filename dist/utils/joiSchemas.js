"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userSchema = exports.invoiceSchema = exports.serviceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.serviceSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    quantity: joi_1.default.number().required(),
    rate: joi_1.default.number().required(),
});
exports.invoiceSchema = joi_1.default.object({
    invoiceAddress: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
    currency: joi_1.default.string().required(),
    paymentType: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
    clientName: joi_1.default.string().required(),
    clientEmail: joi_1.default.string().email().required(),
    services: joi_1.default.array().items(exports.serviceSchema).required(),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required(),
});
exports.userSchema = joi_1.default.object({
    walletId: joi_1.default.string().required(),
    fullName: joi_1.default.string().required(),
    profilePic: joi_1.default.string().allow(""),
    businessName: joi_1.default.string().required(),
    businessLogo: joi_1.default.string().allow(""),
});
exports.loginSchema = joi_1.default.object({
    walletId: joi_1.default.string().required(),
});
