import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { BASE_URL } from "../global";
import fs from "fs";
// import jwt from "jsonwebtoken";
// import { create } from "domain";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const allProducts = await prisma.product.findMany({
      where: { name: { contains: search?.toString() || "" } },
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

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, categoryId } = req.body;
    const newProduct = await prisma.product.create({
      data: { name, description, price, categoryId },
    });

    return res
      .json({
        status: true,
        data: newProduct,
        message: "Product has created succsessfully",
      })
      .status(201);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: { name, description, price },
    });

    return res
      .json({
        status: true,
        data: updatedProduct,
        message: "Product has updated succsessfully",
      })
      .status(200);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: id } });

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

export const changePicture = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const findMenu = await prisma.product.findFirst({
      where: { id: id },
    });
    if (!findMenu) {
      return response.json({ status: false, message: "Menu not found" });
    }
    let filename = findMenu.image;

    if (request.file) {
      filename = request.file.filename;
      let path = `${BASE_URL}/../public/product-picture/${filename}`;
      let exist = fs.existsSync(path);
      // Filter if file not exist
      if (exist && findMenu.image !== ``) {
        fs.unlinkSync(path);
      }
    }

    const updatedMenu = await prisma.product.update({
      where: { id: id },
      data: {
        image: filename,
      },
    });

    return response
      .json({
        status: true,
        data: updatedMenu,
        message: "Menu picture has updated successfully",
      })
      .status(200);
  } catch (error) {
    return response
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

// export const createProductSeller = async (req: Request, res: Response) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ status: false, message: "Unauthorized" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decodedToken: any = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     );
//     const sellerId = decodedToken.user?.id;

//     if (!sellerId) {
//       return res
//         .status(401)
//         .json({ status: false, message: "Unauthorized - Seller ID not found" });
//     }

//     const { name, price, description, categoryId } = req.body;

//     const newProduct = await prisma.product.create({
//       data: { name, description, price, categoryId, sellerId },
//     });

//     return res.status(201).json({
//       status: true,
//       data: newProduct,
//       message: "Product has been created successfully",
//     });
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ status: false, message: `There is an error. ${error}` });
//   }
// };