Test.block.ViewModel = function(cfg) {
  cfg = cfg || {};
  this.super.call(this, cfg);
  cfg.text && this.setText(cfg.text);
};
Test.block.ViewModel.prototype.handlersMap = {
  '.cross': 'del',
  'this': {
    'click': 'toggleSelect',
    'dblckick': 'changeColor'
  }
};
Test.block.ViewModel.prototype.del = function(e) {
  this.ctrl.delBlock(this.view);
};
Test.block.ViewModel.prototype.toggleSelect = function(e) {
  this.view.el.style.backgroundColor = this.view.el.style.backgroundColor == 'mintcream' ? 'white' : 'mintcream';
  this.fireEvent('change');
};
Test.block.ViewModel.prototype.setText = function(v) {
  if ( v instanceof Test.data.Model )
    this.view.setText(v.text);
  else
    this.view.setText(v);
  return this;
};
Test.utils.extend(Test.block.ViewModel, Test.view.Model);
