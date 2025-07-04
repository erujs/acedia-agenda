"use client"

import { toast as sonnerToast } from "sonner"

// Simple wrapper to maintain API compatibility if needed
export function toast({
  title,
  description,
  variant = "default",
  ...props
}: {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  action?: React.ReactNode
}) {
  if (variant === "destructive") {
    return sonnerToast.error(title || "Error", {
      description,
      ...props,
    })
  }
  
  if (variant === "success") {
    return sonnerToast.success(title || "Success", {
      description,
      ...props,
    })
  }

  return sonnerToast(title || "Notification", {
    description,
    ...props,
  })
}

// Export Sonner's toast functions directly for more flexibility
export {
  toast as sonnerToast,
} from "sonner"

// Simple hook that returns Sonner's toast functions
export function useToast() {
  return {
    toast,
    success: (message: string, options?: any) => sonnerToast.success(message, options),
    error: (message: string, options?: any) => sonnerToast.error(message, options),
    info: (message: string, options?: any) => sonnerToast.info(message, options),
    warning: (message: string, options?: any) => sonnerToast.warning(message, options),
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  }
}