Test.block.extended.ViewModel = function(cfg) {this.super.call(this, cfg);};
Test.block.extended.ViewModel.prototype.changeColor = function() {};
Test.block.extended.ViewModel.prototype.handlersMap = {
  'this': {
    dblclick: 'changeColor'
  }
};
Test.utils.extend(Test.block.extended.ViewModel, Test.block.ViewModel);
