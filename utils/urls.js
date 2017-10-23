const HOST = 'HOST';//
var WS = 'WS';
var urls = {
  REST_userInfo: HOST + 'aide/user/decrypt',//用户信息

  REST_add: HOST + 'aide/invoice/add',//添加发票
  REST_show: HOST + 'aide/invoice/show',//发票详情
  REST_list: HOST + 'aide/invoice/list',//发票列表
  REST_stick: HOST + 'aide/invoice/stick',//发票置顶
  REST_delete: HOST + 'aide/invoice/delete',//删除发票
  REST_submit: HOST + 'aide/invoice/submit',//提交发票
  REST_update: HOST + 'aide/invoice/update',//编辑发票
  REST_refresh: HOST + 'aide/invoice/refresh/qrcode',//刷新二维码
  REST_qrcode: HOST + 'aide/qrcode/commend/cus',//获取商家推荐二维码

  REST_ws_list: WS + 'aide/ws/company/list',
  REST_search: HOST + 'aide/company/show',

  REST_get: HOST + 'aide/customer/get'//根据code获取信息
}

module.exports = {
  urls:urls
}
