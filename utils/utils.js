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