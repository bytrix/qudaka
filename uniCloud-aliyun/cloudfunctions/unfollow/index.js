'use strict';
const _ = require('lodash')
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { user_id, friend_id } = event
	const doc = await db.collection('user').doc(user_id)
	const res = await doc.get()
	// 现有用户的好友
	const _friend_id = res.data[0].friend_id
	console.log('before delete _friend_id', _friend_id)
	_.remove(_friend_id, item => {
		return item === friend_id
	})
	console.log('when delete', _friend_id)
	await doc.update({
		friend_id: _friend_id
	})
	
	//返回数据给客户端
	return _friend_id
};
