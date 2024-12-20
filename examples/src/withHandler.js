import express from "express";
import {
  errorHandler,
  NotFoundError,
  ValidationError,
} from "http-error-handler";

const app = express();
app.use(express.json());

app.get("/with-handler", async (_req, res) => {
  try {
    throw new NotFoundError("Resource not found");
  } catch (error) {
    return errorHandler(error, res);
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^\d+$/)) {
      throw new ValidationError("Invalid product ID", {
        id,
        message: "Product ID must be numeric",
      });
    }
    throw new NotFoundError("Product not found", { id });
  } catch (error) {
    return errorHandler(error, res, {
      includeStack: process.env.NODE_ENV !== "production",
    });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    const errors = {};

    if (!name?.trim()) errors.name = "Name is required";
    if (typeof price !== "number" || price <= 0) {
      errors.price = "Price must be a positive number";
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Invalid product data", errors);
    }

    throw new Error("Database connection failed");
  } catch (error) {
    return errorHandler(error, res);
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
