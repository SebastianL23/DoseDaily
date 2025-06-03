declare module 'class-variance-authority' {
  export type VariantProps<Component extends (...args: any) => any> = Parameters<Component>[0]
  export function cva(base: string, config?: any): (...args: any[]) => string
} 