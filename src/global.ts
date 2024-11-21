import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const BASE_URL = `${path.join(__dirname, "../")}`;
export const PORT = process.env.PORT;
export const SECRET = process.env.SECRET;
export const MERCHANT_KEY = process.env.MERCHANT_KEY;
export const CLIENT_KEY = process.env.CLIENT_KEY;
export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
export const DEVELOPMENT = process.env.DEVELOPMENT;