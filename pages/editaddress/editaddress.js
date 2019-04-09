// pages/editaddress/editaddress.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
var city = require("../../utils/cityCode.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEidtaddress:false,//判断是否是编辑
    // customItem: '全部',
    address:{
    cityCode:'',
      name: '',
      phone: '',
      address: ["请选择地区"],
      detail: '',
      isDefault: false,
    },
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (JSON.stringify(options)!="{}"){
       let address= JSON.parse(options.list)
      address.address = address.address.split(" ")
      this.setData({
        address:address,
        isEidtaddress:true
      })
    }
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
  //名字
  addressName(e){
   let name=e.detail.value;
   let address=this.data.address;
     address.name=name
   this.setData({
     address: address
   })
  },
  //电话
  addressPhone(e) {
    let phone = e.detail.value;
    let address = this.data.address;
    address.phone = phone
    this.setData({
      address: address
    })
  },
  //详细地址
  addressDetail(e) {
    let detail = e.detail.value;
    let address = this.data.address;
    address.detail = detail
    this.setData({
      address: address
    })
  },
  //地区选择
  addressChoose(e){
    let addressL = e.detail.value;
      let cityCode="";
    city.forEach((item) => {
        if (item.label == addressL[2]) {
            cityCode=item.value
      };
        if (item.children) {
            item.children.forEach((jitem) => {
                if (jitem.label == addressL[2]) {
                    cityCode = item.value
                }
                if (jitem.children){
                    jitem.children.forEach((kitem) => {
                        if (kitem.label == addressL[2]) {
                            cityCode = item.value;
                        }
                    })
                }
            })
        }
    })
    let address = this.data.address;
    address.address = addressL;
    address.cityCode = cityCode
    this.setData({
      address: address
    })
  },
  //默认设置
  switch1Change(e){
    let isDefault = e.detail.value;
    if (isDefault){
      isDefault=1
    }else{
      isDefault=0
    }
    let address = this.data.address;
    address.isDefault = isDefault
    this.setData({
      address: address
    })
  },
  
  //保存
  addressBtn(){
    if (this.data.address.name.length < 2) {
      wx.showToast({
        icon: "none",
        title: '请输入名字',
      })
      return;
    }
    if (this.data.address.phone.length !== 11) {
      wx.showToast({
        icon: "none",
        title: '请输入11位手机号',
      })
      return;
    }
    if (this.data.address.address.length < 2) {
      wx.showToast({
        icon: "none",
        title: '请选择地址',
      })
      return;
    }
    if (this.data.address.detail.length < 5) {
      wx.showToast({
        icon: "none",
        title: '请输入详细地址',
      })
      return;
    }
    let address = this.data.address
    address.address = address.address.join(" ")
      sun.actRequest({
          url: this.data.isEidtaddress?http.editUserAddress:http.addUserAddress,
          data: this.data.address,
          loading: true,
          success: (data) => {
              wx.showToast({
                  icon: "none",
                  title: '保存成功',
              })
              wx.navigateBack({
                  delta: 1
              })
          }
      })
  },
  //删除
  addressDelet() {
    let that=this;
    wx.showModal({
      title: '提示',
      content: '温馨提示, 确定要删除改地址吗？',
      success: function (res) {
        if (res.confirm) {
          sun.actRequest({
            url: http.delUserAddress,
            data: { id: that.data.address.id },
            loading: true,
            success: () => {
              wx.showToast({
                title: '删除成功',
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })  
  },
})