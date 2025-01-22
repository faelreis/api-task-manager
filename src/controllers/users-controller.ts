import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { hash } from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";

class UsersController {
  async create(req: Request, res: Response): Promise<any> {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().email(),
      password: z.string().trim().min(6).max(32),
      role: z.enum(["admin", "member"]),
    });

    const { name, email, password, role } = bodySchema.parse(req.body);

    const userWithSameEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists");
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

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(204).send();
  }
}

export { UsersController };
