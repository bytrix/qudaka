import { db_name } from './config.js'

export default {
	table: '',
	open() {
		const isOpen = plus.sqlite.isOpenDatabase({
			name: db_name,
			path: `_doc/${this.table}.db`,
			success(e) {
				console.log('open success')
			},
			fail(e) {
				console.log('open fail', e)
			}
		})
		return new Promise((resolve, reject) => {
			if(isOpen) {
				resolve('ok')
			} else {
				plus.sqlite.openDatabase({
					name: db_name,
					path: `_doc/${this.table}.db`,
					success: e => {
						console.log('打开数据库', e)
						resolve(e)
					},
					fail: e => {
						console.log('数据库创建失败', e)
						reject(e)
					}
				})
			}
		})
		// console.log('isOpen', isOpen)
		// if(isOpen) return
	},
	drop() {
		return new Promise((resolve, reject) => {
			const sql = `DROP TABLE IF EXISTS ${this.table}`
			console.log(sql)
			return plus.sqlite.executeSql({
				name: db_name,
				sql,
				success(e) {
					console.log('删除表成功')
					resolve(e)
				},
				fail(e) {
					console.error('删除表失败', e)
					reject(e)
				}
			})
		})
	},
	create(fields) {
		const that = this
		fields = fields.map(({field, type, pk = false, notNull = false, unique = false}) => {
			return `${field} ${type}${pk ? ' PRIMARY KEY' : ''}${notNull ? ' NOT NULL' : ''}${unique ? ' UNIQUE' : ''}`
		}).join(', ')
		const sql = `CREATE TABLE IF NOT EXISTS ${this.table} (${fields})`
		console.log(sql)
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: db_name,
				sql,
				success(e) {
					console.log(`${that.table}表创建成功`, e)
					resolve(e)
				},
				fail(e) {
					console.log(`${that.table}表创建失败`, e)
					reject(e)
				}
			})
		})
	},
	insert(data) {
		const fields = Object.keys(data).join(',')
		const values = Object.values(data).map(_ => (_ === null || _ === undefined) ? 'null' : `"${_}"`).join(',')
		const sql = `INSERT INTO ${this.table} (${fields}) VALUES(${values})`
		console.log(sql)
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: db_name,
				sql,
				success(e) {
					console.log('插入成功', e)
					resolve(e)
				},
				fail(e) {
					console.log('插入失败', e)
					reject(e)
				}
			})
		})
	},
	select() {
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: db_name,
				sql: `select * from ${this.table}`,
				success(e) {
					console.log('查询成功', e)
					resolve(e)
				},
				fail(e) {
					console.log('查询失败', e)
					reject(e)
				}
			})
		})
	},
	update(newFields, whereCondition) {
		newFields = Object.entries(newFields).map(([k, v]) => {
			return `${k}="${v}"`
		}).join(', ')
		// console.log('newFields', newFields)
		whereCondition = Object.entries(whereCondition).map(([k, v]) => {
			return `${k}="${v}"`
		}).join(', ')
		const sql = `UPDATE ${this.table} SET ${newFields} WHERE ${whereCondition}`
		console.log(sql)
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: db_name,
				sql,
				success(e) {
					console.log('更新成功', e)
					resolve(e)
				},
				fail(e) {
					console.log('更新失败', e)
					reject(e)
				}
			})
		})
	}
}