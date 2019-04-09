// pages/shopDetails/shopDetails.js
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
        shopDetails: '',
        openTime: [],
        label: [],
        offer: [],
        media: {},
        reduce: [],
        isMore: false,
        coupon: [],
        // 菜单项
        menu: [
            {
                title: '店铺活动',
                list: []
            },
            // {
            //     title: '店铺店铺',
            //     list: []
            // }
        ],
        // 当前选择条目
        select: 0,
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        // oss http
        this.setData({
            ossHttp: app.globalData.ossHttp
        })
        // 商户id
        this.setData({
            shopId: options.id
        })
        // 获取商户详情
        this.getLocaleInfo();
        // 获取店铺详细信息
        this.getLocaleDetail();
        // 获取媒体数量
        this.getMediaCount();
        // 获取店铺可用满减活动
        this.getValidReduceByLocale();
        // 获取店铺可领取优惠券
        this.getValidCouponByLocale();
        // 获取推荐活动列表
        this.getRecommandActivityList();
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
    // 获取店铺详情
    getLocaleInfo () {
        let that = this;
        sun.actRequest({
            url: http.getLocaleInfo,
            showLoading: true,
            data: { id: this.data.shopId },
            success: (data) => {
                that.setData({
                    shopDetails: data
                })
                // 页面标题显示店铺名称
                wx.setNavigationBarTitle({
                    title: data.name
                })
            },
            fail: (data) => { }
        })
    },
    // 获取店铺详细信息
    getLocaleDetail () {
        let that = this;
        sun.actRequest({
            url: http.getLocaleDetail,
            showLoading: true,
            data: { id: this.data.shopId },
            success: (data) => {
                that.setData({
                    label: data.label,
                    offer: data.offer,
                    openTime: data.openTime
                })
            },
            fail: (data) => { }
        })
    },
    // 获取媒体数量
    getMediaCount () {
        let that = this;
        sun.actRequest({
            url: http.getMediaCount,
            showLoading: true,
            data: { id: this.data.shopId },
            success: (data) => {
                that.setData({
                    media: data
                })
            },
            fail: (data) => { }
        })
    },
    // 获取店铺可用满减活动
    getValidReduceByLocale () {
        let that = this;
        sun.actRequest({
            url: http.getValidReduceByLocale,
            showLoading: true,
            data: { id: this.data.shopId },
            success: (data) => {
                that.setData({
                    reduce: data
                })
            },
            fail: (data) => { }
        })
    },
    // 获取店铺可领取优惠券
    getValidCouponByLocale () {
        let that = this;
        sun.actRequest({
            url: http.getValidCouponByLocale,
            showLoading: true,
            data: { id: this.data.shopId },
            success: (data) => {
                let arr = data;
                if (arr.length && arr.length > 2) {
                    arr.splice(2, arr.length - 2);
                    that.setData({
                        isMore: true
                    })
                }
                that.setData({
                    coupon: arr
                })
            },
            fail: (data) => { }
        })
    },
    // 推荐活动列表
    getRecommandActivityList () {
        let that = this;
        sun.actRequest({
            url: http.getRecommandActivityList,
            showLoading: true,
            data: { id: this.data.shopId },
            success: (data) => {
                // let arr = data;
                // if (arr.length && arr.length > 2) {
                //     arr.splice(2, arr.length - 2);
                // }
                // that.setData({
                //     coupon: arr
                // })
            },
            fail: (data) => { }
        })
    },
    // 查看店铺地址
    shopAddress() {
        wx.openLocation({
            latitude: this.data.shopDetails.lat,
            longitude: this.data.shopDetails.lng,
            scale: 16
        })
    },
    //拨打店铺电话
    makeCall(e) {
        let tel = JSON.stringify(this.data.shopDetails.tel).replace(/\"/g, "  ");
        wx.makePhoneCall({
            phoneNumber: tel,
            success: function (res) {
                // console.log(res);
            }, fail: function (err) { }
        })
    },
    // 菜单选择
    chooseMenu(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            select: index
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
    },
    // go营业信息
    businessInfo () {
        let id = this.data.shopId;
        wx.navigateTo({
            url: '../businessInfor/businessInfor?id=' + id
        })
    },
    // go店铺优惠券
    moreCoupon () {
        let id = this.data.shopId;
        wx.navigateTo({
            url: '../o2oCoupons/o2oCoupons?id=' + id
        })
    },
    // go店铺图片，视频
    mediaDetails () {
        let id = this.data.shopId;
        wx.navigateTo({
            url: '../o2oShopMedia/o2oShopMedia?id=' + id
        })
    }
})