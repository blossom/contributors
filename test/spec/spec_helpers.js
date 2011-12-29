(function() {

  beforeEach(function() {
    return this.addMatchers({
      elementExists: function() {
        return jQuery(this.actual).length > 0;
      }
    });
  });

}).call(this);
