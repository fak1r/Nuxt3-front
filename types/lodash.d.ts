declare module 'lodash/throttle' {
  const throttle: <T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean
      trailing?: boolean
    },
  ) => T
  export default throttle
}
declare module 'lodash/debounce' {
  const debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean
      trailing?: boolean
      maxWait?: number
    },
  ) => T
  export default debounce
}
