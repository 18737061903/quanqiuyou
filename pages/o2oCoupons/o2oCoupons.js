// pages/o2oCoupons/o2oCoupons.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ossHttp: '',
        shopId: '',
        coupon: [],
        page: 0,
        size: 10
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            shopId: options.id
        })
        // oss http
        this.setData({
            ossHttp: app.globalData.ossHttp
        })
        // 获取店铺可领取优惠券
        let page = this.data.page;
        let size = this.data.size;
        this.getValidCouponByLocale(page, size);
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
        // 加载更多
        let page = this.data.page;
        let size = this.data.size;
        this.getValidCouponByLocale(page, size);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 获取店铺可领取优惠券
    getValidCouponByLocale(page, size) {
        let that = this;
        let id = this.data.shopId;
        if (!page) {
            page = 1;
        } else {
            ++page;
        }
        sun.actRequest({
            url: http.getValidCouponByLocale,
            showLoading: true,
            data: { 
                id: id,
                page: page,
                size: size
            },
            success: (data) => {
                // 加载第一页
                if (data.length && page == 1) { 
                    that.setData({
                        coupon: data,
                        page: page
                    })
                    return;
                }
                // 第n页加载数据
                if (data.length && page !== 1) {
                    // sun.showMsg('加载成功~');
                    let arr = this.data.coupon;
                    arr = arr.concat(data);
                    this.setData({
                        coupon: arr,
                        page: page
                    })
                    return;
                }
                // 第n页无数据
                if (!data.length && page !== 1) {
                    sun.showMsg('没有更多了~');
                }
            },
            fail: (data) => { }
        })
    },
    // 领取优惠券
    receiveCoupon(e) {
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
            fail: (data) => { }
        })
    }
})