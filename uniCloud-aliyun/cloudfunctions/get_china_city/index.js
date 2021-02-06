'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { parent_code } = event
	const collection = db.collection('opendb-city-china')
	const res = collection.limit(500).where({type: 1, parent_code}).get()
	
	//返回数据给客户端
	return res
};
