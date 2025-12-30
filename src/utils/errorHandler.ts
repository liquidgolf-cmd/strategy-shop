/**
 * User-friendly error messages
 * Converts technical errors into friendly messages that users can understand
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  retryable?: boolean;
}

/**
 * Convert API errors to user-friendly messages
 */
export function handleAPIError(error: unknown): AppError {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // Network errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('failed to fetch')) {
      return {
        message: "Hmm, looks like there's a connection issue. Check your internet and try again!",
        code: 'NETWORK_ERROR',
        statusCode: 503,
        retryable: true,
      };
    }

    // API key errors
    if (errorMessage.includes('api key') || errorMessage.includes('authentication') || errorMessage.includes('401')) {
      return {
        message: "Something's not quite right with the setup. Please check the configuration.",
        code: 'AUTH_ERROR',
        statusCode: 401,
        retryable: false,
      };
    }

    // Rate limiting
    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return {
        message: "Whoa there! I need a quick breather. Give me a moment and try again!",
        code: 'RATE_LIMIT',
        statusCode: 429,
        retryable: true,
      };
    }

    // Not found errors
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return {
        message: "Couldn't find what I was looking for. Let's try something else!",
        code: 'NOT_FOUND',
        statusCode: 404,
        retryable: false,
      };
    }

    // Server errors
    if (errorMessage.includes('500') || errorMessage.includes('internal server')) {
      return {
        message: "Yikes! Something went wrong on my end. Give it another shot!",
        code: 'SERVER_ERROR',
        statusCode: 500,
        retryable: true,
      };
    }

    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return {
        message: "Took longer than expected. Want to try again?",
        code: 'TIMEOUT',
        statusCode: 408,
        retryable: true,
      };
    }

    // Generic error with friendly message
    return {
      message: "Oops! Something didn't go as planned. Let's try that again!",
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      retryable: true,
    };
  }

  // Fallback for non-Error objects
  return {
    message: "Hmm, something unexpected happened. Mind trying again?",
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
    retryable: true,
  };
}

/**
 * Get a friendly error message from an error object
 */
export function getUserFriendlyMessage(error: unknown): string {
  return handleAPIError(error).message;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  return handleAPIError(error).retryable ?? true;
}

