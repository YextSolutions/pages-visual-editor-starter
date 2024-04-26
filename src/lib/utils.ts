/**
 * Creates a cancellable delay that resolves after the specified time.
 * @param ms - The delay time in milliseconds. If not provided, the promise will never resolve.
 * @returns An object with a promise and a cancel function.
 */
export const cancellableDelay = (ms?: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let rejectFn: (reason?: any) => void;

  const promise = new Promise<void>((resolve, reject) => {
    rejectFn = reject;
    if (typeof ms === "number") {
      timeoutId = setTimeout(resolve, ms);
    }
  });

  return {
    promise,
    cancel: () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      rejectFn(new Error("Cancelled")); // Use stored reject function
    },
  };
};
