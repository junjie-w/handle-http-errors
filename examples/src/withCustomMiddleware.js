import express from "express";
import {
  errorMiddleware,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  NotFoundError,
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
  const { email, username } = req.body;
  const errors = {};

  if (!email?.trim()) {
    errors.email = "Email is required";
  } else if (!email.includes("@")) {
    errors.email = "Invalid email format";
  }

  if (!username?.trim()) {
    errors.username = "Username is required";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Invalid user data", errors);
  }

  next();
};

app.get("/users/:id", requireAuth, (req, _res, next) => {
  try {
    const { id } = req.params;
    if (!id.match(/^\d+$/)) {
      throw new ValidationError("Invalid user ID", {
        id: "User ID must be numeric",
      });
    }
    throw new NotFoundError("User not found", { id });
  } catch (error) {
    next(error);
  }
});

app.post("/users/register", requireAuth, validateUser, (req, res, next) => {
  try {
    const { role } = req.query;
    if (role === "admin") {
      throw new ForbiddenError("Insufficient permissions", {
        message: "Only administrators can create admin users",
        currentUserRole: "user",
      });
    }
    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: req.body.email,
        username: req.body.username,
        role: role || "user",
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use(
  errorMiddleware({
    includeStack: process.env.NODE_ENV !== "production",
    onError: async (error) => {
      console.error(`[${new Date().toISOString()}] Error: ${error.message}`);
    },
  })
);

app.listen(3003, () => {
  console.log("Server running on http://localhost:3003");
});
