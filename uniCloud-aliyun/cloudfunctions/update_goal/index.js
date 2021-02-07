'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { goal_id, times } = event
	const collection = await db.collection('goal')
	const res = await collection.doc(goal_id).update({
		times
	})
	//返回数据给客户端
	return res
};
