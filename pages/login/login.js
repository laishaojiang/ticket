// pages/loading/loading.js
var app = getApp();
var getUrlParam = require('../../utils/util.js').getUrlParam;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (!options.q) {
      var c = options.regCode
    } else {
      var src = decodeURIComponent(options.q);
      var c = getUrlParam('regCode', src);
    }
    app.globalData.hasScanCode = c;
    if (wx.showLoading){
      wx.showLoading({
        title: '加载中',
      });
    }else{
      wx.showModal({
        title: '微信版本过低',
        content: '您的微信版本过低，请先升级微信',
        showCancel:false,
        success:function(){
          wx.navigateBack();
        }
      });
      return;
    }
   
    this.timer = setInterval(function(){
      console.log(app.globalData.isExist);
      if (app.globalData.isExist === true){
        wx.reLaunch({
          url: '../index_lis/index_lis',
        });
      }else if(app.globalData.isExist === false){
        wx.reLaunch({
          url: '../index/index',
        });
      } else if (app.globalData.isExist === 'error'){
        wx.reLaunch({
          url: '../erro/erro',
        });
      }
    },1000);
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
    clearInterval(this.timer);
  
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