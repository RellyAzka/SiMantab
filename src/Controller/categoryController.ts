import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { BASE_URL } from "../global";
import fs from "fs";
import {
  createCategory as createCategoryQuery,
  updateCategory as updateCategoryQuery,
  deleteCategory as deleteCategoryQuery,
} from "../Queries/Category";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const allCategories = await prisma.category.findMany({
      where: { name: { contains: search?.toString() || "" } },
    });
    return res
      .json({
        status: true,
        data: allCategories,
        message: "Categories has retrieved succsessfully",
      })
      .status(200);
  } catch (error) {
    return res.json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const data = await createCategoryQuery(req.body);
    return res
      .json({
        status: true,
        data: data,
        message: "Category has created succsessfully",
      })
      .status(200);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await updateCategoryQuery(req.body, id);
    return res
      .json({
        status: true,
        data: data,
        message: "Category has updated succsessfully",
      })
      .status(200);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = deleteCategoryQuery(id);
    return res
      .json({
        status: true,
        message: "Category has deleted succsess",
      })
      .status(200);
  } catch (error) {
    return res
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};