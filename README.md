# handle-http-errors

HTTP error handling library with TypeScript support, providing error classes, handlers, and middleware support.

## ☘️ Features

- Error Classes - Built-in HTTP error classes with type support
- Error Handler - Flexible error handling with standardized responses
- Middleware Support - Ready-to-use Express middleware
- TypeScript Support - Full type safety with TypeScript

## 📥 Installation

```bash
npm install handle-http-errors
# or
yarn add handle-http-errors
# or
pnpm add handle-http-errors
```

## 📖 Usage

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

### 🌐 Middleware

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

## 🗂️ Error Classes

```typescript
import {
  HttpError,           // Base error class
  ValidationError,     // 400 - Validation errors
  BadRequestError,     // 400 - Malformed requests
  UnauthorizedError,   // 401 - Authentication errors
  ForbiddenError,      // 403 - Authorization errors
  NotFoundError,       // 404 - Resource not found
  InternalServerError  // 500 - Server errors
} from 'handle-http-errors';
```

## 📋 Error Response Format

```typescript
{
  status: number;       // HTTP status code
  code: string;         // Error code (e.g., 'VALIDATION_ERROR')
  message: string;      // Error message
  timestamp: string;    // ISO timestamp
  details?: object;     // Optional error details
  stack?: string;       // Stack trace (development only)
}
```

## ⚙️ Configuration

```typescript
// Middleware options
interface ErrorHandlerOptions {
  includeStack?: boolean;              // Include stack traces
  onError?: (error: unknown) => void;  // Error callback
}

// Using with options
app.use(errorMiddleware({
  includeStack: process.env.NODE_ENV !== 'production',
  onError: (error) => console.error(error)
}));
```

## 🔍 Development vs Production

Development Mode (`NODE_ENV !== 'production'`):
- Detailed error messages
- Stack traces (when enabled)
- Error details included

Production Mode (`NODE_ENV === 'production'`):
- Generic error messages
- No stack traces
- Limited error details

## 📚 Examples

Check out the [examples](https://github.com/junjie-w/handle-http-errors/tree/main/examples) directory for detailed usage examples.

## 📄 License

MIT
