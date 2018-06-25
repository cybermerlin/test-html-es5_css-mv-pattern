/**
 * @class Test.utils.EventManager
 * @singleton
 */
Test.utils.EventManager = {
  list: [],
  find: function(event, handler, target, recParent) {
    recParent = recParent !== false;
    var result = [];

    function run(el, elFromL) {
      if ( el.parentNode && elFromL !== el )
        return run(el.parentNode, elFromL);
      else
        return elFromL === el;
    }

    for (var i = 0; i < this.list.length; i++) {
      var match = this.list[i].event === event;
      handler && (match &= this.list[i].handler === handler);
      if ( target ) {
        if ( recParent )
          match &= run(target, this.list[i].target);
        else
          match &= this.list[i].target === target;
      }

      if ( match ) {
        result.push(this.list[i]);
      }
    }

    return result;
  },

  /**
   *
   * @param {HTMLElementEventMap} event
   * @param {Function} handler
   * @param {HTMLElement} target
   * @param {Object|Test.view.Model} cls
   */
  on: function(event, handler, target, cls) {
    var
        id = Test.utils.uuid(6),
        self = this
    ;
    if ( this.list.indexOfKey('event', event) == -1 ) {
      document.body.addEventListener(event, function(e) {
        var list = self.find(e.type, null, e.target);
        for (var io in list)
          if ( list.hasOwnProperty(io) )
            list[io].handler.apply(list[io].cls, arguments);

        // if (e.target === target)
        //   handler.apply(self, arguments);
        // else {
        e.preventDefault();
        e.stopPropagation();
        // }
      });
    }

    this.list.push({
      id: id,
      target: target,
      event: event,
      handler: handler,
      cls: cls
    });
  },

  off: function(event, handler, target) {
    var list = this.find(event, handler, target);

    for (var i = 0; i < list.length; i++) {
      var itl = this.list.indexOfKey('id', list[i].id);
      this.list.splice(itl, 1);
    }
  }
};
