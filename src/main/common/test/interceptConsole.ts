import {ThenableIterator, ThenableOrIteratorOrValue} from '../async/async'

export type TConsoleType = 'debug' | 'info' | 'trace' | 'log' | 'warn' | 'error'

export function interceptConsole(handler: (
	this: {
		type: TConsoleType,
		console: typeof console,
	},
	...args: any[]
) => boolean|void): () => void {
	const _console = console

	const orig_debug = _console.debug
	const orig_info = _console.info
	const orig_trace = _console.trace
	const orig_log = _console.log
	const orig_warn = _console.warn
	const orig_error = _console.error

	const orig_console = {
		debug() {
			return orig_debug.apply(_console, arguments)
		},
		info() {
			return orig_info.apply(_console, arguments)
		},
		trace() {
			return orig_trace.apply(_console, arguments)
		},
		log() {
			return orig_log.apply(_console, arguments)
		},
		warn() {
			return orig_warn.apply(_console, arguments)
		},
		error() {
			return orig_error.apply(_console, arguments)
		},
	}

	function createHandler(type: TConsoleType) {
		const orig_func = orig_console[type]
		const _this = {
			type,
			console: orig_console,
		}

		return function () {
			const result = handler.apply(_this, arguments)

			if (result) {
				return
			}

			orig_func.apply(orig_console, arguments)
		}
	}

	_console.debug = createHandler('debug')
	_console.info = createHandler('info')
	_console.trace = createHandler('trace')
	_console.log = createHandler('log')
	_console.warn = createHandler('warn')
	_console.error = createHandler('error')

	return () => {
		_console.debug = orig_debug
		_console.info = orig_info
		_console.trace = orig_trace
		_console.log = orig_log
		_console.warn = orig_warn
		_console.error = orig_error
	}
}

// region throwOnConsoleError

function objectToString(o) {
	if (o instanceof Error) {
		return o.stack || (o + '')
	}

	return o + ''
}

let lastConsoleError = null
export function *throwOnConsoleError<TContext, TValue>(
	_this: TContext,
	throwPredicate: (this: TConsoleType, ...args: any[]) => boolean,
	func: (this: TContext) => ThenableOrIteratorOrValue<TValue>,
): ThenableIterator<TValue> {
	lastConsoleError = null
	const dispose = interceptConsole(function () {
		if (throwPredicate.apply(this.type, arguments)) {
			const error = new Error(`console.${this.type}(${
				Array.from(arguments).map(o => objectToString(o)).join('\r\n')
			})`)
			lastConsoleError = error
			throw error
		}
	})

	try {
		const result: TValue = yield func.call(_this)

		if (lastConsoleError) {
			throw lastConsoleError
		}

		return result
	} finally {
		dispose()
	}
}

// endregion
