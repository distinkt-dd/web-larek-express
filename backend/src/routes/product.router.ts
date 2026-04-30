import { Router } from "express";
import ProductController from "../controllers/product.controller";
import productSchema from "../dtos/product.dto";
import { joiValidator } from "../middlewares/validation";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getProducts);
router.post("/", joiValidator(productSchema), productController.createProduct);

export default router;
