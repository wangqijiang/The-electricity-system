//服务器的入口文件
//1创建koa实例对象
const Koa=require('koa')
const app = new Koa()
//2绑定中间件
//第一层
const respDurationMiddleware = require('./middleware/koa_response_duration')
app.use(respDurationMiddleware)
//第二层
const respHeaderMiddleware = require('./middleware/koa_response_header')
app.use(respHeaderMiddleware)
//第三层
const respDataMiddleware = require('./middleware/koa_response_data')
app.use(respDataMiddleware)
//3绑定端口号8888
app.listen(8888)

const webSocketService = require('./service/web_socket_service.js')
//开启服务端的监听，监听客户端的连接
//当某一个客户端连接成功之后，就对对这个客户端的进行message事件的监听
webSocketService.listen()