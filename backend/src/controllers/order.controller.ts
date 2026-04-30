/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
import { faker } from "@faker-js/faker";
import { NextFunction, Request, Response } from "express";
import BadRequestError from "../exceptions/bad-request-error";
import product, { IProduct } from "../models/product.model";
import { TOrder } from "../types/order.types";

export default class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    const body: TOrder = req.body;
    const items = body.items;

    const products = await product.find({
      _id: { $in: items },
    });
    const foundIds = products.map((prod) => prod._id.toString());
    const missingIds = items.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      return next(
        new BadRequestError(`Товары с ID ${missingIds.join(", ")} не найдены!`),
      );
    }

    const prodNotPrices: IProduct[] = [];

    const sumTotal = products.reduce((acc, item) => {
      if (item.price !== null) {
        return acc + item.price;
      }
      prodNotPrices.push(item);
      return acc;
    }, 0);

    if (prodNotPrices.length > 0) {
      const productsTitles = prodNotPrices.map((prod) => prod.title);
      return next(
        new BadRequestError(
          `Товар(ы): ${productsTitles.join(", ")}, не продаются!`,
        ),
      );
    }

    if (sumTotal !== body.total) {
      return next(new BadRequestError("Неверная сумма заказа"));
    }

    return res.status(201).json({
      id: faker.string.uuid(),
      total: sumTotal,
    });
  }
}
