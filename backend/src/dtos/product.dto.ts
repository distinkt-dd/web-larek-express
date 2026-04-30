/* eslint-disable newline-per-chained-call */
/* eslint-disable import/no-extraneous-dependencies */
import { Joi } from "celebrate";

// Схема для изображения
const imageSchema = Joi.object({
  fileName: Joi.string()
    .required()
    .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
    .messages({
      "string.pattern.base":
        "Файл изображения должен иметь расширение .jpg, .jpeg, .png, .gif или .webp",
      "any.required": "Поле 'fileName' обязательно",
    }),

  originalName: Joi.string().required().min(1).max(255).messages({
    "string.min": "Оригинальное имя файла не может быть пустым",
    "string.max": "Оригинальное имя файла не должно превышать 255 символов",
    "any.required": "Поле 'originalName' обязательно",
  }),
})
  .required()
  .messages({
    "any.required": "Поле 'image' обязательно",
  });

// Схема для продукта
export default Joi.object({
  title: Joi.string().min(2).max(30).required().messages({
    "string.min": "Название товара должно содержать минимум 2 символа",
    "string.max": "Название товара не должно превышать 30 символов",
    "any.required": "Поле 'title' обязательно",
  }),

  image: imageSchema,

  category: Joi.string().min(2).max(50).required().messages({
    "string.min": "Категория должна содержать минимум 2 символа",
    "string.max": "Категория не должна превышать 50 символов",
    "any.required": "Поле 'category' обязательно",
  }),

  description: Joi.string().min(10).max(1000).optional().allow("").messages({
    "string.min": "Описание должно содержать минимум 10 символов",
    "string.max": "Описание не должно превышать 1000 символов",
  }),

  price: Joi.number().min(0).precision(2).allow(null).default(null).messages({
    "number.min": "Цена не может быть отрицательной",
    "number.precision": "Цена может содержать не более 2 знаков после запятой",
  }),
});
