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
