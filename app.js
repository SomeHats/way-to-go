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

var app = express(),

// Hackish, but it's nearly midnight...
  env = 'dev';

// model

/*var Todo = mongoose.model('Todo', new mongoose.Schema({
  text: String,
  done: Boolean,
  order: Number
}));*/

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
  res.send('');
});

app.get('/api/place/:ref', function(req, res) {
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
  data = JSON.parse(req.params.data);
  console.log(typeof data.access);
  if (!data.access) data.access = null;
  if (!data.parking) data.parking = null;
  if (!data.staff) data.staff = null;
  if (!data.toilet) data.toilet = null;

  var existing = store.get('places', {name: data.place.name}, function(existing) {
    /*name: data.place.name,
    lat: {
      $gt: data.place.lat - 0.002,
      $lt: data.place.lat + 0.002
    },
    lng: {
      $gt: data.place.lng - 0.002,
      $lt: data.place.lng + 0.002
    }});*/

  console.log(existing);

  data.access = toNum(data.access);
  data.parking = toNum(data.parking);
  data.staff = toNum(data.staff);
  data.toilets = toNum(data.toilets);

  if (existing === undefined) {
    if (data.access === null) data.access = 0.5;
    if (data.parking === null) data.parking = 0.5;
    if (data.staff === null) data.staff = 0.5;
    if (data.toilets === null) data.toilets = 0.5;
    existing = {
      lat: data.place.lat,
      lng: data.place.lng,
      name: data.place.name,
      access: data.access,
      'access-count': 1,
      parking: data.parking,
      'parking-count': 1,
      staff: data.staff,
      'staff-count': 1,
      toilets: data.toilets,
      'toilets-count': 1
    };
    store.set('places', existing);
  }

  res.send('{"success":true}');
  });
});

app.get('/api/*', function(req, res) {
  res.status(404).send("{'success':false}");
});

/*app.get('*', function(req, res){
  res.sendfile(path.join(application_root, 'public/index.html'));
});*/

/*

app.get('/api/todos', function(req, res){
  return Todo.find(function(err, todos) {
    return res.send(todos);
  });
});

app.get('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    if (!err) {
      return res.send(todo);
    }
  });
});

app.put('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    todo.text = req.body.text;
    todo.done = req.body.done;
    todo.order = req.body.order;
    return todo.save(function(err) {
      if (!err) {
        console.log("updated");
      }
      return res.send(todo);
    });
  });
});

app.post('/api/todos', function(req, res){
  var todo;
  todo = new Todo({
    text: req.body.text,
    done: req.body.done,
    order: req.body.order
  });
  todo.save(function(err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(todo);
});

app.delete('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    return todo.remove(function(err) {
      if (!err) {
        console.log("removed");
        return res.send('')
      }
    });
  });
});*/

if (env === 'dev') {
  app.listen(3000);

  console.log('Server started at localhost:3000');
} else if (env === 'prod') {
  app.listen(80);

  console.log('Server started at localhost:80');
} else {
  console.log('Bad env');
}
