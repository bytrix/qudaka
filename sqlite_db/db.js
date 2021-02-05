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
						console.log('数据库穿件失败', e)
						reject(e)
					}
				})
			}
		})
		// console.log('isOpen', isOpen)
		// if(isOpen) return
	},
	drop() {
		plus.sqlite.executeSql({
			name: db_name,
			sql: `drop table ${this.table}`,
			success(e) {
				console.log('删除表成功')
			}
		})
	},
	create(fields) {
		fields = fields.map(({field, type, pk = false, isNull = true}) => {
			return `${field} ${type} ${pk ? 'PRIMARY KEY ' : ''}${!isNull ? 'NOT NULL' : ''}`
		}).join(', ')
		const sql = `CREATE TABLE ${this.table} (${fields})`
		console.log(sql)
		plus.sqlite.executeSql({
			name: db_name,
			sql,
			success(e) {
				console.log('sql 执行成功', e)
			},
			fail(e) {
				console.log('sql执行失败', e)
			}
		})
	},
	insert(data) {
		const fields = Object.keys(data).join(',')
		const values = Object.values(data).map(_ => `"${_}"`).join(',')
		const sql = `insert into ${this.table}(${fields}) values(${values})`
		// console.log('sql', sql)
		plus.sqlite.executeSql({
			name: db_name,
			sql,
			success(e) {
				console.log('插入成功', e)
			},
			fail(e) {
				console.log('插入失败', e)
			}
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
	}
}