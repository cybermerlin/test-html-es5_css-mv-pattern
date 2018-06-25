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
    var self = this;
    this.toolbar = new Test.toolbar.View({
      el: document.getElementById('toolbar'),
      ctrl: this
    });
    this.statusbar = new Test.status.Controller({el: document.getElementById('status')});
    this.listBlock = new Test.listBlock.Controller({el: document.querySelector('article')});
    this.listBlock.on('change', function(bv) {
      self.statusbar.setColored(this.colored);
      self.statusbar.setSelected(this.selected);
    });
    this.listBlock.on('add', function(bv) {
      self.statusbar.setCount(this.list.length);
    });
    this.title = 'Another test';
  }

  return new Application();
};


//region namespaces
Test.toolbar = {};
Test.status = {};
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
