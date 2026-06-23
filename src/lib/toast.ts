import { toast } from 'sonner';
import type { ExternalToast } from 'sonner';

type ToastId = string | number;

type ShowOptions = ExternalToast;

/**
 * Shows a success toast notification.
 * @param message - The message to display.
 * @param options - Additional toast configuration.
 * @returns The toast ID.
 */
export function showSuccess(message: string, options?: ShowOptions) {
  return toast.success(message, options);
}

/**
 * Shows an error toast notification.
 * @param message - The message to display.
 * @param options - Additional toast configuration.
 * @returns The toast ID.
 */
export function showError(message: string, options?: ShowOptions) {
  return toast.error(message, options);
}

/**
 * Shows an info toast notification.
 * @param message - The message to display.
 * @param options - Additional toast configuration.
 * @returns The toast ID.
 */
export function showInfo(message: string, options?: ShowOptions) {
  return toast(message, options);
}

/**
 * Shows a loading toast notification.
 * @param message - The message to display.
 * @param options - Additional toast configuration.
 * @returns The toast ID.
 */
export function showLoading(message: string, options?: ShowOptions) {
  return toast.loading(message, options);
}

/**
 * Dismisses a toast by its ID, or all toasts if no ID is given.
 * @param id - Optional toast ID to dismiss.
 */
export function dismissToast(id?: ToastId) {
  toast.dismiss(id);
}

export { toast };
export type { ToastId, ShowOptions };
