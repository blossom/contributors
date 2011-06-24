describe 'when generating a list entry with a github contributor', ->

  entry = {}

  beforeEach ->
    user =
      contributions: 10
      gravatar_id: '7111722195d87231c263add622a583b6'
      login: 'nikgraf'
      name: 'Nik Graf'
      type: 'User'

    entry = contributors.generateEntry user, { imageSize: 60 }

  it 'should contain a valid link', ->

    link = $(entry).find('a')
    expect(link).elementExists()
    expect(link.attr('href')).toEqual('https://github.com/nikgraf')

  it 'should contain an image', ->

    image = $(entry).find('img')
    expect(image).elementExists()
    expect(image.attr('src')).toEqual('https://secure.gravatar.com/avatar/7111722195d87231c263add622a583b6?s=60&d=https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png')
    expect(image.attr('width')).toEqual('60')
    expect(image.attr('height')).toEqual('60')

  it 'should contain a name', ->

    span = $(entry).find('span')
    expect(span).elementExists()
    expect(span.html()).toEqual('Nik Graf')

  describe 'without a name', ->

    beforeEach ->
      user =
        contributions: 10
        gravatar_id: '7111722195d87231c263add622a583b6'
        login: 'nikgraf'
        type: 'User'

      entry = contributors.generateEntry user, { imageSize: 60 }

    it 'should fallback to login', ->

      span = $(entry).find('span')
      expect(span).elementExists()
      expect(span.html()).toEqual('nikgraf')

describe 'when generating a list entry with a non-github contributor', ->

  entry = {}

  beforeEach ->
    user =
      contributions: 1
      name:	'Max Moritz'

    entry = contributors.generateEntry user, { imageSize: 60 }

  it 'should contain the github default image', ->

    image = $(entry).find('img')
    expect(image).elementExists()
    expect(image.attr('src')).toEqual('https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png')
    expect(image.attr('width')).toEqual('60')
    expect(image.attr('height')).toEqual('60')

  it 'should contain a name', ->

    span = $(entry).find('span')
    expect(span).elementExists()
    expect(span.html()).toEqual('Max Moritz')

describe 'when fetching repositories contributors', ->

  it 'should call jsonp with the correct parameters', ->

    spyOn contributors, 'jsonp'
    callback = -> console.log 'callback called'
    contributors.getContributors 'brunch', 'brunch', callback

    expect(contributors.jsonp).toHaveBeenCalledWith('repos/show/brunch/brunch/contributors/anon', callback)

describe 'when generating a contributorList', ->

  it 'should call getContributors with the correct parameters', ->

    spyOn contributors, 'getContributors'
    contributors.generate 'brunch', 'brunch'

    expect(contributors.getContributors).toHaveBeenCalled()

  describe 'when callback is called', ->

    it 'should return insert the list in case an id string was provided', ->
      runs ->
        contributors.jsonp = (url, callback) ->
          callback { contributors: [] }
        contributors.generate 'brunch', 'brunch', { placeholder: 'placeholder' }, (contributorList) ->
          @expect($('#placeholder')[0].firstChild.nodeName).toEqual('UL')

    it 'should return insert the list in case a domElement was provided', ->
      runs ->
        contributors.jsonp = (url, callback) ->
          callback { contributors: [] }
        placeholder = $('#placeholder')[0]
        contributors.generate 'brunch', 'brunch', { placeholder: placeholder }, (contributorList) ->
          @expect(placeholder.firstChild.nodeName).toEqual('UL')

    it 'should provide the list as paramter in the callback', ->
      runs ->
        contributors.jsonp = (url, callback) ->
          callback { contributors: [] }
        contributors.generate 'brunch', 'brunch', {}, (contributorList) ->
          @expect(contributorList).toEqual('<ul></ul>')

    afterEach ->
      $('#placeholder').html('')

describe 'when initializing options', ->

  describe 'without imageSize', ->

    options = contributors.initializeOptions(undefined)

    it 'should set a default imageSize', ->

      expect(options.imageSize).toEqual(30)

  describe 'with imageSize', ->

    options = contributors.initializeOptions { imageSize: 60 }

    it 'should set a default imageSize', ->

      expect(options.imageSize).toEqual(60)
