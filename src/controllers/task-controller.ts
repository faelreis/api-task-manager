import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response } from "express";
import { z } from "zod";

class TaskController {
  async index(req: Request, res: Response): Promise<any> {
    const tasks = await prisma.tasks.findMany({
      orderBy: {
        status: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json(tasks);
  }

  async create(req: Request, res: Response): Promise<any> {
    const bodySchema = z.object({
      assignedTo: z.string().uuid(),
      teamId: z.string().uuid(),
      title: z.string().nonempty(),
      description: z.string().nonempty().optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    });

    const { assignedTo, teamId, title, description, status, priority } =
      bodySchema.parse(req.body);

    const task = await prisma.tasks.create({
      data: {
        assignedTo,
        teamId,
        title,
        description,
        status,
        priority,
      },
    });

    return res.status(201).json(task);
  }

  async update(req: Request, res: Response): Promise<any> {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      assignedTo: z.string().uuid(),
      teamId: z.string().uuid(),
      title: z.string().nonempty(),
      description: z.string().nonempty().optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    });

    const { id } = paramsSchema.parse(req.params);

    const { assignedTo, teamId, title, description, status, priority } =
      bodySchema.parse(req.body);

    const task = await prisma.tasks.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const user = req.user;

    if (task.assignedTo !== user?.id && user?.role !== "admin") {
      throw new AppError(
        "You do not have permission to update this task.",
        403
      );
    }

    const taskUpdated = await prisma.tasks.update({
      where: {
        id,
      },
      data: {
        assignedTo,
        teamId,
        title,
        description,
        status,
        priority,
      },
    });

    if (status && task.status !== status) {
      await prisma.taskHistory.create({
        data: {
          task_id: id,
          changed_by: assignedTo,
          old_status: task.status || "pending",
          new_status: status,
        },
      });
    }

    return res.json(taskUpdated);
  }

  async delete(req: Request, res: Response): Promise<any> {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(req.params);

    const task = await prisma.tasks.findUnique({
      where: {
        id,
      },
    });

    if (!id) {
      throw new AppError("Task not found");
    }

    const user = req.user;

    if (task?.assignedTo !== user?.id && user?.role !== "admin") {
      throw new AppError(
        "You do not have permission to delete this task.",
        403
      );
    }

    await prisma.tasks.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Task deleted",
    });
  }
}

export { TaskController };
