import { SessionsController } from "@/controllers/sessions-controller";
import { Router } from "express";

const sessionsRoutes = Router();

const sessionsController = new SessionsController();

sessionsRoutes.post("/", sessionsController.create);
sessionsRoutes.post("/refresh", sessionsController.refresh);

export { sessionsRoutes };
