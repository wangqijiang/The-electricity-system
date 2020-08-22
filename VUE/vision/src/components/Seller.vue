<!-- 商家销量统计的横向柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      currentPage: 1, // 当前显示的页数
      totalPage: 2, // 一共多少页
      timerId: null // 定时器的标识
    }
  },
  created () {
    // 组件创建完成之后进行回调函数的注册
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
    // 发送数据给服务器，告诉服务器我需要数据
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
  },
  destroyer () {
    clearInterval(this.timerId)
    // 组件销毁的时候把他取消掉
    window.removeEventListener('resize', this.screenAdapter)
    // 组件销毁的时候进行回调函数的取消
    this.$socket.unregisterCallBack('sellerData')
  },
  methods: {
    // 初始化echartInstance对象
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)
      // 对图标初始化的配置
      const initOption = {
        title: {
          text: '☛ 商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离包含坐标轴上的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white' // 文字颜色
              }
            },
            itemStyle: {
              // 颜色渐变的方向
              // 不同百分比之下的颜色
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 百分之零下状态的颜色
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 百分之百下状态的颜色
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 对图表对象进行鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器数据
    getData (ret) {
      // http://127.0.0.1:8888/api/seller
      // const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      // 从小到大排序
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      // 每五个元素显示一页
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      console.log(this.totalPage)
      this.updateChart()
      // 启动定时器
      this.startInterval()
    },
    // 更新图标
    updateChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 屏幕适配
    screenAdapter () {
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 和分辨率相关的大小
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]// 柱状图圆角控制
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 必须手动调用图标对象的resize 才能有效果
      this.chartInstance.resize()
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstance.dispose()// 销毁图表
      this.initChart() // 重新以最新的主题名称初始化图表
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart()
    }
  }
}
</script>

<style>

</style>
