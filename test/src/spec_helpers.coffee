beforeEach ->
  @addMatchers
    elementExists: () ->
      jQuery(@actual).length>0
