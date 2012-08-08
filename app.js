var application_root = __dirname,
  express = require("express"),
  path = require("path"),
  store = require(path.join(application_root, 'lib/store.js')),
  fs = require('fs'),
  request = require('request');

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

app.get('/api/*', function(req, res) {
  res.status(404).send('404');
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
