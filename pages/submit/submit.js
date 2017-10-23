// pages/submit/submit.js
var app = getApp();
var urls = require('../../utils/urls.js').urls;
var get_sign = require('../../utils/util.js').get_sign;
var testObj = require('../../utils/util.js').testObj;
var getUrlParam = require('../../utils/util.js').getUrlParam;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noCode: true,
    kpType: app.globalData.kpType
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp());
    var that = this;
    var tkType = options.tkType;
    var uiId = options.uiId;
    var code = app.globalData.code;
    var hasScanCode = app.globalData.hasScanCode;
    var noCode = (code || hasScanCode)? false : true;
    this.setData({
      tkType: tkType,
      noCode: noCode,
      uiId: uiId,
      code: code
    });
  },
  submit:function(){
    var that = this;
    var uiId = this.data.uiId;
    var tkType = this.data.tkType;
    var hasScanCode = app.globalData.hasScanCode;
    if(wx.showLoading){
      wx.showLoading({
        title: '提交中',
      });
    }
    if (hasScanCode){//如果扫码进入已获取到商家code
      wx.request({
        url: urls.REST_get,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: get_sign({
          code: hasScanCode,
          openId: app.globalData.openId,
          ghId: app.globalData.ghId
        }),
        success: function (res) {
          if (res.data.state == 0) {
            var kpType = res.data.info.customer.kpType;//1--扫描开票 2-提交开票
            if (kpType == 1) {
              wx.redirectTo({
                url: '/pages/details/details?uiId=' + uiId + '&tkType=' + tkType
              });
            } else if (kpType == 2) {
              that.submitRequs(hasScanCode, uiId, tkType);
            } else {
              console.log('获取开票类型失败');
            }
          } else {
            wx.showModal({
              title: '获取商家信息失败',
              content: res.data.message,
            })
          }
        },
        fail: function () {
          wx.showModal({
            title: '网络加载失败',
            content: '请稍后再试',
          });
        },
        complete: function () {
          wx.hideLoading();
        }
      });
    } else{
      if (app.globalData.kpType == 1) {
        wx.redirectTo({
          url: '/pages/details/details?uiId=' + that.data.uiId + '&tkType=' + that.data.tkType
        });
      } else if (app.globalData.kpType == 2) {
        var code = app.globalData.code;
        that.submitRequs(code, uiId, tkType);
      } else {
        console.log('获取开票类型失败');
      }
    }
    
  },
  scan: function () {
    var that = this;
    var uiId = this.data. uiId;
    var tkType = this.data.tkType;
    wx.scanCode({
      success: function (codeUrl) {
        if (wx.showLoading) {
          wx.showLoading();
        }
        var str = codeUrl.result;
        var code = getUrlParam('regCode', str);
        if (code) {
          app.globalData.code = code;
          wx.request({
            url: urls.REST_get,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: get_sign({
              code: code,
              openId: app.globalData.openId,
              ghId: app.globalData.ghId
            }),
            success: function (res) {
              if (res.data.state == 0) {
                var kpType = res.data.info.customer.kpType;//1--扫描开票 2-提交开票
                if (kpType == 1) {
                  wx.redirectTo({
                    url: '/pages/details/details?uiId=' + uiId + '&tkType=' + tkType
                  });
                } else if (kpType == 2) {
                  that.submitRequs(code, uiId, tkType);
                }else{
                  console.log('获取开票类型失败');
                }
              } else {
                wx.showModal({
                  title: '获取商家信息失败',
                  content: res.data.message,
                })
              }
            },
            fail:function(){
              wx.showModal({
                title: '网络加载失败',
                content: '请稍后再试',
              });
            },
            complete:function(){
              wx.hideLoading();
            }
          });
        } else {//没有code,同1.0版本
          wx.redirectTo({
            url: '/pages/details/details?uiId=' + that.data.uiId + '&tkType=' + that.data.tkType
          });
        }
      }
    });
  },
  submitRequs: function (code, uiId, tkType){
    wx.request({
      url: urls.REST_submit,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: get_sign({
        code: code,
        uiId: uiId,
        openId: app.globalData.openId,
        ghId: app.globalData.ghId
      }),
      success: (data) => {
        if (data.data.state == 0) {
          app.globalData.kpType = ''
          app.globalData.code = '';
          app.globalData.hasScanCode = '';
          wx.redirectTo({
            url: '/pages/submit_success/submit_success'
          });
        }else if(data.data.state == 215){
          wx.showModal({
            title: '温馨提示',
            content: data.data.message
          });
        }else{
          wx.showModal({
            title: '开票失败',
            content: data.data.message,
          });
        }
      },
      fail: function () {
        wx.showModal({
          title: '网络加载失败',
          content: '请稍后再试',
        });
      },
      complete:function () {
        wx.hideLoading();
      }
    });
  },
  compile: function (event) {//点击编辑
    var that = this
    wx.navigateTo({
      url: '/pages/amend/amend?uiId=' + that.data.uiId + '&tkType=' + that.data.tkType
    });
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
    var that = this;
    var uiId = this.data.uiId;
    var code = this.data.code;
    var tkType = this.data.tkType;
    wx.request({
      url: urls.REST_show,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: get_sign({
        code: code,
        isNeedQRC: 2,
        uiId: uiId,
        openId: app.globalData.openId,
        ghId: app.globalData.ghId
      }),
      success: function (res) {
        if (res.data.state == 0) {
          var _list = res.data.info.appletUserInvoice;
          for(var x in _list){
            if(_list[x] == null){
              _list[x] = '';
            }
          }
          that.setData({
            appletUserInvoice: _list
          });
        } else {
          wx.showModal({
            title: '获取发票信息失败',
            content: res.data.message
          });
        }
      }
    });
  },
  goList: function () {
    wx.reLaunch({
      url: '../index_lis/index_lis'
    });
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

  }
})