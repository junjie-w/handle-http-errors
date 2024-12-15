import express, { Request, Response, NextFunction } from 'express';
import { createErrorHandler, NotFoundError, ValidationError } from 'error-handler-ts';

const app = express();
const errorHandler = createErrorHandler({
  includeStack: true
});

app.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^\d+$/)) {
      throw new ValidationError('Invalid user ID', { 
        id,
        expected: 'number' 
      });
    }

    const user = null; 
    if (!user) {
      throw new NotFoundError('User not found', { id });
    }

    res.json({ id, name: 'John Doe' });
  } catch (error) {
    next(error);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler.middleware(err, req, res, next);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
