// 导入express
const express = require('express')
const app = express()
// 导入joi
const joi = require('joi')

const cors = require('cors')
app.use(cors())

//配置解析表单数据中间件
//只能解析application和x-www-form-urencoded格式的表单中间件
app.use(express.urlencoded({ extended: false }))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 一定要在路由之前封装函数
app.use((req, res, next) => {
	// status默认值为1表示错误情况
	res.cc = function (err, status = 1) {
		res.send({
			status,
			message: err instanceof Error ? err.message : err,
		})
	}
	next()
})

//一定要在路由之前配置解析token中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(
	expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] })
)

//导入并使用路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
//导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
//导入并使用文章分类
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
//导入并使用文章
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

//定义错误级别中间件
app.use((err, req, res, next) => {
	// 验证失败的错误
	if (err instanceof joi.ValidationError) return res.cc(err)
	//身份认证失败的错误
	if (err.name === 'UnauthorizedError') return res.cc('身份认证失败 ')
	//如果是未知的错误
	res.cc(err)
})

//启动服务器
app.listen(3007, () => {
	console.log('api sever running at http://127.0.0.1:3007')
})
