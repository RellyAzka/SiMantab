import express from "express";
import { verifyToken, verifyRole } from "../middlewares/authorization";
import {
  getCart,
  addToCart,
  deleteFromCart,
} from "../Controller/cartController";

const app = express();
app.use(express.json());

app.get("/", [verifyToken, verifyRole(["CUSTOMER"])], getCart);
app.post("/", [verifyToken, verifyRole(["CUSTOMER"])], addToCart);
app.delete("/:id", [verifyToken, verifyRole(["CUSTOMER"])], deleteFromCart);

export default app;