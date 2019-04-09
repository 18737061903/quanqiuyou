const Sun = require('../../utils/sun.js')
var app = getApp();
var http = require("../../utils/http.js")
// pages/welcome/welcome.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    wx.getSetting({
        success(res) {
            if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                    success(res) {
                        page.parseUserInfo(res);
                    }
                })
            }
        }
    })
  },
    //openid 换取用户信息
    login: function (openId) {
        wx.setStorageSync("openId", openId);
        Sun.actRequest({
            url: http.wxMinLogin,
            hideShow: true,
            data: {
                openId: openId
            },
            success: res => {
                wx.setStorageSync("res", res);
                wx.redirectTo({
                    url: "../homes/homes"
                })
            },
            fail: (code, msg) => {
                wx.redirectTo({
                    url: '../binding/binding',
                })
            }
        })
    },
    //获取openid
    parseUserInfo(item) {
        Sun.showLoading('正在加载中~');
        let page = this; 
        let encrypt = item.encryptedData;
        let userInfo = item.userInfo;
        let iv = item.iv;
        wx.login({
            success: res => {
                console.log(res);
                Sun.actRequest({
                    url: http.getWxOpenIdByCode,
                    data: {
                        code: res.code,
                        encrypt: encrypt,
                        iv: iv
                    },
                    success: (data) => {
                        console.log(data);
                        page.login(data);
                    }
                });
            }
        })
    }, 
    //授权按钮
    getUserInfo: function (data) {
        //用户允许登陆
        if (data.detail.rawData) {
            this.parseUserInfo(data.detail);
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                // if (res.confirm) {
                //   // console.log('用户点击了“返回授权”')
                // }
                }
            })
        }
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})