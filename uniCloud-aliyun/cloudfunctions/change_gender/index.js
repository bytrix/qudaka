'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { id, gender } = event
	const collection = db.collection('db-user')
	const res = collection.doc(id).update({
		gender
	})
	
	//返回数据给客户端
	return res
};
