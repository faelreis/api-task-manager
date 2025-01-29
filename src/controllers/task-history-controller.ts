import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response } from "express";
import z from "zod";

class TaskHistoryController {
  async index(req: Request, res: Response): Promise<any> {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(req.params);

    const user = req.user;

    if (id !== user?.id && user?.role !== "admin") {
      throw new AppError(
        "You don't have permission to view this task history.",
        403
      );
    }

    const taskHistory = await prisma.taskHistory.findMany({
      where: {
        task_id: id,
      },
      orderBy: {
        changed_at: "desc",
      },
    });

    if (taskHistory.length === 0) {
      throw new AppError("No history found for this task", 404);
    }

    return res.json(taskHistory);
  }
}

export { TaskHistoryController };
