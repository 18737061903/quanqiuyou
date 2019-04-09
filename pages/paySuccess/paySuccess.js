// pages/paySuccess/paySuccess.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: null,
        payPrice: '',
        shopName: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            payPrice: options.payPrice,
            shopName: options.shopName
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 差评
    badReview () {
        wx.showToast({
            title: '系统已经收到您的反馈，谢谢',
            icon: 'none',
            duration: 2000,
            success() {
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000)
            }
        })
    },
    // 好评
    goodReview () {
        wx.showToast({
            title: '点赞成功，谢谢惠顾',
            icon: 'none',
            duration: 1000,
            success () {
                setTimeout (function () {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000)
            }
        })
    }
    // goBack () {
    //     wx.navigateBack({
    //         delta: 1
    //     })
    //     // wx.redirectTo({
    //     //     url: '/pages/paySuccess/paySuccess?payPrice=' + that.data.payPrice
    //     // })
    // }
})