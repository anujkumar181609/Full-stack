import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { users } from "../data/user.store.js";
import { signAccessToken } from "../services/token.service.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "name, email, and password are required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const exists = users.find((user) => user.email === normalizedEmail);

  if (exists) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash
  };

  users.push(user);

  const token = signAccessToken({ id: user.id, email: user.email, name: user.name });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signAccessToken({ id: user.id, email: user.email, name: user.name });

  res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});
