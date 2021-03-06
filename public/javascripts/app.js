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
  var Application, Data, Geocode, Rate, RateNearby, Search, Types;

  Data = require('lib/data');

  Types = require('lib/types');

  RateNearby = require('templates/rate-nearby');

  Rate = require('rate');

  Geocode = require('lib/geocode');

  Search = require('search');

  Application = (function() {

    function Application() {}

    Application.prototype.init = function() {
      var _this;
      $('[href=#]').on('click', function() {});
      _this = this;
      Data.hCont = false;
      $('.h-cont').on('click', function() {
        var theme;
        if (Data.hCont === false) {
          theme = 'c';
          Data.hCont = true;
        } else {
          theme = 'a';
          Data.hCont = false;
        }
        console.log(theme);
        $.mobile.page.prototype.options.backBtnTheme = theme;
        $.mobile.page.prototype.options.headerTheme = theme;
        $.mobile.page.prototype.options.contentTheme = theme;
        $.mobile.page.prototype.options.footerTheme = theme;
        $.mobile.listview.prototype.options.headerTheme = theme;
        $.mobile.listview.prototype.options.theme = theme;
        $.mobile.listview.prototype.options.dividerTheme = theme;
        $.mobile.listview.prototype.options.splitTheme = theme;
        $.mobile.listview.prototype.options.countTheme = theme;
        $.mobile.listview.prototype.options.filterTheme = theme;
        $.mobile.activePage.find('.ui-btn').not('.ui-li-divider').removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e').addClass('ui-btn-up-' + theme).attr('data-theme', theme);
        $.mobile.activePage.find('.ui-li-divider').each(function(index, obj) {
          if ($(this).parent().attr('data-divider-theme') === void 0) {
            return $(this).removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e').addClass('ui-bar-' + theme).attr('data-theme', theme);
          }
        });
        $.mobile.activePage.find('.ui-btn').removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e').addClass('ui-btn-up-' + theme).attr('data-theme', theme);
        $.mobile.activePage.find('.ui-header, .ui-footer').removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e').addClass('ui-bar-' + theme).attr('data-theme', theme);
        return $.mobile.activePage.removeClass('ui-body-a ui-body-b ui-body-c ui-body-d ui-body-e').addClass('ui-body-' + theme).attr('data-theme', theme);
      });
      $('#searchlist:visible').listview('option', 'filterCallback', function(text, search) {
        if (text.trim().toLowerCase() === 'search near:') {
          return false;
        } else if (text.toLowerCase().indexOf(search) === -1) {
          return true;
        } else {
          return false;
        }
      });
      $('#searchlist a').on('click', function() {
        var $el, location;
        $el = $(this);
        location = $('#location').val();
        console.log(location);
        if (location.trim() === '') {
          return alert('Please enter a location');
        } else {
          return Search.start($el.attr('data-term'), location);
        }
      });
      $(window).on('hashchange', function() {
        switch (window.location.hash) {
          case '#rate':
            return _this.rate();
          case '#rate-nearby':
            if (Data.nearbyAvailable === false) {
              return $.mobile.changePage('#home');
            }
            break;
          case '#map':
          case '#list':
          case '#info':
            if (Data.searchTerm === false) {
              return $.mobile.changePage('#home');
            }
        }
      });
      $(window).trigger('hashchange');
      if (navigator.geolocation) {
        this.geo = navigator.geolocation;
      } else {
        this.geo = false;
      }
      return Geocode.getAddr(this.geo, function(addr) {
        var $loc;
        $loc = $('#location');
        $loc.attr('placeholder', '');
        if ($loc.val() === '') {
          $loc.val(addr);
          return Data.geolocAdd = addr;
        }
      }, function() {
        console.log('fail');
        Data.geolocAdd = '';
        return $('#location').attr('placeholder', '');
      });
    };

    Application.prototype.rate = function() {
      $('#rate-nogeo-notice, #rate-loading-notice').addClass('hidden');
      $('#rate-geo-notice').removeClass('hidden');
      $('#rate-nearby h2').text('Rate');
      if (this.geo) {
        $.mobile.showPageLoadingMsg();
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
          rankby: 'distance',
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
          $.mobile.hidePageLoadingMsg();
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

  Data.searchTerm = false;

  module.exports = new Application;
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var App;

  App = require('application');

  $(document).on('ready', function() {
    return App.init();
  });
  
}});

window.require.define({"lib/data": function(exports, require, module) {
  
  module.exports = {};
  
}});

window.require.define({"lib/geocode": function(exports, require, module) {
  var Data;

  Data = require('lib/data');

  module.exports = {
    getAddr: function(geo, success, fail) {
      if (geo === false) {
        return fail();
      } else {
        return geo.getCurrentPosition(function(pos) {
          var geocoder, latlng;
          latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          geocoder = new google.maps.Geocoder;
          Data.lastLatlng = latlng;
          return geocoder.geocode({
            latLng: latlng
          }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              return success(results[0].formatted_address);
            } else {
              console.log(status);
              return fail();
            }
          });
        }, function() {
          return fail();
        });
      }
    },
    getLatLong: function(addr, success, fail) {
      var geocoder;
      geocoder = new google.maps.Geocoder;
      return geocoder.geocode({
        address: addr
      }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          return success(results[0].geometry.location);
        } else {
          console.log(status);
          return fail();
        }
      });
    }
  };
  
}});

