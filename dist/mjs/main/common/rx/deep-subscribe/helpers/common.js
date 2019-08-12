export function checkUnsubscribe(unsubscribe) {
  if (unsubscribe != null && typeof unsubscribe !== 'function') {
    throw new Error("Subscribe function should return null/undefined or unsubscribe function, but not ".concat(unsubscribe));
  }

  return unsubscribe;
}