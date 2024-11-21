import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { BASE_URL } from "../global";
import fs from "fs";
import {
  CartFindFirstSchema,
  CartItemCreateSchema,
  UserFindUniqueSchema,
} from "../../prisma/generated/schemas";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getCart = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const cart = await prisma.cart.findMany({
      where: {
        userId: user.idUser,
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      const newCart = await prisma.cart.create({
        data: {
          userId: user.idUser,
          user: {
            connect: { id: user.idUser },
          },
          items: {
            create: [],
          },
        },
        include: {
          items: true,
        },
      });
      return res.json({
        status: true,
        data: newCart,
        message: "Cart has retrieved succsessfully",
      });
    } else {
      return res
        .json({
          status: true,
          data: cart,
          message: "Cart has retrieved succsessfully",
        })
        .status(200);
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const { productId, quantity } = req.body;
    let cart = await prisma.cart.findUnique({
      where: {
        userId: user.idUser,
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.idUser,
          items: {
            create: [
              {
                productId: productId,
                quantity: quantity,
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        // Add a new item to the cart
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: productId,
            quantity: quantity,
          },
        });
      }
    }

    const updatedCart = await prisma.cart.findUnique({
      where: {
        userId: user.idUser,
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json({
      status: true,
      data: updatedCart,
      message: "Product has been added to the cart successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

export const deleteFromCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({
      where: {
        id: id,
      },
    });

    return res
      .json({
        status: true,
        message: "Product has been removed from the cart successfully.",
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