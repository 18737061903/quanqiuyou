module.exports = {
    // 添加线下订单
    addXXOrder:"/api/order/addXXOrder",
    //支付订单运算结果接口
    getPayResult:"/api/scale/getPayResult",
    // 获取用户账户
    getUserAccount: '/api/user/getUserAccount',
    // 登录  phone password
    login: '/api/user/login',
    // 获取登录验证码 phone
    getLoginCode: '/api/verify/sendLoginCode',
    // 获取注册验证码 phone
    getRegCode: '/api/verify/sendRegCode',
    // 获取修改密码验证码 phone
    getChangPasswordCode: '/api/verify/sendChangePasswordCode',
    // 修改密码
    changePassword: '/api/user/changePassword',
    // 验证码登录    phone, code
    loginByCode: '/api/user/loginByCode',
    // 注册  phone, password, code
    register: '/api/user/register',
    // 设置性别 sex:1,2
    setSex: '/api/user/setSex',
    // 设置生日 birth:2018-13-13
    setBirth: '/api/user/setBirth',
    // 设置昵称 nickName
    setNickName: '/api/user/setNickName',
    // 设置头像  path
    setHeadPic: '/api/user/setHeadPic',
    // 设置邀请人
    setInvite: '/api/user/setUserInvite',
    // 获取爱好
    getUserHobby: '/api/user/getUserHobby',
    // 设置爱好  hobby
    setHobby: '/api/user/setHobby',
    // 设置地址 address
    editAddress: '/api/address/editUserAddress',
    // 删除地址 id
    deleteAddress: '/api/address/deleteUserAddress',
    // 获取用户默认地址
    getDefaultAddress: '/api/address/getDefaultUserAddress',
    // 获取用户的店铺关系
    getUserShopList: '/api/manager/getUserShopList',
    // 获取店铺店员
    getShopStuff: '/api/manager/getShopStuff',
    // 获取商品分类
    getCatList: '/api/goods/getCatList',
    // 获取二维码签名 shopId, type
    getQRCode: '/api/qrcode/getQRCode',
    // 解码二维码 code
    parseQRCode: '/api/qrcode/parseQRCode',
    // 获取分类商品 catId page
    getCatGoodsList: '/api/goods/getCatGoodsList',
    // 搜索商品 search page
    getSearchGoodsList: '/api/goods/getSearchGoodsList',
    // 获取上传路径
    getUploadPath: '/api/image/getUploadPath',
    // ** 获取图片  GET  path
    getImage: '/api/image/getImage',
    // 收藏商品 id, collect
    collectGoods: '/api/goods/collectGoods',
    // 获取个人中心各个数量
    getNumInfo: '/api/user/getNumInfo',
    // 获取收藏商品
    getCollectGoods: '/api/goods/getCollectGoods',
    // 获取收藏商品
    getCollectShop: '/api/shop/getCollectShop',
    // 获取浏览历史
    getHistory: '/api/goods/getHistory',
    // 清除历史记录
    clearHistory: '/api/goods/clearHistory',
    // 获取店铺
    getShop: '/api/shop/getShop',
    // 收藏店铺
    collectShop: '/api/shop/collectShop',
    // 获取店铺商品
    getShopGoods: '/api/goods/getShopGoods',
    // 线下订单 totalPrice  shopId
    createScanOrder: '/api/order/addXXOrder',
    //线上订单
    createAddZXOrder:'/api/order/addZXOrder',
    // 线上订单
    createShopOrder: '/api/order/addWebZXOrder',
    // 支付订单 orderSn  payType: wx/ali
    // payOrder: '/api/order/payOrder',
    // 支付0元订单 orderSn
    payZeroOrder: '/api/order/creditPay',
    // 获取首页猜你喜欢商品
    getHobbyGoodsList: '/api/goods/getHobbyGoodsList',
    // 获取订单列表 page orderStatus
    getOrderList: '/api/order/getUserOrderList',
    // 取消订单  orderId reason
    cancelOrder: '/api/order/cancelOrder',
    // 删除订单
    deleteOrder: '/api/order/deleteUserOrder',
    // 订单详情
    getOrderDetail: '/api/order/getUserOrder',
    // 确认收货   orderId
    confirmReceive: '/api/order/confirmReceipt',
    // 物流信息
    getTransDetail: '/api/order/getOrderExpress',
    // 首页栏目位
    getAdlistById: '/api/ad/getAdlistById',
    // 设置推送
    bindPush: '/api/push/bindUserJg',
    // 首页获取全球头条滚动新闻
    getindexpost: '/api/portal/getindexpost',
    // 获取文章分类列表
    getappcategorylist: '/api/portal/getappcategorylist',
    // 获取文章列表
    getpostlist: '/api/portal/getpostlist',
    // 获取单个文章
    getpost: '/api/portal/getpost',
    // 获取用户发票信息
    getuserinvoice: '/api/user/getuserinvoice',
    // 设置用户增值税发票信息
    saveuserinvoice: '/api/user/saveuserinvoice',
    // 获取用户实名状态
    getUserRealStatus: '/api/user/getUserRealStatus',
    // 获取实名认证验证码
    sendVerifyUserCode: '/api/verify/sendVerifyUserCode',
    // 认证验证码
    verifyVerifyUserCode: '/api/user/verifyVerifyUserCode',
    // 提交认证信息
    verifyUser: '/api/user/verifyUser',
    // 申请店铺
    applyShop: '/api/shop/applyShop',
    // 查询店铺支付状态
    checkShopPayStatus: '/api/manager/checkShopPayStatus',
    //  商户认证支付 押金
    authenticationshop: '/api/shop/authenticationshop',
    // 商户认证状态
    getShopVerifyStatus: '/api/manager/getShopVerifyStatus',
    // 获取入驻费缴费信息
    getauthenticationshop: '/api/shop/getauthenticationshop',
    // getTagName
    getPositionName: 'api/ad/getPositionName',
    // 根据用户号或手机号,获取新运营商信息
    getpromotersbyusernumber: '/api/shop/getpromotersbyusernumber',
    // APP获取商品列表
    getGoodsList: '/api/Seckill/getGoodsList',
    // 获取秒杀活动商品详情
    getSeckillGoodsDetail: '/api/Seckill/getGoodsDetail',
    // 获取订单发票信息
    getOrderInvoice: '/api/order/getOrderInvoice',
    // 获取秒杀订单提交订单页面
    getMSShopCartOrder: '/api/order/getMSShopCartOrder',
    // 添加秒杀订单
    addMSOrder: '/api/order/addMSOrder',
    // 获取首页模块内容
    getAppHomeModels: '/api/model/getAppHomeModels',
    // 根据模块id获取子模块
    getModelsByPid: '/api/model/getModelsByPid',
    // 获取购物车到提交订单数据
    getShopCartOrder: '/api/order/getShopCartOrder',
    // 微信登录 绑定 ------------------------------------
    // 获取openId code   encrypt  iv   返回openId
    getWxOpenIdByCode: '/user/client/wx/getWxOpenIdByCode',    
    // phone, password, code, openId, localeId-- - 扫码得到    返回登录信息
    registerByWxMin: '/user/client/user/registerByWxMin',   
    //  openId   返回登录信息
    wxMinLogin: '/user/client/user/wxMinLogin',  
    // 微信绑定验证码 phone , 返回  isNew
    sendWxMinBindCode: '/user/client/sms/sendWxMinBindCode',   
    // 爆品  商品详情相关---------------------------------
    // 获取商品信息 goodsId  
    getGoodsInfo: '/shop/client/goods/getGoodsInfo',   
    // 获取商品图片列表  goodsId
    getGoodsImgList: '/shop/client/goods/getGoodsImgList', 
    // 获取商品详情 goodsId
    getGoodsDetail: '/shop/client/goods/getGoodsDetail',  
    // 获取商品标签  goodsId
    getGoodsLabel: '/shop/client/goods/getGoodsLabel', 
    // 获取商品sku  goodsId
    getGoodsSkuList: '/shop/client/goods/getGoodsSkuList', 
    // 商品分类相关---------------------------------------
    // 获取所有分类接口
    getGoodsCatList: '/shop/client/goods/getGoodsCatList',
    // 根据分类获取商品列表
    getGoodsListByCatId: '/shop/client/goods/getGoodsListByCatId',
    // 购物车相关-----------------------------------------
    // 获取购物车商品     page, size  
    getUserCart: '/shop/client/cart/getUserCart',   
    // 获取购物车商品数量
    getUserCartNum: '/shop/client/cart/getUserCartNum', 
    // 新增购物车商品    goodsId, skuId, num ， shopId
    createCartGoods: '/shop/client/cart/createCartGoods',
    // 修改购物车数量  cartId, num
    changeCartGoodsNum: '/shop/client/cart/changeCartGoodsNum',   
    // 清空购物车
    clearCart: '/shop/client/cart/clearCart',
    // 删除购物车项，传cartId cartIdList = []
    deleteCart: '/shop/client/cart/deleteCart',    
    // 选中购物车  cartId
    selectCartGoods: '/shop/client/cart/selectCartGoods',   
    // 取消选中购物车  cartId
    cancelSelectCartGoods: '/shop/client/cart/cancelSelectCartGoods',   
    // 根据店铺选中购物车  shopId
    selectCartGoodsByShop: '/shop/client/cart/selectCartGoodsByShop',   
    // 根据店铺取消选中购物车  shopId
    cancelSelectCartGoodsByShop: '/shop/client/cart/cancelSelectCartGoodsByShop',   
    // 全选购物车
    selectAllCartGoods: '/shop/client/cart/selectAllCartGoods',
    // 取消全选购物车
    cancelSelectAllCartGoods: '/shop/client/cart/cancelSelectAllCartGoods',
    //地址相关-----------------------------------------
    //添加地址cityCode,address,detail,phone,name,isDefault
    addUserAddress:'/user/client/address/addUserAddress',
    //编辑地址 id, cityCode, address, detail, phone, name, isDefault
    editUserAddress:"/user/client/address/editUserAddress",
    // 删除地址 id
    delUserAddress:"/user/client/address/delUserAddress",
    // 设置默认地址id
    setDefaultUserAddress:'/user/client/address/setDefaultUserAddress',
    // 获取默认地址
    getUserDefaultAddress:'/user/client/address/getUserDefaultAddress',
    // 获取地址列表
    getUserAddressList:'/user/client/address/getUserAddressList',
    // 订单相关-----------------------------------------
    // 获取用户账户信息
    getUserAccount: '/account/client/account/getUserAccount',
    // 整理订单接口 cityCode 没有选地址的时候不传，goodsList=[{ shopId, goodsId, skuId, num }] 
    parseOnlineOrder: '/order/client/order/parseOnlineOrder', 
    // 下单接口 参数 addressId, goodsList=[{ shopId, goodsId, skuId, num }]    返回orderNo
    createOnlineOrder: '/order/client/order/createOnlineOrder', 
    // 支付订单接口  orderNo 返回paySuccess = 1时直接支付成功，=0时返回parParam，掉起支付sdk
    payOrder:'/order/client/order/payOrder',
    // 接口测试到掉起sdk，不要支付
    // 本地o2o 活动相关-----------------------------------
    // 获取附近活动列表 lng lat  page  size  typeList(可选)  catIdList(可选)
    getNearAvtivityPage: '/locale/client/activity/getNearAvtivityPage',
    // 获取活动详情  id        活动id
    getAvtivityInfo: '/locale/client/activity/getAvtivityInfo',
    // 获取o2o商户详情  id    商户id（localeId）
    getLocaleInfo: '/locale/client/locale/getLocaleInfo',       
    // 收藏活动  activityId     
    collectActivity: '/locale/client/activity/collectActivity',
    // 取消收藏活动 activityId   
    cancelCollectActivity: '/locale/client/activity/cancelCollectActivity',
    // 点赞活动 activityId
    likeActivity: '/locale/client/activity/likeActivity',    
    // 取消点赞活动 activityId
    cancelLikeActivity: '/locale/client/activity/cancelLikeActivity',    
    // 获取活动满减活动  id  （activityId）
    getReduceByActivity: '/locale/client/activity/getReduceByActivity',
    // 获取活动领取优惠券列表   id  （activityId）
    getCouponByActivity: '/locale/client/activity/getCouponByActivity',  
    // 领取优惠券  id  （couponId）
    receiveCoupon:'/locale/client/activity/receiveCoupon', 
    // 获取o2o商户详情  id    商户id（localeId）
    getLocaleInfo: '/locale/client/locale/getLocaleInfo',       
    // 获取店铺详细信息 id  （localeId） 
    getLocaleDetail: '/locale/client/locale/getLocaleDetail',   
    // 获取媒体数量  id(localeId)      返回{ img: 10, video: 20 }
    getMediaCount: '/locale/client/locale/getMediaCount',
    // 推荐活动列表 返回  [{ title: '', id: 123 }];   
    getRecommandActivityList: '/locale/client/activity/getRecommandActivityList',
    // 获取店铺可用满减活动   id  （localeId）            
    getValidReduceByLocale: '/locale/client/activity/getValidReduceByLocale',
    // 获取店铺可用领取优惠券列表  id  （localeId）  page size
    getValidCouponByLocale: '/locale/client/activity/getValidCouponByLocale',
    // 获取图片列表   id(localeId)
    getImgList: '/locale/client/locale/getImgList',   
    // 获取视频列表     id(localeId)     
    getVideoList: '/locale/client/locale/getVideoList',
    // 获取一级分类
    getLocaleFirstCat: '/locale/client/locale/getLocaleFirstCat',
    // 根据pid获取分类    pid  
    getLocaleCatByPid: '/locale/client/locale/getLocaleCatByPid',
    // 搜索活动列表   search    lng      lat    page    size   
    searchAvtivityPage: '/locale/client/activity/searchAvtivityPage',    
    //本地生活支付
    createLocaleOrder:'/order/client/order/createLocaleOrder',
    // 本地生活支付  localeId，couponId，totalMoney  支付价格， clientPayMoney  
    // 客户端计算得到的支付价格   （总  价-优惠券价格 - 满减价格 - 积分价格）
};
