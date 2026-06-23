let pendingRequests = 0;

export function rateLimited<T>(fn: () => Promise<T>): Promise<T> {
  pendingRequests++;
  const delay = pendingRequests * 1000;

  return new Promise<T>((resolve, reject) => {
    setTimeout(async () => {
      try {
        resolve(await fn());
      } catch (err) {
        reject(err);
      } finally {
        pendingRequests--;
      }
    }, delay);
  });
}
