Test.view.Model = function(cfg) {
  cfg = cfg || {};

  cfg.view && (this.view = cfg.view);
  cfg.ctrl && (this.ctrl = cfg.ctrl);

  var self = this;

  function link(query, event, handler, el) {
    Test.utils.EventManager.on(
        event,
        handler.bind(self),
        query === 'this'
            ? el
            : (el || document).querySelector(query),
        self
    );
  }

  for (var io in this.handlersMap)
    if ( this.handlersMap.hasOwnProperty(io) ) {
      var event = 'click';
      if ( typeof this.handlersMap[io] === 'object' ) {
        for (var ioe in this.handlersMap[io])
          if ( this.handlersMap[io].hasOwnProperty(ioe)
              && this[this.handlersMap[io][ioe]] ) {
            event = ioe || event;
            link(io, event, this[this.handlersMap[io][ioe]], this.view.el);
          }
      }
      else if ( this[this.handlersMap[io]] )
        link(io, event, this[this.handlersMap[io]], this.view.el);
    }
};
Test.view.Model.prototype.destroy = function() {
  this.destructor();
};
Test.view.Model.prototype.destructor = function() {
  var event = 'click';
  for (var io in this.handlersMap) {
    //TODO: recursive if multievent|multiaction on one element
    if ( !this.handlersMap.hasOwnProperty(io) ) continue;
    Test.utils.EventManager.off(
        event,
        this[this.handlersMap[io]],
        document.querySelector(io));
  }
};
Test.view.Model.prototype.fireEvent = function() {}; //TODO: move to Test.utils.Observer
Test.view.Model.prototype.handlersMap = null;
Test.view.Model.prototype.view = null;
Test.view.Model.prototype.ctrl = null;
