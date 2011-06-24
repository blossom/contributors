(function() {
  /*
  contributors 0.1.0
  (c) 2011 Nikolaus Graf, blossom
  contributors may be freely distributed under the MIT license.
  http://blossom.github.com/contributors/
  */  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.contributors = {
    apiRoot: 'https://github.com/api/v2/json/',
    __jsonp_callbacks: [],
    jsonp: function(url, callback) {
      var id, script;
      id = +new Date();
      script = document.createElement('script');
      while (this.__jsonp_callbacks[id] !== void 0) {
        id += Math.random();
      }
      this.__jsonp_callbacks[id] = __bind(function() {
        delete this.__jsonp_callbacks[id];
        return callback.apply(this, arguments);
      }, this);
      url += '?callback=' + encodeURIComponent("contributors.__jsonp_callbacks[" + id + "]");
      script.setAttribute('src', "" + this.apiRoot + url);
      return document.getElementsByTagName('head')[0].appendChild(script);
    },
    getContributors: function(user, repository, callback) {
      this.jsonp("repos/show/" + user + "/" + repository + "/contributors/anon", callback);
      return this;
    },
    generateEntry: function(contributor, options) {
      var image, imageSrc, listEntry, name;
      if (contributor.login != null) {
        imageSrc = "https://secure.gravatar.com/avatar/" + contributor.gravatar_id + "?s=" + options.imageSize + "&d=https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png";
      } else {
        imageSrc = 'https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png';
      }
      image = "<img src=\"" + imageSrc + "\" width=\"" + options.imageSize + "\" height=\"" + options.imageSize + "\">";
      name = "<span>" + (contributor.name || contributor.login) + "</span>";
      if (contributor.login != null) {
        listEntry = "<li><a href=\"https://github.com/" + contributor.login + "\">" + image + name + "</a></li>";
      } else {
        listEntry = "<li>" + image + name + "</li>";
      }
      return listEntry;
    },
    initializeOptions: function(options) {
            if (options != null) {
        options;
      } else {
        options = {};
      };
      options.imageSize = options.imageSize || 30;
      options.placeholder = options.placeholder;
      return options;
    },
    generate: function(user, repository, options, callback) {
      return this.getContributors(user, repository, __bind(function(data) {
        var contributor, contributorList, entry, placeholder, _i, _len, _ref;
        options = this.initializeOptions(options);
        contributorList = ['<ul>'];
        _ref = data.contributors;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          contributor = _ref[_i];
          entry = this.generateEntry(contributor, options);
          contributorList.push(entry);
        }
        contributorList.push('</ul>');
        contributorList = contributorList.join('');
        if (options.placeholder != null) {
          if (typeof options.placeholder === 'string') {
            placeholder = document.getElementById(options.placeholder);
          } else {
            placeholder = options.placeholder;
          }
          placeholder.innerHTML = contributorList;
        }
        if ((callback != null) && typeof callback === 'function') {
          return callback(contributorList);
        }
      }, this));
    }
  };
}).call(this);
