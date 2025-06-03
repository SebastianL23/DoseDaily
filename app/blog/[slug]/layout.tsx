import { type PropsWithChildren } from "react"

export default function BlogPostLayout({ children }: PropsWithChildren) {
  return <>{children as any}</>
}
