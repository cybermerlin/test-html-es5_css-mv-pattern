Test.utils.applyIf = function(to, from, clone) {
  clone = clone || false;
  to = to || {};
  from = from || {};

  var result = to; //TODO: clone ? (clone||Object.assign)(to) : to;

  for (var io in from) {
    if ( !from.hasOwnProperty(io) || result[io] ) continue;
    result[io] = from[io];
  }

  return result;
};
Test.utils.extend = function(a, b) {
  for (var io in b.prototype) {
    if ( !b.prototype.hasOwnProperty(io) ) continue;
    if ( (typeof b.prototype[io] === 'object') && !!a.prototype[io] && (b.prototype[io] !== null) )
      for (var ioo in b.prototype[io])
        if ( b.prototype[io].hasOwnProperty(ioo) && !a.prototype[io][ioo] )
          a.prototype[io][ioo] = b.prototype[io][ioo];
    if ( !a.prototype[io] && (b.prototype[io] !== null) ) a.prototype[io] = b.prototype[io];
  }
  a.prototype.super = b;
};
Test.utils.generateText = function() {
  return 'random: ' + Math.random().toFixed(4);
};
Test.utils.uuid = function(len, radix) {
  len = (len || 36);
  radix = radix || 10;

  try {
    return (new ActiveXObject("Scriptlet.TypeLib").GUID.substr(1, len));

  } catch (e) {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    var chars = CHARS, uuid = [], rnd = Math.random;
    radix = radix || chars.length;

    if ( len != 36 ) {
      // Compact form
      for (var i = 0; i < len; i++)
        uuid[i] = chars[0 | rnd() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if ( !uuid[i] ) {
          r = 0 | rnd() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
        }
      }
    }

    return uuid.join('');
  }
};
