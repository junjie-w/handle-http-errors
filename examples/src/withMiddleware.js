import express from "express";
import {
  errorMiddleware,
  NotFoundError,
  ValidationError,
} from "http-error-handler";

const app = express();
app.use(express.json());

app.get("/with-middleware", (req, res, next) => {
  try {
    throw new NotFoundError("Resource not found");
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id", (req, res, next) => {
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

app.use(
  errorMiddleware({
    onError: async (error) => {
      console.error(`Error: ${error}`);
    },
  })
);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
