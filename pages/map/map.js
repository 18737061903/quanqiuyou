// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        longitude: 121.61599731445315,
        latitude: 31.271459579467784,
        markers: [{
            id: 0,
            iconPath: "../../images/icon_cur_position.png",
            latitude: 23.099994,
            longitude: 113.324520,
            width: 50,
            height: 50
        }],
        roomname:[]//选择位置
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        // 在地图中选择位置
        wx.chooseLocation({
            success: function (res) {
                // success
                console.log(res)
                console.log(res, "location")
                console.log(res.name)
                console.log(res.latitude)
                console.log(res.longitude)
                that.setData({
                    roomname: res.name
                })
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
        var that = this;
        wx.getLocation({//获取自己的定位
        type: "wgs84",
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                //console.log(res.latitude);
                that.setData({
                latitude: res.latitude,
                longitude: res.longitude,
                    markers: [{
                        latitude: res.latitude,
                        longitude: res.longitude
                    }]
                })
                wx.openLocation({//使用微信内置地图查看位置距离
                    latitude,
                    longitude,
                    scale: 18
                })
            }
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

    }
})