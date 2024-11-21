import express from "express";
import { verifyToken, verifyRole } from "../middlewares/authorization";
import {
  getOrders,
  createOrder,
  getOrderById,
} from "../Controller/orderController";

const app = express();
app.use(express.json());

app.get(
  "/",
  [verifyToken, verifyRole(["ADMIN", "SUPER_ADMIN", "CUSTOMER"])],
  getOrders
);
app.get(
  "/:id",
  [verifyToken, verifyRole(["ADMIN", "SUPER_ADMIN"])],
  getOrderById
);
app.post("/", [verifyToken, verifyRole(["CUSTOMER"])], createOrder);

export default app;