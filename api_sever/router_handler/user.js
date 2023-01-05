//导入数据库模块
const db = require('../db/index')
//导入bcryptjs
const bcrypt = require('bcryptjs')
//导入jwt
const jwt = require('jsonwebtoken')

const config = require('../config')

// 用户注册的处理函数
exports.regUser = (req, res) => {
	const userinfo = req.body //获取客户端的信息
	// console.log(userinfo)

	//对表单中的数据进行合法的校验在前面的joi中已经完成
	// if (!userinfo.username || !userinfo.password) {
	// 	return res.send({status: 1,message: '用户名或密码不合法!',	}) }

	//定义sql语句
	const sqlStr = 'select * from ev_users where username=?'
	db.query(sqlStr, [userinfo.username], (err, results) => {
		if (err) {
			// return res.send({ status: 1, message: err.message })
			return res.cc(err)
		}
		//判断用户名是都被占用
		if (results.length > 0) {
			// return res.send({ status: 1, message: '用户名被占用，请更换用户名！' })
			return res.cc('用户名被占用，请更换用户名！')
		}
		//用户名可以使用,调用bcypt对密码进行加密
		// console.log(userinfo)
		userinfo.password = bcrypt.hashSync(userinfo.password, 10)
		// console.log(userinfo)
		const sql = 'insert into ev_users set ?'
		db.query(
			sql,
			{ username: userinfo.username, password: userinfo.password },
			(err, results) => {
				//判断sql是否成功
				// if (err) return res.send({ status: 1, message: err.message })
				if (err) return res.cc(err)
				//判断影响行数
				if (results.affectedRows !== 1) {
					// return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
					return res.cc('注册用户失败，请稍后再试！')
				}
				//注册成功
				// res.send({ status: 0, message: '注册成功！' })
				res.cc('注册成功', 0)
			}
		)
	})
	// res.send('reguser OK!')
}
//用户登录的处理函数
exports.loginUser = (req, res) => {
	// 接收表单数据
	const userinfo = req.body
	// 定义sql语句
	const sql = 'select * from ev_users where username=?'
	// 执行sql语句，根据用户名查询用户的信息
	db.query(sql, userinfo.username, (err, results) => {
		if (err) return res.cc(err)
		if (results.length !== 1) return res.cc('登录失败 err1')

		//密码比对
		const compareResult = bcrypt.compareSync(
			userinfo.password,
			results[0].password
		)
		if (!compareResult) return res.cc('登陆失败 err2')

		//生成jwt的token字符串
		const user = { ...results[0], password: '', user_pic: '' }
		//对用户的信息进行加密
		const tokenStr = jwt.sign(user, config.jwtSecretKey, {
			expiresIn: config.expiresIn,
		})
		res.send({
			status: 0,
			message: '登录成功',
			token: 'Bearer ' + tokenStr,
		})
	})
	// res.send('login OK!')
}
