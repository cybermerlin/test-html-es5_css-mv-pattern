Test.view.View = function(cfg) {
  cfg = cfg || {};

  this.tpl = cfg.tpl || this.tpl;

  if ( cfg.el ) this.el = cfg.el;
  if ( this.el ) {
    this.el.setAttribute('uid', Test.utils.uuid(6));
    this.el.cls = this;
  }

  cfg.container && cfg.container.appendChild(this.el);

  this.ViewModel && !this.viewModel && (
      this.viewModel = new this.ViewModel(
          Test.utils.applyIf(
              cfg.ViewModel,
              {
                ctrl: cfg.ctrl || null,
                view: this
              })
      )
  );
};
Test.view.View.prototype.el = null;
Test.view.View.prototype.tpl = '';
Test.view.View.prototype.viewModel = null;
Test.view.View.prototype.ViewModel = null;
Test.view.View.prototype.destroy = function() {
  this.destructor();
};
Test.view.View.prototype.destructor = function() {
  this.viewModel && this.viewModel.destroy();
};
