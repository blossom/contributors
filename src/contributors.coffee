###
contributors 0.1.0
(c) 2011 Nikolaus Graf, blossom
contributors may be freely distributed under the MIT license.
http://blossom.github.com/contributors/
###

@contributors =

  # github http api v2
  apiRoot: 'https://github.com/api/v2/json/'


  # stores jsonp callbacks
  __jsonp_callbacks: []


  # Based on JSONP from from https://github.com/fitzgen/github-api/blob/master/github.js
  #
  # Send a JSONP request to the Github API that calls 'callback'
  #
  # The 'url' parameter is concatenated with the apiRoot
  # The way that we are supporting non-global, anonymous
  # functions is by sticking them in the globally exposed
  # 'contributors.__jsonp_callbacks' object with a unique 'id'.
  # Once the callback is called, it is deleted from the object.
  jsonp: (url, callback) ->
    id = +new Date()
    script = document.createElement 'script'

    while @__jsonp_callbacks[id] isnt undefined
      id += Math.random() # Avoid slight possibility of id clashes.

    @__jsonp_callbacks[id] = =>
      delete @__jsonp_callbacks[id]
      callback.apply @, arguments

    url += '?callback=' + encodeURIComponent "contributors.__jsonp_callbacks[#{id}]"

    script.setAttribute 'src', "#{@apiRoot}#{url}"
    document.getElementsByTagName('head')[0].appendChild script


  # runs the api call to fetch contributors
  getContributors: (user, repository, callback) ->
    @jsonp "repos/show/#{user}/#{repository}/contributors/anon", callback
    return @

  # return a list entry depending on the contributor information
  generateEntry: (contributor, options) ->

    if contributor.login?
      imageSrc = "https://secure.gravatar.com/avatar/#{contributor.gravatar_id}?s=#{options.imageSize}&d=https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png"
    else
      # fallback image (octocat avatar)
      imageSrc = 'https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png'

    image = "<img src=\"#{imageSrc}\" width=\"#{options.imageSize}\" height=\"#{options.imageSize}\">"
    name = "<span>#{contributor.name or contributor.login}</span>"

    # only generate a tag in case contributor has a profile on github
    if contributor.login?
      listEntry = "<li><a href=\"https://github.com/#{contributor.login}\">#{image}#{name}</a></li>"
    else
      listEntry = "<li>#{image}#{name}</li>"

    listEntry


  # initialize options and imageSize in case they don't exists
  initializeOptions: (options) ->
      options ?= {}
      options.imageSize = options.imageSize or 30
      options.placeholder = options.placeholder
      options


  # placeholder can be a dom element or a string which represants an id
  generate: (user, repository, options, callback) ->
    @getContributors user, repository, (data) =>
      options = @initializeOptions options

      # generate list as string
      contributorList = ['<ul>']
      for contributor in data.contributors
        entry = @generateEntry contributor, options
        contributorList.push entry
      contributorList.push '</ul>'
      contributorList = contributorList.join('')

      # insert to placeholder in case options was provided
      if options.placeholder?
        if typeof(options.placeholder) is 'string'
          placeholder = document.getElementById(options.placeholder)
        else
          placeholder = options.placeholder
        placeholder.innerHTML = contributorList

      callback(contributorList) if callback? and typeof(callback) is 'function'
