import { env } from "@/env";

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "30m",
  },
  refreshToken: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: "7d",
  },
};
