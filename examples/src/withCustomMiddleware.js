import express from "express";
import {
  errorMiddleware,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
} from "http-error-handler";

const app = express();
app.use(express.json());

const requireAuth = (req, _res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new UnauthorizedError("No auth token provided");
  }
  if (token !== "valid-token") {
    throw new UnauthorizedError("Invalid token");
  }
  next();
};

const validateUser = (req, _res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ValidationError("Missing required fields", {
      email: !email ? "Email is required" : undefined,
      password: !password ? "Password is required" : undefined,
    });
  }
  if (!email.includes("@")) {
    throw new ValidationError("Invalid email format", {
      email: "Must be a valid email address",
    });
  }
  next();
};

app.get("/users/:id", requireAuth, (req, _res, next) => {
  try {
    const { id } = req.params;
    throw new NotFoundError("User not found", { id });
  } catch (error) {
    next(error);
  }
});

app.post("/users", requireAuth, validateUser, (req, res, next) => {
  try {
    const { role } = req.query;
    if (role === "admin") {
      throw new ForbiddenError("Insufficient permissions");
    }
    res.status(201).json({ message: "User created" });
  } catch (error) {
    next(error);
  }
});

app.use(
  errorMiddleware({
    includeStack: process.env.NODE_ENV !== "production",
    onError: async (error) => {
      console.error(`[${new Date().toISOString()}] Error:`, error);
    },
  })
);

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});
