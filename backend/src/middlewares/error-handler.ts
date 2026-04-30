/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import BadRequestError from "../exceptions/bad-request-error";
import ConflictError from "../exceptions/conflict-error";
import NotFoundPath from "../exceptions/not-found-error";

export default (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof NotFoundPath) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Внутренняя ошибка сервера!",
  });
};
