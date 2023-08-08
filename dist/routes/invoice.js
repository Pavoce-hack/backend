"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoice_1 = require("../controllers/invoice");
const validation_1 = require("../utils/validation");
const router = express_1.default.Router();
router.post("/create", validation_1.verifyToken, invoice_1.createInvoice);
router.patch("/update/:id", validation_1.verifyToken, invoice_1.updateInvoice);
router.delete("/delete/:id", validation_1.verifyToken, invoice_1.deleteInvoice);
router.get("/all", validation_1.verifyToken, invoice_1.getAllInvoices);
router.get("/:id", validation_1.verifyToken, invoice_1.getInvoice);
exports.default = router;
