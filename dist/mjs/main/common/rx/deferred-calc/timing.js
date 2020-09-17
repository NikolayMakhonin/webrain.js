export const timingDefault = {
  now: Date.now,
  setTimeout: typeof window === 'undefined' ? setTimeout : setTimeout.bind(window),
  clearTimeout: typeof window === 'undefined' ? clearTimeout : clearTimeout.bind(window)
};