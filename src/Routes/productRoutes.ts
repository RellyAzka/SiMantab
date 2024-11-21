import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  changePicture,
} from "../Controller/productController";
import {
  addProductValidation,
  updateProductValidation,
} from "../Middlewares/productValidation";
import productPict from "../Middlewares/productImageVal";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get(
  "/",
  [verifyToken, verifyRole(["ADMIN", "SUPER_ADMIN", "CUSTOMER", "SELLER"])],
  getProducts
);
app.post(
  "/",
  [addProductValidation, verifyToken, verifyRole(["ADMIN", "SUPER_ADMIN"])],
  createProduct
);
app.put(
  "/:id",
  [updateProductValidation, verifyToken, verifyRole(["ADMIN", "SUPER_ADMIN"])],
  updateProduct
);
app.delete(
  "/:id",
  [verifyToken, verifyRole(["ADMIN", "SUPER_ADMIN"])],
  deleteProduct
);
app.put(
  "/pic/:id",
  [
    productPict.single("Picture"),
    verifyToken,
    verifyRole(["ADMIN", "SUPER_ADMIN"]),
  ],
  changePicture
);

export default app;