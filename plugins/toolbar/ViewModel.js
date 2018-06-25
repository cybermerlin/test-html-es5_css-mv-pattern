Test.toolbar.ViewModel = function(cfg) {this.super.call(this, cfg);};
Test.toolbar.ViewModel.prototype.handlersMap = {
  '#add': 'addBlock'
};
Test.toolbar.ViewModel.prototype.addBlock = function() {
  this.ctrl.listBlock.addBlock();
  console.log('toolbar > addBlock');
};
Test.utils.extend(Test.toolbar.ViewModel, Test.view.Model);
