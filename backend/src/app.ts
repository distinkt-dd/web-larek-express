/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-extraneous-dependencies */

import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import NotFoundPath from "./exceptions/not-found-error";
import errorHandler from "./middlewares/error-handler";
import { errorLogger, requestLogger } from "./middlewares/logger";
import orderRouter from "./routes/order.router";
import productRouter from "./routes/product.router";
dotenv.config();

const { PORT = 3000 } = process.env;
const dbAddress = process.env.DB_ADDRESS;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(requestLogger);

app.use("/product", productRouter);
app.use("/order", orderRouter);

app.use(errorLogger);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "web-larek-backend",
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundPath(`Маршрут ${req.method} ${req.path} не найден!`));
});

app.use(errorHandler);

const main = async () => {
  await mongoose.connect(dbAddress as string);
  app.listen(PORT, () => {
    console.log("listen 3000");
  });
};

main().catch(async (err) => {
  console.log("Сервер не запустился! Ошибка: ", err);
  await mongoose.disconnect();
  process.exit(1);
});
