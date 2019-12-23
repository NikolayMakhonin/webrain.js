export const performanceNow = typeof performance !== 'undefined' // eslint-disable-next-line no-undef
? () => performance.now() : () => {
  const time = process.hrtime();
  return time[0] * 1000 + time[1] * 0.000001;
};
export function delay(timeMilliseconds) {
  return new Promise(resolve => setTimeout(resolve, timeMilliseconds));
}