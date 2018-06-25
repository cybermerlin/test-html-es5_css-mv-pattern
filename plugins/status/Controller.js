Test.status.Controller = function(cfg) {
  cfg = cfg || {};
  this.view = {
    el: cfg.el,
    count: cfg.el.querySelector('#count'),
    selected: cfg.el.querySelector('#selected'),
    colored: cfg.el.querySelector('#colored')
  };
};
Test.status.Controller.prototype.setCount = function(v) {
  this.view.count.innerText = v;
};
Test.status.Controller.prototype.setSelected = function(v) {
  this.view.selected.innerText = v;
};
Test.status.Controller.prototype.setColored = function(v) {
  this.view.colored.innerText = v[0] + '/' + v[1];
};
