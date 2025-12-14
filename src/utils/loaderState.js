// Simple event emitter pattern for global loader state
let loadingRequestCount = 0;
const listeners = new Set();

export const loaderState = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  showLoader() {
    loadingRequestCount++;
    if (loadingRequestCount === 1) {
      this.notify(true);
    }
  },

  hideLoader() {
    if (loadingRequestCount > 0) {
      loadingRequestCount--;
      if (loadingRequestCount === 0) {
        this.notify(false);
      }
    }
  },

  reset() {
    loadingRequestCount = 0;
    this.notify(false);
  },

  notify(isLoading) {
    listeners.forEach((listener) => listener(isLoading));
  },
};
