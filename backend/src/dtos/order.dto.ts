/* eslint-disable newline-per-chained-call */
/* eslint-disable import/no-extraneous-dependencies */
import { Joi } from "celebrate";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export default Joi.object({
  payment: Joi.string().valid("card", "online").required().messages({
    "any.only": "Тип оплаты должен быть 'card' или 'online'",
    "any.required": "Поле 'payment' обязательно",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Невалидный формат email",
      "any.required": "Поле 'email' обязательно",
    }),

  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Телефон должен содержать 10-15 цифр, может начинаться с +",
      "any.required": "Поле 'phone' обязательно",
    }),

  address: Joi.string().min(3).max(200).required().messages({
    "string.min": "Адрес должен содержать минимум 3 символа",
    "string.max": "Адрес не должен превышать 200 символов",
    "any.required": "Поле 'address' обязательно",
  }),

  total: Joi.number().min(0).required().messages({
    "number.min": "Сумма не может быть отрицательной",
    "any.required": "Поле 'total' обязательно",
  }),

  items: Joi.array()
    .items(Joi.string().pattern(objectIdPattern))
    .min(1)
    .required()
    .messages({
      "array.min": "Массив товаров не может быть пустым",
      "array.base": "Поле 'items' должно быть массивом",
      "string.pattern.base": "ID товара должен быть 24-символьной hex-строкой",
      "any.required": "Поле 'items' обязательно",
    }),
});
