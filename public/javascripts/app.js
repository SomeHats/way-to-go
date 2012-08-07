(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"app": function(exports, require, module) {
  var App,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App = (function(_super) {

    __extends(App, _super);

    function App() {
      return App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.error = function(error) {
      return alert("Error: " + error);
    };

    return App;

  })(Backbone.View);

  module.exports = new App;
  
}});

window.require.define({"application": function(exports, require, module) {
  var Application;

  Application = (function() {

    function Application() {}

    Application.prototype.init = function() {
      var _this;
      $('[href=#]').on('click', function() {});
      _this = this;
      $(window).on('hashchange', function() {
        if (window.location.hash === '#rate') {
          return _this.rate();
        }
      });
      $(window).trigger('hashchange');
      if (navigator.geolocation) {
        return this.geo = navigator.geolocation;
      } else {
        return this.geo = false;
      }
    };

    Application.prototype.rate = function() {
      if (this.geo) {
        return this.geo.getCurrentPosition(this.rateGeo, this.rateNoGeo);
      } else {
        return this.rateNoGeo();
      }
    };

    Application.prototype.rateGeo = function(pos) {
      return alert('GEO!');
    };

    Application.prototype.rateNoGeo = function() {
      return alert('No geo :(');
    };

    Application.prototype.geo = false;

    return Application;

  })();

  module.exports = new Application;
  
}});

window.require.define({"checkin": function(exports, require, module) {
  var Checkin, template;

  template = require('views/templates/checkin');

  Checkin = (function() {

    function Checkin() {}

    Checkin.prototype.start = function() {
      return this.render();
    };

    Checkin.prototype.render = function() {
      return $('#main').html(template());
    };

    return Checkin;

  })();

  module.exports = new Checkin;
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var App;

  App = require('application');

  $(document).on('ready', function() {
    return App.init();
  });
  
}});

window.require.define({"routes": function(exports, require, module) {
  var App, Router,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App = require('app');

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      "": "reset",
      ":search": "search"
    };

    Router.prototype.search = function(term) {
      App.search.set('term', decodeURIComponent(term));
      return App.search.go();
    };

    Router.prototype.reset = function() {
      if (App.search.get('results')) {
        return App.search.cancel();
      }
    };

    return Router;

  })(Backbone.Router);
  
}});

window.require.define({"views/templates/checkin": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h2>Check in</h2>\n";});
}});

window.require.define({"views/templates/header": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h1>Way to Go</h1>\n";});
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<a href=\"#checkin\">Check In</a>\n";});
}});

