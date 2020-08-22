//计算服务器消耗时长的中间件
//导出函数
module.exports = async (ctx,next) => {
  //记录开始时间
  const start = Date.now()
  //让内层中间件得到执行
  await next()
  //记录结束时间
  const end =Date.now()
  //设置响应头
  const duration = (end-start)/1000
  //ctx.set(设置响应头)
  ctx.set('X-Response-Time',duration+'s')
}