(function() {
  "use strict";


  var test = new Test();
  test.listBlock.addBlock();
  test.listBlock.addBlock('as5df');
  Array.from(Array(Math.floor(Math.random() * 20)))
      .forEach(function() {
        test.listBlock.addBlock();
      });
})();
