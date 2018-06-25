/**
 * section with text and cross-button for close
 * @param cfg
 * @constructor
 */
Test.block.View = function(cfg) {
  cfg = cfg || {};

  if ( !cfg.el ) {
    var block = document.createElement('SECTION');
    block.innerHTML = this.tpl;
    cfg.el = block;
  }

  cfg.ViewModel = {
    view: this,
    ctrl: cfg.ctrl || null,
    text: cfg.text
  };

  this.super.call(this, cfg);
};
/**
 * @property {HTMLElement} el
 */
Test.block.View.prototype.el = null;
Test.block.View.prototype.tpl = '<div class="content scroll-y">{0}</div><button class="cross float-r">X</button>';
Test.block.View.prototype.ViewModel = Test.block.ViewModel;
Test.block.View.prototype.setText = function(v) {
  this.el.firstChild.innerHTML = this.el.firstChild.innerHTML.format(v);
  this.el.style.width;
  return this;
};
Test.utils.extend(Test.block.View, Test.view.View);
