(function() {
  "use strict";

//region extend standart n global things
  if ( !String.prototype.format )
    String.prototype.format = function(values) {
      var a = arguments;
      return this.replace(/\{(\d+)\}/g, function(m, i) {
        return a[i];
      });
    };
  if ( !Array.prototype.indexOfKey )
    Array.prototype.indexOfKey = function(key, val, from) {
      var len = this.length;
      from = Number(arguments[2]) || 0;
      from = (from < 0)
          ? Math.ceil(from)
          : Math.floor(from);
      if ( from < 0 ) from += len;

      for (; from < len; from++) {
        try {
          if ( key in this[from] ) {
            if ( this[from][key] === val ) return from;
            if ( typeof (this[from][key]) === 'number' || typeof (val) === 'number' )
              if ( parseInt(val) === parseInt(this[from][key]) )
                return from;
          }
        } catch (e) {}
      }
      return -1;
    };
//endregion


  /**
   * this framework developed as MVC+MVVW.
   * What is it? That's means u may use :
   * - Controller - business logic
   * - View       - just only view (I mean something like HTML)
   * - ViewModel  - that's event mapper. It link html elements with methods (which use methods from the Controller) from
   *                  this class (user actions)
   * - Store      - storage for data of list
   * - DataModel  - data(row) structure
   *
   * new Test() --> new Controller() --> new View() --> new ViewModel
   *                                |--> new ViewModel()   // this case using if a View is exists (mb simple HTML, or
   *                                                            some framework created it like
   *                                                            angular[directive|component]
   *                                |--> new Store()
   *                                |--> new DataModel()  // for single data row, like current User
   *
   * Controller - just business logic (methods for calculation something OR executing something like Task OR working
   *                with data n syncing it to the server
   * View - only for visualise element
   * ViewModel - only user actions n services functions for modify View
   * DataModel - structure of data and low-level simple methods like save|delete|add|load
   * Store - list of the DataModel rows
   *
   * @return Application
   * @namespace Test
   * @constructor
   */
  var Test = function() {
    function Application() {
      this.toolbar = new Test.toolbar.View({
        el: document.getElementById('toolbar'),
        ctrl: this
      });
      this.listBlock = new Test.listBlock.Controller();
      this.title = 'Another test';
    }

    return new Application();
  };


//region namespaces
  Test.toolbar = {};
  Test.view = {};
  Test.data = {};
  Test.block = {
    data: {},
    extended: {}
  };
  Test.listBlock = {
    data: {}
  };
  Test.utils = {};
//endregion


//region base classes
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
  Test.view.Model.prototype.handlersMap = null;
  Test.view.Model.prototype.view = null;
  Test.view.Model.prototype.ctrl = null;

  Test.data.Store = function(cfg) {
    cfg = cfg || {};
    this.Model = cfg.Model || this.Model;
  };
  Test.data.Store.prototype.Model = Test.data.Model;
  Test.data.Store.prototype.add = function(v) {this.data.push(new this.Model(v));};

  Test.data.Model = function(v) {
    for (var io in v) {
      if ( v.hasOwnProperty(io) && this.hasOwnProperty(io) ) this[io] = v[io];
    }
  };

  Test.utils.applyIf = function(to, from, clone) {
    clone = clone || false;
    to = to || {};
    from = from || {};

    var result = to; //TODO: clone ? (clone||Object.assign)(to) : to;

    for (var io in from) {
      if ( !from.hasOwnProperty(io) || result[io] ) continue;
      result[io] = from[io];
    }

    return result;
  };
  Test.utils.extend = function(a, b) {
    for (var io in b.prototype) {
      if ( !b.prototype.hasOwnProperty(io) ) continue;
      if ( (typeof b.prototype[io] === 'object') && !!a.prototype[io] && (b.prototype[io] !== null) )
        for (var ioo in b.prototype[io])
          if ( b.prototype[io].hasOwnProperty(ioo) && !a.prototype[io][ioo] )
            a.prototype[io][ioo] = b.prototype[io][ioo];
      if ( !a.prototype[io] && (b.prototype[io] !== null) ) a.prototype[io] = b.prototype[io];
    }
    a.prototype.super = b;
  };
  Test.utils.generateText = function() {
    return 'random: ' + Math.random().toFixed(4);
  };
  Test.utils.uuid = function(len, radix) {
    len = (len || 36);
    radix = radix || 10;

    try {
      return (new ActiveXObject("Scriptlet.TypeLib").GUID.substr(1, len));

    } catch (e) {
      // Private array of chars to use
      var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

      var chars = CHARS, uuid = [], rnd = Math.random;
      radix = radix || chars.length;

      if ( len != 36 ) {
        // Compact form
        for (var i = 0; i < len; i++)
          uuid[i] = chars[0 | rnd() * radix];
      } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (var i = 0; i < 36; i++) {
          if ( !uuid[i] ) {
            r = 0 | rnd() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
          }
        }
      }

      return uuid.join('');
    }
  };
//endregion


//region Product
  Test.toolbar.ViewModel = function(cfg) {this.super.call(this, cfg);};
  Test.toolbar.ViewModel.prototype.handlersMap = {
    '#add': 'addBlock'
  };
  Test.toolbar.ViewModel.prototype.addBlock = function() {
    this.ctrl.listBlock.addBlock();
    console.log('toolbar > addBlock');
  };
  Test.utils.extend(Test.toolbar.ViewModel, Test.view.Model);

  Test.toolbar.View = function(cfg) {this.super.call(this, cfg);};
  Test.toolbar.View.prototype.ViewModel = Test.toolbar.ViewModel;
  Test.utils.extend(Test.toolbar.View, Test.view.View);

  Test.listBlock.Store = function(cfg) {
    this.super.call(this, cfg);
  };
  Test.utils.extend(Test.listBlock.Store, Test.data.Store);

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

  Test.listBlock.Controller = function(cfg) {
    cfg = cfg || {};
    this.list = [];

    this.view = new this.View({container: document.body, ctrl: this});
  };
  Test.listBlock.Controller.prototype.View = Test.listBlock.View;
  Test.listBlock.Controller.prototype.view = null;
  Test.listBlock.Controller.prototype.list = null;
  Test.listBlock.Controller.prototype.addBlock = function(bv) {
    bv = bv || Test.utils.generateText();
    if ( !(bv instanceof Test.block.View) ) {
      bv = new Test.block.View({text: bv, ctrl: this});
    }
    this.list.push(bv);
    this.view.el.appendChild(bv.el);
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

  Test.block.data.Model = function() {};
  Test.utils.extend(Test.block.data.Model, Test.data.Model);

  Test.listBlock.data.Store = function(cfg) {this.super.call(this, cfg);};
  Test.listBlock.data.Store.prototype.Model = Test.block.data.Model;
  Test.utils.extend(Test.listBlock.data.Store, Test.data.Store);

  Test.block.ViewModel = function(cfg) {
    cfg = cfg || {};
    this.super.call(this, cfg);
    cfg.text && this.setText(cfg.text);
  };
  Test.block.ViewModel.prototype.handlersMap = {
    'this': 'toggleSelect',
    '.cross': 'del'
  };
  Test.block.ViewModel.prototype.del = function(e) {
    this.ctrl.delBlock(this.view);
  };
  Test.block.ViewModel.prototype.toggleSelect = function(e) {
    this.view.el.style.backgroundColor = this.view.el.style.backgroundColor == 'mintcream' ? 'white' : 'mintcream';
  };
  Test.block.ViewModel.prototype.setText = function(v) {
    if ( v instanceof Test.data.Model )
      this.view.setText(v.text);
    else
      this.view.setText(v);
    return this;
  };
  Test.utils.extend(Test.block.ViewModel, Test.view.Model);

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

  Test.block.extended.ViewModel = function(cfg) {this.super.call(this, cfg);};
  Test.block.extended.ViewModel.prototype.changeColor = function() {};
  Test.block.extended.ViewModel.prototype.handlersMap = {
    'this': {
      dblclick: 'changeColor'
    }
  };
  Test.utils.extend(Test.block.extended.ViewModel, Test.block.ViewModel);
//endregion


  var test = new Test();
  test.listBlock.addBlock();
  test.listBlock.addBlock('as5df');
  Array.from(Array(Math.floor(Math.random() * 20)))
      .forEach(function() {
        test.listBlock.addBlock();
      });
})();
