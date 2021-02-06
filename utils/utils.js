export function cutAny(n) {
	return function(arr) {
		let emptyArr = new Array(n).fill(undefined)
		if(arr.length <= n) {
			for(let i in arr) {
				emptyArr[i] = arr[i]
			}
		}
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