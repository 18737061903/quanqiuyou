// pages/address/address.js
var app = getApp();
var http = require("../../utils/http.js");
var sun = require("../../utils/sun.js");
var startx = 0;
var movex = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    addressList:'',
    showImg:true,//缺省
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    sun.showLoading('加载中~');
    this.getdAddresslist()
  },
    getdAddresslist() {
        sun.actRequest({
            url: http.getUserAddressList,
            data: {},
            loading: true,
            success: (data) => {
                sun.hideLoading();
                if (data.length >= 0) {
                    let arr = data
                    arr.forEach(function (item) {
                        item.isSelected = false;
                        item.offsetX = 0;
                    })
                    this.setData({
                        addressList: arr,
                        showImg: false
                    })
                } else {
                    this.setData({
                        addressList: {},
                        showImg: true
                    })
                }

            }
        });
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
  //删除左右滑动
  dStart: function (event) {
    startx = event.touches[0].clientX;
  },
  dMove: function (event) {
    movex = event.touches[0].clientX;
      let index = event.target.dataset.index;
      let arr = this.data.addressList
      let offset = startx - movex;
      if (offset > 30) {
          arr[index].offsetX = -170;
      } else if (offset < -30) {
          arr[index].offsetX = 0;
      }
      this.setData({
          addressList: arr
      })
  },
  dEnd: function (event) {
  },
  //删除
  deleteAddress(e){
    let that=this;
    let id=e.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: '温馨提示, 确定要删除改地址吗？',
      success: function (res) {
        if (res.confirm==true) {
          sun.actRequest({
            url: http.delUserAddress,
            data: { id:id },
            loading: true,
            success: () => {
              wx.showToast({
                title: '删除成功',
              })
              that.getdAddresslist()
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })  
  },
  //编辑跳转
  navioNewaddress(e){
    let index = e.target.dataset.index;
    let list = JSON.stringify(this.data.addressList[index]);
    if(list){
      wx.navigateTo({
        url: '../editaddress/editaddress?list=' + list,
      })
    }else{
      wx.navigateTo({
        url: '../editaddress/editaddress',
      })
    }
  },
  //选取地址
  setDefault(e){
      let index = e.target.dataset.index;
      let addressList = this.data.addressList[index];
      wx.setStorageSync('addressList', addressList)
      wx.navigateBack({
          data: 1
      })
  },
  //设置默认地址
  bindtapisDefault(e){
      let id=e.target.dataset.id
      sun.actRequest({
          url: http.setDefaultUserAddress,
          data: {
              id:id
          },
          loading: true,
          success: (data) => {
            wx.showToast({
                icon:"none",
                title: '设置默认地址成功',
            })
            this.onShow()//设置成功再次加载
          }
      });
  }
})