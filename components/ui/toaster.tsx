"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

const NextToast = Toast as any
const NextToastClose = ToastClose as any
const NextToastDescription = ToastDescription as any
const NextToastProvider = ToastProvider as any
const NextToastTitle = ToastTitle as any
const NextToastViewport = ToastViewport as any

export function Toaster() {
  const { toasts } = useToast()

  return (
    <NextToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <NextToast key={id} {...props}>
            <div className="grid gap-1">
              {title && <NextToastTitle>{title}</NextToastTitle>}
              {description && (
                <NextToastDescription>{String(description)}</NextToastDescription>
              )}
            </div>
            {action}
            <NextToastClose />
          </NextToast>
        )
      })}
      <NextToastViewport />
    </NextToastProvider>
  )
}
