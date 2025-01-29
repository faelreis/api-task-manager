import { authConfig } from "@/config/auth";
import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
  role: string;
  sub: string;
}

const ensureAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization header missing", 401);
    }

    const [, token] = authHeader.split(" ");

    try {
      const { role, sub: user_id } = verify(
        token,
        authConfig.jwt.secret
      ) as TokenPayload;

      request.user = {
        id: user_id,
        role,
      };

      return next();
    } catch (error) {
      throw new AppError("Token expired or invalid", 401);
    }
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
};

export { ensureAuthenticated };
