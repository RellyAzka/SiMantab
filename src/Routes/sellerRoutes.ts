import express from "express";
import {
  createProduct,
  deleteSellerProduct,
  getSellerProducts,
  updateSellerProduct,
} from "../Controller/sellerController";
import {
  addProductValidation,
  updateProductValidation,
} from "../Middlewares/sellerValidation";
import { verifyToken, verifyRole } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get(
  "/",
  [verifyToken, verifyRole(["SELLER", "ADMIN", "SUPER_ADMIN"])],
  getSellerProducts
);
app.post(
  "/",
  [
    verifyToken,
    verifyRole(["SELLER", "ADMIN", "SUPER_ADMIN"]),
    addProductValidation,
  ],
  createProduct
);
app.put(
  "/:id",
  [
    verifyToken,
    verifyRole(["SELLER", "ADMIN", "SUPER_ADMIN"]),
    updateProductValidation,
  ],
  updateSellerProduct
);
app.delete(
  "/:id",
  [verifyToken, verifyRole(["SELLER", "ADMIN", "SUPER_ADMIN"])],
  deleteSellerProduct
);

export default app;