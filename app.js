var application_root = __dirname,
  express = require("express"),
  path = require("path"),
  store = require(path.join(application_root, 'lib/store.js')),
  fs = require('fs'),
  request = require('request');

function toNum(str) {
  if (str === null) {
    return null
  } else if (str == 'good' || str == ['good']) {
    return 1;
  } else if (str == 'ok' || str == ['ok']) {
    return 0.5;
  } else {
    return 0;
  }
}

var types = ['access', 'parking', 'toilet', 'staff'],
  forEachType = function (callback) {
    for (var i = 0; i < types.length; i += 1) {
      callback(types[i]);
    }
  };

var app = express(),

// Hackish, but it's nearly midnight...
  env = 'dev';

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  //app.set('views', path.join(application_root, "views"));
  //app.set('view engine', 'jade')
});

app.get('/gm/*', function(req, res) {
  console.log('Generic Google Maps api request')
  var url = 'https://maps.googleapis.com/';
  url = req.url.replace('/gm/', url);

  request(url, function(err, reqRes, body) {
    if(!err) {
      res.send(body);
    } else {
      console.log('Could not get google map request');
      res.send("{'success': false}");
    }
  });
});

app.get('/api', function(req, res) {
  console.log('Blank API request.');
  res.send('Way to Go');
});

app.get('/api/place/:ref', function(req, res) {
  console.log('Place info request.')
  var data = {},
    place = store.get('places', {ref: req.params.ref});
  if (place === undefined) {
    data.success = false;
  } else {
    data.success = true;
    data.place = place;
  }

  res.send(JSON.stringify(data));
});

app.get('/api/rate/:data', function(req, res) {
  console.log('Rate request...')
  data = JSON.parse(req.params.data);
  forEachType(function(type) {
    if(data[type]) {
      data[type] = toNum(data[type]);
    } else {
      data[type] = null;
    }
  });

  var existing = store.get('places', {
    name: data.place.name,
    lat: {
      $gt: data.place.lat - 0.002,
      $lt: data.place.lat + 0.002
    },
    lng: {
      $gt: data.place.lng - 0.002,
      $lt: data.place.lng + 0.002
    }
  }, function(existing) {
    console.log('Results called');
    if (existing === undefined) {
      console.log('Place ' + data.place.name + ' does not already exist');

      existing = {
        lat: data.place.lat,
        lng: data.place.lng,
        name: data.place.name
      };

      forEachType(function(type) {
        existing[type] = data[type];
        if(data[type] !== null) {
          existing[type + '-count'] = 1;
        } else {
          existing[type + '-count'] = 0;
        }
      })

      console.log('Creating ' + existing.name);
      store.set('places', existing);

    } else {
      console.log('Place ' + existing.name + ' already exists.');
      console.log('before');
      console.log(existing);
      forEachType(function(type) {
        if (data[type] !== null) {
          existing[type + '-count'] += 1;
          existing[type] += data[type];
        }
      });
      console.log('after');
      console.log(existing)
    }

    res.send('{"success":true}');

  });
});

app.get('/api/*', function(req, res) {
  res.status(404).send("{'success':false}");
  console.log('Unknown API request: ' + req.url)
});

app.listen(3000);

console.log('Server started at localhost:3000');