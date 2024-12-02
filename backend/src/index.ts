import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_URI || "mongodb://root:example@localhost:27017";
mongoose
  .connect(uri, {
    authSource: "admin",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to the chat app!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
