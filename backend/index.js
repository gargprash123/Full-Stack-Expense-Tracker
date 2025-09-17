import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

//app.use(cors({origin:[""]}))
app.use(cors('*'));
// const vercelFrontendURL = "https://full-stack-expense-tracker-fvix4cigg.vercel.app";
// app.use(cors({ origin: vercelFrontendURL }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api-v1", routes);

app.use((req, res,next) => {
  res.status(404).json({
    status: "404 Not found",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});