Test.listBlock.View = function(cfg) {
  cfg = cfg || {};

  if ( !cfg.el ) {
    var block = document.createElement('ARTICLE');
    block.innerHTML = this.tpl;
    cfg.el = block;
  }

  this.super.call(this, cfg);
};
Test.listBlock.View.prototype.tpl = '';
Test.listBlock.View.prototype.viewModel = null;
Test.listBlock.View.prototype.ViewModel = null;
Test.utils.extend(Test.listBlock.View, Test.view.View);
