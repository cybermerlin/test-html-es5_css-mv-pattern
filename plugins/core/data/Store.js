Test.data.Store = function(cfg) {
  cfg = cfg || {};
  this.Model = cfg.Model || this.Model;
};
Test.data.Store.prototype.Model = Test.data.Model;
Test.data.Store.prototype.add = function(v) {this.data.push(new this.Model(v));};
