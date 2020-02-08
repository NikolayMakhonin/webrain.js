const path = require('path')
const fs = require('fs')

/* eslint-disable no-undef */
const fileExtensions = {
	js    : ['.es6', '.es', '.js', '.mjs'],
	ts    : ['.ts'],
	svelte: ['.html', '.svelte'],
}

function asPromise(func) {
	return new Promise((resolve, reject) => func((err, result) => {
		if (err) {
			reject(err)
			return
		}
		resolve(result)
	}))
}

let now

if (typeof performance !== 'undefined' && performance.now) {
	now = performance.now.bind(performance)
} else {
	const start = process.hrtime()
	// eslint-disable-next-line no-shadow
	now = function now() {
		const end = process.hrtime(start)
		return end[0] * 1000 + end[1] / 1000000
	}
}

async function writeTextFile(filePath, content) {
	filePath = path.resolve(process.cwd(), filePath)
	const dir = path.dirname(filePath)
	await new Promise((resolve, reject) => {
		fs.mkdir(dir, {recursive: true}, err => {
			if (err) {
				reject(err)
				return
			}

			resolve()
		})
	})
	await new Promise((resolve, reject) => {
		fs.writeFile(filePath, content, err => {
			if (err) {
				reject(err)
				return
			}

			resolve()
		})
	})
}

function normalizePath(filepath) {
	return path.relative(process.cwd(), filepath).replace(/\\/g, '/')
}

module.exports = {
	writeTextFile,
	fileExtensions,
	asPromise,
	now,
	normalizePath,
}
