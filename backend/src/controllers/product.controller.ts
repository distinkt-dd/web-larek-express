/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */

import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import BadRequestError from "../exceptions/bad-request-error";
import ConflictError from "../exceptions/conflict-error";
import product, { IProduct } from "../models/product.model";

export default class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await product.find({});
      return res.status(200).send({
        items: products,
        total: products.length,
      });
    } catch (err) {
      return next(err);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const body: IProduct = req.body;
      const prod = await product.create(body);

      return res.status(201).send(prod);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadRequestError("Ошибка валидации данных при создании товара!"),
        );
      }
      if (err instanceof Error && err.message.includes("E11000")) {
        return next(
          new ConflictError("Товар с таким названием уже был создан!"),
        );
      }
      return next(err);
    }
  }
}