window.require.define({"lib/hslToHex": function(exports, require, module) {
  var hslToRgb;

  module.exports = hslToRgb = function(h, s, l) {
    var b, decColor, g, hue2rgb, p, q, r;
    if (s === 0) {
      r = b = g = l;
    } else {
      hue2rgb = function(p, q, t) {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
          return q;
        }
        if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
      };
      q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    decColor = Math.round(b * 255) + 256 * Math.round(g * 255) + 65536 * Math.round(r * 255);
    return decColor.toString(16);
  };

  window.hsl = hslToRgb;
  
}});

window.require.define({"lib/types": function(exports, require, module) {
  
  module.exports = 'airport|amusement_park|art_gallery|bakery|bank|bar|beauty_salon|bicycle_store|book_store|bowling_alley|bus_station|cafe|campground|car_dealer|car_rental|car_repair|casino|cemetery|church|city_hall|clothing_store|convenience_store|courthouse|dentist|department_store|doctor|electronics_store|embassy|florist|food|furniture_store|gas_station|grocery_or_supermarket|gym|hair_care|hardware_store|hindu_temple|home_goods_store|hospital|jewelry_store|laundry|library|liquor_store|local_government_office|lodging|meal_delivery|meal_takeaway|mosque|movie_rental|movie_theater|museum|night_club|parking|pet_store|pharmacy|physiotherapist|place_of_worship|post_office|restaurant|school|shoe_store|shopping_mall|spa|stadium|subway_station|synagogue|taxi_stand|train_station|university|zoo';
  
}});

