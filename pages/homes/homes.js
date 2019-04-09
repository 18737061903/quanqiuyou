// pages/homes/homes.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var startY = 0;
var moveY = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearch:true,//判断是否显示搜索框
    iStop:172,//nav上移
    mallTop:175,//商城模块的padding-top
    currentSwiper:0,//轮播点
    noAll:false,//没有更多了
    scrollNav:'',//首页导航
    activeNav:0,
    // 模块id
    modelId: 1,
    // 秒杀商品列表
    kill: [],
    modelList:[],//爆品
    // 当前选中时间段
    active: '',
    // 当前选中时间段 状态
    clickStatus: '',
    // 当前点击商品
    clickGoods: '',
    http: 'https://globmate.oss-cn-hangzhou.aliyuncs.com/',
    selected1: false,//爆品
    selected2: true,//本地
    animationData:null,//更多
    isleft:false,//左侧栏显示
    kindex: null,//索引
    page:1,//分页
    msg:[],
    // banner
    imgUrls: ['', ''],
    indicatorDots: true,
    autoplay: true,
    circular:"true",
    interval: 3000,
    duration: 1000,
    // 活动时间段数据
    seckill: [
      // 0 已结束 1 抢购中 2 即将开始
      {
        startTime: null,
        endTime: null,
        startName: '08:00',
        endName: '10:00',
        status: ''
      },
      {
        startTime: null,
        endTime: null,
        startName: '10:00',
        endName: '12:00',
        status: ''
      },
      {
        startTime: null,
        endTime: null,
        startName: '12:00',
        endName: '14:00',
        status: ''
      },
      {
        startTime: null,
        endTime: null,
        startName: '14:00',
        endName: '16:00',
        status: ''
      },
      {
        startTime: null,
        endTime: null,
        startName: '16:00',
        endName: '18:00',
        status: ''
      },
      {
        startTime: null,
        endTime: null,
        startName: '18:00',
        endName: '20:00',
        status: ''
      },
      {
        startTime: null,
        endTime: null,
        startName: '20:00',
        endName: '22:00',
        status: ''
      },
    ],
    goodsType: sun.statics.goodsType.goods,
    skillGoodsType: sun.statics.goodsType.skillGoods,
    // 模块跳转类型
    modelType: {
        link: sun.statics.modelType.link,
        goods: sun.statics.modelType.goods,
        cat: sun.statics.modelType.cat,
        model: sun.statics.modelType.model
    },
    // 
    ossHttp: '',
    // 本地相关----------------------------------------
    // 定位是否授权
    position: false,
    actPage: 0, 
    // 初始地图定位
    lat: 31.1938900000,
    lng: 121.3175600000,
    address: "虹桥火车站广场",
    // 附近店铺活动列表
    actList: [],
    // 筛选
    showScreen: false,
    // 活动类型
    actType: [ 
        {
            type: 0,
            title: '全部',
            status: false
        },
        {
            type: 1,
            title: '满减',
            status: false
        },
        {
            type: 2,
            title: '优惠券',
            status: false
        },
    ],
    // 店铺类型
    shopType: [],
    // 筛选选中类型
    typeList: [],
    catIdList: []
},

  /**
   * 生命周期函数--监听页面加载
   */
