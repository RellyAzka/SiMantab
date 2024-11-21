import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changePicture,
  authentication as login,
} from "../Controller/userController";
import {
  addUserValidation,
  loginValidation,
  updateUserValidation,
} from "../Middlewares/userValidation";
import userPict from "../Middlewares/userImageVal";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();

app.get("/", getUsers);
app.post(
  "/",
  [addUserValidation, verifyToken, verifyRole(["ADMIN", "SUPER_ADMIN"])],
  createUser
);
app.put(
  "/:id",
  [updateUserValidation, verifyToken, verifyRole(["ADMIN", "SUPER_ADMIN"])],
  updateUser
);
app.delete("/:id", [verifyToken, verifyRole(["SUPER_ADMIN"])], deleteUser);
app.put(
  "/pic/:id",
  [
    userPict.single("Picture"),
    verifyToken,
    verifyRole(["ADMIN", "SUPER_ADMIN"]),
  ],
  changePicture
);
app.post("/login", [loginValidation], login);

export default app;