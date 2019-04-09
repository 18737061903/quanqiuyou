// pages/orderList/orderList.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
Page({

    /**
     * 页面的初始数据
     */     
    data: {
        ossHttp: '',
        // 加载状态
        loadStatus: {
            refresh: 1,
            more: 2
        },
        // 订单状态
        orderStatus: {
            unpay: '',
            receive: '',
            complete: '',
            received: '',
            cancel: '',
            close: ''
        },
        // 当前选择条目
        select: 0,
        // 菜单项
        menu: [
            {
                title: '全部',
                list: [],
                page: 0,
                totalPage: 0,
                status: 'all'
            },
            {
                title: '待付款',
                list: [],
                page: 0,
                totalPage: 0,
                status: 'unPay'
            },
            {
                title: '待收货',
                list: [],
                page: 0,
                totalPage: 0,
                status: 'wait'
            },
            {
                title: '已完成',
                list: [],
                page: 0,
                totalPage: 0,
                status: 'finish'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // oss http
        this.setData({
            ossHttp: app.globalData.ossHttp
        })
        // 获取当前页面top值 做刷新用
        // let that = this;
        // wx.createSelectorQuery().select('#all').boundingClientRect(function (rect) {
        //     that.setData({
        //         pageTop: rect.top
        //     })
        // }).exec()
        // 订单状态
        let status = {};
        status.unpay = sun.statics.order_unPay;
        status.receive = sun.statics.order_receive;
        status.complete = sun.statics.order_complete;
        status.received = sun.statics.order_received;
        status.cancel = sun.statics.order_cancel;
        status.close = sun.statics.order_close;
        this.setData({
            orderStatus: status
        })
        // 获取用户订单列表
        this.getOrderList();
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
        // 显示顶部刷新图标
        wx.showNavigationBarLoading(); 
        this.getOrderList(this.data.loadStatus.refresh);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // 当前选项 总页数 大于 当前已取数据页数 再加载更多
        if (this.data.menu[this.data.select].totalPage > this.data.menu[this.data.select].page) {
            this.getOrderList(this.data.loadStatus.more);
        } else {
            sun.showMsg('没有更多了~')
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 获取订单列表
    getOrderList(loadStatus) {
        // 当前选中状态的订单列表
        let arr = this.data.menu;
        // 刷新
        if (loadStatus == this.data.loadStatus.refresh) {
            console.log(this.data.select)
            arr[this.data.select].page = 1;
        }
        // 加载下一页数据
        if (loadStatus == this.data.loadStatus.more) {
            arr[this.data.select].page++;
        }
        // 页数初始化 获取第一页
        if (arr[this.data.select].page == 0) {
            arr[this.data.select].page = 1;
        }
        // request
        sun.request({
            url: http.getOrderList,
            showLoading: true,
            data: { 
                page: arr[this.data.select].page, 
                orderStatus: arr[this.data.select].status 
            },
            success: (data) => {
                // 隐藏导航栏加载框  停止下拉动作
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                // 对应状态订单信息赋值
                arr[this.data.select].page = data.page;
                arr[this.data.select].totalPage = data.totalPage;
                // 是否是加载下一页数据
                if (loadStatus == this.data.loadStatus.more) {
                    // 多页拼接
                    arr[this.data.select].list = arr[this.data.select].list.concat(data.list);
                } else if (loadStatus == this.data.loadStatus.refresh) {
                    // 刷新 清空全部，再获取第一页
                    arr[this.data.select].list = [];
                    arr[this.data.select].list = data.list;
                } else {
                    // 第一页
                    arr[this.data.select].list = data.list;
                }
                // 更新数组
                this.setData({
                    menu: arr
                })
                console.log(this.data.menu);
            }
        })
    },
    // 菜单选择
    chooseMenu (e) {
        let index = e.currentTarget.dataset.index;
        // 如果当前选择菜单项等于 已激活项，不做操作
        if (index === this.data.select) {
            return;
        }
        this.setData({
            select: index
        })
        // 如果当前选中项 还未加载过第一页
        if (this.data.menu[this.data.select].page == 0) {
            this.getOrderList();
        }
    },
    // 删除订单
    deleteOrder (e) {
        // 已选择订单下标
        var childindex = e.currentTarget.dataset.childindex;
        // 所属菜单项
        var select = this.data.select;
        var that = this;
        let arr = that.data.menu;
        console.log(arr);
        wx.showModal({
            title: '温馨提示',
            content: '确定要删除订单吗~',
            success(res) {
                if (res.confirm) {
                    let orderId = that.data.menu[select].list[childindex].id;
                    // 删除 
                    sun.showLoading('正在删除~');
                    // sun.request({
                    //     url: http.deleteOrder,
                    //     data: { orderId: orderId },
                    //     success: (data) => {
                    //         sun.showMsg('已删除~');
                    //         // 删除成功后更新本地数据 ()
                    //         let arr = that.data.menu;
                    //         console.log(arr[that.select].list)
                    //         arr[that.select].list.splice(that.childindex, 1);
                    //         // 更新数组
                    //         this.setData({
                    //             menu: arr
                    //         })
                    //     }
                    // })
                } else if (res.cancel) {
                    // nothing
                }
            }
        })
    }
})