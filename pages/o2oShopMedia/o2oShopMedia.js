// pages/o2oShopMedia/o2oShopMedia.js
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
        select: 0,
        menu: [
            {
                title: '图片',
            },
            {
                title: '视频',
            }
        ],
        size: 10,
        imgList: [],
        imgPage: 0,
        videoList: [],
        videoPage: 0,
        // 预览图片列表
        httpImgList: []
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
        // 获取图片列表
        let id = this.data.shopId;
        let page = this.data.imgPage;
        let size = this.data.size;
        this.getImgList(id, page, size);
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
        //加载更多图片
        if (this.data.select == 0) {
            let id = this.data.shopId;
            let page = this.data.imgPage;
            let size = this.data.size;
            this.getImgList(id, page, size);
        } else if (this.data.select == 1) {
            //加载更多视频
            let id = this.data.shopId;
            let page = this.data.videoPage;
            let size = this.data.size;
            this.getVideoList(id, page, size);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 获取图片列表
    getImgList (id, page, size) {
        let that = this;
        if (!page) {
            page = 1;
        } else {
            ++page;
        }
        sun.actRequest({
            url: http.getImgList,
            showLoading: true,
            data: { id: id, page: page, size: size},
            success: (data) => {
                // 商家没有图片
                if (!data.length && page == 1) {
                    sun.showMsg('商家暂未上传图片~');
                    return;
                }
                // 第一页图片
                if (data.length && page == 1) {
                    that.setData({
                        imgList: data,
                        imgPage: page
                    })
                }
                // 第n页加载数据
                if (data.length && page !== 1) {
                    let arr = this.data.imgList;
                    arr = arr.concat(data);
                    that.setData({
                        imgList: arr,
                        imgPage: page
                    })
                } 
                if (!data.length && page !== 1) { 
                    sun.showMsg('没有更多图片了~');
                }
                // 图片预览 添加http
                let imgList = that.data.imgList;
                let httpImgList = [];
                imgList.forEach((value) => {
                    value = that.data.ossHttp + value;
                    httpImgList.push(value);
                });
                that.setData({
                    httpImgList: httpImgList
                })
            },
            fail: (data) => { }
        })
    },
    // 获取视频列表
    getVideoList(id, page, size) {
        let that = this;
        if (!page) {
            page = 1;
        } else {
            ++page;
        }
        sun.actRequest({
            url: http.getVideoList,
            showLoading: true,
            data: { id: id, page: page, size: size },
            success: (data) => {
                // 没有视频
                if (!data.length && page == 1) {
                    sun.showMsg('商家暂未上传视频~');
                    return;
                }
                // 第一页
                if (data.length && page == 1) {
                    that.setData({
                        videoList: data,
                        videoPage: page
                    })
                    return;
                }
                // 第n页加载数据
                if (data.length && page !== 1) {
                    let arr = this.data.videoList;
                    arr = arr.concat(data);
                    that.setData({
                        videoList: arr,
                        videoPage: page
                    })
                } else {
                    sun.showMsg('没有更多视频了~');
                }
            },
            fail: (data) => { }
        })
    },
    // 菜单选择
    chooseMenu(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            select: index
        })
        //加载视频
        if (index == 1 && !this.data.videoList.length) {
            let id = this.data.shopId;
            let page = this.data.videoPage;
            let size = this.data.size;
            this.getVideoList(id, page, size);
        }
    },
    // 轮播图图片预览
    previewImage(e) {
        console.log(e);
        let current = e.currentTarget.dataset.path;
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: this.data.httpImgList // 需要预览的图片http链接列表
        })
    }
})