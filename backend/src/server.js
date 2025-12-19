import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.listen(process.env.PORT, () =>
  console.log("Server is up and running on port: " + process.env.PORT)
);
