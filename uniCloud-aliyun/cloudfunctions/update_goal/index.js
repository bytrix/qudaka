'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { goal_id, times } = event
	const collection = db.collection('db-goal')
	const res = collection.doc(goal_id).update({
		times
	})
	//返回数据给客户端
	return res
};
