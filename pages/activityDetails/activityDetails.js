// pages/activityDetails/activityDetails.js
var app = getApp();
var http = require("../../utils/http.js");
var sun = require("../../utils/sun.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ossHttp: '',
        actDetails: '',
        shopInfo: '',
        reduce: [],
        coupon: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // oss http
        this.setData({
            ossHttp: app.globalData.ossHttp
        })
        // 获取活动详情
        let actId = options.id;
        this.getAvtivityInfo(actId);
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
    // 获取活动详情
    getAvtivityInfo(actId) {
        let that = this;
        sun.actRequest({
            url: http.getAvtivityInfo,
            showLoading: true,
            data: { id: actId },
            success: (data) => {
                this.setData({
                    actDetails: data
                })
                if (data) {
                    // 获取o2o店铺信息
                    this.getLocaleInfo(this.data.actDetails.localeId);
                    // 获取活动满减活动
                    this.getReduceByActivity(this.data.actDetails.id);
                    // 获取活动领取优惠券列表
                    this.getCouponByActivity(this.data.actDetails.id);
                }
            },
            fail: (data) => {
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000)
            }
        })
    },
    // 获取o2o店铺信息
    getLocaleInfo(localeId) {
        let that = this;
        sun.actRequest({
            url: http.getLocaleInfo,
            showLoading: true,
            data: { id: localeId },
            success: (data) => {
                this.setData({
                    shopInfo: data
                })
            },
            fail: (data) => { }
        })
    },
    // 获取活动满减活动
    getReduceByActivity(activityId) {
        let that = this;
        sun.actRequest({
            url: http.getReduceByActivity,
            showLoading: true,
            data: { id: activityId },
            success: (data) => {
                this.setData({
                    reduce: data
                })
            },
            fail: (data) => { }
        })
    },
    // 获取活动领取优惠券列表
    getCouponByActivity(activityId) {
        let that = this;
        sun.actRequest({
            url: http.getCouponByActivity,
            showLoading: true,
            data: { id: activityId },
            success: (data) => {
                this.setData({
                    coupon: data
                })
            },
            fail: (data) => { }
        })
    },
    // 查看店铺地址
    shopAddress() {
        wx.openLocation({
            latitude: this.data.shopInfo.lat,
            longitude: this.data.shopInfo.lng,
            scale: 16
        })
    },
    //拨打店铺电话
    makeCall(e) {
        let tel = JSON.stringify(this.data.shopInfo.tel).replace(/\"/g, "  ");
        wx.makePhoneCall({
            phoneNumber: tel,
            success: function (res) {
                
            }, fail: function (err) { }
        })
    },
    // 收藏相关
    selectChange() {
        let isCollect = this.data.actDetails.isCollect;
        if (isCollect) {
            this.cancelCollectActivity();
        } else {
            this.collectActivity();
        }
    },
    // 收藏活动
    collectActivity() {
        sun.actRequest({
            url: http.collectActivity,
            showLoading: true,
            data: { activityId: this.data.actDetails.id },
            success: (data) => {
                sun.showMsg('已收藏~');
                let act = this.data.actDetails;
                act.isCollect = 1;
                ++act.collectNum;
                this.setData({
                    actDetails: act
                })
            },
            fail: (data) => {}
        })
    },
    // 取消收藏活动
    cancelCollectActivity() {
        sun.actRequest({
            url: http.cancelCollectActivity,
            showLoading: true,
            data: { activityId: this.data.actDetails.id },
            success: (data) => {
                sun.showMsg('取消收藏~');
                let act = this.data.actDetails;
                act.isCollect = 0;
                --act.collectNum;
                this.setData({
                    actDetails: act
                })
            },
            fail: (data) => {}
        })
    },
    // 点赞相关
    likeChange() {
        let isLike = this.data.actDetails.isLike;
        if (isLike) {
            this.cancelLikeActivity();
        } else {
            this.likeActivity();
        }
    },
    // 点赞活动
    likeActivity() {
        sun.actRequest({
            url: http.likeActivity,
            showLoading: true,
            data: { activityId: this.data.actDetails.id },
            success: (data) => {
                sun.showMsg('点赞成功~');
                let act = this.data.actDetails;
                act.isLike = 1;
                ++act.likeNum;
                this.setData({
                    actDetails: act
                })
            },
            fail: (data) => {}
        })
    },
    // 取消点赞活动
    cancelLikeActivity() {
        sun.actRequest({
            url: http.cancelLikeActivity,
            showLoading: true,
            data: { activityId: this.data.actDetails.id },
            success: (data) => {
                sun.showMsg('取消点赞~');
                let act = this.data.actDetails;
                act.isLike = 0;
                --act.likeNum;
                this.setData({
                    actDetails: act
                })
            },
            fail: (data) => {}
        })
    },
    // 领取优惠券
    receiveCoupon (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let arr = this.data.coupon;
        let id = arr[index].id;
        sun.actRequest({
            url: http.receiveCoupon,
            showLoading: true,
            data: { id: id },
            success: (data) => {
                sun.showMsg('领取成功~');
                arr[index].isReceive = 1;
                that.setData({
                    coupon: arr
                })
            },
            fail: (data) => {}
        })
    },
    // 跳转店铺详情
    goShop () {
        let id = this.data.actDetails.localeId;
        wx.navigateTo({
            url: '../shopDetails/shopDetails?id=' + id
        })
    }
})