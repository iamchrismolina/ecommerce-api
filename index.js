import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Word!");
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
