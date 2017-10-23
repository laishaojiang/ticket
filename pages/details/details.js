// pages/details/details.js
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
    tkType:'',
    appletUserInvoice:[],
    qr_code:'../../image/placeholder.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tkType = options.tkType;
    var uiId = options.uiId
    this.setData({
      uiId: uiId,
      tkType: tkType
    });
  },
  refreshCode:function(){
    var that = this;
    if(wx.showLoading){
      wx.showLoading();
    }
    wx.request({
      url: urls.REST_refresh,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: get_sign({
        openId: app.globalData.openId,
        ghId: app.globalData.ghId,
        uiId: that.data.uiId,
        code: app.globalData.code || app.globalData.hasScanCode || ''
      }),
      success: function (res) {
        if(res.data.state == 0){
          that.setData({
            qr_code: res.data.info.qrcodeUrl
          });
        }
      },
      complete:function(){
        wx.hideLoading();
      }
    })
  },
  compile: function (event) {//点击编辑
    var that = this
    wx.navigateTo({
      url: '/pages/amend/amend?uiId=' + that.data.uiId + '&tkType=' + that.data.tkType
    });
  },
  goList: function () {
    wx.reLaunch({
      url: '../index_lis/index_lis'
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
    wx.request({
      url: urls.REST_show,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: get_sign({
        code: app.globalData.code || app.globalData.hasScanCode || '',
        isNeedQRC: 1,
        uiId: that.data.uiId,
        openId: app.globalData.openId,
        ghId: app.globalData.ghId
      }),
      success: function (res) {
        console.log(res);
        if (res.data.state == 0) {
          that.setData({
            appletUserInvoice: res.data.info.appletUserInvoice,
            qr_code: res.data.info.qrcodeUrl
          });
        } else {
          console.log('获取详情失败');
        }
      }
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
    console.log('unload');//清空商家信息
    app.globalData.kpType = '';
    app.globalData.code = '';
    app.globalData.hasScanCode = '';
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