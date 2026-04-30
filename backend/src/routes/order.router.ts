import { Router } from "express";
import OrderController from "../controllers/order.controller";
import orderSchema from "../dtos/order.dto";
import ValidationIdsMiddleware, {
  joiValidator,
  normalizePhone,
} from "../middlewares/validation";

const router = Router();
const orderController = new OrderController();

router.post(
  "/",
  ValidationIdsMiddleware.validateItemsIds.bind(ValidationIdsMiddleware),
  normalizePhone,
  joiValidator(orderSchema),
  orderController.createOrder,
);

export default router;
