import Joi from "joi";

export const serviceSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  quantity: Joi.number().required(),
  rate: Joi.number().required(),
});

export const invoiceSchema = Joi.object({
  invoiceAddress: Joi.string().required(),
  userId: Joi.string().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  paymentType: Joi.string().required(),
  status: Joi.string().required(),
  clientName: Joi.string().required(),
  clientEmail: Joi.string().email().required(),
  services: Joi.array().items(serviceSchema).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  duration: Joi.number().required(),
  installment: Joi.number().required(),
  initialDeposit: Joi.number().required(),
  discount: Joi.number().required(),
  termsAndConditions: Joi.array().items(Joi.string()).required(),
});

export const userSchema = Joi.object({
  walletId: Joi.string().required(),
  fullName: Joi.string().required(),
  profilePic: Joi.string().allow(""),
  businessName: Joi.string().required(),
  businessLogo: Joi.string().allow(""),
});

export const loginSchema = Joi.object({
  walletId: Joi.string().required(),
});
