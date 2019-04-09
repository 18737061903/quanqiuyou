// pages/goodsDetail/goodsDetail.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
// 引入wxParse
var WxParse = require('../../wxParse/wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ossHttp: '',
        // 轮播配置
        indicatorDots: true,
        indicatorColor: 'rgba(153,153,153,1)',
        afterColor: 'rgba(232,83,82,1)',
        autoplay: true,
        circular: true,
        interval: 2000,
        duration: 1000,
        // 商品信息
        goodsDetail: {},
        // 富文本详情
        htmlDetail: '',
        // 商品标签
        goodsLabel: [],
        // 轮播图片
        imgList: [],
        // 商品规格
        goodSpecList: [],
        // 默认展示规格
        spec: {},
        specSelect: 0,
        // 属性信息显示flag
        showSku: false,
        // 购买数量
        buyNum: 1,
        // 购物车数量
        carNum: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        sun.showLoading('加载中~');
        // 商品id
        let goodsId = '';
        if (options.goodsId) {
           goodsId = options.goodsId;
        }
        // oss http
        this.setData({
            ossHttp: app.globalData.ossHttp
        })
        // 获取商品信息
        this.getGoodsInfo (1);
        // 获取商品标签
        this.getGoodsLabel(1);
        // 获取商品富文本详情
        this.getGoodsDetail(1);
        // 获取商品规格
        this.getGoodsSkuList(1);
        // 商品信息
        // let that = this;
        // sun.actRequest({
        //     url: http.getGoodsInfo,
        //     // data: { id: goodsId},
        //     data: { goodsId: 1},
        //     success: (data) => {
        //         sun.hideLoading();
                // 商品信息
                // that.setData({
                //     goodsDetail: data,
                //     htmlDetail: data.htmlDetail
                // })
                // 富文本
                // WxParse.wxParse('htmlDetail', 'html', that.data.htmlDetail, that, 0);
                // 图片预览 添加http
                // let imgList = [];
                // data.imgList.forEach((value) => {
                //     value.img = this.data.ossHttp + value.img;
                //     imgList.push(value.img);
                // });
                // that.setData({
                //     imgList: imgList
                // })
                // 默认显示规格
                // if (data.hasSpec) {
                //     that.setData({
                //         spec: data.goodSpecList[0]
                //     })
                // }
            // }
        // })
        // 获取购物车商品数量
        this.getUserCartNum();
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
        // 获取购物车商品数量
        this.getUserCartNum();
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
    // 商品图片
    getGoodsImgList (id) {
        let that = this;
        sun.actRequest({
            url: http.getGoodsImgList,
            // data: { goodsId: id},
            data: { goodsId: '1110050051062910978' },
            success: (data) => {
                sun.hideLoading();
                // 没有轮播图，则默认主图
                let arr = [];
                arr.push(that.data.goodsDetail.img);
                if (data.length) {
                    data.forEach((item) => {
                        arr.push(item);
                    })
                } 
                that.setData({
                    imgList: arr
                })
            }
        })
    },
    // 获取商品信息
    getGoodsInfo (id) {
        let that = this;
        sun.actRequest({
            url: http.getGoodsInfo,
            // data: { goodsId: id},
            data: { goodsId: '1110050051062910978' },
            success: (data) => {
                sun.hideLoading();
                that.setData({
                    goodsDetail: data
                })
                // 获取商品图片
                that.getGoodsImgList(1);
            }
        })
    },
    // 获取商品标签
    getGoodsLabel(id) {
        let that = this;
        sun.actRequest({
            url: http.getGoodsLabel,
            // data: { goodsId: id},
            data: { goodsId: '1110050051062910978' },
            success: (data) => {
                sun.hideLoading();
                that.setData({
                    goodsLabel: data
                })
            }
        })
    },
    // 获取商品富文本详情
    getGoodsDetail(id) {
        let that = this;
        sun.actRequest({
            url: http.getGoodsDetail,
            // data: { goodsId: id},
            data: { goodsId: '1110050051062910978' },
            success: (data) => {
                sun.hideLoading();
                that.setData({
                    htmlDetail: data.detail
                })
                // 富文本
                WxParse.wxParse('htmlDetail', 'html', that.data.htmlDetail, that, 0);
            }
        })
    },
    // 获取商品规格
    getGoodsSkuList(id) {
        let that = this;
        sun.actRequest({
            url: http.getGoodsSkuList,
            // data: { goodsId: id},
            data: { goodsId: '1110050051062910978' },
            success: (data) => {
                sun.hideLoading();
                that.setData({
                    goodSpecList: data,
                    spec: data[0]
                })
            }
        })
    },
    // 轮播图图片预览
    previewImage (e) {
        let current = e.currentTarget.dataset.link;
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: this.data.imgList // 需要预览的图片http链接列表
        })
    },
    // 收藏 -确定与取消
    selectChange () {
        let that = this;
        let collect = 1 - that.data.goodsDetail.collect;
        sun.request({
            url: http.collectGoods,
            data: { id: that.data.goodsDetail.id, collect: collect },
            success: (data) => {
                let goods = that.data.goodsDetail;
                goods.collect = collect;
                that.setData({
                    goodsDetail: goods
                })
                if (that.data.goodsDetail.collect) {
                    sun.showMsg('已收藏');
                } else {
                    sun.showMsg('已取消收藏');
                }
            }
        })
    },
    // 规格选择
    selectSpec (e) {
        let select = e.currentTarget.dataset.index
        if (select != this.data.specSelect) {
            // 当前选中sku
            let spec = this.data.goodSpecList[select];
            this.setData({
                specSelect: select,
                spec: spec
            })
            // console.log(this.data.spec)
        }
    },
    // 加入购物车 调出属性信息 选择
    addCar () {
        this.setData({
            showSku: true
        })
    },
    // 关闭属性选择
    closeSku () {
        this.setData({
            showSku: false
        })
    },
    // 购买数量增加
    addNum () {
        if (this.data.buyNum > this.data.spec.stock) {
            sun.showMsg('库存不足!');
            return;
        }
        this.setData({
            buyNum: ++ this.data.buyNum
        })
        if (this.data.buyNum > this.data.spec.stock) {
            sun.showMsg('库存不足!');
        }
    },
    // 购买数量减少
    delNum () {
        if (this.data.buyNum < 1 || this.data.buyNum == 1) {
            sun.showMsg('不能再减了~');
            return;
        }
        this.setData({
            buyNum: -- this.data.buyNum
        })
    },
    // 获取购物车商品数量
    getUserCartNum () {
        sun.actRequest({
            url: http.getUserCartNum,
            data: {},
            success: (data) => {
               this.setData({
                   carNum: data
               })
            }
        })
    },
    // 加入商品到购物车
    addGoods () {
        if (this.data.buyNum > this.data.spec.stock) {
            sun.showMsg('库存不足!');
            return;
        }
        sun.showLoading('正在加入购物车~');
        let that = this;
        sun.actRequest({
            url: http.createCartGoods,
            data: {
                goodsId: that.data.spec.goodsId,
                skuId: that.data.spec.id,
                num: that.data.buyNum,
                shopId: that.data.goodsDetail.shopId
            },
            success: (data) => {
                sun.hideLoading();
                sun.showMsg('已成功加入到购物车~');
                this.setData({
                    // carNum: data.totalNumber,
                    carNum: ++that.data.carNum,
                    // 初始化select data
                    showSku: false,
                    specSelect: 0,
                    buyNum: 1
                })
                // 获取商品规格
                this.getGoodsSkuList(1);
            }
        })
    },
    // 我的购物车
    myCar () {
        wx.navigateTo({
            url: '../cart/cart'
        })
    }
})