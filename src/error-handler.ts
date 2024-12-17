import { ErrorHandlerOptions, HttpResponse } from "./types";
import { errorProcessor } from "./error-processor";
import { DEFAULT_ERROR } from "./errors";
import { isDevelopment } from "./config";

export const errorHandler = async (
  error: unknown,
  res: HttpResponse,
  options: ErrorHandlerOptions = {}
) => {
  const defaultOptions = {
    includeStack: isDevelopment,
    ...options
  };

  try {
    const errorResponse = await errorProcessor(error, defaultOptions);
    return res.status(errorResponse.status).json(errorResponse);
  } catch (_err) {
    return res.status(DEFAULT_ERROR.status).json(DEFAULT_ERROR);
  }
};
