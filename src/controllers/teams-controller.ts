import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { hash } from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";

class TeamsController {
  async create(req: Request, res: Response): Promise<any> {
    const bodySchema = z.object({
      name: z.string().trim().min(1),
      description: z.string().optional(),
    });

    const { name, description } = bodySchema.parse(req.body);

    const team = await prisma.team.create({
      data: {
        name,
        description: description ?? "",
      },
    });

    return res.status(201).json(team);
  }

  async show(req: Request, res: Response): Promise<any> {
    const paramsShema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsShema.parse(req.params);

    const team = await prisma.team.findUnique({
      where: {
        id,
      },
    });

    await prisma.team.findFirst({
      where: {
        id,
      },
    });

    return res.json(team);
  }

  async update(req: Request, res: Response): Promise<any> {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      name: z.string().trim().min(1),
      description: z.string().optional(),
    });

    const { id } = paramsSchema.parse(req.params);
    const { name, description } = bodySchema.parse(req.body);

    const existingTeam = await prisma.team.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      throw new AppError("Team not found");
    }

    const updatedTeam = await prisma.team.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return res.json(updatedTeam);
  }

  async delete(req: Request, res: Response): Promise<any> {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(req.params);

    const team = await prisma.team.findUnique({
      where: {
        id,
      },
    });

    if (!team) {
      return res.status(404).json({
        error: "Team not found",
      });
    }

    await prisma.team.delete({
      where: {
        id,
      },
    });

    return res.status(204).send();
  }
}

export { TeamsController };
