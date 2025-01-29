import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { hash } from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";

class UsersController {
  async index(req: Request, res: Response): Promise<any> {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    });

    return res.json(users);
  }

  async create(req: Request, res: Response): Promise<any> {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().email(),
      password: z.string().trim().min(6).max(32),
      role: z.enum(["admin", "member"]).optional(),
    });

    const {
      name,
      email,
      password,
      role = "member",
    } = bodySchema.parse(req.body);

    const userWithSameEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists", 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  }

  async update(req: Request, res: Response): Promise<any> {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().email(),
      password: z.string().trim().min(6).max(32).optional(),
      role: z.enum(["admin", "member"]),
    });

    const { id } = paramsSchema.parse(req.params);
    const { name, email, password, role } = bodySchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError("User not found");
    }

    let hashedPassword = undefined;

    if (password) {
      hashedPassword = await hash(password, 8);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password: hashedPassword || existingUser.password,
        role,
      },
    });

    const { password: _, ...updatedUserWithoutPassword } = updatedUser;

    return res.json(updatedUserWithoutPassword);
  }

  async delete(req: Request, res: Response): Promise<any> {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(req.params);

    const user = await prisma.tasks.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError("User not found");
    }

    await prisma.tasks.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Task deleted successfully.",
    });
  }

  async addToTeam(req: Request, res: Response): Promise<any> {
    const paramsSchema = z.object({
      userId: z.string().uuid(),
      teamId: z.string().uuid(),
    });

    const { userId, teamId } = paramsSchema.parse(req.params);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!user || !team) {
      throw new AppError("User or Team not found", 404);
    }

    const teamMember = await prisma.teamMembers.create({
      data: {
        userId,
        teamId,
      },
    });

    return res.status(201).json(teamMember);
  }
}

export { UsersController };
