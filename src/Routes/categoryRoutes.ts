import express from "express";
import {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
} from "../Controller/categoryController";
import { verifyToken, verifyRole } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get(
    "/",
    [verifyToken, verifyRole(["SUPER_ADMIN", "ADMIN", "SELLER", "CUSTOMER"])],
    getCategory
);
app.post(
    "/",
    [verifyToken, verifyRole(["SUPER_ADMIN", "ADMIN", "SELLER", "CUSTOMER"])],
    createCategory
);
app.put(
    "/:id",
    [verifyToken, verifyRole(["SUPER_ADMIN", "ADMIN", "SELLER", "CUSTOMER"])],
    updateCategory
);
app.delete("/:id", [verifyToken, verifyRole(["SUPER_ADMIN"])], deleteCategory);

export default app;