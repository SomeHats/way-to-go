var db = require('mongojs').connect('localhost:27017/waytogo', ['places']);

exports.set = function (collection, data) {
  db.places.save(data);
};

exports.get = function (collection, query, callback) {
  var out = undefined;
  db.places.find(query).forEach(function(err, docs) {
    if (!out) {
      if (err) {
        console.log('error');
        console.log(err);
      } else if (docs) {
        out = docs
      }
      callback(out);
    }
  });
  return out;
}; 
