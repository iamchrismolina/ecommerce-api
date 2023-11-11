const corsOptions = {
  origin: [`${process.env.CLIENT_URL}`, "https://dksuperstore.vercel.app"],
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

export default corsOptions;
