function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
};
var trim = function(str) {//去除空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**验证 */
var testObj = {
  checkName: function (name) {
    var reg = /^[\u4E00-\u9FA5a-zA-Z]{1,50}$/g;
    if (reg.test(name)) {
      return true;
    } else {
      return false;
    }
  },
  checkPhone: function (num) {
    var reg = /^1[34578]\d{9}$/g;
    if (reg.test(num)) {
      return true;
    } else {
      return false;
    }
  },
  checkTel: function (num) {
   // var reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/g;
    var reg =  /^[\d\s\-]{7,14}$/
    if (reg.test(num)) {
      return true;
    } else {
      return false;
    }
  },
  isNull: function (val) {
    if (typeof val == 'null' || typeof val == 'undefined' || val == '' || val == null) {
      return true;
    } else {
      return false;
    }
  },
  isSelect: function () {
    if ($(this).find('span:first').text() == '请选择') {
      return false;
    } else {
      return true;
    }
  },
  isNumber: function (val) {
    var reg = /^([0-9]|[0-9]{2}|100)$/g;
    if (reg.test(val)) {
      return true;
    } else {
      return false;
    }
  },
  checkPlace: function (val) {
    var reg = /^[\u4E00-\u9FA5]+$/g;
    if (reg.test(val)) {
      return true;
    } else {
      return false;
    }
  },
  checkID: function (num) {
     var reg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
     var reg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    // var reg1 = /^[A-Z]{1,2}[0-9]{6}[\(|\（]?[0-9A-Z][\)|\）]?$/;//香港格式1 (香港身份证号码结构：XYabcdef(z))
    // var reg2 = /^[A-Z][0-9]{8,12}$/;//香港格式2 (H60152555)
    // var reg3 = /^[1|5|7][0-9]{6}[\(|\（]?[0-9A-Z][\)|\）]?$/;//澳门,8位数,不包含出生年月 格式为 xxxxxxx(x) 注:x全为数字,无英文字母 首位数只有1、5、7字开头的
    // var reg4 = /^[a-zA-Z][0-9]{9}$/;//台湾:10位字母和数字
    if (reg1.test(num) || reg2.test(num)) {
      return true;
    } else {
      return false;
    }
  },
  checkEmail: function (mail) {
    var reg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if (reg.test(mail)) {
      return true;
    } else {
      return false;
    }
  },
  checkTax: function (tax) {
    //var reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
    var reg = /^[A-Z0-9a-z]{4,22}$/;
    if (reg.test(tax)) {
      return true;
    } else {
      return false;
    }
  },
  checkBankNo: function (num) {
    //var reg = /^([1-9]{1})(\d{14}|\d{18})$/;
    var reg = /^[\d\s]+$/;
    if (reg.test(num)) {
      return true;
    } else {
      return false;
    }
  }
}
/*截取参数*/
function getUrlParam(name, url) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  url = url.substr(url.indexOf('?'));
  var r = url.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/*md5加密*/
function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF),
    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
* Bitwise rotate a 32-bit number to the left.
*/
function bit_rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
* These functions implement the four basic operations the algorithm uses.
*/
function md5_cmn(q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md5_ff(a, b, c, d, x, s, t) {
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
* Calculate the MD5 of an array of little-endian words, and a bit length.
*/
function binl_md5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var i, olda, oldb, oldc, oldd,
    a = 1732584193,
    b = -271733879,
    c = -1732584194,
    d = 271733878;

  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = md5_ff(a, b, c, d, x[i], 7, -680876936);
    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5_gg(b, c, d, a, x[i], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5_hh(d, a, b, c, x[i], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i], 6, -198630844);
    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return [a, b, c, d];
}

/*
* Convert an array of little-endian words to a string
*/
function binl2rstr(input) {
  var i,
    output = '';
  for (i = 0; i < input.length * 32; i += 8) {
    output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
  }
  return output;
}

/*
* Convert a raw string to an array of little-endian words
* Characters >255 have their high-byte silently ignored.
*/
function rstr2binl(input) {
  var i,
    output = [];
  output[(input.length >> 2) - 1] = undefined;
  for (i = 0; i < output.length; i += 1) {
    output[i] = 0;
  }
  for (i = 0; i < input.length * 8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
  }
  return output;
}

/*
* Calculate the MD5 of a raw string
*/
function rstr_md5(s) {
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}

/*
* Calculate the HMAC-MD5, of a key and some data (raw strings)
*/
function rstr_hmac_md5(key, data) {
  var i,
    bkey = rstr2binl(key),
    ipad = [],
    opad = [],
    hash;
  ipad[15] = opad[15] = undefined;
  if (bkey.length > 16) {
    bkey = binl_md5(bkey, key.length * 8);
  }
  for (i = 0; i < 16; i += 1) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }
  hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
}

/*
* Convert a raw string to a hex string
*/
function rstr2hex(input) {
  var hex_tab = '0123456789abcdef',
    output = '',
    x,
    i;
  for (i = 0; i < input.length; i += 1) {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F) +
      hex_tab.charAt(x & 0x0F);
  }
  return output;
}

/*
* Encode a string as utf-8
*/
function str2rstr_utf8(input) {
  return unescape(encodeURIComponent(input));
}

/*
* Take string arguments and return either raw or hex encoded strings
*/
function raw_md5(s) {
  return rstr_md5(str2rstr_utf8(s));
}
function hex_md5(s) {
  return rstr2hex(raw_md5(s));
}
function raw_hmac_md5(k, d) {
  return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
}
function hex_hmac_md5(k, d) {
  return rstr2hex(raw_hmac_md5(k, d));
}

function hexMD5(string, key, raw) {
  if (!key) {
    if (!raw) {
      return hex_md5(string);
    }
    return raw_md5(string);
  }
  if (!raw) {
    return hex_hmac_md5(key, string);
  }
  return raw_hmac_md5(key, string);
}
function get_sign(params) {
  var appsecret = "kdIbGT";  // 保存的秘钥
  var s_keys = [];
  for (var i in params) {
    s_keys.push(i);
  }
  s_keys.sort();
  var data = "";
  for (var i = 0; i < s_keys.length; i++) {
    if (params[s_keys[i]] !== '') {
      data += s_keys[i] + "=" + params[s_keys[i]] + "&";
    }
  }
  //加上秘钥
  data += "secret=" + appsecret;
  params.sign = hexMD5(data).toUpperCase();
  return params;
}

module.exports = {
  formatTime: formatTime,
  testObj: testObj,
  getUrlParam: getUrlParam,
  get_sign: get_sign,
  trim:trim
}
