'use strict';
const _ = require('lodash')
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { user_id, friend_id } = event
	const doc = db.collection('user').doc(user_id)
	const res = await doc.get()
	console.log('关注查询', res)
	// 获取用户的现好友
	const _friend_id = res.data[0].friend_id || []
	console.log('_friend_id...', _friend_id)
	// 将新好友添加进现好友并去重
	const new_friend_id = _.uniq([..._friend_id, friend_id])
	const res2 = await doc.update({
		friend_id: new_friend_id
	})
	
	//返回数据给客户端
	return new_friend_id
};
