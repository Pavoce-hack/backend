"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const validation_1 = require("../utils/validation");
const router = express_1.default.Router();
router.post("/register", user_1.createUser);
router.post("/login", user_1.loginUser);
router.put("/update/:id", validation_1.verifyToken, user_1.updateUser);
router.delete("/delete/:id", validation_1.verifyToken, user_1.deleteUser);
router.get("/all", validation_1.verifyToken, user_1.getAllUsers);
router.get("/:id", validation_1.verifyToken, user_1.getUser);
exports.default = router;
