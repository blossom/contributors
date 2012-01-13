
/*
contributors 0.1.0
(c) 2011 Nikolaus Graf, blossom
contributors may be freely distributed under the MIT license.
http://blossom.github.com/contributors/
*/

(function() {

  this.contributors = {
    apiRoot: 'https://github.com/api/v2/json/',
    _jsonp_callbacks: [],
    jsonp: function(url, callback) {
      var id, script,
        _this = this;
      id = +new Date();
      script = document.createElement('script');
      while (this._jsonp_callbacks[id] !== void 0) {
        id += Math.random();
      }
      this._jsonp_callbacks[id] = function() {
        delete _this._jsonp_callbacks[id];
        return callback.apply(_this, arguments);
      };
      url += '?callback=' + encodeURIComponent("contributors._jsonp_callbacks[" + id + "]");
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
      listEntry = contributor.login != null ? "<li><a href=\"https://github.com/" + contributor.login + "\">" + image + name + "</a></li>" : "<li>" + image + name + "</li>";
      return listEntry;
    },
    initializeOptions: function(options) {
      if (options == null) options = {};
      if (options.imageSize == null) options.imageSize = 30;
      return options;
    },
    generate: function(user, repository, options, callback) {
      var _this = this;
      return this.getContributors(user, repository, function(data) {
        var contributor, contributorList, placeholder, _i, _len, _ref;
        options = _this.initializeOptions(options);
        if (options.maxContributors != null) {
          data.contributors = data.contributors.slice(0, options.maxContributors + 1 || 9e9);
        }
        contributorList = ['<ul>'];
        _ref = data.contributors;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          contributor = _ref[_i];
          contributorList.push(_this.generateEntry(contributor, options));
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
        return typeof callback === "function" ? callback(contributorList) : void 0;
      });
    }
  };

}).call(this);
