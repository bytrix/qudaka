'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	event = {
		timestamp: new Date().getTime(),
		times: parseInt(event.times),
		...event
	}
	console.log('event : ', event)
	const collection = db.collection('db-goal')
	const res = collection.add(event)
	//返回数据给客户端
	return res
};
