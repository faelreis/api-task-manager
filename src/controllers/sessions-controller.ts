import { authConfig } from "@/config/auth";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { compare } from "bcrypt";
import { Request, Response } from "express";
import z from "zod";
import { sign, verify } from "jsonwebtoken";

class SessionsController {
  async create(request: Request, response: Response): Promise<any> {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Invalid email or password", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const { secret: refreshSecret, expiresIn: refreshExpiresIn } =
      authConfig.refreshToken;

    const token = sign({ role: user.role ?? "member" }, secret, {
      subject: user.id,
      expiresIn,
    });

    const refreshToken = sign({ role: user.role ?? "member" }, refreshSecret, {
      subject: user.id,
      expiresIn: refreshExpiresIn,
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
      },
    });

    const { password: hashedPassword, ...userWithoutPassword } = user;

    return response.json({
      token,
      refreshToken,
      user: userWithoutPassword,
    });
  }

  async refresh(request: Request, response: Response): Promise<any> {
    const refreshToken = request.body.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    let decoded;
    try {
      decoded = verify(refreshToken, authConfig.refreshToken.secret);
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }

    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new AppError("Refresh token not found", 401);
    }

    const user = await prisma.user.findFirst({
      where: { id: decoded.sub?.toString() },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role ?? "member" }, secret, {
      subject: user.id,
      expiresIn,
    });

    return response.json({
      token,
    });
  }
}

export { SessionsController };