window.require.define({"rate": function(exports, require, module) {
  var Data, Rate, Render, rate;

  Data = require('lib/data');

  Render = require('templates/rate');

  Rate = (function() {

    function Rate() {}

    Rate.prototype.start = function(e) {
      var el;
      el = $(this);
      Data.place = Data.nearby[el.attr('data-index')];
      console.log(rate);
      return rate.rate(Data.place);
    };

    Rate.prototype.rate = function(place) {
      $('#rate-nearby h2').text('Rate - ' + place.name);
      $('#rate-nearby [data-role=content]').html(Render(place)).trigger('create');
      $('#rate-nearby input[type=checkbox]').on('change', function() {
        var $this, name;
        $this = $(this);
        name = $this.attr('name').replace('-chk', '');
        console.log(($this.prop('checked') ? 'enabled' : 'disabled'));
        return $('#rate-nearby input[name=' + name + ']').checkboxradio($this.prop('checked') ? 'enable' : 'disable');
      }).trigger('change');
      return $('#rate-save').on('click', function() {
        var data, send;
        $.mobile.showPageLoadingMsg();
        data = $('#rate-form').formParams();
        send = {
          place: {
            name: Data.place.name,
            lat: Data.place.geometry.location.lat,
            lng: Data.place.geometry.location.lng,
            ref: Data.place.reference
          }
        };
        if (data.wheelchair) {
          send.access = data.wheelchair;
        }
        if (data['parking-chk'] && data.parking) {
          send.parking = data.parking;
        }
        if (data['staff-chk'] && data.staff) {
          send.staff = data.staff;
        }
        if (data['toilet-chk'] && data.toilet) {
          send.toilet = data.toilet;
        }
        return $.ajax('/api/rate/' + encodeURI(JSON.stringify(send)), {
          error: function() {
            return console.log('Error');
          },
          success: function(data) {
            data = JSON.parse(data);
            if (data.success) {
              console.log('Success!');
              $.mobile.hidePageLoadingMsg();
              alert('Done! Thanks for rating ' + Data.place.name + '!');
              Data.place = null;
              return $.mobile.changePage('#home');
            } else {
              return console.log('error');
            }
          }
        });
      });
    };

    return Rate;

  })();

  module.exports = rate = new Rate;
  
}});

