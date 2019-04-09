// pages/binding/binding.js
var app = getApp();
var http = require("../../utils/http.js")
var sun = require("../../utils/sun.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,
    show:"password",
    codeTime:0,//验证码
    disabled:false,//验证码按钮禁用
    getPhonev:'',//电话号码
    getCodev:"",//验证码值
    getPasswordv:'',//密码
    codename:"获取验证码",//
    iscode: null,//用于存放存放验证码接口里获取到的code
    isNew:0,//判断是否输入密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        sun.showMsg('您暂未绑定~绑定一下吧！');
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
    //获取手机号
    getPhonevalue(e){
        this.setData({
            getPhonev: e.detail.value
        })
    },
    //获取验证码
    getCodevalue(e){
        this.setData({
            getCodev: e.detail.value
        })
    }, 
    //获取密码
    getPasswordvalue(e) {
        this.setData({
            getPasswordv: e.detail.value
        })
    },
    //验证码sendRegisterCode phone
    getCode: function () {
        var phone = this.data.getPhonev;
        var page = this;
        var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
        // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        // var myreg = "^[0-9]{6,16}$";
        if (this.data.getPhonev == "") {
            sun.showMsg('手机号不能为空！');
            setTimeout(()=>{
                page.setData({
                    disabled: false
                });
            },0)
        } else if (!myreg.test(this.data.getPhonev)) {
            sun.showMsg('请输入正确的手机号！');
            setTimeout(() => {
                page.setData({
                    disabled: false
                });
            }, 0)
        } else {
            sun.actRequest({
                url: http.sendWxMinBindCode,
                showLodaing:true,
                data: {
                    phone:phone
                },
                success(res) {
                    sun.showMsg('验证码发送成功,请注意查收！');
                    page.setData({
                        isNew: res.isNew
                    })
                    var num = 60;
                    var timer = setInterval(function () {
                        num--;
                        if (num <= 0) {
                            clearInterval(timer);
                            page.setData({
                                codename: '重新发送',
                                disabled: false
                            })
                        } else {
                            page.setData({
                                codename: num + "s"
                            })
                        }
                    }, 1000)
                }, fail (code, msg){
                    page.setData({
                        codename: '重新发送',
                        disabled: false
                    })
                }
            })
        }
    },
    //验证码点击
    getVerificationCode(){
        this.getCode();
        this.setData({
            disabled:true
        })
    },
    //判断密码是否显示以及切换眼睛
    eyes(){
        if (this.data.isShow) {   
            this.setData({
                isShow: false,
                show: "text"
            })
        } else {
            this.setData({
                isShow: true,
                show: "password"
            })
        }
    },
    //绑定
    submit(e){
        let Password = this.data.getPasswordv;
        let Code = this.data.getCodev;
        let Phone = this.data.getPhonev;
        let OpenId = wx.getStorageSync("openId");
        var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
        if (Phone == "") {
            sun.showMsg('手机号码不能为空！');
            return false;
        } else if (!myreg.test(Phone)) {
            sun.showMsg('请输入正确的手机号格式！');
            return false;
        }
        if (Code == "") {
            sun.showMsg('验证码不能为空！');
            return false;
        } else if (this.data.isNew && Code.length < 4) {
            sun.showMsg('验证码有误！');
            return false;
        } else if (this.data.isNew &&(Password.length < 6 || Password.length > 16)){
            sun.showMsg('请输入6-16位密码！');
        }else{
            sun.actRequest({
                url: http.registerByWxMin,
                showLoading: true,
                data: {
                    phone: Phone,
                    password: Password,
                    code: Code,
                    openId: OpenId,
                    localeId: ''
                },
                success(res){
                    sun.showMsg('绑定成功!');
                    wx.setStorageSync("res", res);
                    wx.redirectTo({
                        url: "../homes/homes"
                    })
                },
                fail: (code, msg) => {
                    sun.showMsg(msg);
                }
            })
        }
    }
})