import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { MidtransClient } from "midtrans-node-client";
import { CLIENT_KEY, MIDTRANS_SERVER_KEY, DEVELOPMENT } from "../global";
import { v4 as uuidv4 } from "uuid";
import { midtrans } from "../utils/midtrans";

const snap = new MidtransClient.Snap({
  clientKey: CLIENT_KEY,
  serverKey: MIDTRANS_SERVER_KEY,
  isProduction: DEVELOPMENT,
});

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getOrders = async (req: Request, res: Response) => {
  try {
    const allOrders = await prisma.order.findMany();
    return res
      .json({
        status: true,
        data: allOrders,
        message: "Orders has retrieved succsessfully",
      })
      .status(200);
  } catch (error) {
    return res.json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });
    if (!order) {
      return res.json({
        status: false,
        message: "Order not found",
      });
    }
    return res
      .json({
        status: true,
        data: order,
        message: "Order has retrieved successfully",
      })
      .status(200);
  } catch (error) {
    return res.json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.idUser,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Cart is empty. Cannot create an order.",
      });
    }
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price; // Assuming each product has a "price" field
    }, 0);

    // Create a new order
    const newOrder = await prisma.order.create({
      data: {
        userId: user.idUser,
        total: totalPrice, // Save the total price in the order
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // Save product price for reference
          })),
        },
      },
    });
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    const resMidtrans = midtrans(newOrder.id, totalPrice);

    return res.status(201).json({
      status: true,
      data: newOrder,
      midtrans: resMidtrans,
      message: "Order has been created successfully.",
    });
  } catch (error) {
    console.log(CLIENT_KEY, MIDTRANS_SERVER_KEY, DEVELOPMENT);
    return res.status(400).json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};