onLoad: function (options) {
    // oss http
    this.setData({
        ossHttp: app.globalData.ossHttp
    })
    //购物车跳过来时
    let selected1 = options.selected1;
    if (selected1==1){
        this.setData({
            selected1:true,
            selected2:false
        })
        sun.showLoading('加载中~');
        this.getAppHomeModels()
    }
    //   二维码相关 
    let url = options.q;
    var res = wx.getStorageSync("res");
    console.log(res);
    if (!res) {
        if (url) app.globalData.qrCode = url;
        wx.redirectTo({
            url: '../wxlogin/wxlogin'
        })
        return;
    }
    if (getApp().globalData.qrCode) {
        url = getApp().globalData.qrCode;
    }
    if (url) {
        url = decodeURIComponent(url);
        var c = GetRequest(url).c;
        sun.request({
            url: "/api/qrcode/parseQRCode",
            showLoading: true,
            data: {
                code: c
            },
            success:function(res){
                if (res) {
                    if (parseInt(res.type)  == 2) {
                        wx.navigateTo({
                            url: '../shopDetails/shopDetails?id=' + res.localeId
                        })
                        app.globalData.qrCode = null;
                    }
                }
            },
            fail:(code,msg)=>{}
        })
    }
    function GetRequest(url) {
        // var url = location.search; //获取url中"?"符后的字串
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substring(url.indexOf("?") + 1);
            // var str = str.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    // --------------------------------本地生活--------------------------
    // 获取用户定位
    this.getLocation();
    // 获取店铺一级分类
    this.getLocaleFirstCat();
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
        //当前是本地生活时，刷新本地列表数据
        if (this.data.selected2 && !this.data.showScreen) {
            // 显示顶部刷新图标
            wx.showNavigationBarLoading();
            this.setData({
                actPage: 0,
                actList: []
            })
            // 获取附近店铺活动
            this.getLocation();
            // 获取店铺一级分类
            // this.getLocaleFirstCat();
        } else {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        }
    },

  /**
   * 页面上拉触底事件的处理函数
   */
    onReachBottom: function () {
        //加载更多本地列表数据
        if (this.data.selected2){
            let page = this.data.actPage; 
            let typeList = this.data.typeList; 
            let catIdList = this.data.catIdList; 
            this.getNearAvtivityPage(page, typeList, catIdList);
        }
    },

  /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {

    },
    // 爆品模块 获取首页模块列表
    selected1: function (e) {
        let that=this;
        this.setData({
            selected2: false,
            selected1: true
        })
        if (this.data.selected1) {
            if (that.data.modelList.length<=0){
                sun.showLoading('加载中~');
                this.getAppHomeModels()
            }
        }
    },
    // 首页模块列表
    getAppHomeModels() {
        let that=this;
        sun.request({
            url: http.getAppHomeModels,
            data: {},
            success: (data) => {
                sun.hideLoading();
                if (data.length != 0) {
                    that.setData({
                        modelList: data,
                        noAll: true
                    })
                }
                that.data.modelList.forEach((item, index) => {
                    if (item.type == 1) {
                        that.setData({
                            scrollNav: that.data.modelList[index]
                        })
                    }
                })
                // 秒杀活动开始时间戳
                that.getSeckill();
            }
        })
    },
    selected2: function (e) {
        this.setData({
            selected1: false,
            selected2: true
        })
    },
    //更多动画
    showMyModal(){
        this.setData({
            isleft: !this.data.isleft,
        })
        this.fadeIn();
    },
    showMyHieden(){
        this.fadeOut();
        setTimeout(() => {
            this.setData({
                isleft: !this.data.isleft,
                mallHeight:'',
            })
        }, 400)
    },
    fadeIn: function () {
        // 开始写动画
        var animation = wx.createAnimation({
            duration: 600,
            timingFunction: 'ease',
        })
        animation.translateX('0').step();
        this.setData({
            animationData: animation.export()
        })
    },
    fadeOut: function () {
        // 开始写动画
        var animation = wx.createAnimation({
            duration: 600,
            timingFunction: 'ease',
        })
        animation.translateX('-100%').step();
        this.setData({
            animationData: animation.export()
        })
    },
    fadeInfilter: function () {
        // 开始写动画
        var animation = wx.createAnimation({
            duration: 600,
            timingFunction: 'ease',
        })
        animation.translateY('0%').step();
        this.setData({
            animationfilter: animation.export()
        })
    },
    fadeOutfilter: function () {
        // 开始写动画
        var animation = wx.createAnimation({
            duration: 600,
            timingFunction: 'ease',
        })
        animation.translateY('-100%').step();
        this.setData({
            animationfilter: animation.export()
        })
    },
   //搜索
    search(){
        wx.navigateTo({
        url: '../search/search',
        })
    },
    //扫码
    scanCode(){
        wx.scanCode({
            success: (res) => {
                console.log(res)
            }
        })
    },
    //活动时间
    killItem(e){
        let that=this
        let index = e.target.dataset.index;
        let item = e.target.dataset.item;
        this.setData({
            active:index,
            clickStatus: item.status,// 当前选中时间段 状态
        })
        // 获取相应时间段下的秒杀商品列表
        sun.request({
            url: http.getGoodsList,
            data: { 
                startTime: that.data.seckill[index].startTime, 
                page: this.data.page 
            },
            loading: true,
            success: (data) => {
                this.data.kill = [];
                that.setData({
                    kill:data
                })
                if (this.data.kill.length > 6) {
                    that.setData({
                        kill: this.data.kill.slice(0, 6)
                    })
                } 
            }
        });
    },
  // 秒杀活动开始时间戳
  getSeckill() {
    let that = this;
    let now = new Date();
    let year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate();
    let ymd = null;
    ymd = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    let seckill = that.data.seckill;
      seckill.forEach((item, index) => {
      // IOS 时间字符串 不兼容Data.parse()方法
      var Stime = (ymd + ' ' + item.startName); var ostime = (ymd + ' ' + item.endName);
      var newtime = Stime.replace(/-/g, "/"); var oldtime = ostime.replace(/-/g, "/");
      item.startTime = Date.parse(newtime) / 1000;
      item.endTime = Date.parse(oldtime) / 1000;
      // 活动时间状态判断 0 已结束 1 抢购中 2 即将开始
      let killStart = Date.parse(newtime);
      let killEnd = Date.parse(oldtime);
      if (now.getTime() >= killEnd) {
          seckill.forEach((jkitem, jkindex) => {
           if(index==jkindex){
             seckill[jkindex].status=0
           }
        })
        that.setData({
          seckill: seckill
        })
      } else if (now.getTime() > killStart && now < killEnd) {
        seckill.forEach((jkitem, jkindex) => {
          if (index == jkindex) {
            seckill[jkindex].status = 1
          }
        })
        that.setData({
          seckill: seckill
        })
        // 初始化展示当前正在抢购中的时间段
        that.setData({
          active:index,
          clickStatus: item.status
        })
        sun.request({
          url: http.getGoodsList,
          data: { 
            startTime: item.startTime, 
            page:that.data.page 
            },
          loading: true,
          success: (data) => {
            that.setData({
              kill:data
            })
              if (that.data.kill.length > 4) {//如果数据大于4只显示6条
                that.setData({
                  kill: that.data.kill.slice(0, 4)
                })
              }
          
          }
        });
      } else if (now.getTime() < killStart ) {
        seckill.forEach((jkitem, jkindex) => {
          if (index == jkindex) {
            seckill[jkindex].status = 2
          }
        })
        that.setData({
          seckill: seckill
        })
      }
    })
  },
  tapnavScroll(){
      let that = this;
      sun.request({
        url: http.getModelsByPid,
        data: {
          pid: that.data.modelid
        },
        loading: true,
        success: (data) => {
          that.setData({
            modelList: data
          })
        }
      });
  },
  //点击横向导航切换
  navScroll(e){
    let index = e.target.dataset.index;
    let modelid = e.target.dataset.modelid;
    let that = this;
    that.setData({
      activeNav:index,
      modelid: modelid
    })
    sun.request({
      url: http.getModelsByPid,
      data: {
        pid: modelid
      },
      loading: true,
      success: (data) => {
       that.setData({
         modelList:data
       })
      }
    });
  },
 //秒杀商品跳转
  goodsDetail(e){
    let index = e.target.dataset.index;
    let seckillnumber = parseInt(e.target.dataset.seckillnumber);
    let seckillsale = parseInt(e.target.dataset.seckillsale);
    let data = e.target.dataset.item;
    if (seckillsale / (seckillnumber +seckillsale) == 1 ){
      wx.showToast({
        icon: 'none',
        title: '已售完',
      })
    }else if (this.data.clickStatus == 0){
      wx.showToast({
        icon: 'none',
        title: '已结束',
      })
    } else if (this.data.clickStatus == 2) {
      wx.showToast({
        icon: 'none',
        title: '即将开始',
      })
    } else if (this.data.clickStatus == 1) {
        //立即抢购
        // wx.navigateTo({
        //     url: '../goodsDetail/goodsDetail?goodsId=' + data.goodsId ,
        // })
    }
    
  },
  //轮播图原点
  swiperChange(e){
    this.setData({
      currentSwiper: e.detail.current
    })
  },
   // 商品，活动页，分类跳转 
  goPath(e) {
    let index=e.target.dataset.index;
    let data = e.target.dataset.data[index];
    let type = parseInt(data.type);
    switch (type) {
    // 模块跳转类型 link1 -链接 goods2 -商品 cat3 -分类 model4 -模块
      case this.data.modelType.link:
        break;
      case this.data.modelType.goods:
        //商品跳转
        wx.navigateTo({
          url: '../goodsDetail/goodsDetail?goodsId=' + data.goodsId + "&goodsType=" + this.data.goodsType,
        })
        break;
      case this.data.modelType.cat:
        //分类商品页跳转
        break;
      case this.data.modelType.model:
        break;
    }
  },
    // 推荐商品跳转
    goLikeGoods(e) {
        let data = e.target.dataset.item;
        wx.navigateTo({
            url: '../goodsDetail/goodsDetail?goodsId=' + data.id,
        })
    },
    // 横向商品列表商品跳转
    goGoods(item) {
        wx.navigateTo({
            url: '',
        })
    },
    // 查看更多到-->秒杀页
    more() {
        wx.navigateTo({
            url: '',
        })
    },
    //设置跳转
    setTing(){
        wx.navigateTo({
            url: '../setMsg/setMsg',
        })
    },
    //   到购物车
    myCart() {
        wx.navigateTo({
            url: '../cart/cart'
        })
    },
    //   到我的订单
    myOrder () {
        wx.navigateTo({
            url: '../orderList/orderList'
        })
    },
    //监听屏幕滚动 判断上下滚动
    onPageScroll: function (ev) {
        if(this.data.selected1){
            var _this = this;
            if (ev.scrollTop > 0 ) {
                //向下滚动
                _this.setData({
                    iStop: 88,
                    mallTop: 85,
                    isSearch: false,
                })
            } else if (ev.scrollTop <=50) {
                //向上滚动
                _this.setData({
                    iStop: 173,
                    mallTop: 175,
                    isSearch: true,
                })
            }
        }
    },
    // --------------------------------本地相关----------------------------
    // 定位授权
    getPosition () {
        var that = this
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userLocation']) {
                    //打开提示框，提示前往设置页面
                    that.setData({
                        position: true
                    })
                } else {
                    // 进入地图
                    wx.openLocation({
                        latitude: that.data.lat,
                        longitude: that.data.lng,
                        scale: 16
                    })
                }
            }
        })
    },
    //打开定位授权设置
    openSetting(e) {
        let that = this;
        wx.openSetting({
            success(res) {
                res.authSetting = {
                    "scope.userLocation": true
                }
                if (res.authSetting) {
                    that.setData({
                        position: false
                    })
                    // 重新获取附近店铺活动
                    that.getLocation();
                }
            }
        })
    },
    //取消定位授权
    positionCancel() {
        this.setData({
            position: false
        })
    },
    // 获取当前定位地址
    getLocation () {
        var that = this
        var qqmapsdk = new QQMapWX({ key: 'A5JBZ-JROLX-QZT46-ZHDVT-XIOBS-KXF3V' });
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                sun.showMsg('定位成功~');
                that.setData({
                    lat: res.latitude,
                    lng: res.longitude
                })
                // 获取定位附近店铺
                let page = that.data.actPage; 
                let typeList = that.data.typeList;
                let catIdList = that.data.catIdList; 
                that.getNearAvtivityPage(page, typeList, catIdList);
                //逆地址解析 
                qqmapsdk.reverseGeocoder({
                    location: { latitude: res.latitude, longitude: res.longitude },
                    success: function (addressRes) {
                        let address = addressRes.result.address;
                        that.setData({
                            address: address
                        })
                    }
                })
            }, fail: function (msg) {
                sun.showMsg('获取定位失败! 请打开手机定位权限~');
            }
        })
    },
    // 获取本地生活 附近店铺活动
    getNearAvtivityPage(page, typeList, catIdList) {
        let that = this;
        if (!page) {
            page = 1;
        } else {
            ++page;
        }
        sun.actRequest({
            url: http.getNearAvtivityPage,
            showLoading: true,
            data: { 
                lng: this.data.lng, 
                lat: this.data.lat, 
                page: page,
                size: 5,
                typeList: typeList,
                catIdList: catIdList
            },
            success: (data) => {
                // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
                // 附近没有商家
                if (!data.length && page == 1) {
                    sun.showMsg('附近没有商家~');
                    return;
                }
                // 第一页
                if (data.length && page == 1) {
                    that.setData({
                        actList: data,
                        actPage: page
                    })
                    return;
                }
                // 第n页加载数据
                if (data.length && page !==1) {
                    let arr = this.data.actList;
                    arr = arr.concat(data);
                    that.setData({
                        actList: arr,
                        actPage: page
                    })
                } else {
                    sun.showMsg('没有更多了~');
                }
            },
            fail: (data) => {
                // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            }
        })
    },
    //   到活动详情页
    goAcDetails(e) {
        let index = e.currentTarget.dataset.index;
        let actId = this.data.actList[index].id;
        wx.navigateTo({
            url: '../activityDetails/activityDetails?id=' + actId
        })
    },
    // o2o筛选 typeList catIdList getNearAvtivityPage
    // 获取店铺一级分类
    getLocaleFirstCat () {
        let that = this;
        sun.actRequest({
            url: http.getLocaleFirstCat,
            showLoading: true,
            data: {},
            success: (data) => {
                let arr = data;
                if (arr.length) {
                    // 添加全部选项
                    arr.unshift({id: '', level: '', list: [], name: '全部', pid: ''})
                    // 添加选中状态
                    arr.forEach ((item) => {
                        item.status = false;
                    })
                    that.setData({
                        shopType: arr
                    })
                }
            },
            fail: (data) => { }
        })
    },
    // 打开筛选
    showScreening () {
        this.setData({
            showScreen: true
        })
    },
    // 关闭筛选
    hideScreening () {
        this.setData({
            showScreen: false
        })
    },
    // 选择活动类型
    checkActType (e) {
        let index = e.currentTarget.dataset.index;
        let arr = this.data.actType;
        // 全选
        if (arr[index].type == 0) {
            // 全选
            if (arr[index].status) {
                arr.forEach((item, index) => {
                    item.status = false;
                })
            } else {
                // 全不选
                arr.forEach((item, index) => {
                    item.status = true;
                })
            }
            this.setData({
                actType: arr
            })
            return;
        } else {
            // 单个选择状态更改
            arr[index].status = !arr[index].status;
            let n = 0;
            // 剔除全部选项
            arr.shift(arr[0]);
            arr.forEach((item, index) => {
                if (item.status) ++n;
            })
            // 单个选择影响全选
            if (n == arr.length) {
                arr.unshift({type: 0, title: '全部', status: true})
            } else {
                arr.unshift({ type: 0, title: '全部', status: false})
            }
            this.setData({
                actType: arr
            })
        }
    },
    // 选择店铺类型
    checkShopType (e) {
        let index = e.currentTarget.dataset.index;
        let arr = this.data.shopType;
        // 全选
        if (!arr[index].id) {
            // 全选
            if (arr[index].status) {
                arr.forEach((item, index) => {
                    item.status = false;
                })
            } else {
                // 全不选
                arr.forEach((item, index) => {
                    item.status = true;
                })
            }
            this.setData({
                shopType: arr
            })
            return;
        } else {
            // 单个选择状态更改
            arr[index].status = !arr[index].status;
            let n = 0;
            // 剔除全部选项 
            arr.shift(arr[0]);
            arr.forEach((item, index) => {
                if (item.status) ++n;
            })
            // 单个选择影响全选
            if (n == arr.length) {
                arr.unshift({id: '', level: '', list: [], name: '全部', pid: '', status: true})
            } else {
                arr.unshift({ id: '', level: '', list: [], name: '全部', pid: '', status: false})
            }
            this.setData({
                shopType: arr
            })
        }
    },
    // 筛选刷新
    screenRefresh () {
        // 活动类型
        let actType = this.data.actType;
        let typeList = [];
        actType.forEach((item, index) => {
            if (item.type == 0 && item.status) {
                typeList = [];
                return;
            }
            if (item.type !== 0 && item.status) {
                typeList.push(item.type);
            }
        })
        this.setData({
            typeList: typeList
        })
        // 店铺类型
        let shopType = this.data.shopType;
        let catIdList = [];
        shopType.forEach((item, index) => {
            if (item.status) {
                catIdList.push(item.id);
            }
        })
        // 店铺类型 剔除不需要项
        catIdList.forEach((item, index) => {
            if (!item) {
                catIdList.splice(index, 1)
            }
        })
        this.setData({
            catIdList: catIdList
        })
        // post data
        let page = 0;
        this.setData({
            actPage: 0,
            showScreen: false
        })
        let postTypeList = this.data.typeList;
        let postCatIdList = this.data.catIdList;
        this.getNearAvtivityPage(page, postTypeList, postCatIdList);
    },
    // 清除所有筛选 
    clearScreen () {
        // 清除活动类型
        let actType = this.data.actType;
        actType.forEach((item, index) => {
            item.status = false;
        })
        this.setData({
            actType: actType
        })
        // 清除店铺类型
        let shopType = this.data.shopType;
        shopType.forEach((item, index) => {
            item.status = false;
        })
        this.setData({
            shopType: shopType
        })
    },
    //   到o2o本地生活搜索页
    goSearch () {
        wx.navigateTo({
            url: '../o2oSearch/o2oSearch?lng=' + this.data.lng + '&lat=' + this.data.lat
        })
    },
})