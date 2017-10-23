//app.js
const urls = require('utils/urls.js').urls;
const utils = require('utils/util.js');
const get_sign = utils.get_sign;
const getUrlParam = utils.getUrlParam;
App({
  onLaunch: function (options) {
    var that = this;
    var source = options?options.scene : 1001;
    that.globalData.source = source;
    wx.login({
      success: function (res) {
        console.log(res);
        const lgCode = res.code;
        wx.getUserInfo({
          success: function (userInfo) {
            console.log(userInfo);
            const encryptedData = userInfo.encryptedData;
            const iv = userInfo.iv;
            that.getUserInit(lgCode, encryptedData, iv, source, function (data) {
              console.log(data);
              if (data.data.state == 0) {
                that.globalData.isExist = data.data.info.isExist;
                that.globalData.openId = data.data.info.openId;
                if (data.data.info.customer) {
                  that.globalData.kpType = data.data.info.customer.kpType;
                  that.globalData.code = data.data.info.customer.code;
                }
              } else {
                that.globalData.isExist = 'error';
              }

            });
          },
          fail: function () {
            const encryptedData = '';
            const iv = '';
            that.getUserInit(lgCode, encryptedData, iv, source, function (data) {
              console.log(data);
              if (data.data.state == 0) {
                that.globalData.isExist = data.data.info.isExist;
                that.globalData.openId = data.data.info.openId;
                if (data.data.info.customer) {
                  that.globalData.kpType = data.data.info.customer.kpType;
                  that.globalData.code = data.data.info.customer.code;
                }
              }else{
                that.globalData.isExist = 'error';
              } 
            });
          }
        });
      }
    });
  },
  getUserInit: function (code, encryptedData, iv, source, success) {//用户初始化接口
    var that = this;
    wx.request({
      url: urls.REST_userInfo,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: get_sign({
        appId: that.globalData.appId,
        code: code,
        encryptedData: encryptedData,
        ghId: that.globalData.ghId,
        iv: iv,
        source: source
      }),
      success: function (data) {
        if (data) {
          success(data)
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '',
          content: res.errMsg,
        })
        that.globalData.isExist = 'error';
      },
      complete: function () {

      }
    });
  },
  globalData: {
    userInfo: null,
    openId: '',
    appId: 'wxa365c56f12fddf8b',
    ghId: 'gh_ae981f8354c2',
    isExist: '',
    hasScanCode:'',//扫码直接进入小程序
    code: '',//code
    kpType: '',//1.扫描开票 ，2.提交开票
    source:1001
  }
})