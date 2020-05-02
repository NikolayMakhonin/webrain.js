// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {getObjectUniqueId} from '../../../main/common/helpers/object-unique-id'
import {assert} from '../../../main/common/test/Assert'
import {CalcType} from '../../../main/common/test/calc'
import {calcMemAllocate} from '../../../main/common/test/calc-mem-allocate'
import {describe, it, xit} from '../../../main/common/test/Mocha'
import {MapPolyfill} from './src/MapPolyfill.js'

describe('map perf', function() {
	/* tslint:disable */

	// see: https://github.com/garycourt/murmurhash-js
	// see: https://stackoverflow.com/a/22429679/5221762
	function murmurhash2_32_gc(str, seed) {
		let l = str.length,
			h = seed ^ l,
			i = 0,
			k;
		const step = l >= 128 ? (l / 128) | 0 : 1;

		while (l >= 4 * step) {
		k =
		  ((str.charCodeAt(i) & 0xff)) |
		  ((str.charCodeAt(i += step) & 0xff) << 8) |
		  ((str.charCodeAt(i += step) & 0xff) << 16) |
		  ((str.charCodeAt(i += step) & 0xff) << 24);

		k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
		k ^= k >>> 24;
		k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

		h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

		l -= 4 * step;
		i += step;
	  }

	  switch (l) {
		  case 3: h ^= (str.charCodeAt(i + 2 * step) & 0xff) << 16;
		  case 2: h ^= (str.charCodeAt(i + step) & 0xff) << 8;
		  case 1: h ^= (str.charCodeAt(i) & 0xff);
				  h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
	  }

	  h ^= h >>> 13;
	  h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
	  h ^= h >>> 15;

	  return h >>> 0;
	}

	function murmurhash3_32_gc(key, seed) {
		let remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

		remainder = key.length & 3; // key.length % 4
		bytes = key.length - remainder;
		h1 = seed;
		c1 = 0xcc9e2d51;
		c2 = 0x1b873593;
		i = 0;

		while (i < bytes) {
			k1 =
			  ((key.charCodeAt(i) & 0xff)) |
			  ((key.charCodeAt(++i) & 0xff) << 8) |
			  ((key.charCodeAt(++i) & 0xff) << 16) |
			  ((key.charCodeAt(++i) & 0xff) << 24);
			++i;

			k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
			k1 = (k1 << 15) | (k1 >>> 17);
			k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

			h1 ^= k1;
			h1 = (h1 << 13) | (h1 >>> 19);
			h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
			h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
		}

		k1 = 0;

		switch (remainder) {
			case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
			case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
			case 1: k1 ^= (key.charCodeAt(i) & 0xff);

			k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
			k1 = (k1 << 15) | (k1 >>> 17);
			k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
			h1 ^= k1;
		}

		h1 ^= key.length;

		h1 ^= h1 >>> 16;
		h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= h1 >>> 13;
		h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
		h1 ^= h1 >>> 16;

		return h1 >>> 0;
	}

	/* tslint:enable */
	/* tslint:disable:no-empty */

	function stringHashCode(str) {
		const len = str.length
		if (len < 32) {
			let hash = 0
			for (let i = 0; i < len; i++) {
				hash ^= str.charCodeAt(i)
				hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) | 0
				// hash  = (((hash << 5) - hash) + str.charCodeAt(i)) | 0
			}
			return hash
		} else {
			let hash = len
			const len_2 = (len / 2) | 0
			let i = 1
			while (i <= len_2) {
				hash ^= str.charCodeAt(i - 1)
				hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) | 0
				hash ^= str.charCodeAt(len - i)
				hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) | 0
				// hash  = (((hash << 5) - hash) + str.charCodeAt(i)) | 0
				i <<= 1
			}
			return hash
		}
	}

	it('base', function() {
		this.timeout(300000)

		const map = new Map()
		const mapPolyfill = new MapPolyfill()

		function getKey(i: number) {
			return 'The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and '
				+ (i % 10000).toString().padStart(4, '0')
				+ 'this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.'
		}

		for (let i = 0; i < 10000; i++) {
			map.set(getKey(i), i)
			mapPolyfill.set(getKey(i), i)
		}

		let index = 0
		let key
		let value

		const result = calcPerformance(
			10000,
			() => {

			}, () => {
				index = Math.floor(Math.random() * 10000)
				key = getKey(index)
			},
			// () => {
			// 	value = map.get(key)
			// }, () => {
			// 	value = mapPolyfill.get(key)
			// },
			() => {
				value = stringHashCode(key)
			},
			// () => {
			// 	value = murmurhash2_32_gc(key, 1)
			// },
			() => {
				value = murmurhash3_32_gc(key, 1)
			},
		)

		console.log(value)
		console.log(result)
	})

	xit('memory', function() {
		this.timeout(300000)

		const set = new Set()
		const setArray = {}
		const objects = []
		for (let i = 0; i < 10; i++) {
			objects[i] = {}
			getObjectUniqueId(objects[i])
		}

		console.log(calcMemAllocate(CalcType.Min, 50000, () => {
			for (let i = 0; i < 10; i++) {
				set.add(i * i * 10000000)
			}
			for (let i = 0; i < 10; i++) {
				set.delete(i * i * 10000000)
			}
		}).toString())
	})
})
