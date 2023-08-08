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
exports.userResolver = void 0;
const user_1 = require("../models/user");
const joiSchemas_1 = require("../utils/joiSchemas");
exports.userResolver = {
    Query: {
        users: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield user_1.UserModel.find().exec();
        }),
        user: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield user_1.UserModel.findById(id);
        }),
    },
    Mutation: {
        createUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { walletId, fullName, businessName, businessLogo, profilePic } = args;
            yield joiSchemas_1.userSchema.validateAsync({
                walletId,
                fullName,
                businessName,
                businessLogo,
                profilePic,
            });
            const newUser = yield user_1.UserModel.create({
                walletId,
                fullName,
                businessName,
                businessLogo,
                profilePic,
            });
            yield newUser.save();
        }),
        loginUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { walletId } = args;
            const user = yield user_1.UserModel.findOne({ walletId });
            if (!user) {
                throw new Error("Invalid email or password");
            }
            if (user.walletId !== walletId) {
                throw new Error("Invalid email or password");
            }
            return user;
        }),
        updateUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, input } = args;
            return yield user_1.UserModel.findByIdAndUpdate(_id, input, { new: true });
        }),
        deleteUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { _id } = args;
            return yield user_1.UserModel.findByIdAndDelete(_id);
        }),
    },
};
