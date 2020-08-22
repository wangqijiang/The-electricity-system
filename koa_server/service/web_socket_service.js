const WebSocket = require('ws')
const fileUtils = require('../utils/file_utils')
const path = require('path')
// 创建websocket服务端的对象绑定的端口号是9998
const wss = new WebSocket.Server({port: 9998})
//服务端开启了监听
module.exports.listen = () => {
  // 对客户端的连接事件进行监听
  // client代表的是客户端的连接socket对象
  wss.on('connection', client => {
    console.log('有客户端连接成功')
    // 对客户端连接对象进行message事件的监听
    // msg: 由客户端发给服务端的数据
    client.on('message',async msg => {
      console.log('客户端发送数据给服务端了'+msg)
      let payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') {
        let filePath = '../data/' + payload.chartName + '.json'
        filePath = path.join(__dirname, filePath)
        const ret = await fileUtils.getFileJsonData(filePath)
        //在服务端获取到数据的基础之上，增加data的字段
        // data对应的值就是某个json文件的的内容
        payload.data = ret
        client.send(JSON.stringify(payload))
      } else {
        // 原封不动的将所接受到的数据转发给每个连接中的客户端
        // wss.clients代表所有客户端的连接
        wss.cliend.forEach(client => {
          client.send(msg)
        })
      }
      // 由服务端往客户端发送数据
      cliend.send('你好我是服务端')
    })
  })
}

