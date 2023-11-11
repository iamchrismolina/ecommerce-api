import dotenv from "dotenv";
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import mongoose from "mongoose";
import Product from "./model/Product.js";

dotenv.config();

const app = express();
// To allow reading of JSON Data that's sent to this server
app.use(express.json());

app.use(cors(corsOptions));

mongoose
  .connect(process.env.DATABASE_URL || 5001)
  .then(() => {
    console.log("Connected to MongoDb");
  })
  .catch((err) => {
    console.log(err);
  });

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: "2023-10-16",
});

app.get("/", (req, res) => {
  res.send("Hello Word!");
});

app.get("/storedata", async (req, res) => {
  const products = await Product.find();
  res.json(`This is StoreData: ${products}`);
});

app.post("/create-checkout-session", async (req, res) => {
  const dbStoreItems = await Product.find();
  if (!dbStoreItems) return res.status(204).json("No Products Found");
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.itemDetails.map((item) => {
        const matchedStoreItem = dbStoreItems.find(
          (dbStoreItem) => dbStoreItem.productId === item.id
        );
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: matchedStoreItem?.title,
            },
            unit_amount: Math.round((matchedStoreItem?.price ?? 0) * 100),
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err?.message ?? "An unexpected error occured",
    });
  }
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});

export default app;
