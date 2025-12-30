/**
 * Retry utility for API calls
 */

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: 'none' | 'linear' | 'exponential';
  onRetry?: (attempt: number, error: unknown) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> = {
  maxAttempts: 3,
  delay: 1000,
  backoff: 'exponential',
};

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === opts.maxAttempts) {
        break;
      }

      // Calculate delay
      let delay = opts.delay;
      if (opts.backoff === 'exponential') {
        delay = opts.delay * Math.pow(2, attempt - 1);
      } else if (opts.backoff === 'linear') {
        delay = opts.delay * attempt;
      }

      // Call onRetry callback if provided
      if (opts.onRetry) {
        opts.onRetry(attempt, error);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

