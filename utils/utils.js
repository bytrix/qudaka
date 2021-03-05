export function cutAny(n) {
	return function(arr) {
		// console.log('arr', arr)
		let emptyArr = new Array(n).fill(null)
		// if(arr.length <= n) {
			// for(let i in arr) {
			// 	emptyArr[i] = arr[i]
			// }
		// }
		for(let i = 0; i < n; i++) {
			emptyArr[i] = arr[i]
		}
		console.log('emptyArr', emptyArr)
		return emptyArr
	}
}

export function randomStr(n) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSUVWXYZ0123456789'
	let res = ''
	for(let i = 0; i < n; i++) {
		let r = Math.round(Math.random() * 62)
		res += alphabet[r]
	}
	return res
}

export function randomUsername() {
	return 'u_' + randomStr(8)
}

export function objectPropFill(obj, value) {
	for(let k in obj) {
		if(obj[k] === null) {
			obj[k] = value
		}
	}
	return obj
}

export function range(n) {
	let arr = new Array(n).fill(0)
	console.log('arr', arr)
	for(let i = 0 ; i < arr.length; i++) {
		arr[i] = i
	}
	return arr
}