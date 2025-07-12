declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    color?: string
    strokeWidth?: string | number
  }
  export const ChevronDown: FC<IconProps>
  export const ShoppingBag: FC<IconProps>
  export const X: FC<IconProps>
  // Add other icons as needed
} 