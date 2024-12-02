import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} from "../controllers/userController";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

export default router;
