import {
  ClerkExpressWithAuth,
  ClerkExpressRequireAuth,
} from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";

dotenv.config();

export const verifyClerkToken = ClerkExpressWithAuth({
  apiKey: process.env.CLERK_API_KEY,
  secretKey: process.env.JWT_SECRET,
});

export const requireAuth = ClerkExpressRequireAuth({
  apiKey: process.env.CLERK_API_KEY,
  secretKey: process.env.JWT_SECRET,
});
