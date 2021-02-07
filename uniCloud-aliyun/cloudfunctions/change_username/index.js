'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { id, username } = event
	const collection = await db.collection('user')
	const res = await collection.doc(id).update({
		username
	})
	
	//返回数据给客户端
	return res
};
