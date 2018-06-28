if ( !String.prototype.format )
  Object.defineProperty(String.prototype, 'format', {
    value: function(values) {
      var a = arguments;
      return this.replace(/\{(\d+)\}/g, function(m, i) {
        return a[i];
      });
    }
  });
if ( !Array.prototype.indexOfKey )
  Object.defineProperty(Array.prototype, 'indexOfKey', {
    value: function(key, val, from) {
      var len = this.length;
      from = Number(arguments[2]) || 0;
      from = (from < 0)
          ? Math.ceil(from)
          : Math.floor(from);
      if ( from < 0 ) from += len;

      for (; from < len; from++) {
        try {
          if ( key in this[from] ) {
            if ( this[from][key] === val ) return from;
            if ( typeof (this[from][key]) === 'number' || typeof (val) === 'number' )
              if ( parseInt(val) === parseInt(this[from][key]) )
                return from;
          }
        } catch (e) {}
      }
      return -1;
    }
  });
