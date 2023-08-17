import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
    fullName: string;
    walletId: string;
    businessName: string;
    profilePic: string;
    businessLogo: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export const UserSchema = new Schema<UserDocument>(
    {
      fullName: { type: String, required: true },
      walletId: { type: String, required: true, unique: true },
      businessName: { type: String, required: true },
      profilePic: { type: String },
      businessLogo: { type: String },
    },
    {
      timestamps: true,
    }
  );
  
export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
