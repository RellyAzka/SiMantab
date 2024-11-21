
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const addUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string()
    .valid("ADMIN", "SUPER_ADMIN", "SELLER", "CUSTOMER")
    .optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  verifEmail: Joi.boolean().optional(),
  role: Joi.string()
    .valid("ADMIN", "SUPER_ADMIN", "SELLER", "CUSTOMER")
    .optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const addUserValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addUserSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({ status: false, message: error });
  }
};

export const updateUserValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updateUserSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({ status: false, message: error });
  }
};

export const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await loginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({ status: false, message: error });
  }
};