window.require.define({"search": function(exports, require, module) {
  var Data, Geocode, Rate, Search, getColour, hslToHex, listRender, render, _this;

  hslToHex = require('lib/hslToHex');

  Data = require('lib/data');

  Geocode = require('lib/geocode');

  render = require('templates/info');

  listRender = require('templates/list');

  Rate = require('rate');

  Search = (function() {

    function Search() {}

    Search.prototype.start = function(term, near) {
      this.near = near;
      this.term = term;
      $.mobile.showPageLoadingMsg();
      return $.ajax('/api/search/' + encodeURI(term) + '/' + encodeURI(near), {
        dataType: 'json',
        error: function() {
          return alert('Something went wrong :(');
        },
        success: function(data) {
          console.log(data);
          if (data.success) {
            _this.data = data;
            Data.searchTerm = true;
            $.mobile.changePage('#map');
            $.mobile.showPageLoadingMsg();
            $('#searchMap').height($(window).innerHeight() - ($('#map [data-role=header]').outerHeight() + $('#map [data-role=footer]').outerHeight() + 2));
            if (Data.geolocAdd && near.trim().toLowerCase() === Data.geolocAdd.trim().toLowerCase()) {
              return _this.draw(Data.lastLatlng);
            } else {
              return Geocode.getLatLong(near, _this.draw, function() {
                return alert('Could not draw map :(');
              });
            }
          } else {
            return alert("Something went wrong :(\n(toilets aren't supported yet)");
          }
        }
      });
    };

    Search.prototype.draw = function(center) {
      var compare, el, loc, map, marker, pinImage, place, _i, _len, _ref;
      compare = function(a, b) {
        if (a.general) {
          if (b.general) {
            if (a.general < b.general) {
              return 1;
            } else if (a.general > b.general) {
              return -1;
            } else {
              return 0;
            }
          } else {
            return -1;
          }
        } else {
          if (b.general) {
            return 1;
          } else {
            return 0;
          }
        }
      };
      $('#searchList ul').html('');
      _this.data.results = _this.data.results.sort(compare);
      map = new google.maps.Map($('#searchMap')[0], {
        center: center,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      _ref = _this.data.results;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        place = _ref[_i];
        loc = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
        if (place.general !== void 0) {
          place.generalColour = getColour(place.general);
          place.general = Math.round(place.general * 10);
          place.generalRender = true;
          if (place.access !== void 0) {
            place.accessColour = getColour(place.access);
            place.access = Math.round(place.access * 10);
            place.accessRender = true;
          }
          if (place.parking !== void 0) {
            place.parkingColour = getColour(place.parking);
            place.parking = Math.round(place.parking * 10);
            place.parkingRender = true;
          }
          if (place.toilet !== void 0) {
            place.toiletColour = getColour(place.toilet);
            place.toilet = Math.round(place.toilet * 10);
            place.toiletRender = true;
          }
          if (place.staff !== void 0) {
            place.staffColour = getColour(place.staff);
            place.staff = Math.round(place.staff * 10);
            place.staffRender = true;
          }
        } else {
          place.generalColour = '7D93BA';
        }
        pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.75|0|" + place.generalColour + '|3', new google.maps.Size(39, 51), new google.maps.Point(0, 0), null);
        marker = new google.maps.Marker({
          position: loc,
          map: map,
          title: place.name,
          icon: pinImage
        });
        el = $(listRender(place)).appendTo($('#searchList ul'));
        _this.markerClick(place, marker, map, el);
      }
      $.mobile.hidePageLoadingMsg();
      try {
        return $('#searchList ul').listview('refresh');
      } catch (error) {
        return console.log(error);
      }
    };

    Search.prototype.markerClick = function(place, marker, map, list) {
      var clickFunc;
      clickFunc = function() {
        var service;
        $.mobile.changePage('#info');
        $('#infoPanel ul').html(render(place));
        $('#infoPanel ul').listview('refresh');
        service = new google.maps.places.PlacesService(map);
        service.getDetails({
          reference: place.reference
        }, function(pd, status) {
          var review, _i, _len, _ref;
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(pd);
            place.extraInfo = true;
            place.phone = pd.formatted_phone_number ? pd.formatted_phone_number : false;
            place.openAvailable = pd.opening_hours ? true : false;
            place.open = place.openAvailable ? pd.opening_hours.open_now : null;
            if (pd.formatted_address) {
              place.address = pd.formatted_address;
              place.encodedAddress = encodeURI(pd.formatted_address);
            } else {
              place.address = false;
            }
            place.currentLocation = Data.lastLatlng ? Data.lastLatlng.Xa + ',' + Data.lastLatlng.Ya : false;
            place.website = pd.website ? pd.website : false;
            if (pd.reviews) {
              place.reviews = [];
              _ref = pd.reviews;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                review = _ref[_i];
                if (review.author_name === 'A Google User') {
                  review.author_name = 'Anonymous';
                }
                place.reviews.push(review);
              }
            }
            console.log('Pre Render');
            console.log(place);
            $('#infoPanel ul').html(render(place));
            return $('#infoPanel ul').listview('refresh');
          } else {
            console.log(status);
            return $('#infoPanel .loading').text('Could not load details.');
          }
        });
        return $('#infoPanel a.rate').live('click', function() {
          Data.nearbyAvailable = true;
          $.mobile.changePage('#rate-nearby');
          Data.place = place;
          return Rate.rate(place);
        });
      };
      google.maps.event.addListener(marker, 'click', clickFunc);
      return list.on('click', clickFunc);
    };

    return Search;

  })();

  getColour = function(val) {
    return hslToHex(val / 3, 0.99, 0.6);
  };

  module.exports = _this = new Search;
  
}});

