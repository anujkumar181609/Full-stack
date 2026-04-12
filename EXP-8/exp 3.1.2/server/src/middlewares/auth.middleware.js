import { ApiError } from "../utils/apiError.js";
import { verifyAccessToken } from "../services/token.service.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
