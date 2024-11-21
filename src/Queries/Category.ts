import prisma from "../prisma"
import { Prisma } from "@prisma/client";

export const createCategory = async (data: { name: string }) => {
  const { name } = data;
  const category = await prisma.category.create({ data: { name } });
  return category;
};

export const updateCategory = async (
  data: { name: string },
  paramsId: string
) => {
  const { name } = data;
  const category = await prisma.category.update({
    where: { id: paramsId },
    data: { name },
  });
  return category;
};

export const deleteCategory = async (id: string) => {
  await prisma.category.delete({ where: { id: id } });
};