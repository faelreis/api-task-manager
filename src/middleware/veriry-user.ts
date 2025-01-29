import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";

const verifyUserAuth = (roles: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError("User not authenticated", 401);
    }

    if (!roles.includes(request.user.role)) {
      throw new AppError("Role not authorized", 403);
    }

    return next();
  };
};

export { verifyUserAuth };
