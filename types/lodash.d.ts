declare module 'lodash/throttle' {
  type ThrottledFunc<T extends (...args: any[]) => any> = ((
    ...args: Parameters<T>
  ) => ReturnType<T>) & {
    cancel: () => void
    flush: () => ReturnType<T>
  }

  const throttle: <T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean
      trailing?: boolean
    },
  ) => ThrottledFunc<T>
  export default throttle
}
declare module 'lodash/debounce' {
  type DebouncedFunc<T extends (...args: any[]) => any> = ((
    ...args: Parameters<T>
  ) => ReturnType<T>) & {
    cancel: () => void
    flush: () => ReturnType<T>
  }

  const debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean
      trailing?: boolean
      maxWait?: number
    },
  ) => DebouncedFunc<T>
  export default debounce
}
