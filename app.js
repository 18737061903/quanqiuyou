//app.js
var http = require("utils/http.js")
var sun = require("utils/sun.js")
App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // wx.setStorageSync("userInfo", res.userInfo)
              // console.log(res.userInfo)
              // console.log("app获取成功")
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
          })
        } //else {
        //   console.log("失败 引导用户授权")
        //   wx.navigateTo({
        //     url: '../wxlogin/wxlogin',
        //   })
        // }
      }
    })
    
  },
    globalData: {
        // 用户信息
        userInfo:null,
        // 
        baseUrl: "https://test.globmate.com",
        // 微信扫码
        qrCode: null,
        // oss_http
        ossHttp: 'https://globmate.oss-cn-hangzhou.aliyuncs.com/',
        // 购物车到订单 购物车列表
        cartIdList: [],
        //秒杀
        seckill:{},
        // 搜索记录
        searchHistory: []
    }
})