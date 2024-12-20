import express from "express";
import {
  errorMiddleware,
  NotFoundError,
  ValidationError,
} from "handle-http-errors";

const app = express();
app.use(express.json());

app.get("/with-middleware", (_req, _res, next) => {
  try {
    throw new NotFoundError("Resource not found");
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id", (req, _res, next) => {
  try {
    const { id } = req.params;
    if (!id.match(/^\d+$/)) {
      throw new ValidationError("Invalid user ID", { id });
    }
    throw new NotFoundError("User not found", { id });
  } catch (error) {
    next(error);
  }
});

app.post("/users/register", (req, _res, next) => {
  try {
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
      throw new ValidationError("Invalid registration data", errors);
    }

    throw new Error("Database connection failed");
  } catch (error) {
    next(error);
  }
});

app.use(
  errorMiddleware({
    onError: async (error) => {
      console.error(`Error: ${error.message}`);
    },
  })
);

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});
