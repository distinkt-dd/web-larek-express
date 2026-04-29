import mongoose from "mongoose";

interface IProductImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IProductImage;
  category: string;
  description: string;
  price: number | null;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    minlength: [2, "Минимальная длина названия - 2"],
    maxlength: [30, "Максимальная длина названия - 30"],
    required: [true, "Поле названия должно быть заполнено"],
    unique: true,
  },
  image: {
    fileName: {
      type: String,
      required: [true, "Поле fileName должно быть заполнено"],
    },
    originalName: {
      type: String,
      required: [true, "Поле originalName должно быть заполнено"],
    },
  },

  category: {
    type: String,
    required: [true, "Поле категории должно быть заполнено"],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>("product", productSchema);
