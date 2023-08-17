import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config();

// Generate a JWT containing the user payload
const cookie = process.env.TOKEN as string;

export const verifyUser = (id: any, walletId: string) => {
  const token = jwt.sign(
    {
      walletId,
      id,
    },
    process.env.JWT_SECRET as string
  );
  return token;
};

export const verifyToken = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];    
    if (authHeader) {
      const token = authHeader.split(" ")[1]; // Split the 'Bearer ' prefix
      const verifiedUser = jwt.verify(token, process.env.JWT_SECRET as string);
      if (verifiedUser) {
        req.authentication = true;
        req.user = verifiedUser;
        next();
      } else {
        return res.status(400).json("Invalid token");
      }
    } else {
      return res.status(401).json("Unauthorized");
    }
  } catch (error) {
    console.log('error');
    return res.status(500).json(error);
  }
};

/*  try {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Split the 'Bearer ' prefix
      const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
      if (verifiedUser) {
        req.authentication = true;
        req.user = verifiedUser;
        next();
      } else {
        return res.status(400).json('Invalid token');
      }
    } else {
      return res.status(401).json('Unauthorized');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
  
  */
