import { globalScope } from './helpers';

function browserUnhandledErrors(callback) {
  const errorHandler = (...args) => {
    this.error('unhandledrejection', ...args.map(arg => arg instanceof PromiseRejectionEvent && arg.reason || arg));
  };

  if (typeof globalScope !== 'undefined') {
    globalScope.addEventListener('unhandledrejection', errorHandler);
    globalScope.onunhandledrejection = errorHandler;

    globalScope.onerror = (...args) => {
      callback('unhandled error', ...args);
    };
  }
}

function nodeUnhandledErrors(callback) {
  process.on('unhandledRejection', (...args) => {
    callback('process.unhandledRejection', ...args);
  }).on('uncaughtException', (...args) => {
    callback('process.uncaughtException', ...args);
  });
}

function interceptEval(callback) {
  const oldEval = globalScope.eval;
  delete globalScope.eval;

  globalScope.eval = str => {
    if (str.indexOf('async function') >= 0) {
      return oldEval.call(globalScope, str);
    }

    try {
      return oldEval.call(globalScope, str);
    } catch (ex) {
      callback('eval error', ex, str);
      throw ex;
    }
  };
}

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');

function isNode() {
  return !isBrowser();
}

export function unhandledErrors(callback) {
  if (isNode()) {
    // is node
    nodeUnhandledErrors(callback);
  } else {
    // is browser
    browserUnhandledErrors(callback);
  }

  interceptEval(callback);
}
export function exit() {
  if (isNode()) {
    process.exit(1);
  } else {
    window.close();
  }
}