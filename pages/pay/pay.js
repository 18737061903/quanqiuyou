// pages/pay/pay.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http: 'https://globmate.oss-cn-hangzhou.aliyuncs.com/',
    money:'',//支付金额
    sn: "ZX201901251634165270",
    moneytrue:false,//判断是否可点击
    payment:false,//付款
    paymoney:false,//支付金额
    moneyreduction:false,//满减
    shopid:'',//店铺id
    getPayResult:'',//支付信息
    plaeseinput:'请输入金额',
    nickName:'',//名字
    headPic:"",//头像
    // 支付价格
    payPrice: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        //店铺基本数据
        this.setData({
            shopid: options.nearShopId,
            headPic: options.headPic,
            nickName: options.nickname
        })
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  //输入金额
  moneyinput(e){
    // console.log(e.detail.value)
   var that=this;
   that.setData({
     money: e.detail.value
   })
    if (e.detail.value){
      that.setData({
        moneytrue: true,
        payment: false,//付款
        paymoney: false,//支付金额
        moneyreduction: false,//满减
      })
    } else if (!e.detail.value){
      that.setData({
        moneytrue: false,
        payment: false,//付款
        paymoney: false,//支付金额
        moneyreduction: false,//满减
      })
    }
  },
  //点击确认
  moneytrues(){

    let that=this;
    let money=that.data.money;
    let shopid = that.data.shopid;
    // 多个小数点
    if ((money.split('.').length - 1) > 1) {
        wx.showToast({
            title: '请输入正确的数字',
            icon: 'none',
            duration: 1000
        })
        return;
    }
    if (that.data.moneytrue){
      sun.request({
        url: http.getPayResult,
        showLoading: true,
        data: {
          shopId: shopid,
          totalPrice: money
        },
        success: (data) => {
          // console.log(data)
          if (data.subtractFull===0 && data.subtractCut===0){
            that.setData({
              plaeseinput:"未查询到符合条件的满减优惠",
              moneyreduction:false,//满减
            })
          }else{
            that.setData({
              moneyreduction:true,//满减
            })
          }
          that.setData({
            getPayResult:data,
            payment: true,//付款
            paymoney: true,//支付金额
          })
        }
      })
     
    }
  },
  // 支付
  pay(){
    var that=this;
    var resultPrice= that.data.getPayResult.resultPrice;
    let shopid = that.data.shopid;
    if (this.data.payment){
      sun.request({
        url: http.addXXOrder,
        showLoading: true,
        data: {
          totalPrice: resultPrice,
          shopId: shopid,
          credit:1
        },
        success: (data) => {
            that.setData({
                payPrice: data.payPrice
            })
            that.payOrder(data)
        }
      })
    }
  },
    payOrder(data){
        //吊起支付传订单号
        let that = this;
        sun.request({
            url: http.payOrder,
            showLoading: true,
            data: {
                orderSn: data.orderSn,
                payType: "yopWx",
            },
            success: (data) => {
                wx.requestPayment({
                    timeStamp: data.response.timeStamp,
                    nonceStr: data.response.nonceStr,
                    package: data.response.package,
                    signType: data.response.signType,
                    paySign: data.response.paySign,
                    success: function (res) {
                        console.log(res);
                        wx.showModal({
                            title: '支付成功',
                            content: '',
                            success(res) {
                                wx.redirectTo({
                                    url: '/pages/paySuccess/paySuccess?payPrice=' + that.data.payPrice + '&shopName=' + that.data.nickName
                                })
                            }
                        })
                    },
                    fail: function (res) {
                        wx.showModal({
                            title: '支付失败',
                            content: '请重新支付'
                        })
                    },
                })
            }
        })
    }
})