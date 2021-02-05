// import { open, create, insert, select } from './db.js'
import db from '../db.js'
import { db_name } from '../config.js'

// export default function ({ username, avatar }) {
// 	db.table = 'user'
// 	db.open()
// 	db.insert({
// 		username,
// 		avatar
// 	})
// }

db.table = 'user'

export default {
	// 将登陆用户存储到数据库
	save({ username, avatar, unionid }) {
		db.open()
		.then(() => {
			// db.drop()
			// db.create([
			// 	{
			// 		field: 'unionid',
			// 		type: 'text',
			// 		pk: true,
			// 		isNull: false
			// 	},
			// 	{
			// 		field: 'username',
			// 		type: 'text',
			// 		isNull: false
			// 	},
			// 	{
			// 		field: 'avatar',
			// 		type: 'text',
			// 		isNull: false
			// 	}
			// ])
			db.insert({
				username,
				avatar,
				unionid
			})
		})
	},
	// 从数据库中获取当前登陆用户
	get() {
		return new Promise((resolve, reject) => {
			return db.open()
			.then(() => {
				return db.select()
			})
			.then(res => {
				if(res.length === 1) {
					resolve(res[0])
				} else {
					console.log('用户未登陆')
					reject('用户未登陆')
				}
			})
		})
	}
}