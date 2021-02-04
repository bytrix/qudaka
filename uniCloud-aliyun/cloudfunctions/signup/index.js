'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { username, avatar, unionid } = event
	const collection = db.collection('db-user')
	const res_matched_user = await collection.where({ unionid }).get()
	console.log('匹配用户', res_matched_user)
	if(res_matched_user.data.length === 0) {
		return collection.add(event)
	} else {
		return {
			registered: true,
			username: username,
			unionid: unionid
		}
	}
	//返回数据给客户端
	// return res
};
