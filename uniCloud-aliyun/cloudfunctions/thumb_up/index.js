'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { record_id, user_id } = event
	
	// try {
	// 	const x = await db.collection('_thumb_up__record__user').add({
	// 		record_id,
	// 		user_id
	// 	})
	// } catch(e) {
	// 	console.log('点赞失败..', e)
	// 	// return {
	// 	// 	success: false,
	// 	// 	msg: '点赞失败'
	// 	// }
	// 	throw new Error('不能重复点赞')
	// }
	console.log(`用户${user_id}给打卡记录${record_id}点赞.`)
	
	// const collection = db.collection('record')
	const doc = db.collection('record').doc(record_id)
	const { data } = await doc.get()
	console.log('获取记录', data)
	if(data.length === 1) {
		// const old_thumb_up_count = data[0].thumb_up_count
		const old_thumb_up_users = data[0].thumb_up_users
		// console.log('点赞数', old_thumb_up_count)
		if(old_thumb_up_users.indexOf(user_id) !== -1) {
			throw new Error('不能重复点赞！')
		}
		return await doc.update({
			// thumb_up_count: old_thumb_up_count + 1,
			thumb_up_users: [
				...old_thumb_up_users,
				user_id
			]
		})
	}
	
	//返回数据给客户端
	// return event
};
