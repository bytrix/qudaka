'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	event = {
		...event,
		timestamp: new Date().getTime(),
		times: parseInt(event.times),
		repeat_times: parseInt(event.repeat_times)
	}
	console.log('event : ', event)
	const collection = await db.collection('goal')
	const res = await collection.add(event)
	//返回数据给客户端
	return res
};
