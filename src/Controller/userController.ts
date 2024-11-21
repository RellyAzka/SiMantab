import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import { BASE_URL, SECRET } from "../global";
import fs from "fs";
import { sign } from "jsonwebtoken";
import { createCategory as createCategoryQuery } from "../Queries/Category";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany();

    return res
      .json({
        status: true,
        data: allUsers,
        message: "Users has retrieved succsessfully",
      })
      .status(200);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await prisma.user.create({
      data: { name, email, password: md5(password), role },
    });

    return res
      .json({
        status: true,
        data: newUser,
        message: "User has created succsessfully",
      })
      .status(201);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, verifEmail } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { name, email, password: md5(password), emailVerified: verifEmail },
    });

    return res
      .json({
        status: true,
        data: updatedUser,
        message: "User has updated succsessfully",
      })
      .status(200);
  } catch (error) {
    return res
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.user.delete({ where: { id: id } });

    return res
      .json({
        status: true,
        data: deletedUser,
        message: "User has deleted succsessfully",
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
    const findUser = await prisma.user.findFirst({
      where: { id: id },
    });
    if (!findUser) {
      return response.json({ status: false, message: "User not found" });
    }
    let filename = findUser.image;

    if (request.file) {
      filename = request.file.filename;
      let path = `${BASE_URL}/../public/user-picture/${filename}`;
      let exist = fs.existsSync(path);
      // Filter if file not exist
      if (exist && findUser.image !== ``) {
        fs.unlinkSync(path);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        image: filename,
      },
    });

    return response
      .json({
        status: true,
        data: updatedUser,
        message: "User picture has updated successfully",
      })
      .status(200);
  } catch (error) {
    return response
      .json({ status: false, message: `There is an error. ${error}` })
      .status(400);
  }
};

export const authentication = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    const findUser = await prisma.user.findFirst({
      where: { email, password: md5(password) },
    });
    if (!findUser) {
      return response.status(200).json({
        status: false,
        logged: false,
        message: "Invalid email or password",
      });
    }

    let data = {
      idUser: findUser.id,
      name: findUser.name,
      email: findUser.email,
      role: findUser.role,
    };

    let payLoad = JSON.stringify(data);

    const token = sign(payLoad, SECRET || "token");

    return response
      .json({
        status: true,
        logged: true,
        data: { ...findUser, token },
        message: "User has logged in successfully",
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        logged: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};