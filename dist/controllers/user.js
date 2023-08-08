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
exports.getUser = exports.getAllUsers = exports.deleteUser = exports.updateUser = exports.loginUser = exports.createUser = void 0;
const joiSchemas_1 = require("../utils/joiSchemas");
const validation_1 = require("../utils/validation");
const userResolver_1 = require("../resolvers/userResolver");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId, fullName, businessName } = req.body;
    const validation = joiSchemas_1.userSchema.validate(req.body);
    try {
        if (validation.error) {
            return res
                .status(400)
                .json({ error: validation.error.details[0].message });
        }
        else {
            const allUsers = yield userResolver_1.userResolver.Query.users();
            const existingUser = allUsers.find((user) => user.walletId === walletId);
            let profilePicUrl;
            let businessLogoUrl;
            if (req.files) {
                const valuesArr = Object.values(req.files).flat();
                profilePicUrl = valuesArr[0].path;
                businessLogoUrl = valuesArr[1].path;
            }
            if (existingUser) {
                const message = "User already exists!!! Login instead";
                return res.status(409).json(message);
            }
            else {
                const newUser = {
                    walletId,
                    fullName,
                    businessName,
                    profilePic: profilePicUrl,
                    businessLogo: businessLogoUrl,
                };
                yield userResolver_1.userResolver.Mutation.createUser(null, newUser);
                const message = "User signed up successfully";
                return res.status(201).json({ message, newUser });
            }
        }
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.body;
    const getToken = process.env.TOKEN;
    try {
        const validUser = joiSchemas_1.loginSchema.validate(req.body);
        if (validUser.error) {
            return res
                .status(400)
                .json({ error: validUser.error.details[0].message });
        }
        const user = yield userResolver_1.userResolver.Mutation.loginUser(null, { walletId });
        if (!user) {
            return res.status(400).json("User not found, kindly register");
        }
        else {
            const id = user._id;
            const token = (0, validation_1.verifyUser)(id, walletId);
            res.cookie(getToken, token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1000 * 7,
            });
            return res
                .status(200)
                .json({ message: "User logged in successfully", user, token });
        }
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.loginUser = loginUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = req.user;
    const { id } = req.params;
    const { walletId, fullName, businessName } = req.body;
    let profilePicUrl;
    let businessLogoUrl;
    if (req.files) {
        const valuesArr = Object.values(req.files).flat();
        profilePicUrl = valuesArr[0].path;
        businessLogoUrl = valuesArr[1].path;
    }
    try {
        const { error } = yield joiSchemas_1.userSchema.validateAsync({
            walletId,
            fullName,
            businessName,
            profilePic: profilePicUrl,
            businessLogo: businessLogoUrl,
        });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const user = yield userResolver_1.userResolver.Query.user(null, { id });
        if (!user) {
            return res.status(404).json(`User with ID:${id} not found`);
        }
        const updatedUser = {
            walletId,
            fullName,
            businessName,
            businessLogo: businessLogoUrl,
            profilePic: profilePicUrl,
        };
        yield userResolver_1.userResolver.Mutation.updateUser(null, {
            _id: id,
            input: updatedUser,
        });
        return res
            .status(200)
            .json({ message: "User updated successfully", updatedUser });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield userResolver_1.userResolver.Mutation.deleteUser(null, {
            _id: id,
        });
        if (!deletedUser) {
            return res.status(404).json(`User with ID:${id} not found`);
        }
        return res.status(200).json({
            message: `User with ID:${id} deleted successfully`,
        });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.deleteUser = deleteUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userResolver_1.userResolver.Query.users();
        if (!allUsers) {
            return res.status(400).json({ message: "No users found" });
        }
        else {
            return res
                .status(200)
                .json({ message: "All users fetched successfully", allUsers });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userResolver_1.userResolver.Query.user(null, { id });
        if (!user) {
            return res.status(400).json({ message: `User with ID: ${id} not found` });
        }
        else {
            return res.status(200).json({ message: "User retrieved successfully", user });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getUser = getUser;
