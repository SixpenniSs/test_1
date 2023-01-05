//用户的路由模块
const express = require('express')

const router = express.Router()

const artcate_handler = require('../router_handler/artcate')

//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const {
	add_cate_schema,
	delete_cate_schema,
	get_cate_schema,
	update_cate_schema,
} = require('../schema/artcate')

//获取文章分类的列表数据
router.get('/cates', artcate_handler.getAtricleCates)
//新增文章分类
router.post(
	'/addcates',
	expressJoi(add_cate_schema),
	artcate_handler.addArticleCates
)
// 根据 Id 删除文章分类的路由
router.get(
	'/deletecate/:id',
	expressJoi(delete_cate_schema),
	artcate_handler.deleteCateById
)
// 根据 Id 获取文章分类的路由
router.get(
	'/cates/:id',
	expressJoi(get_cate_schema),
	artcate_handler.getArtCateById
)
// 根据 Id 更新文章分类的路由
router.post(
	'/updatecate',
	expressJoi(update_cate_schema),
	artcate_handler.updateCateById
)

module.exports = router
