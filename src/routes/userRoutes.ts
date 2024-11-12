import { Router } from "express";
import { UserController } from "@/controllers/UserController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/users", async (req, res) => {
  await userController.register(req, res);
});

export default userRoutes;
