export async function retry<T>(fn: () => Promise<T>, retries: number = 3, delay: number = 500): Promise<T> {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (retries > 0) {
            retries--;
            setTimeout(attempt, delay);
          } else {
            reject(error);
          }
        });
    };

    attempt();
  });
}
