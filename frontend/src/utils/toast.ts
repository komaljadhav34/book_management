import toast from 'react-hot-toast';

export const toastSuccess = (message: string) => toast.success(message);
export const toastError = (error: unknown, fallback = 'Something went wrong') => {
  let message =
    (error as any)?.response?.data?.detail ||
    (error as any)?.message ||
    fallback;
    
  // FastAPI validation errors return an array of objects
  if (Array.isArray(message)) {
    message = message.map((m: any) => m.msg || JSON.stringify(m)).join(", ");
  } else if (typeof message === "object" && message !== null) {
    message = JSON.stringify(message);
  }
  
  toast.error(message);
};
export const toastLoading = (message: string) => toast.loading(message);
export const toastDismiss = (id?: string) => toast.dismiss(id);
