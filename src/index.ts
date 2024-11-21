import express from "express";
import cors from "cors";
import { PORT } from "./global";

import productRoute from "./Routes/productRoutes";
import userRoute from "./Routes/userRoutes";
import sellerRoute from "./Routes/sellerRoutes";
import categoryRoute from "./Routes/categoryRoutes";
import cartRoute from "./Routes/cartRoutes";
import orderRoute from "./Routes/orderRoutes";

const app = express();

app.use(express.json());

app.use(cors());
app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/sellers", sellerRoute);
app.use("/categories", categoryRoute);
app.use("/cart", cartRoute);
app.use("/orders", orderRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});