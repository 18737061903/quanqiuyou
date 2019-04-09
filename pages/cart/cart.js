// pages/cart/cart.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ossHttp: '',
        // 店铺，商品列表
        cartList: [],
        // 宝贝总数量
        totalNum: '',
        // 初始总价(所有)
        initTotalPrice: 0,
        // 会变动的总价
        totalPrice: '',
        // 编辑状态
        editStatus: false,
        // 购物车全选状态
        allSelectStatus: false,
        // 默认地址
        address: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        sun.showLoading('加载中~');
        // oss http
        this.setData({
            ossHttp: app.globalData.ossHttp
        })
        // 获取购物车列表
        this.getUserCart();
        // 获取默认地址(备用)
        // this.getAddress();
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
        this.setData({
            cartList: [],
            totalNum: '',
            initTotalPrice: 0,
            totalPrice: ''
        })
        // 获取购物车列表
        this.getUserCart();
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
    // 获取购物车列表
    getUserCart() {
        sun.actRequest({
            url: http.getUserCart,
            data: {page: 1, size: 10},
            // data: {},
            success: (data) => {
                // 添加购物车商铺选中状态
                this.addShopStatus(data.list);
                // 更新已勾选结算总价
                this.updateTotalPrice();
                // 购物车宝贝数量,初始总价格(所有商品总价)
                this.setData({
                    totalNum: data.totalNum,
                    // initTotalPrice: data.totalPrice
                })
                sun.hideLoading();
            }
        })
    },
    // 获取用户默认地址
    getAddress() {
        sun.actRequest({
            url: http.getDefaultAddress,
            data: {},
            success: (data) => {
                if (data.id) {
                    this.setData({
                        address: data
                    })
                } else {
                    let address = { id: '', phone: '', address: '', detail: '', name: '' }
                    this.setData({
                        address: address
                    })
                }
            }
        })
    },
    // 初始化添加购物车商铺选中状态
    addShopStatus(data) {
        let arr = data;
        arr.forEach((item, index) => {
            let n = 0;
            item.list.forEach((ktem) => {
                if (ktem.isSelect == 1) {
                    ++n;
                }
            });
            // 初始化添加店铺是否选中状态
            if (n == item.list.length) {
                arr[index].isSelect = 1;
            } else {
                arr[index].isSelect = 0;
            }
        });
        // 更新数组
        this.setData({
            cartList: arr
        });
        // 初始化购物车全选状态()
        let m = 0;
        arr.forEach((jtem) => {
            if (jtem.isSelect == 1) {
                ++m;
            }
        });
        if (m == arr.length) {
            this.setData({
                allSelectStatus: true
            })
        }
        console.log(this.data.cartList)
    },
    // 购物车编辑状态切换
    edit() {
        this.setData({
            editStatus: !this.data.editStatus
        })
    },
    // 购物车全选与不选
    selectAll() {
        let arr = this.data.cartList;
        // 已全选状态（变为不选）
        if (this.data.allSelectStatus) {
            arr.forEach((item, index) => {
                arr[index].isSelect = 0;
                item.list.forEach((ktem, kndex) => {
                    item.list[kndex].isSelect = 0;
                });
            });
            this.setData({
                cartList: arr,
                allSelectStatus: false,
                // 总价置0
                totalPrice: 0
            })
        } else {
            // 不选状态（变为全选）
            arr.forEach((item, index) => {
                arr[index].isSelect = 1;
                item.list.forEach((ktem, kndex) => {
                    item.list[kndex].isSelect = 1;
                });
            });
            this.setData({
                cartList: arr,
                allSelectStatus: true,
                // 全部宝贝总价
                totalPrice: this.data.initTotalPrice
            })
            console.log(this.data.totalPrice)
        }
    },
    // 单个店铺的选中
    shopSelect(e) {
        let shopIndex = e.currentTarget.dataset.index;
        let arr = this.data.cartList;
        // 单个店铺已选中状态（变为不选）
        if (arr[shopIndex].isSelect) {
            arr[shopIndex].isSelect = 0;
            arr[shopIndex].list.forEach((item, index) => {
                item.isSelect = 0;
            });
            this.setData({
                cartList: arr
            })
            // 每次勾选商品及店铺 更新结算总价
            this.updateTotalPrice();
            // 每次勾选商品及店铺 更新全选状态
            this.updateAllSelectStatus();
        } else {
            // 单个店铺未选中状态（变为全选）
            arr[shopIndex].isSelect = 1;
            arr[shopIndex].list.forEach((item, index) => {
                item.isSelect = 1;
            });
            this.setData({
                cartList: arr
            })
            // 每次勾选商品及店铺 更新结算总价
            this.updateTotalPrice();
            // 每次勾选商品及店铺 更新全选状态
            this.updateAllSelectStatus();
        }
    },
    // 单个商品的选中
    goodsSelect(e) {
        let arr = this.data.cartList;
        let pIndex = e.currentTarget.dataset.index;
        let childindex = e.currentTarget.dataset.childindex;
        // 当前点击商品已选中
        if (arr[pIndex].list[childindex].isSelect == 1) {
            // 则该商品改为不选
            arr[pIndex].list[childindex].isSelect = 0;
            // 每次勾选商品 更新店铺选中状态 
            this.updateShopSatus(pIndex);
            // 每次勾选商品及店铺 更新结算总价
            this.updateTotalPrice();
            // 每次勾选商品及店铺 更新全选状态
            this.updateAllSelectStatus();
        } else {
            // 当前点击商品未选中
            // --改为选中
            arr[pIndex].list[childindex].isSelect = 1;
            // 更新数组
            this.setData({
                cartList: arr
            })
            // 每次勾选商品 更新店铺选中状态 
            this.updateShopSatus(pIndex);
            // 每次勾选商品及店铺 更新结算总价
            this.updateTotalPrice();
            // 每次勾选商品及店铺 更新全选状态
            this.updateAllSelectStatus();
        }
    },
    // 每次勾选商品及店铺 更新结算总价
    updateTotalPrice() {
        let totalPrice = 0;
        this.data.cartList.forEach((item, index) => {
            item.list.forEach((ktem, kndex) => {
                if (ktem.isSelect == 1) {
                    totalPrice += parseFloat(ktem.price) * ktem.num;
                }
            });
        });
        this.setData({
            totalPrice: totalPrice
        })
    },
    // 每次勾选商品及店铺 更新全选状态
    updateAllSelectStatus() {
        // 商铺选中个数
        let flagNum = 0;
        this.data.cartList.forEach((item, index) => {
            // 如果商铺有一个未选中，更新全选按钮状态
            if (item.isSelect == 0) {
                this.setData({
                    allSelectStatus: false
                })
            } else {
                ++flagNum;
            }
            // 如果商铺全部选中，更新全选按钮状态
            if (flagNum == this.data.cartList.length) {
                this.setData({
                    allSelectStatus: true
                })
            }
        });
    },
    // 每次勾选商品 更新对应店铺选中状态 
    updateShopSatus(pIndex) {
        // 商铺对应商品选中个数
        let flagNum = 0;
        let arr = this.data.cartList;
        arr[pIndex].list.forEach((item, index) => {
            // 如果该商铺有商品未选中
            if (item.isSelect == 0) {
                // 如果该商铺有商品未选中 则此店铺不选中
                arr[pIndex].isSelect = 0;
                this.setData({
                    cartList: arr
                })
            } else {
                // 否则计算选中商品个数
                ++flagNum;
            }
            // 如果该店铺所有商品全部选中，则更新该店铺按钮状态
            if (flagNum == arr[pIndex].list.length) {
                arr[pIndex].isSelect = 1;
                this.setData({
                    cartList: arr
                })
            }
        });
    },
    // 单个商品数量减少
    delNum(e) {
        let that = this;
        let arr = this.data.cartList;
        // index
        let pIndex = e.currentTarget.dataset.index;
        let childindex = e.currentTarget.dataset.childindex;
        let itemNum = arr[pIndex].list[childindex].num;
        if (itemNum < 1 || itemNum == 1) {
            sun.showMsg('该宝贝不能再减了哦~');
            return;
        } else {
            // post number
            let postNum = arr[pIndex].list[childindex].num;
            sun.actRequest({
                url: http.changeCartGoodsNum,
                data: {
                    cartId: arr[pIndex].list[childindex].id,
                    num: --postNum,
                    // status: arr[pIndex].goodsList[childindex].status
                },
                success: (data) => {
                    // 本地购买数量
                    --arr[pIndex].list[childindex].num;
                    // 更新数组
                    that.setData({
                        cartList: arr,
                        totalNum: --that.data.totalNum
                    })
                    // 每次更改数量 更新结算总价
                    that.updateTotalPrice();
                }
            })
        }
    },
    // 单个商品数量增加
    addNum(e) {
        let that = this;
        let arr = this.data.cartList;
        // index
        let pIndex = e.currentTarget.dataset.index;
        let childindex = e.currentTarget.dataset.childindex;
        // post number
        let postNum = arr[pIndex].list[childindex].num;
        sun.actRequest({
            url: http.changeCartGoodsNum,
            data: {
                cartId: arr[pIndex].list[childindex].id,
                num: ++postNum,
                // status: arr[pIndex].goodsList[childindex].status
            },
            success: (data) => {
                // 本地购买数量
                ++arr[pIndex].list[childindex].num;
                // 更新数组
                that.setData({
                    cartList: arr,
                    totalNum: ++that.data.totalNum
                })
                // 每次更改数量 更新结算总价
                that.updateTotalPrice();
            }
        })
    },
    // 删除购物车商品
    deleteGoods() {
        let that = this;
        // 清空购物车
        let allSelectStatus = this.data.allSelectStatus;
        if (allSelectStatus) {
            wx.showModal({
                title: '温馨提示',
                content: '确定要清空购物车吗~',
                success(res) {
                    if (res.confirm) {
                        // 删除
                        sun.showLoading('正在删除~');
                        sun.actRequest({
                            url: http.clearCart,
                            data: {},
                            success: (data) => {
                                sun.hideLoading();
                                sun.showMsg('已删除~');
                                // 删除成功后更新本地数据 ()
                                // that.updateCartList(itemList);
                                // 获取购物车列表
                                that.getUserCart();
                            }
                        })
                    } else if (res.cancel) {
                        // nothing
                    }
                }
            })
            return;
        }
        // 单项删除
        // itemList 获取已勾选购物车项id
        let itemList = [];
        itemList = this.getSelectedItemId();
        if (!itemList.length) {
            sun.showMsg('请勾选您要删除的宝贝~');
            return;
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '确定要移除宝贝吗~',
                success(res) {
                    if (res.confirm) {
                        // 删除
                        sun.showLoading('正在删除~');
                        sun.actRequest({
                            url: http.deleteCart,
                            data: { cartIdList: itemList },
                            success: (data) => {
                                sun.hideLoading();
                                sun.showMsg('已删除~');
                                // 删除成功后更新本地数据 ()
                                // that.updateCartList(itemList);
                                // 获取购物车列表
                                that.getUserCart();
                            }
                        })
                    } else if (res.cancel) {
                        // nothing
                    }
                }
            })
        }
    },
    // 获取已选中购物车项id
    getSelectedItemId() {
        let arr = this.data.cartList;
        // itemList 购物车项所需参数
        let itemList = [];
        arr.forEach((item, index) => {
            item.list.forEach((ktem, kndex) => {
                if (ktem.isSelect == 1) {
                    itemList.push({
                        goodsId:ktem.goodsId,
                        num: ktem.num,
                        skuId:ktem.skuId,
                        shopId:ktem.shopId
                    })
                    app.globalData.cartIdList = itemList
                }
            });
        });
        return itemList;
    },
    // 删除成功后更新本地数据
    updateCartList(itemList) {
        // let arr = this.data.cartList;
        // let idList = itemList;
        // arr.forEach((item, index) => {
        //     if (item.goodsList.length) {
        //         item.goodsList.forEach((ktem, kndex) => {
        //             // 筛选已选中id项
        //             if (idList.length) {
        //                 idList.forEach((jtem, jndex) => {
        //                     if (ktem.id == jtem) {
        //                         console.log(1)
        //                         item.goodsList[kndex] = kndex;
        //                         // 剔除本地数据选中的每一项
        //                         // item.goodsList.splice(kndex, 1);
        //                         // 剔除itemList每一项
        //                         // idList.splice(jndex, 1);
        //                         // length--
        //                         // item.goodsList.length--
        //                         // idList.length--
        //                     }
        //                 });
        //                 console.log(idList)
        //             }
        //         });
        //         console.log(item.goodsList)
        //     }
        // })
        // arr.forEach((item, index) => {
        //     item.goodsList.forEach((ktem, kndex) => {
        //         if (ktem == kndex) {
        //             item.goodsList.splice(kndex, 1);
        //             console.log(item.goodsList)
        //         }

        //     })
        // })
        // console.log(arr)
        // 如果一个店铺中所有商品被选中删除完 则该店铺被删除
        // arr.forEach((item, index) => {
        //     if (!item.goodsList.length) {
        //         arr.splice(index, 1);
        //     }
        // })
        // // 更新数组
        // this.setData({
        //     cartList: arr
        // })
        // console.log(arr)
        // console.log(this.data.cartList)
    },
    // 去结算 从购物车到提交订单
    createOrder() {
        let itemList = [];
        // itemList 获取已勾选购物车项id
        itemList = this.getSelectedItemId();
        // 默认地址
        let address = this.data.address;
        if (!itemList.length) {
            sun.showMsg('请勾选您要买的宝贝~');
            return;
        } else {
            // 到填写订单
            wx.navigateTo({
                url: '/pages/createOrder/createOrder'
            })
        }
    },
    // 购物车为空时 重定向为首页
    goIndex() {
        wx.reLaunch({
            url: '../homes/homes?selected1=' + 1
        })
    }
})