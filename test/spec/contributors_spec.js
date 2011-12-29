(function() {

  describe('when generating a list entry with a github contributor', function() {
    var entry;
    entry = {};
    beforeEach(function() {
      var user;
      user = {
        contributions: 10,
        gravatar_id: '7111722195d87231c263add622a583b6',
        login: 'nikgraf',
        name: 'Nik Graf',
        type: 'User'
      };
      return entry = contributors.generateEntry(user, {
        imageSize: 60
      });
    });
    it('should contain a valid link', function() {
      var link;
      link = $(entry).find('a');
      expect(link).elementExists();
      return expect(link.attr('href')).toEqual('https://github.com/nikgraf');
    });
    it('should contain an image', function() {
      var image;
      image = $(entry).find('img');
      expect(image).elementExists();
      expect(image.attr('src')).toEqual('https://secure.gravatar.com/avatar/7111722195d87231c263add622a583b6?s=60&d=https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png');
      expect(image.attr('width')).toEqual('60');
      return expect(image.attr('height')).toEqual('60');
    });
    it('should contain a name', function() {
      var span;
      span = $(entry).find('span');
      expect(span).elementExists();
      return expect(span.html()).toEqual('Nik Graf');
    });
    return describe('without a name', function() {
      beforeEach(function() {
        var user;
        user = {
          contributions: 10,
          gravatar_id: '7111722195d87231c263add622a583b6',
          login: 'nikgraf',
          type: 'User'
        };
        return entry = contributors.generateEntry(user, {
          imageSize: 60
        });
      });
      return it('should fallback to login', function() {
        var span;
        span = $(entry).find('span');
        expect(span).elementExists();
        return expect(span.html()).toEqual('nikgraf');
      });
    });
  });

  describe('when generating a list entry with a non-github contributor', function() {
    var entry;
    entry = {};
    beforeEach(function() {
      var user;
      user = {
        contributions: 1,
        name: 'Max Moritz'
      };
      return entry = contributors.generateEntry(user, {
        imageSize: 60
      });
    });
    it('should contain the github default image', function() {
      var image;
      image = $(entry).find('img');
      expect(image).elementExists();
      expect(image.attr('src')).toEqual('https://d3nwyuy0nl342s.cloudfront.net/images/gravatars/gravatar-140.png');
      expect(image.attr('width')).toEqual('60');
      return expect(image.attr('height')).toEqual('60');
    });
    return it('should contain a name', function() {
      var span;
      span = $(entry).find('span');
      expect(span).elementExists();
      return expect(span.html()).toEqual('Max Moritz');
    });
  });

  describe('when fetching repositories contributors', function() {
    return it('should call jsonp with the correct parameters', function() {
      var callback;
      spyOn(contributors, 'jsonp');
      callback = function() {
        return console.log('callback called');
      };
      contributors.getContributors('brunch', 'brunch', callback);
      return expect(contributors.jsonp).toHaveBeenCalledWith('repos/show/brunch/brunch/contributors/anon', callback);
    });
  });

  describe('when generating a contributorList', function() {
    it('should call getContributors with the correct parameters', function() {
      spyOn(contributors, 'getContributors');
      contributors.generate('brunch', 'brunch');
      return expect(contributors.getContributors).toHaveBeenCalled();
    });
    return describe('when callback is called', function() {
      it('should return insert the list in case an id string was provided', function() {
        return runs(function() {
          contributors.jsonp = function(url, callback) {
            return callback({
              contributors: []
            });
          };
          return contributors.generate('brunch', 'brunch', {
            placeholder: 'placeholder'
          }, function(contributorList) {
            return this.expect($('#placeholder')[0].firstChild.nodeName).toEqual('UL');
          });
        });
      });
      it('should return insert the list in case a domElement was provided', function() {
        return runs(function() {
          var placeholder;
          contributors.jsonp = function(url, callback) {
            return callback({
              contributors: []
            });
          };
          placeholder = $('#placeholder')[0];
          return contributors.generate('brunch', 'brunch', {
            placeholder: placeholder
          }, function(contributorList) {
            return this.expect(placeholder.firstChild.nodeName).toEqual('UL');
          });
        });
      });
      it('should provide the list as paramter in the callback', function() {
        return runs(function() {
          contributors.jsonp = function(url, callback) {
            return callback({
              contributors: []
            });
          };
          return contributors.generate('brunch', 'brunch', {}, function(contributorList) {
            return this.expect(contributorList).toEqual('<ul></ul>');
          });
        });
      });
      return afterEach(function() {
        return $('#placeholder').html('');
      });
    });
  });

  describe('when initializing options', function() {
    describe('without imageSize', function() {
      var options;
      options = contributors.initializeOptions(void 0);
      return it('should set a default imageSize', function() {
        return expect(options.imageSize).toEqual(30);
      });
    });
    return describe('with imageSize', function() {
      var options;
      options = contributors.initializeOptions({
        imageSize: 60
      });
      return it('should set a default imageSize', function() {
        return expect(options.imageSize).toEqual(60);
      });
    });
  });

}).call(this);
