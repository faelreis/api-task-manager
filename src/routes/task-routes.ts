import { Router } from "express";
import { TaskController } from "@/controllers/task-controller";
import { TaskHistoryController } from "@/controllers/task-history-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { verifyUserAuth } from "@/middleware/veriry-user";

const tasksRoutes = Router();

const taskController = new TaskController();
const taskHistoryController = new TaskHistoryController();

tasksRoutes.get(
  "/",
  ensureAuthenticated,
  verifyUserAuth(["admin", "member"]),
  taskController.index
);

tasksRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuth(["admin", "member"]),
  taskController.create
);

tasksRoutes.patch(
  "/:id",
  ensureAuthenticated,
  verifyUserAuth(["admin", "member"]),
  taskController.update
);

tasksRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyUserAuth(["admin", "member"]),
  taskController.delete
);

tasksRoutes.get(
  "/:id/history",
  ensureAuthenticated,
  verifyUserAuth(["admin", "member"]),
  taskHistoryController.index
);

export { tasksRoutes };
