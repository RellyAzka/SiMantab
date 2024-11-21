import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { BASE_URL } from "../global";
import fs from "fs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, categoryId } = req.body;
    const user = req.body.user;

    console.log(user);

    const newProduct = await prisma.product.create({
      data: { name, description, price, categoryId, sellerId: user.idUser },
    });

    return res
      .json({
        status: true,
        data: newProduct,
        message: "Product has created succsessfully",
      })
      .status(201);
  } catch (error) {
    const user = req.body.user;
    console.log(user);
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const getSellerProducts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const user = req.body.user;
    const allProducts = await prisma.product.findMany({
      where: {
        name: { contains: search?.toString() || "" },
        sellerId: user.idUser,
      },
    });

    return res
      .json({
        status: true,
        data: allProducts,
        message: "Products has retrieved succsessfully",
      })
      .status(200);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const updateSellerProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const user = req.body.user;
    const findProduct = await prisma.product.findFirst({
      where: { id: id, sellerId: user.idUser },
    });
    if (!findProduct) {
      return res
        .json({
          status: false,
          message: "Product not found",
        })
        .status(404);
    }
    const updateProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name: name,
        description: description,
        price: price,
      },
    });

    return res
      .json({
        status: true,
        data: updateProduct,
        message: "Product has updated succsessfully",
      })
      .status(200);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const deleteSellerProduct = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const { id } = req.params;
    const findProduct = await prisma.product.findFirst({
      where: { id: id, sellerId: user.idUser },
    });
    if (!findProduct) {
      return res
        .json({
          status: false,
          message: "Product not found",
        })
        .status(404);
    }

    await prisma.product.delete({
      where: { id: id, sellerId: user.idUser },
    });

    return res
      .json({
        status: true,
        message: "Product has deleted succsessfully",
      })
      .status(200);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};