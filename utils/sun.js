const app = getApp();
// des加密库
var CryptoJS = require('./tripledes.js');
var desKey = require('./key.js');
// const http = "http://192.168.2.107/hz_dashu/index.php";
// const http = "https://test.globmate.com";
// const o2oHttp = "http://116.62.126.90:4001";
const o2oHttp = "http://192.168.0.79:4001";
// const http = "http://192.168.0.38:4001";
// const http = "https://www.globmate.com";
//接口请求
const request = (item) => {
    if (item.showLoading){
        wx.showLoading({
            title: '正在加载中',
            mask: true
        })
    }
    // todo
    item.data.sign = 123;
    item.data.device = 6;
    item.data.time = Date.parse(new Date()) / 1000;
    let user = wx.getStorageSync("res");
    let header = {
        'Content-Type': 'application/json'
    };
    if (user){
        header.token = user.token;
    }
    wx.request({
        url: http + item.url,
        data: item.data,
        header: header,
        method: 'POST',
        success: function (data) {
        wx.hideLoading();
            if (data.data.code == 0) {
                item.success(data.data.data);
            } else {
                if (!item.hideShow && data.data.msg.length > 0) {
                    showMsg(data.data.msg);
                }
                item.fail(data.data.code, data.data.msg);
            }
        },
        fail: function() {
            wx.hideLoading()
            wx.showToast({
                title: '网络连接错误，请检查网络状态',
                icon: 'none'
            });
        }
    })
}
//java接口请求
const actRequest = (item) => {
    if (item.showLoading){
        wx.showLoading({
            title: '正在加载中',
            mask: true
        })
    }
    let device = 5;
    item.data.device = device;
    item.data.time = Date.parse(new Date()) / 1000;
    let user = wx.getStorageSync("res");
    let token;
    let key = desKey.desKey;
    if (user){
        token = user.token;
        key = user.desKey;
    }
    let str = JSON.stringify(item.data);
    let paramStr = encrypt(str, key);
    console.log(decrypt(paramStr, key))
    let data = {
        device: device,
        token: token,
        param: paramStr,
        dataType: 'text'
    }
    let header = {};
    if (token) {
        header.token = token;
    }
    wx.request({
        url: o2oHttp + item.url,
        data: data,
        header: header,
        dataType: 'string',
        method: 'POST',
        success: function (data) {
            wx.hideLoading();
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
            console.log(JSON.parse(longToString(data.data)));
            // js Long类型number 精度丢失
            let res = JSON.parse(longToString(data.data));
            if (res.code == 0) {
                item.success(res.data);
            } else {
                if (!item.hideShow && res.msg.length > 0) {
                    showMsg(res.msg);
                }
                item.fail(res.code, res.msg);
            }
        },
        fail: function(err) {
            console.log(err);
            wx.hideLoading();
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
            wx.showToast({
                title: '网络连接错误，请检查网络状态',
                icon: 'none'
            });
        }
    })
    // RequestTask.onHeadersReceived(function callback);
}
const longToString = (string) => {
    var s = true;
    while (s) {
        s = string.match(/:[\d]*\d{18}/);
        if (s) {
            var t = s[0].replace(':', ':"') + '"';
            string = string.replace(s, t);
        }
    }
    return string;
}
// 加密
const encrypt = (string, key = desKey.desKey, iv = desKey.iv) => {
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let ivHex = CryptoJS.enc.Utf8.parse(iv);
    let encrypted = CryptoJS.DES.encrypt(string, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}
// 解密
const decrypt = (string, key = desKey.desKey, iv = desKey.iv) => {
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let ivHex = CryptoJS.enc.Utf8.parse(iv);
    let decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(string)
    }, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
// 提示框
const showMsg = (title) => {
    wx.showToast({
        title: title,
        icon: 'none',
        duration: 1500
    });
}
// loading
const showLoading = (title) => {
    wx.showLoading({
        title: title
    })
}
// hideLoading
const hideLoading = () => {
    wx.hideLoading();
}
//包含字符串
const containsString = (long, short) => { return long.indexOf(short) !== -1; }
//图片裁剪
const parseImg=(img, option)=>{
  let src = img;
  if (!img) {
    return src;
  }
  if (!containsString(img, 'http')) {
    src = setting.oss_http + img;
    if (option) {
      if (option.x || option.y) {
        if (containsString(src, '?')) {
          src = src + '&x-oss-process=image/resize,m_fill';
        } else {
          src = src + '?x-oss-process=image/resize,m_fill';
        }
        if (option.x) {
          src = src + ',w_' + option.x;
        }
        if (option.y) {
          src = src + ',h_' + option.y;
        }
      }
      if (option.copy) {
        if (containsString(src, '?')) {
          src = src + '&copy';
        } else {
          src = src + '?copy';
        }
      }
    }
  }
  return src;
}
//时间戳转换时间
function formatTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

var statics = {
  // QRCode
  QRCode_shop_cash: 1,
  // order
  order_all: null,
  order_unPay: 0,
  order_pay: 1,
  order_cancel: 2,
  order_close: 3,
  order_receive: 4,
  order_received: 5,
  order_complete: 6,
  order_delete: 20,
  img_replace: '/!!!img!!!/',
  // 模块跳转类型 1 -链接 2 -商品 3 -分类 4 -模块
  modelType: {
    link: 1,
    goods: 2,
    cat: 3,
    model: 4
  },
  // 平台类型-模块
  platType: 1,
  // 商品类型 1 -普通商品 2 -秒杀商品
  goodsType: {
    goods: 1,
    skillGoods: 2
  }
}

module.exports = {
    request: request,
    actRequest: actRequest,
    showMsg: showMsg,
    showLoading: showLoading,
    hideLoading: hideLoading,
    parseImg: parseImg,
    formatTimeTwo,
    statics: statics
}