Test.listBlock.Controller = function(cfg) {
  cfg = cfg || {};
  this.list = [];

  this.view = new this.View({el: cfg.el, ctrl: this});
};
Test.listBlock.Controller.prototype.View = Test.listBlock.View;
Test.listBlock.Controller.prototype.view = null;
Test.listBlock.Controller.prototype.fireEvent = function() {};  //TODO: move to Observer
Test.listBlock.Controller.prototype.on = function() {};  //TODO: move to Observer
Test.listBlock.Controller.prototype.list = null;
Test.listBlock.Controller.prototype.colored = 0;
Test.listBlock.Controller.prototype.selected = 0;
Test.listBlock.Controller.prototype.addBlock = function(bv) {
  bv = bv || Test.utils.generateText();
  if ( !(bv instanceof Test.block.View) ) {
    bv = new Test.block.View({text: bv, ctrl: this});
  }
  this.list.push(bv);
  this.view.el.appendChild(bv.el);
  this.fireEvent('add', bv);
};
Test.listBlock.Controller.prototype.delBlock = function(bv) {
  if ( (bv instanceof Test.block.View) ) {
    var uid = bv.el.getAttribute('uid');
    for (var i = 0; i < this.list.length; i++) {
      if ( this.list[i].el.getAttribute('uid') == uid )
        this.list.splice(i, 1);
    }
  }
  this.view.el.removeChild(bv.el);
  bv.destroy();
};
