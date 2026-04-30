/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import { Joi } from "celebrate";
import { NextFunction, Request, Response } from "express";
import BadRequestError from "../exceptions/bad-request-error";

export default class ValidationIdsMiddleware {
  private static isValidObjectId(id: string): boolean {
    const hexRegex = /^[0-9a-fA-F]{24}$/;
    return hexRegex.test(id);
  }

  static validateParamId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (id && !this.isValidObjectId(id)) {
        return next(
          new BadRequestError(
            `Невалидный формат ID: "${id}". ID должен быть 24-символьной hex-строкой`,
          ),
        );
      }

      return next();
    } catch (err) {
      return next(new BadRequestError("Ошибка при валидации ID параметра"));
    }
  }

  static validateItemsIds(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items)) {
        return next(new BadRequestError("Поле 'items' должно быть массивом"));
      }

      if (items.length === 0) {
        return next(
          new BadRequestError("Массив товаров не может быть пустым!"),
        );
      }

      const invalidIds = items.filter(
        (id: string) => !this.isValidObjectId(id),
      );

      if (invalidIds.length > 0) {
        return next(
          new BadRequestError(
            `Невалидный формат ID в items: ${invalidIds.join(", ")}. Каждый ID должен быть 24-символьной hex-строкой`,
          ),
        );
      }

      return next();
    } catch (err) {
      return next(new BadRequestError("Ошибка при валидации ID в items"));
    }
  }
}

export const normalizePhone = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.phone) {
    const cleaned = req.body.phone.replace(/[^\d+]/g, "");
    const normalized = cleaned.replace(/^\+/, "").replace(/\+/g, "");
    const phone = req.body.phone.startsWith("+")
      ? `+${normalized}`
      : normalized;

    req.body.phone = phone;
  }
  next();
};

export const joiValidator = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      return next(new BadRequestError(messages));
    }

    req.body = value;
    next();
  };
};
