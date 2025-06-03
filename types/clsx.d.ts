declare module 'clsx' {
  export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | false
  interface ClassDictionary {
    [id: string]: boolean | undefined | null
  }
  interface ClassArray extends Array<ClassValue> {}
  export default function clsx(...inputs: ClassValue[]): string
} 