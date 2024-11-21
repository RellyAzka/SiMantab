import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const addProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  categoryId: Joi.number().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().optional(),
  description: Joi.string().optional(),
  categoryId: Joi.number().optional(),
});

export const addProductValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addProductSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({ status: false, message: error });
  }
};

export const updateProductValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updateProductSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({ status: false, message: error });
  }
};