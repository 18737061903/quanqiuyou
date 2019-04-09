// pages/orderDetail/orderDetail.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
     notAddress:false,//缺省
     address:'',
     goodsOrder:'',//商品列表
     addressId:"",
     itemListId:"1109032381634998274",//is普通商品
     seckill:'',//is秒杀商品
     //发票类型
     invoiceType:0,//
     titleType: 1,//
     credit: 1,//是否使用积分 0 不使用 1使用
     goodsList:[],//商品信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取商品列表
      console.log()
      this.setData({
          goodsList: app.globalData.cartIdList
      })
      app.globalData.cartIdList=[]
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
     let _this = this;
      //请求订单信息
      _this.setData({
          itemListId: app.globalData.cartIdList,
          seckill: app.globalData.seckill
      })
     let addressList=wx.getStorageSync("addressList")
      if (addressList){//切换地址
          _this.setData({
              address: addressList,
           notAddress: true//有地址                        
             })
          //判断获取是否秒杀订单
         _this.getGoodsMsg()
          wx.removeStorageSync("addressList")
      } else if (addressList==''){
          sun.showLoading('加载中~');
          _this.getdAddresslist()//获取默认地址
      }
  },
  //普通商品列表
getShopCartOrder(){
    let that = this;
    sun.actRequest({
        url: http.parseOnlineOrder,
        data: {
            goodsList: that.data.goodsList,
            cityCode: that.data.address.cityCode,
        },
        loading: true,
        success: (data) => {
            sun.hideLoading();
            that.setData({
                goodsOrder: data,
            })
        }
    });
},
//秒杀商品列表
getMSShopCartOrder() {
    let that = this;
    sun.request({
        url: http.getMSShopCartOrder,   
        data: {
            seckillId: that.data.seckill.seckillId,
            addressId: that.data.address.id,
            credit: that.data.credit,
            number: that.data.seckill.number
        },
        loading: true,
        success: (data) => {
            that.setData({
                goodsOrder: data,
            })
            sun.hideLoading();
        }
    });
},
//获取默认地址
 getdAddresslist() {
    let that=this;
    sun.actRequest({
        url: http.getUserDefaultAddress,
        data: {},
        loading: true,
        success: (data) => {
            if (data) {
                that.setData({
                    address: data,
                    notAddress: true//有地址                        
                })
                // console.log(that.data.address.cityCode)
            } else {
                //没有地址
                that.setData({
                    notAddress:false
                })
            }
            //判断获取是否秒杀订单
            that.getGoodsMsg()
        }
    });
},
//判断获取是否秒杀订单
getGoodsMsg() {
    let _this = this;
    if (JSON.stringify(_this.data.seckill) != "{}") {
        _this.getMSShopCartOrder()//获取秒杀goods列表
    } else {
        _this.getShopCartOrder()//获取普遍goods列表
    }
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
  //普通商品提交订单返回订单号
  craterOder(){
     
    let that=this;
    if (!that.data.notAddress){
       wx.showToast({
           icon:"none",
           title: '请添加地址',
       })
       return
    }
    sun.actRequest({
        url: http.createOnlineOrder,
        loading: true,
        data: {
            goodsList: that.data.goodsList,
            addressId: that.data.address.id,
        },
        success: (data) => {
            console.log(data)
           that.payOrder(data)
        }
    });
  },
//秒杀商品提交订单
addMSOrder() {
    let that = this;
    sun.request({
        url: http.addMSOrder,
        loading: true,
        data: {
            seckillId: that.data.seckill.seckillId,
            number: that.data.seckill.number,
            addressId: that.data.address.id,
            invoiceType: that.data.invoiceType,
            titleType: that.data.titleType,
            credit: that.data.credit,
        },
        success: (data) => {
            if (data.payPrice != 0) {
                that.payOrder(data)
            } else {
                that.payZeroOrder(data)
            }
        }
    });
},
payZeroOrder(data){
    //支付金额为0 
    let that = this;
    let payPrice = data.payPrice;
    sun.request({
        url: http.payZeroOrder,
        showLoading: true,
        data: {
            orderSn: data.orderSn
        },
        success: function (res) {
            wx.showModal({
                title: '支付成功',
                content: '',
                success(res) {
                    wx.redirectTo({
                        url: '/pages/successPay/successPay?payPrice=' + payPrice,
                    })
                }
            })
        },
        fail: function (res) {
            wx.showModal({
                title: '支付失败',
                content: '请重新支付'
            })
            //跳入订单详情
        },
    })
},
payOrder(data) {
    //吊起支付传订单号
    let that = this;
    sun.actRequest({
        url: http.payOrder,
        showLoading: true,
        data: {
            orderNo: data,
            payMethod:3
        },
        success: (data) => {
            if (data.paySuccess==0){
                wx.requestPayment({
                    timeStamp: data.payParam.timeStamp,
                    nonceStr: data.payParam.nonceStr,
                    package: data.payParam.package,
                    signType: data.payParam.signType,
                    paySign: data.payParam.paySign,
                    success: function (res) {
                        app.globalData.cartIdList = [];//清空
                        app.globalData.seckill = {};//清空
                        wx.showModal({
                            title: '支付成功',
                            content: '',
                            success(res) {
                                wx.redirectTo({
                                    url: '/pages/successPay/successPay?payPrice=' + payPrice,
                                })
                            }
                        })
                    },
                    fail: function (res) {
                        wx.showModal({
                            title: '支付失败',
                            content: '请重新支付',
                            success(res) {
                                //跳入订单详情
                                wx.redirectTo({
                                    url: '',
                                })
                            },
                            fail(res) {
                                //跳入订单详情
                                wx.redirectTo({
                                    url: '',
                                })
                            }
                        })
                    },
                })
            }
        }
    })
},
  //选择地址
  addressChoose(){
    wx.navigateTo({
      url: '../address/address',
    })
  }
})