// pages/businessInfor/businessInfor.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopId: '',
        businessInfor: {
            label: [],
            offer: [],
            openTime: []
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            shopId: options.id
        })
        // 获取店铺详细信息
        this.getLocaleDetail(this.data.shopId);
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
    // 获取店铺详细信息
    getLocaleDetail (shopId) {
        let id = shopId;
        let that = this;
        sun.actRequest({
            url: http.getLocaleDetail,
            showLoading: true,
            data: { id: id },
            success: (data) => {
                if (data) {
                    that.setData({
                        businessInfor: data
                    })
                }
            },
            fail: (data) => { }
        })
    }
})