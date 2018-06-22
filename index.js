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
//endregion


  /**
   * this framework developed as MVC+MVVW.
   * What is it? That's means u may use :
   * - Controller - business logic
   * - View - just only view (I mean something like HTML)
   * - ViewModel - that's event mapper. It link html elements with methods (such use methods from Controller) from this
   * class (user actions)
   * - Store - storage for data of list
   * - DataModel - data(row) structure
   *
   * new Test() --> new Controller() --> new View() --> new ViewModel
   *                                |--> new ViewModel()   // this case using if a View is exists (mb simple HTML, or
   *                                                            it created some framework like
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
  Test.view.View = function(cfg) {
    cfg = cfg || {};

    this.tpl = cfg.tpl || this.tpl;

    if ( cfg.el ) this.el = cfg.el;

    cfg.container && cfg.container.appendChild(this.el);

    this.ViewModel && (this.viewModel = new this.ViewModel({view: this}));
  };
  Test.view.View.prototype.el = null;
  Test.view.View.prototype.tpl = '';
  Test.view.View.prototype.viewModel = null;
  Test.view.View.prototype.ViewModel = null;

  Test.view.Model = function(cfg) {
    cfg = cfg || {};

    cfg.view && (this.view = cfg.view);
    cfg.ctrl && (this.ctrl = cfg.ctrl);

    function link(query, event, handler, el) {
      if ( query === 'this' )
        el && el.addEventListener(event, handler);
      else {
        (el || document).querySelector(query).addEventListener(event, handler);
      }
    }

    for (var io in this.handlersMap)
      if ( this.handlersMap.hasOwnProperty(io) ) {
        var event = 'click';
        if ( typeof this.handlersMap[io] === 'object' ) {
          for (var ioe in this.handlersMap[io])
            if ( this.handlersMap[io].hasOwnProperty(ioe) ) {
              event = ioe || event;
              link(io, event, this[this.handlersMap[io]], this.view.el);
            }
        }
        else
          link(io, event, this[this.handlersMap[io]], this.view.el);
      }
  };
  Test.view.Model.prototype.destroy = function(){};
  Test.view.Model.prototype.destructor = function(){};
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

  Test.utils.extend = function(a, b) {
    for (var io in b.prototype) {
      if ( !b.prototype.hasOwnProperty(io) ) continue;
      if ( (typeof b.prototype[io] === 'object') && !!a.prototype[io] && (b.prototype[io] !== null) )
        for (var ioo in b.prototype[io])
          if ( b.prototype[io].hasOwnProperty(ioo) && !a.prototype[io][ioo] )
            a.prototype[io][ioo] = b.prototype[io][ioo];
      a.prototype[io] = b.prototype[io];
    }
    a.prototype.super = b;
  };
  Test.utils.generateText = function() {
    return 'random: ' + Math.random().toFixed(4);
  };
//endregion


//region Product
  Test.toolbar.ViewModel = function(cfg) {this.super.call(this, cfg);};
  Test.toolbar.ViewModel.prototype.handlersMap = {
    '#add': 'addBlock'
  };
  Test.toolbar.ViewModel.prototype.addBlock = function() {
    this.ctrl.addBlock();
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

    this.tpl = cfg.tpl || this.tpl;

    if ( cfg.el )
      this.el = cfg.el;
    else {
      var block = document.createElement('ARTICLE');
      block.innerHTML = this.tpl;
      this.el = block;
    }

    cfg.container && cfg.container.appendChild(this.el);

    this.ViewModel && (this.viewModel = new this.ViewModel({view: this}));
  };
  Test.listBlock.View.prototype.tpl = '';
  Test.listBlock.View.prototype.viewModel = null;
  Test.listBlock.View.prototype.ViewModel = null;

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
    'this': 'select'
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
    this.tpl = cfg.tpl || this.tpl;

    if ( cfg.el )
      this.el = cfg.el;
    else {
      var block = document.createElement('SECTION');
      block.innerHTML = this.tpl;
      this.el = block;
    }

    cfg.container && cfg.container.appendChild(this.el);

    this.ViewModel && (this.viewModel = new this.ViewModel({
      view: this,
      ctrl: cfg.ctrl || null,
      text: cfg.text
    }));
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
