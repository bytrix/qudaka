'use strict';
const db = uniCloud.database()
// 数据库中不存在手机号，则注册新账号
// 若已存在手机号，则直接返回已有账号
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { phone } = event
	const collection = await db.collection('user')
	const res_matched_user = await collection.where({ phone }).get()
	const matched_users = res_matched_user.data
	console.log('匹配用户', matched_users)
	if(matched_users.length === 0) {
		const res = await collection.add(event)
		return {
			...res,
			...event,
			friend_id: []
		}
	} else {
		return {
			registered: true,
			// username: username,
			// phone: phone
			...matched_users[0],
			id: matched_users[0]._id
		}
	}
	//返回数据给客户端
	// return res
};