window.require.define({"templates/info": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div class=\"trafficlight-show-major ui-li-aside\" style=\"background-color: #";
    foundHelper = helpers.generalColour;
    stack1 = foundHelper || depth0.generalColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "generalColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "; box-shadow: 0 0 8px #";
    foundHelper = helpers.generalColour;
    stack1 = foundHelper || depth0.generalColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "generalColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n				";
    foundHelper = helpers.general;
    stack1 = foundHelper || depth0.general;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "general", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n			</div>\n		";
    return buffer;}

  function program3(depth0,data) {
    
    
    return "\n		<li>No accessibility information.</li>\n	";}

  function program5(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.accessRender;
    stack1 = foundHelper || depth0.accessRender;
    stack2 = helpers['if'];
    tmp1 = self.program(6, program6, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.accessRender;
    stack1 = foundHelper || depth0.accessRender;
    stack2 = helpers.unless;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.parkingRender;
    stack1 = foundHelper || depth0.parkingRender;
    stack2 = helpers['if'];
    tmp1 = self.program(10, program10, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.parkingRender;
    stack1 = foundHelper || depth0.parkingRender;
    stack2 = helpers.unless;
    tmp1 = self.program(12, program12, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.toiletRender;
    stack1 = foundHelper || depth0.toiletRender;
    stack2 = helpers['if'];
    tmp1 = self.program(14, program14, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.toiletRender;
    stack1 = foundHelper || depth0.toiletRender;
    stack2 = helpers.unless;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.staffRender;
    stack1 = foundHelper || depth0.staffRender;
    stack2 = helpers['if'];
    tmp1 = self.program(18, program18, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.staffRender;
    stack1 = foundHelper || depth0.staffRender;
    stack2 = helpers.unless;
    tmp1 = self.program(20, program20, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program6(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<li><h3>Wheelchair Access</h3>\n				<div class=\"trafficlight-show ui-li-aside\" style=\"background-color: #";
    foundHelper = helpers.accessColour;
    stack1 = foundHelper || depth0.accessColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "accessColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "; box-shadow: 0 0 8px #";
    foundHelper = helpers.accessColour;
    stack1 = foundHelper || depth0.accessColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "accessColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n					";
    foundHelper = helpers.access;
    stack1 = foundHelper || depth0.access;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "access", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n				</div>\n			</li>\n		";
    return buffer;}

  function program8(depth0,data) {
    
    
    return "\n			<li>No wheelchair access information.</li>\n		";}

  function program10(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<li><h3>Car Parking</h3>\n				<div class=\"trafficlight-show ui-li-aside\" style=\"background-color: #";
    foundHelper = helpers.parkingColour;
    stack1 = foundHelper || depth0.parkingColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "parkingColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "; box-shadow: 0 0 8px #";
    foundHelper = helpers.parkingColour;
    stack1 = foundHelper || depth0.parkingColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "parkingColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n					";
    foundHelper = helpers.parking;
    stack1 = foundHelper || depth0.parking;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "parking", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n				</div>\n			</li>\n		";
    return buffer;}

  function program12(depth0,data) {
    
    
    return "\n			<li>No car parking space information.</li>\n		";}

  function program14(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<li><h3>Toilet Facilities</h3>\n				<div class=\"trafficlight-show ui-li-aside\" style=\"background-color: #";
    foundHelper = helpers.toiletColour;
    stack1 = foundHelper || depth0.toiletColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "toiletColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "; box-shadow: 0 0 8px #";
    foundHelper = helpers.toiletColour;
    stack1 = foundHelper || depth0.toiletColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "toiletColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n					";
    foundHelper = helpers.toilet;
    stack1 = foundHelper || depth0.toilet;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "toilet", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n				</div>\n			</li>\n		";
    return buffer;}

  function program16(depth0,data) {
    
    
    return "\n			<li>No toilet facility information.</li>\n		";}

  function program18(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<li><h3>Staff Friendliness</h3>\n				<div class=\"trafficlight-show ui-li-aside\" style=\"background-color: #";
    foundHelper = helpers.staffColour;
    stack1 = foundHelper || depth0.staffColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "staffColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "; box-shadow: 0 0 8px #";
    foundHelper = helpers.staffColour;
    stack1 = foundHelper || depth0.staffColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "staffColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n					";
    foundHelper = helpers.staff;
    stack1 = foundHelper || depth0.staff;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "staff", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n				</div>\n			</li>\n		";
    return buffer;}

  function program20(depth0,data) {
    
    
    return "\n			<li>No staff friendliness information.</li>\n		";}

  function program22(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.phone;
    stack1 = foundHelper || depth0.phone;
    stack2 = helpers['if'];
    tmp1 = self.program(23, program23, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.address;
    stack1 = foundHelper || depth0.address;
    stack2 = helpers['if'];
    tmp1 = self.program(25, program25, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.openAvailable;
    stack1 = foundHelper || depth0.openAvailable;
    stack2 = helpers['if'];
    tmp1 = self.program(28, program28, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.website;
    stack1 = foundHelper || depth0.website;
    stack2 = helpers['if'];
    tmp1 = self.program(33, program33, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.reviews;
    stack1 = foundHelper || depth0.reviews;
    stack2 = helpers['if'];
    tmp1 = self.program(35, program35, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program23(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<li><a href=\"tel:";
    foundHelper = helpers.phone;
    stack1 = foundHelper || depth0.phone;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "phone", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">Call: ";
    foundHelper = helpers.phone;
    stack1 = foundHelper || depth0.phone;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "phone", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></li>\n		";
    return buffer;}

  function program25(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<li>";
    foundHelper = helpers.address;
    stack1 = foundHelper || depth0.address;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "address", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</li>\n			";
    foundHelper = helpers.currentLocation;
    stack1 = foundHelper || depth0.currentLocation;
    stack2 = helpers['if'];
    tmp1 = self.program(26, program26, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program26(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<li><a href=\"https://maps.google.co.uk/maps?saddr=";
    foundHelper = helpers.currentLocation;
    stack1 = foundHelper || depth0.currentLocation;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "currentLocation", { hash: {} }); }
    buffer += escapeExpression(stack1) + "&daddr=";
    foundHelper = helpers.encodedAddress;
    stack1 = foundHelper || depth0.encodedAddress;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "encodedAddress", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">Get directions</a></li>\n			";
    return buffer;}

  function program28(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.open;
    stack1 = foundHelper || depth0.open;
    stack2 = helpers['if'];
    tmp1 = self.program(29, program29, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.open;
    stack1 = foundHelper || depth0.open;
    stack2 = helpers.unless;
    tmp1 = self.program(31, program31, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program29(depth0,data) {
    
    
    return "\n				<li>Currently open</li>\n			";}

  function program31(depth0,data) {
    
    
    return "\n				<li>Not currently open</li>\n			";}

  function program33(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<li><a href=\"";
    foundHelper = helpers.website;
    stack1 = foundHelper || depth0.website;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "website", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">Visit website</a></li>\n		";
    return buffer;}

  function program35(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<li data-role=\"list-divider\" data-theme=\"b\">\n				Reviews\n			</li>\n			";
    foundHelper = helpers.reviews;
    stack1 = foundHelper || depth0.reviews;
    stack2 = helpers.each;
    tmp1 = self.program(36, program36, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program36(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<li>\n					<h3>";
    foundHelper = helpers.author_name;
    stack1 = foundHelper || depth0.author_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "author_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n					<p>";
    foundHelper = helpers.text;
    stack1 = foundHelper || depth0.text;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "text", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</li>\n			";
    return buffer;}

  function program38(depth0,data) {
    
    
    return "\n		<li class=\"loading\">Loading...</li>\n	";}

    buffer += "	<li>\n		<h2>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h2>\n		";
    foundHelper = helpers.generalRender;
    stack1 = foundHelper || depth0.generalRender;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</li>\n	";
    foundHelper = helpers.generalRender;
    stack1 = foundHelper || depth0.generalRender;
    stack2 = helpers.unless;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    foundHelper = helpers.generalRender;
    stack1 = foundHelper || depth0.generalRender;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	<li>\n		<a href=\"#\" class=\"rate\">Rate ";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a>\n	</li>\n	<li role=\"list-divider\" data-theme=\"b\">Details</li>\n	";
    foundHelper = helpers.extraInfo;
    stack1 = foundHelper || depth0.extraInfo;
    stack2 = helpers['if'];
    tmp1 = self.program(22, program22, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    foundHelper = helpers.extraInfo;
    stack1 = foundHelper || depth0.extraInfo;
    stack2 = helpers.unless;
    tmp1 = self.program(38, program38, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    return buffer;});
}});

window.require.define({"templates/list": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div class=\"trafficlight-show-cont ui-li-aside\"><div class=\"trafficlight-show-mini\" style=\"background-color: #";
    foundHelper = helpers.generalColour;
    stack1 = foundHelper || depth0.generalColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "generalColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "; box-shadow: 0 0 8px #";
    foundHelper = helpers.generalColour;
    stack1 = foundHelper || depth0.generalColour;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "generalColour", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n				";
    foundHelper = helpers.general;
    stack1 = foundHelper || depth0.general;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "general", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n			</div></div>\n		";
    return buffer;}

    buffer += "<li>\n	<a href=\"#\">\n		<span>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n		";
    foundHelper = helpers.generalRender;
    stack1 = foundHelper || depth0.generalRender;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</a>\n</li>";
    return buffer;});
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

window.require.define({"templates/rate": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<form id=\"rate-form\">\n  <div data-role=\"fieldcontain\">\n    <fieldset data-role=\"controlgroup\" data-type=\"horizontal\" class=\"trafficlight\">\n      <legend>Wheelchair Access:</legend>\n      <input type=\"radio\" name=\"wheelchair\" id=\"wheelchair-1\" value=\"bad\" />\n      <label for=\"wheelchair-1\" class=\"red\">Bad</label>\n      <input type=\"radio\" name=\"wheelchair\" id=\"wheelchair-2\" value=\"ok\" />\n      <label for=\"wheelchair-2\" class=\"amber\">Ok</label>\n      <input type=\"radio\" name=\"wheelchair\" id=\"wheelchair-3\" value=\"good\" />\n      <label for=\"wheelchair-3\" class=\"green\">Great</label>\n    </fieldset>\n  </div>\n\n  <div data-role=\"fieldcontain\">\n    <label><input type=\"checkbox\" name=\"parking-chk\">Parking</label>\n    <fieldset data-role=\"controlgroup\" data-type=\"horizontal\" class=\"trafficlight\">\n      <input type=\"radio\" name=\"parking\" id=\"parking-1\" value=\"bad\" />\n      <label for=\"parking-1\" class=\"red\">Bad</label>\n      <input type=\"radio\" name=\"parking\" id=\"parking-2\" value=\"ok\" />\n      <label for=\"parking-2\" class=\"amber\">Ok</label>\n      <input type=\"radio\" name=\"parking\" id=\"parking-3\" value=\"good\" />\n      <label for=\"parking-3\" class=\"green\">Great</label>\n    </fieldset>\n  </div>\n\n  <div data-role=\"fieldcontain\">\n    <label><input type=\"checkbox\" name=\"toilet-chk\">Toilet</label>\n    <fieldset data-role=\"controlgroup\" data-type=\"horizontal\" class=\"trafficlight\">\n      <input type=\"radio\" name=\"toilet\" id=\"toilet-1\" value=\"bad\" />\n      <label for=\"toilet-1\" class=\"red\">Bad</label>\n      <input type=\"radio\" name=\"toilet\" id=\"toilet-2\" value=\"ok\" />\n      <label for=\"toilet-2\" class=\"amber\">Ok</label>\n      <input type=\"radio\" name=\"toilet\" id=\"toilet-3\" value=\"good\" />\n      <label for=\"toilet-3\" class=\"green\">Great</label>\n    </fieldset>\n  </div>\n\n  <div data-role=\"fieldcontain\">\n    <label><input type=\"checkbox\" name=\"staff-chk\">Staff</label>\n    <fieldset data-role=\"controlgroup\" data-type=\"horizontal\" class=\"trafficlight\">\n      <input type=\"radio\" name=\"staff\" id=\"staff-1\" value=\"bad\" />\n      <label for=\"staff-1\" class=\"red\">Bad</label>\n      <input type=\"radio\" name=\"staff\" id=\"staff-2\" value=\"ok\" />\n      <label for=\"staff-2\" class=\"amber\">Ok</label>\n      <input type=\"radio\" name=\"staff\" id=\"staff-3\" value=\"good\" />\n      <label for=\"staff-3\" class=\"green\">Great</label>\n    </fieldset>\n  </div>\n\n  <a href=\"#\" data-role=\"button\" id=\"rate-save\">Save</a>\n\n</form>\n";});
}});

