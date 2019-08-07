import {isIterable} from './helpers/helpers'

export function main(args) {
	console.log(JSON.stringify(args), isIterable)
}

export default {
	main
}
