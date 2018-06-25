Test.data.Model = function(v) {
  for (var io in v) {
    if ( v.hasOwnProperty(io) && this.hasOwnProperty(io) ) this[io] = v[io];
  }
};
