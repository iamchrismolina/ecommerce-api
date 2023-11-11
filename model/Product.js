import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
    },
    ratingRate: {
      type: Number,
    },
    ratingCount: {
      type: Number,
    },
  },
  { collection: "Products" }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
