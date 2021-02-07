'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const { user_id } = event
	const collection = await db.collection('goal')
	const res = await collection.where({
		create_by: user_id
	}).orderBy('timestamp', 'desc').get()
	
	//返回数据给客户端
	return res
};
