//index.js
//获取应用实例
var app = getApp();
var urls = require('../../utils/urls.js').urls;
var get_sign = require('../../utils/util.js').get_sign;
var testObj = require('../../utils/util.js').testObj;
var trim = require('../../utils/util.js').trim;
Page({
  data: {
    tabGene: true,
    tabSpe: false,
    tabPer: false,
    erroInfo: '您输入的格式有误',
    error: false,
    disabled_gene: true,
    disabled_spe: true,
    disabled_per: true,
    name: '',
    compname: '',
    phone: '',
    tel: '',
    mobile: '',
    tax: '',
    IDNo: '',
    addr: '',
    bank: '',
    acc: '',
    tkType: 1,
    wxTicket: false
  },
  onLoad: function () {

  },
  tabGene: function () {
    var that = this;
    this.setData({
      tabGene: true,
      tabSpe: false,
      tabPer: false,
      tkType: 1
    });
    this.testGene(this);
    if (this.data.wxTicket) {
      if (!testObj.checkTax(that.data.tax)) {
        that.setData({
          error: true,
          error_tax: true
        });
      }
      if (!testObj.checkTel(that.data.tel) && !testObj.checkPhone(that.data.tel) && that.data.tel != '') {
        that.setData({
          error: true,
          error_tel: true
        });
      } else {
        that.setData({
          error: false,
          error_tel: false
        });
      }
    }


    /** */
  },
  tabSpe: function () {
    var that = this;
    this.setData({
      tabGene: false,
      tabSpe: true,
      tabPer: false,
      tkType: 2
    });
    this.testSpe(this);
    if (this.data.wxTicket) {
      if (!testObj.checkTax(that.data.tax)) {
        that.setData({
          error: true,
          error_tax: true
        });
      }
      if (!testObj.checkTel(that.data.tel) && !testObj.checkPhone(that.data.tel)) {
        that.setData({
          error: true,
          error_tel: true
        });
      }

      if (testObj.isNull(that.data.addr)) {
        that.setData({
          error: true,
          error_addr: true
        });
      }
      if (!testObj.checkBankNo(that.data.acc)) {
        that.setData({
          error: true,
          error_acc: true
        });
      }
    }
  },
  tabPer: function () {
    this.setData({
      tabGene: false,
      tabSpe: false,
      tabPer: true,
      tkType: 3
    });
    this.testPer(this);
  },
  /*单位名称 */
  input_compname: function (e) {
    var value = e.detail.value;
    var that = this;
    if (testObj.isNull(value)) {
      this.setData({
        error: true,
        error_compname: true
      });
    } else {
      this.setData({
        error: false,
        error_compname: false
      });
    }
    this.setData({
      compname: value
    });
    /** 根据类型选择实时验证方法*/
    if (this.data.tabGene) {
      this.testGene(this);
    }
    if (this.data.tabSpe) {
      this.testSpe(this);
    }
    /** */
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
        })
      });
    } else {
      that.setData({
        searchList: false
      });
    }
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    });
  },
  focus_compname: function () {
    this.setData({
      clear_compname: true
    });
    /*建立websocket*/
    var data = get_sign({
      ghId: app.globalData.ghId,
    });
    wx.connectSocket({
      url: urls.REST_ws_list + '?ghId=' + data.ghId + '&sign=' + data.sign,
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    });
  },
  blur_compname: function () {
    this.setData({
      clear_compname: false,
      // searchList: false
    });
    wx.closeSocket();
  },
  clear_compname: function () {
    this.setData({
      compname: '',
      on_compname: true
    });
  },
  companyConfirm: function (e) {
    var item = e.currentTarget.dataset.item;
    var compname = e.currentTarget.dataset.name;
    var phone = e.currentTarget.dataset.phone;
    var tax = e.currentTarget.dataset.tax;
    var addr = e.currentTarget.dataset.addr;
    var bank = e.currentTarget.dataset.bank;
    var acc = e.currentTarget.dataset.acc;
    if (!phone) {
      phone = '未查询到电话';
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
      tel: phone,
      addr: addr,
      bank: bank,
      acc: acc,
      searchList: false
    });
    /** 根据类型选择实时验证方法*/
    if (this.data.tkType == 1) {
      this.testGene(this);
    }
    if (this.data.tkType == 2) {
      this.testSpe(this);
    }
    /** */
  },
  /* */
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
    /** 根据类型选择实时验证方法*/
    if (this.data.tabGene) {
      this.testGene(this);
    }
    if (this.data.tabSpe) {
      this.testSpe(this);
    }
    /** */
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
    /** 根据类型选择实时验证方法*/
    if (this.data.tabGene) {
      this.testGene(this);
    }
    if (this.data.tabSpe) {
      this.testSpe(this);
    }
    if (this.data.tabPer) {
      this.testPer(this);
    }
    /** */
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
    /** 根据类型选择实时验证方法*/
    if (this.data.tabGene) {
      this.testGene(this);
    }
    if (this.data.tabSpe) {
      this.testSpe(this);
    }
    if (this.data.tabPer) {
      this.testPer(this);
    }
    /** */
  },
  /* */
  /*单位地址 */
  input_addr: function (e) {
    var value = e.detail.value;
    if (!testObj.isNull(value)) {
      this.setData({
        error: false,
        error_addr: false
      });
    } else {
      this.setData({
        error: true,
        error_addr: true
      });
    }
    this.setData({
      addr: value
    });
    /** 根据类型选择实时验证方法*/

    this.testSpe(this);

    /** */
  },
  focus_addr: function () {
    this.setData({
      clear_addr: true
    });
  },
  blur_addr: function () {
    this.setData({
      clear_addr: false
    });
  },
  clear_addr: function () {
    this.setData({
      addr: '',
      on_addr: true
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
    this.testSpe(this);
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
    this.testSpe(this);
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
  /* */
  /*姓名 */
  input_name: function (e) {
    var value = e.detail.value;
    if (testObj.checkName(value)) {
      this.setData({
        error: false,
        error_name: false
      });
    } else {
      this.setData({
        error: true,
        error_name: true
      });
    }
    this.setData({
      name: value
    });
    this.testPer(this);
  },
  focus_name: function () {
    this.setData({
      clear_name: true
    });
  },
  blur_name: function () {
    this.setData({
      clear_name: false
    });
  },
  clear_name: function () {
    this.setData({
      name: '',
      on_name: true
    });
  },
  /* */
  /*个人电话 */
  input_mobile: function (e) {
    var value = e.detail.value;
    if (testObj.checkTel(value) || testObj.checkPhone(value) || value == '') {
      this.setData({
        error: false,
        error_mobile: false
      });
    } else {
      this.setData({
        error: true,
        error_mobile: true
      });
    }
    this.setData({
      mobile: value
    });
    /** 根据类型选择实时验证方法*/
    if (this.data.tabGene) {
      this.testGene(this);
    }
    if (this.data.tabSpe) {
      this.testSpe(this);
    }
    if (this.data.tabPer) {
      this.testPer(this);
    }
    /** */
  },
  focus_mobile: function () {
    this.setData({
      clear_mobile: true
    });
  },
  blur_mobile: function () {
    this.setData({
      clear_mobile: false
    });
  },
  clear_mobile: function () {
    this.setData({
      mobile: '',
      on_mobile: true
    });
  },
  /* */
  /*身份证号码 */
  input_IDNo: function (e) {
    var value = e.detail.value;
    if (testObj.checkID(value) || testObj.isNull(value)) {
      this.setData({
        error: false,
        error_IDNo: false
      });
    } else {
      this.setData({
        error: true,
        error_IDNo: true
      });
    }
    this.setData({
      IDNo: value
    });
    this.testPer(this);
  },
  focus_IDNo: function () {
    this.setData({
      clear_IDNo: true
    });
  },
  blur_IDNo: function () {
    this.setData({
      clear_IDNo: false
    });
  },
  clear_IDNo: function () {
    this.setData({
      IDNo: '',
      on_IDNo: true
    });
    this.testPer(this);
  },
  /* */
  /** 查询*/
  search: function () {
    var compname = this.data.compname || '';
    var tkType = this.data.tabGene ? 1 : 2
    wx.navigateTo({
      // url: '../search/search?compname=' + compname + '&tkType=' + tkType,
      url: `../search/search?compname=${compname}&tkType=${tkType}`
    })
  },
  /* */
  testGene: function (that) {//检查普票全部格式是否正确
    if (!testObj.isNull(that.data.compname) && testObj.checkTax(that.data.tax) && (testObj.checkTel(that.data.tel) || testObj.checkPhone(that.data.tel) || testObj.isNull(that.data.tel))) {
      that.setData({
        disabled_gene: false,
        error: false,
        error_compname: false,
        error_tax: false,
        error_tel: false,
      });
    } else {
      that.setData({
        disabled_gene: true
      });
    }
  },
  testSpe: function (that) {//检查专票全部格式是否正确
    if (!testObj.isNull(that.data.compname) && testObj.checkTax(that.data.tax) && (testObj.checkTel(that.data.tel) || testObj.checkPhone(that.data.tel)) && !testObj.isNull(that.data.addr) && !testObj.isNull(that.data.bank) && !testObj.isNull(that.data.bank && testObj.checkBankNo(that.data.acc))) {
      that.setData({
        disabled_spe: false,
        error:false,
        error_compname: false,
        error_tax: false,
        error_tel: false,
        error_bank: false,
        error_addr: false,
        error_acc: false
      });
    } else {
      that.setData({
        disabled_spe: true
      });
    }
  },
  testPer: function (that) {//检查个人全部格式是否正确
    if (testObj.checkName(that.data.name) && (testObj.checkTel(that.data.mobile) || testObj.checkPhone(that.data.mobile) || testObj.isNull(that.data.mobile)) && (testObj.checkID(that.data.IDNo) || testObj.isNull(that.data.IDNo))) {
      that.setData({
        disabled_per: false,
        error: false,
        error_ame: false,
        error_IDNo: false,
        error_mobile: false
      });
    } else {
      that.setData({
        disabled_per: true
      });
    }
  },
  /**提交保存 */
  submit_gene: function () {
    var that = this;
    this.ticket_sub(this, 1, {
      fpzl: 1,
      gfdh: that.data.tel,
      gfdz: '',
      gfmc: that.data.compname,
      gfyhzh: '',
      khyh: '',
      gfsh: that.data.tax,
      code: app.globalData.code,
      ghId: app.globalData.ghId,
      openId: app.globalData.openId,
      kpType: app.globalData.kpType
    });
  },
  submit_spe: function () {
    var that = this;
    this.ticket_sub(this, 2, {
      fpzl: 2,
      gfdh: that.data.tel,
      gfdz: that.data.addr,
      gfmc: that.data.compname,
      gfsh: that.data.tax,
      gfyhzh: trim(that.data.acc),
      khyh: that.data.bank,
      code: app.globalData.code,
      ghId: app.globalData.ghId,
      openId: app.globalData.openId,
      kpType: app.globalData.kpType
    });
  },
  submit_per: function () {
    var that = this;
    this.ticket_sub(this, 3, {
      fpzl: 3,
      gfdh: that.data.mobile,
      gfdz: '',
      gfmc: that.data.name,
      gfsh: that.data.IDNo,
      gfyhzh: '',
      khyh: '',
      code: app.globalData.code,
      ghId: app.globalData.ghId,
      openId: app.globalData.openId,
      kpType: app.globalData.kpType
    });
  },
  ticket_sub: function (that, tkType, datas) {//tkType:发票类型:1普票，2专票，3个人
    if (wx.showLoading()) {
      wx.showLoading();
    }
    var phone = tkType == 3 ? that.data.mobile : that.data.tel;
    var compname = tkType == 3 ? that.data.name : that.data.compname;
    wx.request({
      url: urls.REST_add,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: get_sign(datas),
      success: function (res) {
        if (res.data.state == 0) {
          var uiId = res.data.info.uiId;
          wx.redirectTo({
            url: '../submit/submit?tkType=' + tkType + '&uiId=' + uiId,
          });
        } else {
          wx.showModal({
            title: '保存失败',
            content: res.data.message,
          });
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
  },
  chooseInvoiceTitle: function () {
    if (wx.chooseInvoiceTitle) {
      var that = this;
      wx.chooseInvoiceTitle({
        success(res) {
          console.log(res);
          if (res.choose_invoice_title_info) {
            var res = JSON.parse(res.choose_invoice_title_info)
          }
          if (res.type == 1) {//（0：单位，1：个人）
            that.setData({
              tabGene: false,
              tabSpe: false,
              tabPer: true,
              tkType: 3,
              name: res.title,
            });
          }else if(res.type == 0){
            that.setData({
              tabGene: true,
              tabSpe: false,
              tabPer: false,
              tkType: 1,
              compname: res.title,
              tax: res.taxNumber,
              tel: res.telephone,
              addr: res.companyAddress,
              bank: res.bankName,
              acc: res.bankAccount,
            });
          }
          that.setData({
            wxTicket: true
          });
          /** 根据类型选择实时验证方法*/
          if (that.data.tabGene) {
            that.testGene(that);
            console.log(that.data.tel)
            console.log(that.data.tel != '')
            if (!testObj.checkTax(that.data.tax)) {
              that.setData({
                error: true,
                error_tax: true
              });
            }
            if (!testObj.checkTel(that.data.tel) && !testObj.checkPhone(that.data.tel) && that.data.tel != '') {
              that.setData({
                error: true,
                error_tel: true
              });
            }
          }
          if (that.data.tabSpe) {
            that.testSpe(that);
            if (!testObj.checkTax(that.data.tax)) {
              that.setData({
                error: true,
                error_tax: true
              });
            }
            if (!testObj.checkTel(that.data.tel) && !testObj.checkPhone(that.data.tel)) {
              that.setData({
                error: true,
                error_tel: true
              });
            }
            if (testObj.isNull(that.data.addr)) {
              that.setData({
                error: true,
                error_addr: true
              });
            }
            if (!testObj.checkBankNo(that.data.acc)) {
              that.setData({
                error: true,
                error_acc: true
              });
            }
          }
          if (that.data.tabPer) {
            that.testPer(that);
          }
          /** */
        }
      });
    } else {
      wx.showModal({
        title: '微信版本过低，不支持此功能',
        content: '',
      })
    }
  },
  onShow: function () {
    if (app.globalData.searchRes) {
      console.log(app.globalData.searchItem);
      var searchItem = app.globalData.searchItem;
      var compname = searchItem.gfmc;
      var tel = searchItem.gfdh;
      var tax = searchItem.gfsh;
      var addr = searchItem.gfdz;
      var bank = searchItem.khyh;
      var acc = searchItem.gfyhzh;
      this.setData({
        compname: compname,
        tax: tax,
        tel: tel,
        addr: addr,
        bank: bank,
        acc: acc,
        error: false,
        error_tax: false,
        error_addr: false,
        error_tel: false,
        error_bank: false,
        error_acc: false,
      });
      /** 根据类型选择实时验证方法*/
      if (this.data.tkType == 1) {
        this.testGene(this);
      }
      if (this.data.tkType == 2) {
        this.testSpe(this);
      }
      /** */
      app.globalData.searchRes = null;
    }
  },
  onUnload:function(){
    //页面卸载复位
    this.setData({
      wxTicket:false
    })
  }
})
