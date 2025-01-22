import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { verifyUserAuth } from "@/middleware/veriry-user";

const teamsRoutes = Router();

const teamsController = new TeamsController();

teamsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuth(["admin"]),
  teamsController.create
);
teamsRoutes.get(
  "/:id",
  ensureAuthenticated,
  verifyUserAuth(["admin", "member"]),
  teamsController.show
);
teamsRoutes.patch(
  "/:id",
  ensureAuthenticated,
  verifyUserAuth(["admin"]),
  teamsController.update
);
teamsRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyUserAuth(["admin"]),
  teamsController.delete
);

export { teamsRoutes };
