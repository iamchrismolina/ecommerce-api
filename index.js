import dotenv from "dotenv";
import express from "express";
import Stripe from "stripe";
import cors from "cors";

dotenv.config();

const app = express();
// To allow reading of JSON Data that's sent to this server
app.use(express.json());

const corsOptions = {
  origin: [`${process.env.CLIENT_URL}`],
  methods: "GET,HEAD,PUT,OPTIONS,POST,DELETE",
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "token",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "Access-Control-Allow-Credentials",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: "2023-10-16",
});

app.get("/storedata", (req, res) => {
  res.json("Storedata is Here, Present!");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.itemDetails.map((item) => {
        const matchedStoreItem = dbStoreItems.find(
          (dbStoreItem) => dbStoreItem.id === item.id
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

app.get("/", (req, res) => {
  res.send("Hello Word!");
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});

export default app;
