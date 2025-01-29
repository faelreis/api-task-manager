import { Router } from "express";
import { UsersController } from "../controllers/users-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { verifyUserAuth } from "@/middleware/veriry-user";

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.get("/", ensureAuthenticated, usersController.index);
usersRoutes.post("/", usersController.create);
usersRoutes.patch(
  "/:id",
  ensureAuthenticated,
  verifyUserAuth(["admin", "member"]),
  usersController.update
);
usersRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyUserAuth(["admin", "member"]),
  usersController.delete
);
usersRoutes.post(
  "/:userId/teams/:teamId",
  ensureAuthenticated,
  verifyUserAuth(["admin"]),
  usersController.addToTeam
);

export { usersRoutes };
