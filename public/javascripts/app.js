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
  var Application, Data, Rate, RateNearby, Types;

  Data = require('data');

  Types = require('types');

  RateNearby = require('templates/rate-nearby');

  Rate = require('rate');

  Application = (function() {

    function Application() {}

    Application.prototype.init = function() {
      var _this;
      $('[href=#]').on('click', function() {});
      _this = this;
      $(window).on('hashchange', function() {
        switch (window.location.hash) {
          case '#rate':
            return _this.rate();
          case '#rate-nearby':
            if (Data.nearbyAvailable === false) {
              return $.mobile.changePage('#home');
            }
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
      $('#rate-nogeo-notice, #rate-loading-notice').addClass('hidden');
      $('#rate-geo-notice').removeClass('hidden');
      if (this.geo) {
        return this.geo.getCurrentPosition(this.rateGeo, this.rateNoGeo);
      } else {
        console.log('Geo not allowed');
        return this.rateNoGeo();
      }
    };

    Application.prototype.rateGeo = function(pos) {
      Data.waitingForGeo = true;
      $('#rate-loading-notice').removeClass('hidden');
      return $.ajax('/gm/maps/api/place/search/json', {
        data: {
          key: 'AIzaSyALj6zax-yPF5UIfk77oOH4thM3BeEesVw',
          location: pos.coords.latitude + ',' + pos.coords.longitude,
          radius: pos.coords.accuracy * 2 + 100,
          sensor: true,
          types: Types
        },
        context: this,
        dataType: 'json',
        error: function() {
          console.log('Error!');
          return this.rateNoGeo();
        },
        success: function(data) {
          console.log(data);
          Data.nearbyAvailable = true;
          Data.nearby = data.results;
          for (i=0; i < data.results.length; i++) {
            data.results[i].index = i
          };

          $.mobile.changePage('#rate-nearby', {
            transition: 'none'
          });
          $('#rate-nearby [data-role=content]').html(RateNearby(data)).trigger('create');
          return $('#rate-nearby [data-role=content] a').on('click', Rate.start);
        }
      });
    };

    Application.prototype.rateNoGeo = function() {
      $('#rate-geo-notice, #rate-loading-notice').addClass('hidden');
      return $('#rate-nogeo-notice').removeClass('hidden');
    };

    return Application;

  })();

  Data.geo = false;

  Data.key = 'AIzaSyALj6zax-yPF5UIfk77oOH4thM3BeEesVw';

  Data.waitingForGeo = false;

  Data.nearbyAvailable = false;

  module.exports = new Application;
  
}});

window.require.define({"data": function(exports, require, module) {
  
  module.exports = {};
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var App;

  App = require('application');

  $(document).on('ready', function() {
    return App.init();
  });
  
}});

window.require.define({"rate": function(exports, require, module) {
  var Data, Rate;

  Data = require('data');

  Rate = (function() {

    function Rate() {}

    Rate.prototype.start = function(e) {
      var el, place;
      el = $(this);
      return place = Data.nearby[el.attr('data-index')];
    };

    return Rate;

  })();

  module.exports = new Rate;
  
}});

window.require.define({"templates/rate-nearby": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n  <li><a href=\"#\" data-ref=\"";
    stack1 = depth0.reference;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.reference", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" data-index=\"";
    stack1 = depth0.index;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.index", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    stack1 = depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></li>\n  ";
    return buffer;}

    buffer += "<ul data-role=\"listview\">\n  ";
    foundHelper = helpers.results;
    stack1 = foundHelper || depth0.results;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</ul>\n";
    return buffer;});
}});

window.require.define({"types": function(exports, require, module) {
  
  module.exports = 'airport|amusement_park|art_gallery|bakery|bank|bar|beauty_salon|bicycle_store|book_store|bowling_alley|bus_station|cafe|campground|car_dealer|car_rental|car_repair|casino|cemetery|church|city_hall|clothing_store|convenience_store|courthouse|dentist|department_store|doctor|electronics_store|embassy|florist|food|furniture_store|gas_station|grocery_or_supermarket|gym|hair_care|hardware_store|hindu_temple|home_goods_store|hospital|jewelry_store|laundry|library|liquor_store|local_government_office|lodging|meal_delivery|meal_takeaway|mosque|movie_rental|movie_theater|museum|night_club|parking|pet_store|pharmacy|physiotherapist|place_of_worship|post_office|restaurant|school|shoe_store|shopping_mall|spa|stadium|subway_station|synagogue|taxi_stand|train_station|university|zoo';
  
}});

