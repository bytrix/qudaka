import db from '../db.js'
import { db_name } from '../config.js'

db.table = 'user'

export default {
	truncate() {
		console.log('清空user表')
		return db.open()
		.then(() => {
			return db.drop()
		})
		.then(() => {
			console.log('重新建表')
			return db.create([
				{
					field: 'id',
					type: 'text',
					pk: true,
					notNull: true
				},
				{
					field: 'phone',
					type: 'text',
					notNull: true,
					unique: true
				},
				{
					field: 'username',
					type: 'text',
					notNull: true
				},
				{
					field: 'avatar',
					type: 'text',
				},
				{
					field: 'gender',
					type: 'char'
				},
				{
					field: 'location',
					type: 'text'
				},
				{
					field: 'birthday',
					type: 'text'
				},
				{
					field: 'signature',
					type: 'text'
				}
			])
		})
	},
	// 将登陆用户存储到数据库
	save(fields) {
		return db.open()
		.then(() => {
			return db.insert(fields)
		})
	},
	update(newValues, whereCondition) {
		console.log('update....', newValues, whereCondition)
		return db.open()
		.then(() => {
			return db.update(newValues, whereCondition)
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