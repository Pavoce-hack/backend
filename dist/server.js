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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const invoiceResolver_1 = require("./resolvers/invoiceResolver");
const userResolver_1 = require("./resolvers/userResolver");
const invoiceTypeDefs_1 = __importDefault(require("./typeDefs/invoiceTypeDefs"));
const userTypeDefs_1 = __importDefault(require("./typeDefs/userTypeDefs"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const user_1 = __importDefault(require("./routes/user"));
const invoice_1 = __importDefault(require("./routes/invoice"));
const cloudinary_1 = require("./utils/cloudinary");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, express_session_1.default)({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../", "public")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(cloudinary_1.cloudinaryMiddleware);
app.use("/user", user_1.default);
app.use("/invoice", invoice_1.default);
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose_1.default.connect(MONGODB_URI, mongooseOpts);
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB successfully!");
    app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}`);
    });
});
const startApolloServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs: [userTypeDefs_1.default, invoiceTypeDefs_1.default],
        resolvers: [invoiceResolver_1.invoiceResolver, userResolver_1.userResolver],
    });
    yield server.start();
    server.applyMiddleware({ app });
});
startApolloServer().catch((err) => console.error("Error starting Apollo Server:", err));
exports.default = app;
