###
contributors 0.1.0
(c) 2011 Nikolaus Graf, blossom
contributors may be freely distributed under the MIT license.
http://blossom.github.com/contributors/
###

@contributors =
  # GitHub HTTP API v2.
  apiRoot: 'https://github.com/api/v2/json/'

  # Stores JSONP callbacks.
  _jsonp_callbacks: []

  # Based on JSONP from from https://github.com/fitzgen/github-api/blob/master/github.js
  #
  # Send a JSONP request to the Github API that calls 'callback'
  #
  # The 'url' parameter is concatenated with the apiRoot
  # The way that we are supporting non-global, anonymous
  # functions is by sticking them in the globally exposed
  # 'contributors._jsonp_callbacks' object with a unique 'id'.
  # Once the callback is called, it is deleted from the object.
  jsonp: (url, callback) ->
    id = +new Date()
    script = document.createElement 'script'

    while @_jsonp_callbacks[id] isnt undefined
      id += Math.random() # Avoid slight possibility of id clashes.

    @_jsonp_callbacks[id] = =>
      delete @_jsonp_callbacks[id]
      callback.apply this, arguments

    url += '?callback=' + encodeURIComponent "contributors._jsonp_callbacks[#{id}]"

    script.setAttribute 'src', "#{@apiRoot}#{url}"
    document.getElementsByTagName('head')[0].appendChild script

  # runs the api call to fetch contributors
  getContributors: (user, repository, callback) ->
    @jsonp "repos/show/#{user}/#{repository}/contributors/anon", callback
    this

  # return a list entry depending on the contributor information
  generateEntry: (contributor, options) ->
    if contributor.login?
      imageSrc = "https://secure.gravatar.com/avatar/#{contributor.gravatar_id}?s=#{options.imageSize}&d=https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png"
    else
      # fallback image (octocat avatar)
      imageSrc = 'https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png'

    image = """<img src="#{imageSrc}" width="#{options.imageSize}" height="#{options.imageSize}">"""
    name = "<span>#{contributor.name or contributor.login}</span>"

    # Only generate a tag in case contributor has a profile on GitHub.
    listEntry = if contributor.login?
      "<li><a href=\"https://github.com/#{contributor.login}\">#{image}#{name}</a></li>"
    else
      "<li>#{image}#{name}</li>"
    listEntry

  # Initialize options and imageSize in case they don't exists.
  initializeOptions: (options = {}) ->
    options.imageSize ?= 30
    options

  # Placeholder can be a dom element or a string which represants an id.
  generate: (user, repository, options, callback) ->
    @getContributors user, repository, (data) =>
      options = @initializeOptions options

      # generate list as string
      if options.maxContributors?
        data.contributors = data.contributors[..options.maxContributors]
      contributorList = ['<ul>']
      for contributor in data.contributors
        contributorList.push @generateEntry contributor, options
      contributorList.push '</ul>'
      contributorList = contributorList.join ''

      # insert to placeholder in case options was provided
      if options.placeholder?
        if typeof(options.placeholder) is 'string'
          placeholder = document.getElementById options.placeholder
        else
          placeholder = options.placeholder
        placeholder.innerHTML = contributorList

      callback? contributorList
