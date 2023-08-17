import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose, { ConnectOptions } from "mongoose";
import { invoiceResolver } from "./resolvers/invoiceResolver";
import { userResolver } from "./resolvers/userResolver";
import invoiceTypeDefs from "./typeDefs/invoiceTypeDefs";
import userTypeDefs from "./typeDefs/userTypeDefs";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import userRoutes from "./routes/user";
import invoiceRoutes from "./routes/invoice";
import { cloudinaryMiddleware } from "./utils/cloudinary";
import jwt from "jsonwebtoken"; // Import the JWT library

interface MongooseOpts {
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
}

dotenv.config();
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Origin", "https://res.cloudinary.com");

  next();
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "../", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cloudinaryMiddleware);
app.use("/user", userRoutes);
app.use("/invoice", invoiceRoutes);

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOpts: ConnectOptions & Partial<MongooseOpts> = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI as string, mongooseOpts);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB successfully!");
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
});

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs: [userTypeDefs, invoiceTypeDefs],
    resolvers: [invoiceResolver, userResolver],
    context: ({ req }) => {
      // Get the token from the request headers
      const token = req.headers.authorization || "";

      // Verify and decode the token
      try {
        const verifiedUser = jwt.verify(
          token.replace("Bearer ", ""),
          process.env.JWT_SECRET as string
        );
        return { authentication: true, user: verifiedUser };
      } catch (error) {
        return { authentication: false, user: null };
      }
    },
  });

  await server.start();

  server.applyMiddleware({ app });
};

startApolloServer().catch((err) =>
  console.error("Error starting Apollo Server:", err)
);

export default app;
