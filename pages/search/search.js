// pages/search/search.js
var app = getApp();
var urls = require('../../utils/urls.js').urls;
var get_sign = require('../../utils/util.js').get_sign;
var testObj = require('../../utils/util.js').testObj;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResult_show: false,
    searchNo_show: false,
    tkType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tkType = options.tkType;
    var compname = options.compname;
    this.setData({
      search: compname,
      tkType: tkType
    });
  },
  focus_search: function () {
    this.setData({
      clear_compname: true
    });
    var data = get_sign({
      ghId: app.globalData.ghId,
    });
    /*建立websocket*/
    wx.connectSocket({
      url: urls.REST_ws_list + '?ghId=' + data.ghId + '&sign=' + data.sign,
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    });
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    });
  },
  input_search: function (e) {
    var value = e.detail.value;
    var that = this;
    this.setData({
      search: value
    });
    /** 连接websocket*/
    if (value.length >= 3) {
      wx.sendSocketMessage({
        data: value,
        success: function (res) {
          console.log(res);
        }
      });
      wx.onSocketMessage(function (res) {
        var data = JSON.parse(res.data);
        console.log(data);
        that.setData({
          searchList: true,
          companyList: data.info.companyList
        });
      });
    } else {
      that.setData({
        searchList: false
      });
    }
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    });
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    });
  },
  blur_search: function () {
    this.setData({
      clear_search: false,
      searchList: false
    });
    wx.closeSocket();
  },
  companyConfirm: function (e) {
    var item = e.currentTarget.dataset.item;
    var compname = e.currentTarget.dataset.name;
    var tel = e.currentTarget.dataset.tel;
    var tax = e.currentTarget.dataset.tax;
    var addr = e.currentTarget.dataset.addr;
    var bank = e.currentTarget.dataset.bank;
    var acc = e.currentTarget.dataset.acc;
    console.log(item)
    this.disResult(compname, tel, tax, addr, bank, acc);
    this.setData({
      searchResult_show: true,
      searchItem:item,
      searchNo_show:false,
      search: compname
    });
  },
  disResult: function (compname,tel, tax, addr, bank, acc){
    if (!tel) {
      tel = '未查询到电话';
      this.setData({
        error_tel: true
      });
    }
    if (!tax) {
      tax = '未查询到税号'
      this.setData({
        error_tax: true
      });
    }
    if (!addr) {
      addr = '未查询到地址';
      this.setData({
        error_addr: true
      });
    }
    if (!bank) {
      bank = '未查询到开户银行';
      this.setData({
        error_bank: true
      });
    }
    if (!acc) {
      acc = '未查询到银行账号';
      this.setData({
        error_acc: true
      });
    }
    this.setData({
      compname: compname,
      tax: tax,
      tel: tel,
      addr: addr,
      bank: bank,
      acc: acc
    });
  },
  search: function () {
    var compname = this.data.search;
    var that = this;
    wx.request({
      url: urls.REST_search,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: get_sign({
        gfmc: compname,
        openId: app.globalData.openId,
        ghId: app.globalData.ghId
      }),
      success: function (res) {
        if (res.data.state == 0){
          var compname = res.data.info.company.gfmc;
          var tel = res.data.info.company.gfdh;
          var tax = res.data.info.company.gfsh;
          var addr = res.data.info.company.gfdz;
          var bank = res.data.info.company.khyh;
          var acc = res.data.info.company.gfyhzh;
          that.disResult(compname, tel, tax, addr, bank, acc);
          that.setData({
            searchNo_show: false,
            searchResult_show: true,
            searchItem: res.data.info.company
          });
        }else{
          that.setData({
            searchNo_show: true,
            searchResult_show: false,
          });
        }
      }
    })
  },
  /*税号 */
  input_tax: function (e) {
    var value = e.detail.value;
    if (testObj.checkTax(value)) {
      this.setData({
        error: false,
        error_tax: false
      });
    } else {
      this.setData({
        error: true,
        error_tax: true
      });
    }
    this.setData({
      tax: value
    });
  },
  focus_tax: function () {
    this.setData({
      clear_tax: true
    });
  },
  blur_tax: function () {
    this.setData({
      clear_tax: false
    });
  },
  clear_tax: function () {
    this.setData({
      tax: '',
      on_tax: true
    });
  },
  /* */

  /*单位电话 */
  input_tel: function (e) {
    var value = e.detail.value;
    if (testObj.checkTel(value) || testObj.checkPhone(value) || value == '') {
      this.setData({
        error: false,
        error_tel: false
      });
    } else {
      this.setData({
        error: true,
        error_tel: true
      });
    }
    this.setData({
      tel: value
    });
  },
  focus_tel: function () {
    this.setData({
      clear_tel: true
    });
  },
  blur_tel: function () {
    this.setData({
      clear_tel: false
    });
  },
  clear_tel: function () {
    this.setData({
      tel: '',
      on_tel: true
    });
  },
  /* */
  /*开户银行 */
  input_bank: function (e) {
    var value = e.detail.value;
    if (!testObj.isNull(value)) {
      this.setData({
        error: false,
        error_bank: false
      });
    } else {
      this.setData({
        error: true,
        error_bank: true
      });
    }
    this.setData({
      bank: value
    });
  },
  focus_bank: function () {
    this.setData({
      clear_bank: true
    });
  },
  blur_bank: function () {
    this.setData({
      clear_bank: false
    });
  },
  clear_bank: function () {
    this.setData({
      bank: '',
      on_bank: true
    });
  },
  /* */
  /*银行账号 */
  input_acc: function (e) {
    var value = e.detail.value;
    if (testObj.checkBankNo(value)) {
      this.setData({
        error: false,
        error_acc: false
      });
    } else {
      this.setData({
        error: true,
        error_acc: true
      });
    }
    this.setData({
      acc: value
    });
  },
  focus_acc: function () {
    this.setData({
      clear_acc: true
    });
  },
  blur_acc: function () {
    this.setData({
      clear_acc: false
    });
  },
  clear_acc: function () {
    this.setData({
      acc: '',
      on_acc: true
    });
  },
  filling:function(){
    var searchItem = this.data.searchItem;
    searchItem.gfmc = this.data.compname;
    searchItem.gfsh = this.data.tax;
    searchItem.gfdh = this.data.tel;
    searchItem.gfdz = this.data.addr;
    searchItem.khyh = this.data.bank;
    searchItem.gfyhzh = this.data.acc;
    app.globalData.searchItem = searchItem;
    app.globalData.searchRes = true;
    wx.navigateBack();
  },
  /* */
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

  }
})