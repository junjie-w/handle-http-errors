# handle-http-errors

Type-safe HTTP error handling package providing error classes, standardized responses, error handler, and built-in Express middleware support. Available as [NPM package](https://www.npmjs.com/package/handle-http-errors).

## 🚂 Features

- Error Classes
- Error Handler
- Express Middleware Support
- TypeScript Support

## ☘️ Usage

### 🔧 Error Handler

```typescript
import express from 'express';
import { errorHandler, ValidationError } from 'handle-http-errors';

const app = express();

app.post('/users', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError('Email is required');
    }
  } catch (error) {
    return errorHandler(error, res);
  }
});
```

### 🌐 Express Middleware

```typescript
import express from 'express';
import { errorMiddleware, NotFoundError } from 'handle-http-errors';

const app = express();

app.get('/users/:id', (req, res, next) => {
  try {
    throw new NotFoundError('User not found', { id: req.params.id });
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware());
```

## ⚙️ Configuration

```typescript
interface ErrorHandlerOptions {
  includeStack?: boolean;                // Include stack traces
  onError?: (error: unknown) => void;    // onError callback
}

// Use with handler
app.post('/users', async (req, res) => {
  try {
    throw new ValidationError('Invalid data');
  } catch (error) {
    return errorHandler(error, res, {
      includeStack: process.env.NODE_ENV !== 'production',
      onError: (error) => console.error(error)
    });
  }
});

// Use with middleware
app.use(errorMiddleware({
  includeStack: process.env.NODE_ENV !== 'production',
  onError: (error) => console.error(error)
}));
```

## 🗂️ Error Classes

```typescript
import {
  HttpError,               // Base error class
  ValidationError,         // 400 - Validation errors
  BadRequestError,         // 400 - Malformed requests
  UnauthorizedError,       // 401 - Authentication errors
  ForbiddenError,          // 403 - Authorization errors
  NotFoundError,           // 404 - Resource not found
  InternalServerError      // 500 - Server errors
} from 'handle-http-errors';
```

## 📋 Error Response Format

```typescript
{
  status: number;       // HTTP status code
  code: string;         // Error code
  message: string;      // Error message
  timestamp: string;    // ISO timestamp
  details?: object;     // Optional error details
  stack?: string;       // Stack trace
}
```

## 🪺 Examples

Check out the [examples](https://github.com/junjie-w/handle-http-errors/tree/main/examples) directory for detailed usage examples:

```bash
git clone https://github.com/junjie-w/handle-http-errors.git
cd handle-http-errors/examples
npm install

# Try different examples
npm run dev:handler                 # Error handler usage
npm run dev:middleware              # Express middleware usage
npm run dev:custom-middleware       # Creating custom error-throwing middlewares
```

## 📄 License

MIT
