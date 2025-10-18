import { defineStore } from 'pinia';
import { Toast, ToastState, ToastType } from '../types';

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    toasts: [],
    nextId: 1,
  }),

  getters: {
    activeToasts: (state) => state.toasts,
    toastCount: (state) => state.toasts.length,
  },

  actions: {
    addToast(
      message: string,
      type: ToastType = 'info',
      duration = 3000
    ): number {
      const id = this.nextId++;
      const toast: Toast = {
        id,
        message,
        type,
        duration,
        timestamp: new Date().getTime(),
      };

      this.toasts.push(toast);

      // Auto-remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id);
        }, duration);
      }

      return id;
    },

    removeToast(id: number): void {
      const index = this.toasts.findIndex((toast) => toast.id === id);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    },

    clearAllToasts(): void {
      this.toasts = [];
    },

    // Convenience methods
    success(message: string, duration = 3000): number {
      return this.addToast(message, 'success', duration);
    },

    error(message: string, duration = 5000): number {
      return this.addToast(message, 'error', duration);
    },

    warning(message: string, duration = 4000): number {
      return this.addToast(message, 'warning', duration);
    },

    info(message: string, duration = 3000): number {
      return this.addToast(message, 'info', duration);
    },

    // Reset store state
    $reset() {
      this.toasts = [];
      this.nextId = 1;
    },
  },
});
