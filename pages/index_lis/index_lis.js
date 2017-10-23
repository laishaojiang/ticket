// pages/index_lis/index_lis.js
var app = getApp();
var urls = require('../../utils/urls.js').urls;
var get_sign = require('../../utils/util.js').get_sign;
var page = 1;
var perSize = 10;
var bl = false;
var getList = function (that, page = 1) {
  if (bl) {
    console.log('加载中...')
    return;
  }
  bl = true;
  var _list = that.data.appAppletUserInvoiceList;
  var totalPage = that.data.totalPage;
  if (page > totalPage) {
    wx.showLoading({
      title: '没有了',
    });
    setTimeout(function () {
      wx.hideLoading();
    }, 1000);
    bl = false;
    return;
  }
  wx.request({
    url: urls.REST_list,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data: get_sign({
      openId: app.globalData.openId,
      ghId: app.globalData.ghId,
      page: page,
      perSize: perSize
    }),
    success: function (res) {
      if (res.data.state == 0) {
        var list = res.data.info.appAppletUserInvoiceList;
        if(list == null){//删除全部发票后返回新增发票页
          wx.reLaunch({
            url: '../index/index',
          });
          return ;
        }
        if (page == 1) {
          for(var i = 0;i< list.length;i++){
            list[i].showMenu = false;
          }
          _list = list;
        } else {
          for (var i = 0; i < list.length; i++) {
            list[i].showMenu = false;
            _list.push(list[i]);
          }
        }
        page++;
        that.setData({
          appAppletUserInvoiceList: _list,
          page: page,
          totalPage: res.data.info.page.totalPage
        });
      }
    },
    complete: function () {
      bl = false;
      console.log('加载完成');
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fpzlImgUrl:[
      '',
      '../../image/icon_general.png',
      '../../image/icon_Special.png',
      '../../image/icon_personal.png'
    ],
    fpzlType: ['', '单位普票', '单位专票','个人发票'],
    appAppletUserInvoiceList:[],
    totalPage:10,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  showMenu:function(e){
    var list = this.data.appAppletUserInvoiceList;
    var index = e.currentTarget.dataset.index;
    if(list[index].showMenu){
      list[index].showMenu = false;
    }else{
      for(var i =0;i<list.length;i++){
        list[i].showMenu = false;
      }
      list[index].showMenu = true;
    }
    this.setData({
      appAppletUserInvoiceList: list
    });
  },
  edit:function(e){
    var uiId = e.currentTarget.dataset.id;
    var tkType = e.currentTarget.dataset.types;
    console.log(e)
    var that = this;
    wx.navigateTo({
      url: `../amend/amend?uiId=${uiId}&tkType=${tkType}`,
    });
  },
  delete_tk:function(e){
    var that = this;
    var uiId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除发票吗',
      content: '',
      success:function(con){
        if(con.confirm){
          wx.request({
            url: urls.REST_delete,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: get_sign({
              openId: app.globalData.openId,
              ghId: app.globalData.ghId,
              uiId:uiId
            }),
            success: function (res) {
              if(res.data.state == 0){
                
                getList(that);
              }else{
                wx.showModal({
                  title: '删除失败',
                  content: res.data.message,
                  showCancel: false
                })
              }
            }
          });
        }
      }
    });
  },
  stick:function(e){
    if(wx.showLoading){
      wx.showLoading();
    }
    var uiId = e.currentTarget.dataset.id;
    var that = this;
    wx.request({
      url: urls.REST_stick,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: get_sign({
        openId: app.globalData.openId,
        ghId: app.globalData.ghId,
        uiId: uiId
      }),
      success: function (res) {
        if (res.data.state == 0) {
          console.log(1)
          getList(that);
        }
      },
      complete:function(){
        wx.hideLoading();
      }
    });
  },
  toSubmit:function(e){
    var uiId = e.currentTarget.dataset.id;
    var tkType = e.currentTarget.dataset.types;
    var that = this;
    wx.navigateTo({
      url: `../submit/submit?uiId=${uiId}&tkType=${tkType}`,
    });
  },
  lower:function(){
    var page = this.data.page;
    getList(this,page);
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
    getList(this);
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