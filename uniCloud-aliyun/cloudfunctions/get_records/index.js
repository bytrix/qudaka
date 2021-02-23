/**
 * 云函数不支持jql语法，故弃之
 * https://uniapp.dcloud.io/uniCloud/cf-database?id=%e8%8e%b7%e5%8f%96%e9%9b%86%e5%90%88%e7%9a%84%e5%bc%95%e7%94%a8
 */

'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { date, user_id } = event
	const collection = await db.collection('record')
	const res = await collection.where({
		date,
		user_id
	}).get()
	console.log('res', res)
	// const res = await collection
	// 	.where('user_id.times == 1')
	// 	.field('user_id{username,avatar},text')
	// 	.orderBy('create_time', 'desc')
	// 	.get()
	// 	.then(res => {
	// 		console.log('res', res)
	// 	})
	// 	.catch(err => {
	// 		console.log('err', err)
	// 	})
	//返回数据给客户端
	return res
};
