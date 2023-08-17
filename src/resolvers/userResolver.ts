import { UserModel, UserDocument } from "../models/user";
import { userSchema } from "../utils/joiSchemas";

interface UserProps {
  walletId?: string;
  fullName?: string;
  businessName?: string;
  profilePic?: string;
  businessLogo?: string;
}

export const userResolver = {
  Query: {
    users: async (): Promise<UserDocument[]> => {
      return await UserModel.find().exec();
    },
    user: async (_: any, { id }: any) => {
      return await UserModel.findById(id);
    },
  },
  Mutation: {
    createUser: async (
      _root: any,
      args: {
        walletId: string;
        fullName: string;
        businessName: string;
        profilePic?: string;
        businessLogo?: string;
      }
    ) => {
      const { walletId, fullName, businessName, businessLogo, profilePic } =
        args;
      await userSchema.validateAsync({
        walletId,
        fullName,
        businessName,
        businessLogo,
        profilePic,
      });
      const newUser = new UserModel({
        walletId,
        fullName,
        businessName,
        businessLogo,
        profilePic,
      });
      await newUser.save();
    },

    loginUser: async (
      _root: any,
      args: {
        walletId: string;
      }
    ): Promise<UserDocument | { error: string }> => {
      const { walletId } = args;
      const user = await UserModel.findOne({ walletId });
      if (!user) {
        return { error: "User not found, kindly register" };
      }
      return user;
    },

    updateUser: async (_root: any, args: { _id: any; input: UserProps }) => {
      const { _id, input } = args;
      return await UserModel.findByIdAndUpdate(_id, input, { new: true });
    },

    deleteUser: async (_root: any, args: { _id: any }) => {
      const { _id } = args;
      return await UserModel.findByIdAndDelete(_id);
    },
  },
};
