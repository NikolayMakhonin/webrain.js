export function createCallWithArgs() {
  const args = arguments;
  return function (func) {
    return func.apply(this, args);
  };
}