// @/components/ui/toast.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Ensure you have a utility function for class merging

// Toast Variants
const toastVariants = cva(
  "fixed z-50 flex items-center justify-center p-4 rounded-md shadow-lg transition-opacity duration-300",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white",
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-black",
      },
      position: {
        top: "top-4 left-1/2 transform -translate-x-1/2",
        bottom: "bottom-4 left-1/2 transform -translate-x-1/2",
        topRight: "top-4 right-4",
        topLeft: "top-4 left-4",
        bottomRight: "bottom-4 right-4",
        bottomLeft: "bottom-4 left-4",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duration?: number;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      open,
      onOpenChange,
      duration = 3000,
      position = "top",
      variant,
      className,
      children,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      if (open) {
        const timer = setTimeout(() => {
          onOpenChange(false);
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [open, duration, onOpenChange]);

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant, position, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Toast.displayName = "Toast";

// ToastProvider and ToastViewport
interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  return <>{children}</>;
};

const ToastViewport = () => {
  return null; // You can customize this if needed
};

export { Toast, ToastProvider, ToastViewport };