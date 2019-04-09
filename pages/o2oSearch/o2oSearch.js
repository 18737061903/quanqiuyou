// pages/o2oSearch/o2oSearch.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ossHttp: '',
        searchValue: '',
        // 推荐活动
        recommAct: ['友盟开业大礼包', '大闸蟹买就送'],
        history: [],
        lng: '',
        lat: '',
        page: 0,
        size: 10,
        // 搜索出的活动列表
        actList: [],
        hasRes: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 经纬度
        let lat = options.lat;
        let lng = options.lng;
        // oss http
        this.setData({
            ossHttp: app.globalData.ossHttp
        })
        // 存储的历史记录
        let history = app.globalData.searchHistory;
        this.setData({
            history: history,
            lat: lat,
            lng: lng
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
        let value = this.data.searchValue;
        let lng = this.data.lng;
        let lat = this.data.lat;
        let page = this.data.page;
        let size = this.data.size;
        this.searchAvtivityPage(value, lng, lat, page, size);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 获取input value
    getValue(e) {
        this.setData({
            searchValue: e.detail.value
        })
    },
    // 清除搜索内容
    clearValue() {
        this.setData({
            searchValue: ''
        })
    },
    // 清除历史搜索
    delHistory() {
        let that = this;
        wx.showModal({
            title: '温馨提示',
            content: '确定要删除历史搜索记录吗~',
            success(res) {
                if (res.confirm) {
                    app.globalData.searchHistory = [];
                    that.setData({
                        history: []
                    })
                    sun.showMsg('删除成功~');
                }
            }
        })
    },
    // 搜索
    doSearch() {
        let value = this.data.searchValue;
        if (!value) {
            sun.showMsg('请输入搜索内容~');
            return;
        }
        // 先清空活动列表,page归0
        this.setData({
            actList: [],
            page: 0
        })
        let lng = this.data.lng;
        let lat = this.data.lat;
        let page = this.data.page;
        let size = this.data.size;
        // request
        this.searchAvtivityPage(value, lng, lat, page, size);
        // 存储搜索记录
        let arr = this.data.history;
        if (value) arr.push(value);
        this.setData({
            history: arr
        });
        app.globalData.searchHistory = [];
        app.globalData.searchHistory = this.data.history;
    },
    // 推荐，或历史搜索
    itemSearch(e) {
        let value = e.currentTarget.dataset.item;
        // 存储搜索记录
        let arr = this.data.history;
        if (value) arr.push(value);
        this.setData({
            history: arr
        });
        app.globalData.searchHistory = [];
        app.globalData.searchHistory = this.data.history;
        // 先清空活动列表,page归0
        this.setData({
            actList: [],
            page: 0,
            searchValue: value
        })
        let lng = this.data.lng;
        let lat = this.data.lat;
        let page = this.data.page;
        let size = this.data.size;
        // request
        this.searchAvtivityPage(value, lng, lat, page, size);
    },
    // request搜索活动列表  search    lng      lat    page    size   
    searchAvtivityPage(value, lng, lat, page, size) {
        // 搜索活动
        let that = this;
        if (!page) {
            page = 1;
        } else {
            ++page;
        }
        sun.actRequest({
            url: http.searchAvtivityPage,
            showLoading: true,
            data: {
                search: value,
                lng: lng,
                lat: lat,
                page: page,
                size: size
            },
            success: (data) => {
                // 搜索 没有相关内容
                if (!data.length && page == 1) {
                    sun.showMsg('没有相关内容~');
                    console.log(111)
                    that.setData({
                        hasRes: false
                    })
                    return;
                }
                // 第一页
                if (data.length && page == 1) {
                    that.setData({
                        actList: data,
                        page: page,
                        hasRes: true
                    })
                    return;
                }
                // 第n页加载数据
                if (data.length && page !== 1) {
                    let arr = this.data.actList;
                    arr = arr.concat(data);
                    this.setData({
                        actList: arr,
                        page: page
                    })
                } else {
                    sun.showMsg('没有更多了~');
                }
            },
            fail: (data) => { }
        })
    },
    //   到活动详情页
    goAcDetails(e) {
        let index = e.currentTarget.dataset.index;
        let actId = this.data.actList[index].id;
        wx.navigateTo({
            url: '../activityDetails/activityDetails?id=' + actId
        })
    }
})